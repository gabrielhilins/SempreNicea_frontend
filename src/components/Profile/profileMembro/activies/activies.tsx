"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import CardProfileEvent from "./card/cardEvent/CardProfileEvent";
import CardProfileProjects from "./card/cardProjects/CardProfileProjects";
import style from "@/components/Profile/profileMembro/activies/style.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useTranslation } from "react-i18next";

// Definindo um tipo para o payload do JWT
interface JwtPayloadCustom extends JwtPayload {
  id: number;
}

interface Projeto {
  id: number;
  imagem: string;
  titulo: string;
  mediaAvaliacoes: number;
  descricao: string;
}

interface Evento {
  id: number;
  arquivosMidia: string;
  titulo: string;
  descricao: string;
  dataEvento: string;
}

interface UserData {
  id: number;
  projetosPostadosId: number[];
  eventosPostadosId: number[];
  fotoFundo: string;
  fotoPerfil: string;
  nome: string;
  localizacao: string;
  noticiasPostadasId: number[];
  projetosFavoritosId: number[];
}

interface ActiviesProps {
  userId: number;
  isOwnProfile?: boolean;
  isPublic?: boolean;
}

export default function Activies({ userId, isOwnProfile = false, isPublic = false }: ActiviesProps) {
  const [selectedTab, setSelectedTab] = useState("projetos");
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loadingProjetos, setLoadingProjetos] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const userDataCache = useRef<UserData | null>(null); // Cache for user data
  const { t } = useTranslation();

  const getUserFromToken = useCallback(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (token && typeof token === "string") {
      try {
        const decoded: JwtPayloadCustom = jwtDecode(token);
        return decoded;
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
      }
    }
    return null;
  }, []);

  // Fetch user data to get projetosPostadosId and eventosPostadosId
  const fetchUserData = useCallback(async () => {
    // Return cached data if available
    if (userDataCache.current) {
      console.log("Using cached user data:", userDataCache.current);
      return userDataCache.current;
    }

    const user = getUserFromToken();
    const tokenUserId = user?.id;
    const fetchId = isOwnProfile ? tokenUserId : userId;

    if (!fetchId) {
      setError(t("Usuário não autenticado ou ID inválido"));
      return null;
    }

    try {
      const response = await fetch(`${baseUrl}/api/membros/${fetchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
          }`,
        },
      });
      if (!response.ok) {
        throw new Error(`Falha ao obter dados do usuário: ${response.status}`);
      }
      const data: UserData = await response.json();
      console.log("User data fetched:", data);
      userDataCache.current = data; // Cache the data
      return data;
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      setError(t("Não foi possível carregar os dados do usuário"));
      return null;
    }
  }, [baseUrl, userId, isOwnProfile, getUserFromToken, t]);

  // Fetch project details by ID
  const fetchProjetoById = useCallback(
    async (projectId: number): Promise<Projeto | null> => {
      try {
        const response = await fetch(`${baseUrl}/api/projeto/${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
            }`,
          },
        });
        if (!response.ok) {
          throw new Error(`Falha ao obter projeto ${projectId}: ${response.status}`);
        }
        const item = await response.json();
        return {
          id: item.id,
          imagem: item.imagem || "",
          titulo: item.titulo || "",
          descricao: item.descricao || "",
          mediaAvaliacoes: item.mediaAvaliacoes || 0,
        };
      } catch (error) {
        console.error(`Erro ao carregar projeto ${projectId}:`, error);
        return null;
      }
    },
    [baseUrl]
  );

  // Fetch event details by ID
  const fetchEventoById = useCallback(
    async (eventId: number): Promise<Evento | null> => {
      try {
        const response = await fetch(`${baseUrl}/api/evento/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
            }`,
          },
        });
        if (!response.ok) {
          throw new Error(`Falha ao obter evento ${eventId}: ${response.status}`);
        }
        const item = await response.json();
        return {
          id: item.id,
          arquivosMidia: item.arquivosMidia || "",
          titulo: item.titulo || "",
          descricao: item.descricao || "",
          dataEvento: item.dataEvento || "",
        };
      } catch (error) {
        console.error(`Erro ao carregar evento ${eventId}:`, error);
        return null;
      }
    },
    [baseUrl]
  );

  // Fetch all projects based on projetosPostadosId
  const fetchProjetos = useCallback(async () => {
    setLoadingProjetos(true);
    try {
      const userData = await fetchUserData();
      if (!userData || !userData.projetosPostadosId || userData.projetosPostadosId.length === 0) {
        setProjetos([]);
        return;
      }

      const projectPromises = userData.projetosPostadosId.map((id) => fetchProjetoById(id));
      const projects = await Promise.all(projectPromises);
      const validProjects = projects.filter((project): project is Projeto => project !== null);
      if (validProjects.length === 0) {
        setError(t("Nenhum projeto válido encontrado"));
      } else {
        setError(null);
      }
      setProjetos(validProjects);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      setError(t("Não foi possível carregar os projetos"));
      toast.error(t("Erro ao carregar projetos"));
    } finally {
      setLoadingProjetos(false);
    }
  }, [fetchUserData, fetchProjetoById, t]);

  // Fetch all events based on eventosPostadosId
  const fetchEventos = useCallback(async () => {
    setLoadingEventos(true);
    try {
      const userData = await fetchUserData();
      if (!userData || !userData.eventosPostadosId || userData.eventosPostadosId.length === 0) {
        setEventos([]);
        return;
      }

      const eventPromises = userData.eventosPostadosId.map((id) => fetchEventoById(id));
      const events = await Promise.all(eventPromises);
      const validEvents = events.filter((event): event is Evento => event !== null);
      if (validEvents.length === 0) {
        setError(t("Nenhum evento válido encontrado"));
      } else {
        setError(null);
      }
      setEventos(validEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      setError(t("Não foi possível carregar os eventos"));
      toast.error(t("Erro ao carregar eventos"));
    } finally {
      setLoadingEventos(false);
    }
  }, [fetchUserData, fetchEventoById, t]);

  useEffect(() => {
    console.log("Activies useEffect triggered for userId:", userId);
    fetchProjetos();
    fetchEventos();
  }, [fetchProjetos, fetchEventos, userId]);

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.title}>
          <h1>{t("Atividade")}</h1>
        </div>
        <div className={style.filter}>
          <ul className={style.buttonList}>
            <li
              className={`${style.buttonItem} ${selectedTab === "projetos" ? style.active : ""}`}
              onClick={() => setSelectedTab("projetos")}
            >
              {t("Projetos")}
            </li>
            <li
              className={`${style.buttonItem} ${selectedTab === "eventos" ? style.active : ""}`}
              onClick={() => setSelectedTab("eventos")}
            >
              {t("Eventos")}
            </li>
          </ul>
        </div>
        <div className={style.activities}>
          {error && <div className={style.error}>{error}</div>}
          {selectedTab === "projetos" && (
            <div className={style.cardProjectContainer}>
              {loadingProjetos ? (
                <div>{t("Carregando projetos")}...</div>
              ) : projetos.length === 0 ? (
                <div className={style.noData}>
                  {t("Este usuário ainda não participou de nenhum projeto.")}
                </div>
              ) : (
                projetos.map((item) => (
                  <CardProfileProjects
                    key={item.id}
                    id={item.id}
                    imagem={item.imagem}
                    titulo={item.titulo}
                    descricao={item.descricao}
                  />
                ))
              )}
            </div>
          )}
          {selectedTab === "eventos" && (
            <div className={style.cardEventContainer}>
              {loadingEventos ? (
                <div>{t("Carregando eventos")}...</div>
              ) : eventos.length === 0 ? (
                <div className={style.noData}>
                  {t("Este usuário ainda não participou de nenhum evento.")}
                </div>
              ) : (
                eventos.map((item) => (
                  <CardProfileEvent
                    key={item.id}
                    id={item.id}
                    arquivosMidia={item.arquivosMidia}
                    titulo={item.titulo}
                    descricao={item.descricao}
                    dataEvento={item.dataEvento}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}