"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import style from "@/components/Profile/profileUsuario/infos/style.module.scss";
import ModalEdit from "@/components/Profile/profileUsuario/modal/modalEdit";
import { BiPencil } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

interface ProfileUserData {
  id?: number;
  nome?: string;
  sobrenome?: string;
  fotoPerfil?: string | null;
  fotoFundo?: string | null;
  localizacao?: string;
  email?: string;
  contato?: string;
  bio?: string;
}

interface InfosProps {
  userId: number | null;
  isOwnProfile?: boolean;
  isPublic?: boolean;
}

export default function InfosUsuario({ userId }: InfosProps) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [profileUserData, setProfileUserData] = useState<ProfileUserData>({});
  const [isEditing, setIsEditing] = useState({ sobre: false });
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchProfileUserData = useCallback(async () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token || !userId) {
      toast.error(t("Usuário não autenticado ou ID inválido."));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/usuarios/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: ProfileUserData = await response.json();
        setProfileUserData(data);
      } else {
        toast.error(t("Erro ao carregar perfil:") + ` ${response.status}`);
      }
    } catch (error) {
      toast.error(t("Erro ao conectar ao servidor."));
    } finally {
      setIsLoading(false);
    }
  }, [userId, baseUrl, t]);

  useEffect(() => {
    fetchProfileUserData();
  }, [fetchProfileUserData]);

  const handleSaveSobreClick = async () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token || !profileUserData.id) {
      toast.error(t("Usuário não autenticado ou ID inválido."));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/usuarios/update/${profileUserData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: profileUserData.bio }),
      });

      if (response.ok) {
        const updatedData: ProfileUserData = await response.json();
        setProfileUserData(updatedData);
        setIsEditing({ sobre: false });
        toast.success(t("Bio atualizada com sucesso!"));
      } else {
        toast.error(t("Erro ao salvar alterações:") + ` ${response.status}`);
      }
    } catch (error) {
      toast.error(t("Erro ao conectar ao servidor."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.container}>
      {isLoading && <p>{t("Carregando...")}</p>}
      <div className={style.content}>
        <div className={style.fotos}>
          <div className={style.fotoDeFundo}>
            <Image
              src={profileUserData.fotoFundo || "/fundo-default.png"}
              alt={t("Foto de Fundo")}
              layout="responsive"
              width={200}
              height={130}
              className={style.imagemDeFundo}
              onError={(e) => {
                e.currentTarget.src = "/fundo-default.png";
              }}
            />
          </div>
          <div className={style.fotoPerfil}>
            <Image
              src={profileUserData.fotoPerfil || "/default-profile.png"}
              alt={t("Foto de Perfil")}
              width={180}
              height={177}
              onError={(e) => {
                e.currentTarget.src = "/default-profile.png";
              }}
            />
          </div>
        </div>
        <div className={style.contentInfo}>
          <div className={style.dados}>
            <div className={style.infos}>
              <h1>
                {profileUserData.nome || t("Nome")} {profileUserData.sobrenome || t("Sobrenome")}
              </h1>
              <p>
                <strong>{t("Localização")}:</strong> {profileUserData.localizacao || t("Não informado")}
              </p>
              <p>
                <strong>{t("Email")}:</strong> {profileUserData.email || t("Não informado")}
              </p>
              <p>
                <strong>{t("Telefone")}:</strong> {profileUserData.contato || t("Não informado")}
              </p>
            </div>
            <div className={style.right}>
              <div className={style.editBtn}>
                <button
                  onClick={() => setOpenModal(true)}
                  disabled={isEditing.sobre || isLoading}
                >
                  {t("Editar Perfil")}
                </button>
                {openModal && (
                  <ModalEdit
                    closeModal={setOpenModal}
                    profileUserData={{
                      id: profileUserData.id || 0,
                      nome: profileUserData.nome || "",
                      sobrenome: profileUserData.sobrenome || "",
                      email: profileUserData.email || "",
                      contato: profileUserData.contato || "",
                      localizacao: profileUserData.localizacao || "",
                      fotoPerfil: profileUserData.fotoPerfil || null,
                      fotoFundo: profileUserData.fotoFundo || null,
                    }}
                    onUpdate={(updatedData) => {
                      setProfileUserData(updatedData);
                      toast.success(t("Perfil atualizado!"));
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.sobre}>
        {!isEditing.sobre ? (
          <div>
            <div className={style.header}>
              <h2>{t("Sobre")}</h2>
              <div className={style.iconHeader}>
                <BiPencil onClick={() => setIsEditing({ sobre: true })} />
              </div>
            </div>
            <p>{profileUserData.bio || t("Nenhuma descrição disponível.")}</p>
          </div>
        ) : (
          <div className={style.editableContainer}>
            <div className={style.editableHeader}>
              <h2>{t("Fale um pouco sobre você...")}</h2>
            </div>
            <textarea
              className={style.editableTextArea}
              value={profileUserData.bio || ""}
              onChange={(e) =>
                setProfileUserData((prev) => ({
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