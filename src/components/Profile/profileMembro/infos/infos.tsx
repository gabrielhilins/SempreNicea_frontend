"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import style from "@/components/Profile/profileMembro/infos/style.module.scss";
import ModalEdit from "@/components/Profile/profileMembro/modal/modalInfo/modalEdit";
import { BiPencil } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

interface ProfileData {
  id?: number;
  nome?: string;
  sobrenome?: string;
  fotoFundo?: string | null;
  fotoPerfil?: string | null;
  localizacao?: string;
  email?: string;
  contato?: string;
  bio?: string;
  formacao?: string;
  updatedAt?: string;
}

interface InfosProps {
  userId: number | null;
  isOwnProfile?: boolean;
  isPublic?: boolean;
}

export default function InfosMembro({ userId, isOwnProfile, isPublic }: InfosProps) {
  const [openModal, setOpenModal] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isEditing, setIsEditing] = useState({ sobre: false });
  const [isLoading, setIsLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ fotoFundo: boolean; fotoPerfil: boolean }>({
    fotoFundo: false,
    fotoPerfil: false,
  });
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation();

  const fetchProfileData = useCallback(async () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token || !userId) {
      toast.error(t("Usuário não autenticado ou ID inválido."));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Buscando dados do perfil. ID:", userId);
      const response = await fetch(`${baseUrl}/api/membros/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: ProfileData = await response.json();
        console.log("Dados do perfil recebidos:", data);
        setProfileData(data);
        // Reset image errors on successful fetch
        setImageErrors({ fotoFundo: false, fotoPerfil: false });
      } else {
        console.error("Erro ao buscar dados do perfil:", response.status);
        toast.error(t("Erro ao carregar perfil: ") + response.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error(t("Erro ao conectar ao servidor."));
    } finally {
      setIsLoading(false);
    }
  }, [userId, baseUrl, t]);

  // Run fetch only once on mount
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Memoize image URLs to prevent re-generation and add timestamp only once
  const fotoPerfilUrl = useMemo(() => {
    if (!profileData.fotoPerfil || imageErrors.fotoPerfil) return "/default-profile.png";
    return `${profileData.fotoPerfil}?t=${profileData.updatedAt || Date.now()}`;
  }, [profileData.fotoPerfil, profileData.updatedAt, imageErrors.fotoPerfil]);

  const fotoFundoUrl = useMemo(() => {
    if (!profileData.fotoFundo || imageErrors.fotoFundo) return "/fundo-default.png";
    return `${profileData.fotoFundo}?t=${profileData.updatedAt || Date.now()}`;
  }, [profileData.fotoFundo, profileData.updatedAt, imageErrors.fotoFundo]);

  const handleSaveSobreClick = useCallback(async () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token || !profileData.id) {
      toast.error(t("Usuário não autenticado ou ID inválido."));
      return;
    }

    setIsLoading(true);
    try {
      console.log("Salvando bio. ID:", profileData.id, "Bio:", profileData.bio);
      const response = await fetch(`${baseUrl}/api/membros/update/${profileData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: profileData.bio }),
      });

      if (response.ok) {
        const updatedData: ProfileData = await response.json();
        console.log("Bio atualizada:", updatedData);
        setProfileData(updatedData);
        setIsEditing({ sobre: false });
        toast.success(t("Bio atualizada com sucesso!"));
      } else {
        console.error("Erro ao salvar bio:", response.status);
        toast.error(t("Erro ao salvar alterações: ") + response.status);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error(t("Erro ao conectar ao servidor."));
    } finally {
      setIsLoading(false);
    }
  }, [profileData.id, profileData.bio, baseUrl, t]);

  return (
    <div className={style.container}>
      {isLoading && <p>{t("Carregando...")}</p>}
      <div className={style.content}>
        <div className={style.fotos}>
          <div className={style.fotoDeFundo}>
            <Image
              src={fotoFundoUrl}
              alt={t("Foto de Fundo")}
              layout="responsive"
              width={1000}
              height={150}
              className={style.imagemDeFundo}
              onError={() => {
                console.warn("Erro ao carregar foto de fundo:", profileData.fotoFundo);
                setImageErrors((prev) => ({ ...prev, fotoFundo: true }));
              }}
            />
          </div>
          <div className={style.fotoPerfil}>
            <Image
              src={fotoPerfilUrl}
              alt={t("Foto de Perfil")}
              width={180}
              height={177}
              onError={() => {
                console.warn("Erro ao carregar foto de perfil:", profileData.fotoPerfil);
                setImageErrors((prev) => ({ ...prev, fotoPerfil: true }));
              }}
            />
          </div>
        </div>
        <div className={style.contentInfo}>
          <div className={style.dados}>
            <div className={style.infos}>
              <h1>
                {profileData.nome || t("Não informado")} {profileData.sobrenome || ""}
              </h1>
              <p>
                <strong>{t("Localização")}:</strong> {profileData.localizacao || t("Não informado")}
              </p>
              <p>
                <strong>{t("Email")}:</strong> {profileData.email || t("Não informado")}
              </p>
              <p>
                <strong>{t("Telefone")}:</strong> {profileData.contato || t("Não informado")}
              </p>
            </div>
            <div className={style.right}>
              {isOwnProfile && (
                <div className={style.editBtn}>
                  <button onClick={() => setOpenModal(true)} disabled={isEditing.sobre || isLoading}>
                    {t("Editar Perfil")}
                  </button>
                  {openModal && (
                    <ModalEdit
                      closeModal={setOpenModal}
                      profileData={{
                        id: profileData.id || 0,
                        nome: profileData.nome || "",
                        sobrenome: profileData.sobrenome || "",
                        email: profileData.email || "",
                        contato: profileData.contato || "",
                        localizacao: profileData.localizacao || "",
                        fotoPerfil: profileData.fotoPerfil || "",
                        fotoFundo: profileData.fotoFundo || "",
                      }}
                      onUpdate={(updatedData) => {
                        setProfileData(updatedData);
                        toast.success(t("Perfil atualizado!"));
                        // Refetch profile data to ensure consistency
                        fetchProfileData();
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={style.sobre}>
        {!isEditing.sobre ? (
          <div>
            <div className={style.header}>
              <h2>{t("Sobre")}</h2>
              {isOwnProfile && (
                <div className={style.iconHeader}>
                  <BiPencil onClick={() => setIsEditing({ sobre: true })} />
                </div>
              )}
            </div>
            <p>{profileData.bio || t("Nenhuma descrição disponível.")}</p>
          </div>
        ) : (
          <div className={style.editableContainer}>
            <div className={style.editableHeader}>
              <h2>{t("Fale um pouco sobre você...")}</h2>
            </div>
            <textarea
              className={style.editableTextArea}
              value={profileData.bio || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              disabled={isLoading}
            />
            <div className={style.editableFooter}>
              <button
                className={style.cancelButton}
                onClick={() => setIsEditing({ sobre: false })}
                disabled={isLoading}
              >
                {t("Cancelar")}
              </button>
              <button
                className={style.saveButton}
                onClick={handleSaveSobreClick}
                disabled={isLoading}
              >
                {isLoading ? t("Salvando...") : t("Salvar")}
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
}