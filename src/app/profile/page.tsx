"use client";
import Activies from "@/components/Profile/profileMembro/activies/activies";
import InfosMembro from "@/components/Profile/profileMembro/infos/infos";
import InfosUsuario from "@/components/Profile/profileUsuario/infos/infos";
import InfosPublico from "@/components/Profile/profileView/infos/infos";
import EducationalBackground from "@/components/Profile/profileMembro/educational/educational";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// Extenda o JwtPayload para incluir os campos "id" e "role"
interface CustomJwtPayload extends JwtPayload {
  id: number;
  role?: string; // "membro" ou "usuario"
}

export default function Perfil() {
  const router = useRouter();
  const params = useParams(); // Captura parâmetros dinâmicos da URL
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [viewedUserId, setViewedUserId] = useState<number | null>(null);
  const [profileType, setProfileType] = useState<
    "membro" | "usuario" | "publico" | null
  >(null);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    // Obtém o userId da URL, se existir (para Perfil Público)
    const urlUserId = params.userId
      ? parseInt(params.userId as string, 10)
      : null;

    if (!token && !urlUserId) {
      // Se não há token e não é um Perfil Público, redireciona para login
      router.push("/login");
    } else {
      try {
        if (token) {
          // Decodifica o token
          const decodedToken = jwtDecode<CustomJwtPayload>(token);
          if (decodedToken.id) {
            setUserId(decodedToken.id);
            const normalizedRole = decodedToken.role?.toLowerCase() || "usuario";
            setRole(normalizedRole);
            console.log("Usuário autenticado automaticamente:", decodedToken);

            // Determina o tipo de perfil
            if (urlUserId) {
              // Perfil Público: outro usuário sendo visualizado
              setViewedUserId(urlUserId);
              setProfileType("publico");
              if (urlUserId === decodedToken.id) {
                router.push(
                  normalizedRole === "membro" ? "/profile" : "/profile/usuario"
                );
              }
            } else {
              // Perfil Membro ou Usuário: próprio perfil
              setViewedUserId(decodedToken.id);
              setProfileType(
                normalizedRole === "membro" ? "membro" : "usuario"
              );
            }
          } else {
            console.error("ID do usuário não encontrado no token.");
            router.push("/login");
          }
        } else {
          // Perfil Público sem autenticação (se permitido)
          setViewedUserId(urlUserId);
          setProfileType("publico");
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        router.push("/login");
      }
    }
  }, [params]);

  // Função para renderizar os componentes com base no tipo de perfil
  const renderProfileContent = () => {
    if (!viewedUserId || !profileType) return null;

    switch (profileType) {
      case "membro":
        return (
          <>
            <InfosMembro userId={viewedUserId} isOwnProfile={true} />
            <EducationalBackground userId={viewedUserId} />
            <Activies userId={viewedUserId} />
           </>
        );
      case "usuario":
        return (
          <>
            <InfosUsuario userId={viewedUserId} isOwnProfile={true} />
          </>
        );
      case "publico":
        return (
          <>
            <InfosPublico userId={viewedUserId} isOwnProfile={false} isPublic={true} />
            {/* Sem BotaoPost para Perfil Público */}
          </>
        );
      default:
        return null;
    }
  };

  return <>{renderProfileContent()}</>;
}
