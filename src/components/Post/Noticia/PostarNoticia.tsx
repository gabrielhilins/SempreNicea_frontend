"use client";

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Postagem.style.scss";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

const PostarNoticia = () => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagem, setImagem] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const limiteCaracteres = 1000;
  const { t } = useTranslation();

  // Função para validar o formulário
  const validateForm = () => {
    if (!titulo.trim() || !conteudo.trim() || !categoria.trim()) {
      toast.error(t("Todos os campos obrigatórios devem ser preenchidos!"));
      return false;
    }
    if (
      imagem &&
      !["image/jpeg", "image/png", "image/jpg"].includes(imagem.type)
    ) {
      toast.error(t("Envie uma imagem válida (JPEG, PNG ou JPG)!"));
      return false;
    }
    return true;
  };

  // Função para obter dados do usuário a partir do token JWT
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

  // Função para verificar a validade do token
  const isTokenValid = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch (error) {
      return false;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagem(e.target.files ? e.target.files[0] : undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token || !isTokenValid(token)) {
      toast.error(t("Sessão expirada. Faça login novamente."));
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      let mediaUrl = null;

      if (imagem) {
        const formData = new FormData();
        formData.append("file", imagem);

        const uploadResponse = await fetch(`${baseUrl}/api/files/upload-noticia-imagem`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || t("Erro ao fazer upload da imagem"));
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

      const { nome, sobrenome, id } = user;
      const publicadorNomeESobrenome = `${nome} ${sobrenome}`;
      const publicadorId = id;

      if (!publicadorId) {
        throw new Error(t("O ID do usuário não foi encontrado."));
      }

      const noticiaData = {
        titulo,
        conteudo,
        categoria,
        imagemUrl: mediaUrl,
        publicadorId,
        publicadorNomeESobrenome,
      };

      const noticiaResponse = await fetch(`${baseUrl}/api/noticias/solicitar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noticiaData),
      });

      if (!noticiaResponse.ok) {
        const errorData = await noticiaResponse.json();
        throw new Error(errorData.error || t("Erro ao criar a notícia"));
      }

      toast.success(t("Solicitação de postagem de notícia enviada com sucesso!"));
      setTitulo("");
      setConteudo("");
      setCategoria("");
      setImagem(undefined);
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao solicitar postagem de notícia:", err);
      toast.error(t(`Erro ao solicitar postagem de notícia: ${err.message}`));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="postar-noticia-container">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="postar-noticia-form"
      >
        <div className="input-container">
          <label className="label" htmlFor="titulo">
            {t("Título da Notícia")}
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
          <label className="label" htmlFor="conteudo">
            {t("Conteúdo da Notícia")}
          </label>
          <textarea
            id="conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            required
            className="input-textarea"
            maxLength={limiteCaracteres}
            disabled={isLoading}
          />
          <span style={{ fontSize: "14px", color: "#666" }}>
            {conteudo.length}/{limiteCaracteres}
          </span>
        </div>

        <div className="input-container">
          <label className="label" htmlFor="categoria">
            {t("Categoria da Notícia")}
          </label>
          <input
            type="text"
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="input-text"
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <label className="label" htmlFor="imagem">
            {t("Imagem da Notícia")}
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="imagem"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
              className="input-file"
              disabled={isLoading}
            />
            {imagem && <span className="file-name">{imagem.name}</span>}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? t("Enviando Solicitação...") : t("Solicitar postagem da Notícia")}
        </button>
      </form>
    </div>
  );
};

export default PostarNoticia;