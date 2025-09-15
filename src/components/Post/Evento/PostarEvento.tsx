"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import "../Postagem.style.scss";
import DropdownMembros from "../DropdownMembros";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

const PostarEvento = () => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [arquivosMidia, setArquivosMidia] = useState<File | undefined>(undefined);
  const [dataEvento, setDataEvento] = useState("");
  const [selectedMembros, setSelectedMembros] = useState<
    { id: number; nomeCompleto: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const limiteCaracteres = 1000;
  const router = useRouter();
  const { t } = useTranslation();

  const validateForm = () => {
    if (!titulo.trim() || !descricao.trim() || !dataEvento.trim()) {
      toast.error(t("Todos os campos obrigatórios devem ser preenchidos!"));
      return false;
    }
    if (
      arquivosMidia &&
      !["image/jpeg", "image/png", "image/jpg"].includes(arquivosMidia.type)
    ) {
      toast.error(t("Envie uma imagem válida (JPEG, PNG ou JPG)!"));
      return false;
    }
    if (selectedMembros.length === 0) {
      toast.error(t("Selecione pelo menos um membro contribuinte!"));
      return false;
    }
    return true;
  };

  const getUserFromToken = () => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token && typeof token === "string") {
      try {
        const decoded: any = jwtDecode(token);
        return decoded;
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
      }
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArquivosMidia(e.target.files ? e.target.files[0] : undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.error(t("Você precisa estar logado para postar."));
      setTimeout(() => router.push('/login'), 1000);
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      let mediaUrl = null;

      if (arquivosMidia) {
        const formData = new FormData();
        formData.append("file", arquivosMidia);

        const uploadResponse = await fetch(`${baseUrl}/api/files/upload-evento-imagem`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          if (uploadResponse.status === 401 || uploadResponse.status === 403) {
            toast.error(t('Sessão expirada. Faça login novamente.'));
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            localStorage.removeItem('role');
            setTimeout(() => router.push('/login'), 1000);
            return;
          }
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || t("Erro ao fazer upload da mídia"));
        }

        const uploadData = await uploadResponse.json();
        mediaUrl = uploadData.mediaUrl;
        if (!mediaUrl) {
          throw new Error(t("URL da mídia não foi retornada pelo servidor"));
        }
      }

      const user = getUserFromToken();
      if (!user) {
        throw new Error(t("Não foi possível identificar o usuário."));
      }

      const { nome, sobrenome, id, role } = user;
      if (!["ADMIN", "MEMBRO"].includes(role)) {
        throw new Error(t("Você não tem permissão para postar eventos."));
      }

      const publicadorNomeESobrenome = `${nome} ${sobrenome}`;
      const publicadorId = id;

      const eventoData = {
        titulo,
        descricao,
        dataEvento,
        arquivosMidia: mediaUrl,
        publicadorId,
        publicadorNomeESobrenome,
        contribuidoresId: selectedMembros.map((membro) => membro.id),
        contribuidoresNomeESobrenome: selectedMembros.map(
          (membro) => membro.nomeCompleto
        ),
      };

      const eventoResponse = await fetch(`${baseUrl}/api/evento/solicitar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventoData),
      });

      if (!eventoResponse.ok) {
        if (eventoResponse.status === 401 || eventoResponse.status === 403) {
          toast.error(t('Sessão expirada. Faça login novamente.'));
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
          localStorage.removeItem('role');
          setTimeout(() => router.push('/login'), 1000);
          return;
        }
        const errorData = await eventoResponse.json();
        throw new Error(errorData.error || t("Erro ao criar o evento"));
      }

      toast.success(t("Solicitação de postagem de evento enviada com sucesso!"));
      setTitulo("");
      setDescricao("");
      setDataEvento("");
      setArquivosMidia(undefined);
      setSelectedMembros([]);
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao solicitar postagem de evento:", err);
      toast.error(t(`Erro ao solicitar postagem de evento: ${err.message}`));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="postar-evento-container">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="postar-evento-form"
      >
        <div className="input-container">
          <label className="label" htmlFor="titulo">
            {t("Título do Evento")}
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="input-text"
            autoComplete="off"
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <label className="label" htmlFor="descricao">
            {t("Descrição do Evento")}
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className="input-textarea"
            maxLength={limiteCaracteres}
            disabled={isLoading}
          />
          <span style={{ fontSize: "14px", color: "#666" }}>
            {descricao.length}/{limiteCaracteres}
          </span>
        </div>

        <div className="input-container">
          <label className="label" htmlFor="dataEvento">
            {t("Data do Evento")}
          </label>
          <input
            type="date"
            id="dataEvento"
            value={dataEvento}
            onChange={(e) => setDataEvento(e.target.value)}
            required
            className="input-text"
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <label className="label" htmlFor="arquivosMidia">
            {t("Imagem do Evento")}
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="arquivosMidia"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
              className="input-file"
              disabled={isLoading}
            />
            {arquivosMidia && (
              <span className="file-name">{arquivosMidia.name}</span>
            )}
          </div>
        </div>

        <DropdownMembros
          selectedMembros={selectedMembros}
          setSelectedMembros={setSelectedMembros}
          disabled={isLoading}
        />

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? t("Enviando Solicitação...") : t("Solicitar postagem do Evento")}
        </button>
      </form>
    </div>
  );
};

export default PostarEvento;