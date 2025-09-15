"use client";

import style from "@/components/Profile/profileView/infos/style.module.scss";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// Interface para os dados do perfil público
interface ProfileUserData {
  id?: number;
  nome?: string;
  sobrenome?: string;
  fotoFundo?: string | null;
  fotoPerfil?: string | null;
  localizacao?: string;
  bio?: string;
}

// Interface para as props do componente
interface InfosProps {
  userId: number | null; // userId pode ser nulo inicialmente
  isPublic?: boolean;
  isOwnProfile?: boolean;
}

export default function InfosPublico({ userId, isPublic = true }: InfosProps) {
  const [profileData, setProfileData] = useState<ProfileUserData>({});
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const fetchProfileData = useCallback(async () => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token || !userId) {
      // Redireciona para login se não houver token ou userId
      router.push("/login");
      return;
    }

    try {
      // Requisição para dados do perfil com token
      const response = await fetch(`${baseUrl}/api/membros/${userId}?public=${isPublic}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: ProfileUserData = await response.json();
        setProfileData(data);
      } else {
        console.error("Erro ao buscar dados do perfil.");
        if (response.status === 401 || response.status === 403) {
          router.push("/login"); // Redireciona se não autorizado
        }
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      router.push("/login");
    }
  }, [userId, isPublic, baseUrl, router]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.fotos}>
          <div className={style.fotoDeFundo}>
            {profileData.fotoFundo ? (
              <Image
                src={profileData.fotoFundo}
                alt="Foto de Fundo"
                layout="responsive"
                width={200}
                height={130}
                className={style.imagemDeFundo}
              />
            ) : (
              <div className={style.placeholder}>
                <Image
                  src="/fundo-default.png"
                  alt="Foto fundo default"
                  layout="responsive"
                  width={200}
                  height={130}
                  className={style.imagemDeFundo}
                />
              </div>
            )}
          </div>

          <div className={style.fotoPerfil}>
            {profileData.fotoPerfil ? (
              <Image
                src={profileData.fotoPerfil}
                alt="Foto de Perfil"
                width={180}
                height={177}
              />
            ) : (
              <div className={style.placeholder}>
                <Image
                  src="/default-profile.png"
                  alt="Foto de perfil default"
                  width={200}
                  height={177}
                />
              </div>
            )}
          </div>
        </div>
        <div className={style.contentInfo}>
          <div className={style.dados}>
            <div className={style.infos}>
              <h1>
                {profileData.nome} {profileData.sobrenome}
              </h1>
              <p>
                <strong>Localização:</strong> {profileData.localizacao}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Sobre (somente leitura) */}
      <div className={style.sobre}>
        <div>
          <div className={style.header}>
            <h2>Sobre</h2>
          </div>
          <p>{profileData.bio}</p>
        </div>
      </div>
    </div>
  );
}
