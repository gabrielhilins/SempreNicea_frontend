"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowBack } from "react-icons/io";
import { MdSave, MdUndo } from "react-icons/md";
import { BiPencil } from "react-icons/bi";
import Image from "next/image";
import style from "@/components/Profile/profileUsuario/modal/style.module.scss";
import { BsPersonVcard, BsTelephone } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { jwtDecode } from "jwt-decode";
import CropImageUpload from "./cropImage/cropImageUpload";
import { useTranslation } from "react-i18next";

interface ProfileUserData {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  contato: string;
  localizacao: string;
  fotoPerfil: string | null;
  fotoFundo: string | null;
  bio?: string;
}

interface ModalEditProps {
  closeModal: (state: boolean) => void;
  profileUserData: ProfileUserData;
  onUpdate: (updateData: ProfileUserData) => void;
}

interface CropCoords {
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}


export default function ModalEdit({
  closeModal,
  profileUserData,
  onUpdate,
}: ModalEditProps) {
  const [nome, setNome] = useState(profileUserData.nome);
  const [sobrenome, setSobrenome] = useState(profileUserData.sobrenome);
  const [email, setEmail] = useState(profileUserData.email);
  const [contato, setContato] = useState(profileUserData.contato);
  const [localizacao, setLocalizacao] = useState(profileUserData.localizacao);
  const [fotoPerfil, setFotoPerfil] = useState<File | undefined>(undefined);
  const [fotoFundo, setFotoFundo] = useState<File | undefined>(undefined);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState<string | null>(null);
  const [fotoFundoUrl, setFotoFundoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropContext, setCropContext] = useState<"perfil" | "fundo" | null>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [bannerCrop, setBannerCrop] = useState<CropCoords | null>(null);
  const { t } = useTranslation();
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const initialProfileUserData = { ...profileUserData };
  
  const fetchAuthenticatedImage = async (
    url: string | null,
    token: string | null
  ): Promise<string | null> => {
    if (!url) {
      console.warn("URL da imagem não fornecida.");
      return null;
    }
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      toast.error(t("Sessão expirada. Faça login novamente."));
      return null;
    }
  
    try {
      console.log("Buscando imagem autenticada:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.error("Erro ao buscar imagem:", response.status, response.statusText);
        toast.error(t("Erro ao carregar imagem."));
        return null;
      }
  
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      console.log("Imagem carregada com sucesso:", blobUrl);
      return blobUrl;
    } catch (error) {
      console.error("Erro na requisição de imagem:", error);
      return null;
    }
  };
  // Carregar imagens autenticadas
  const loadImages = async () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.error(t("Sessão expirada. Faça login novamente."));
      setFotoPerfilUrl("/default-profile.png");
      setFotoFundoUrl("/fundo-default.png");
      return;
    }

    try {
      if (profileUserData.fotoPerfil) {
        const blobUrl = await fetchAuthenticatedImage(`${profileUserData.fotoPerfil}?t=${Date.now()}`, token);
        setFotoPerfilUrl(blobUrl || "/default-profile.png");
      } else {
        setFotoPerfilUrl("/default-profile.png");
      }

      if (profileUserData.fotoFundo) {
        const blobUrl = await fetchAuthenticatedImage(`${profileUserData.fotoFundo}?t=${Date.now()}`, token);
        setFotoFundoUrl(blobUrl || "/fundo-default.png");
      } else {
        setFotoFundoUrl("/fundo-default.png");
      }
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
      setFotoPerfilUrl("/default-profile.png");
      setFotoFundoUrl("/fundo-default.png");
      toast.error(t("Erro ao carregar imagens."));
    }
  };

  useEffect(() => {
    loadImages();

    return () => {
      if (fotoPerfilUrl && fotoPerfilUrl.startsWith("blob:")) {
        console.log("Liberando blob:", fotoPerfilUrl);
        URL.revokeObjectURL(fotoPerfilUrl);
      }
      if (fotoFundoUrl && fotoFundoUrl.startsWith("blob:")) {
        console.log("Liberando blob:", fotoFundoUrl);
        URL.revokeObjectURL(fotoFundoUrl);
      }
    };
  }, [profileUserData.fotoPerfil, profileUserData.fotoFundo]);

  // Validar formulário
  const validateForm = () => {
    if (!nome.trim() || !sobrenome.trim() || !email.trim()) {
      toast.error(t("Nome, sobrenome e email são obrigatórios!"));
      return false;
    }
    if (fotoPerfil && !validImageTypes.includes(fotoPerfil.type)) {
      toast.error(t("A foto de perfil deve ser JPEG, PNG ou JPG!"));
      return false;
    }
    if (fotoFundo && !validImageTypes.includes(fotoFundo.type)) {
      toast.error(t("A foto de fundo deve ser JPEG, PNG ou JPG!"));
      return false;
    }
    return true;
  };

  // Verificar token
  const isTokenValid = () => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch (error) {
      console.error("Erro ao validar token:", error);
      return false;
    }
  };

  // Selecionar imagem
  const handleSelectImage = (file: File, context: "perfil" | "fundo") => {
    if (!file || file.size === 0) {
      toast.error(t("Nenhum arquivo selecionado!"));
      return;
    }

    console.log(`Arquivo selecionado (${context}):`, {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!validImageTypes.includes(file.type)) {
      toast.error(t("A imagem deve ser JPEG, PNG ou JPG!"));
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setCropContext(context);
    setShowCropper(true);

    if (context === "perfil") {
      setFotoPerfil(file);
    } else {
      setFotoFundo(file);
    }
  };

  // Upload de fotos
  const uploadPhoto = async (
    file: File,
    endpoint: string,
    crop?: CropCoords
  ): Promise<string | null> => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.error(t("Usuário não autenticado."));
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (crop) {
      formData.append("cropX", crop.cropX.toString());
      formData.append("cropY", crop.cropY.toString());
      formData.append("cropWidth", crop.cropWidth.toString());
      formData.append("cropHeight", crop.cropHeight.toString());
    }

    try {
      console.log(`Iniciando upload para ${endpoint}:`, {
        fileName: file.name,
        fileType: file.type,
        crop,
      });
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Erro no upload para ${endpoint}:`, errorData);
        throw new Error(errorData.error || t("Erro ao fazer upload da imagem"));
      }

      const data = await response.json();
      if (!data.mediaUrl) {
        throw new Error(t("URL da imagem não retornada pelo servidor"));
      }
      console.log(`Upload bem-sucedido:`, data);
      return `${data.mediaUrl}?t=${Date.now()}`;
    } catch (error) {
      console.error(`Erro no upload para ${endpoint}:`, error);
      toast.error(t("Erro ao fazer upload da imagem"));
      return null;
    }
  };

  // Salvar alterações
  const saveChanges = async () => {
    if (!validateForm()) return;
    if (!isTokenValid()) {
      toast.error(t("Sessão expirada. Faça login novamente."));
      return;
    }

    setIsLoading(true);
    try {
      let updatedFotoPerfilUrl: string | null = profileUserData.fotoPerfil;
      let updatedFotoFundoUrl: string | null = profileUserData.fotoFundo;

      // Upload da foto de perfil
      if (fotoPerfil) {
        const url = await uploadPhoto(fotoPerfil, "/api/files/upload-usuario-perfil");
        if (!url) {
          throw new Error(t("Falha ao fazer upload da foto de perfil"));
        }
        updatedFotoPerfilUrl = url;
      }

      // Upload da foto de fundo
      if (fotoFundo && bannerCrop) {
        const url = await uploadPhoto(fotoFundo, "/api/files/upload-usuario-fundo", bannerCrop);
        if (!url) {
          throw new Error(t("Falha ao fazer upload da foto de fundo"));
        }
        updatedFotoFundoUrl = url;
      } else if (fotoFundo && !bannerCrop) {
        toast.error(t("Selecione uma área de corte para a foto de fundo!"));
        return;
      }

      const updateData = {
        id: profileUserData.id,
        nome,
        sobrenome,
        email,
        contato,
        localizacao,
        fotoPerfil: updatedFotoPerfilUrl,
        fotoFundo: updatedFotoFundoUrl,
        bio: profileUserData.bio,
      };

      console.log("Atualizando perfil:", updateData);

      const response = await fetch(`${baseUrl}/api/usuarios/update/${profileUserData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao atualizar perfil:", response.status, errorData);
        throw new Error(errorData.error || t("Erro ao atualizar perfil"));
      }

      const updatedProfile = await response.json();
      onUpdate(updatedProfile);
      toast.success(t("Perfil atualizado com sucesso!"));
      closeModal(false);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error(t("Erro ao atualizar perfil"));
    } finally {
      setIsLoading(false);
    }
  };

  // Reverter alterações
  const revertChanges = () => {
    setNome(initialProfileUserData.nome);
    setSobrenome(initialProfileUserData.sobrenome);
    setEmail(initialProfileUserData.email);
    setContato(initialProfileUserData.contato);
    setLocalizacao(initialProfileUserData.localizacao);
    setFotoPerfil(undefined);
    setFotoFundo(undefined);
    setFotoPerfilUrl(initialProfileUserData.fotoPerfil || "/default-profile.png");
    setFotoFundoUrl(initialProfileUserData.fotoFundo || "/fundo-default.png");
    setBannerCrop(null);
    setSelectedImage(null);
    setShowCropper(false);
    toast.info(t("Alterações revertidas."));
  };

  // Remover fotos
  const handleRemoveProfile = () => {
    if (fotoPerfilUrl === "/default-profile.png" || !fotoPerfilUrl) {
      toast.info(t("Você já está sem foto de perfil!"));
      return;
    }
    setFotoPerfil(undefined);
    setFotoPerfilUrl("/default-profile.png");
    setSelectedImage(null);
    setShowCropper(false);
    toast.success(t("Foto de perfil removida."));
  };

  const handleRemoveBg = () => {
    if (fotoFundoUrl === "/fundo-default.png" || !fotoFundoUrl) {
      toast.info(t("Você já está sem foto de fundo!"));
      return;
    }
    setFotoFundo(undefined);
    setFotoFundoUrl("/fundo-default.png");
    setBannerCrop(null);
    setSelectedImage(null);
    setShowCropper(false);
    toast.success(t("Foto de fundo removida."));
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.header}>
          <button
            className={style.backIcon}
            onClick={() => closeModal(false)}
            title={t("Voltar")}
            aria-label={t("Voltar")}
            disabled={isLoading}
          >
            <IoMdArrowBack />
          </button>
          <h2>{t("Alterar Dados")}</h2>
        </div>

        {/* Upload de fotos */}
        <div className={style.editPhotos}>
          <div className={style.photos}>
            <div className={style.photoUpload}>
              <label>{t("Foto de Perfil")}:</label>
              <label className={style.profileImageWrapper}>
                <Image
                  src={fotoPerfilUrl || "/default-profile.png"}
                  alt={t("Foto de Perfil")}
                  width={100}
                  height={100}
                  className={style.preview}
                  onError={() => {
                    console.warn("Falha ao carregar imagem de perfil:", fotoPerfilUrl);
                    setFotoPerfilUrl("/default-profile.png");
                  }}
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSelectImage(file, "perfil");
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousSibling as HTMLInputElement;
                    input.click();
                  }}
                  className={style.hoverOverlay}
                >
                  {t("Alterar")}
                </button>
              </label>
              {showCropper && selectedImage && cropContext === "perfil" && (
                <CropImageUpload
                  mode="file"
                  imageSrc={selectedImage}
                  aspectRatio={1}
                  onSave={(file) => {
                    setFotoPerfil(file);
                    setFotoPerfilUrl(URL.createObjectURL(file));
                    setShowCropper(false);
                    setSelectedImage(null);
                    toast.success(t("Foto de perfil cortada!"));
                  }}
                  onCancel={() => {
                    setShowCropper(false);
                    setSelectedImage(null);
                    toast.info(t("Corte cancelado."));
                  }}
                  onRemove={handleRemoveProfile}
                  cropType="profile"
                />
              )}
            </div>
          </div>

          <div className={style.photoUpload}>
            <label>{t("Foto de Fundo")}:</label>
            <label className={style.backgroundImageWrapper}>
              <Image
                src={fotoFundoUrl || "/fundo-default.png"}
                alt={t("Foto de Fundo")}
                width={150}
                height={100}
                className={style.previewBackground}
                onError={() => {
                  console.warn("Falha ao carregar imagem de fundo:", fotoFundoUrl);
                  setFotoFundoUrl("/fundo-default.png");
                }}
              />
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelectImage(file, "fundo");
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.previousSibling as HTMLInputElement;
                  input.click();
                }}
                className={style.hoverOverlay}
              >
                {t("Alterar")}
              </button>
            </label>
            {showCropper && selectedImage && cropContext === "fundo" && (
              <CropImageUpload
                mode="coordinates"
                imageSrc={selectedImage}
                aspectRatio={3}
                onSave={(coords) => {
                  setBannerCrop(coords);
                  setShowCropper(false);
                  setSelectedImage(null);
                  toast.success(t("Corte do banner salvo!"));
                }}
                onCancel={() => {
                  setShowCropper(false);
                  setSelectedImage(null);
                  toast.info(t("Corte cancelado."));
                }}
                onRemove={handleRemoveBg}
                cropType="background"
              />
            )}
          </div>
        </div>

        {/* Formulário */}
        <div className={style.forms}>
          <form>
            <label className={style.formLabel}>
              {t("Nome")}:
              <div className={style.inputGroup}>
                <BsPersonVcard className={style.iconInput} />
                <input
                  type="text"
                  placeholder={t("Nome")}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={style.formInput}
                  required
                  disabled={isLoading}
                />
                <BiPencil className={style.editIcon} />
              </div>
            </label>
            <label className={style.formLabel}>
              {t("Sobrenome")}:
              <div className={style.inputGroup}>
                <BsPersonVcard className={style.iconInput} />
                <input
                  type="text"
                  placeholder={t("Sobrenome")}
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  className={style.formInput}
                  required
                  disabled={isLoading}
                />
                <BiPencil className={style.editIcon} />
              </div>
            </label>
            <label className={style.formLabel}>
              {t("Email")}:
              <div className={style.inputGroup}>
                <MdOutlineEmail className={style.iconInput} />
                <input
                  type="email"
                  placeholder={t("Email")}
                  value={email}
                  className={style.formInput}
                  required
                  disabled={isLoading}
                  readOnly
                />
              </div>
            </label>
            <label className={style.formLabel}>
              {t("Telefone")}:
              <div className={style.inputGroup}>
                <BsTelephone className={style.iconInput} />
                <input
                  type="text"
                  placeholder={t("Telefone")}
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  className={style.formInput}
                  disabled={isLoading}
                />
                <BiPencil className={style.editIcon} />
              </div>
            </label>
            <label className={style.formLabel}>
              {t("Localização")}:
              <div className={style.inputGroup}>
                <GrMapLocation className={style.iconInput} />
                <input
                  type="text"
                  placeholder={t("Localização")}
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  className={style.formInput}
                  disabled={isLoading}
                />
                <BiPencil className={style.editIcon} />
              </div>
            </label>
          </form>
        </div>

        {/* Botões finais */}
        <div className={style.actionButtons}>
          <button
            className={style.saveButton}
            onClick={saveChanges}
            disabled={isLoading}
          >
            <MdSave className={style.buttonIcon} />
            {isLoading ? t("Salvando...") : t("Salvar")}
          </button>
          <button
            className={style.revertButton}
            onClick={revertChanges}
            disabled={isLoading}
          >
            <MdUndo className={style.buttonIcon} /> {t("Reverter Alterações")}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
}