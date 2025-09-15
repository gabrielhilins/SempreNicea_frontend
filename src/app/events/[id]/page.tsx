"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import style from "./style.module.scss";
import HeaderEvents from "@/components/SpecifcEvent/HeaderEvent/HeaderEvent";
import { jwtDecode } from "jwt-decode";
import RecentEvents from "@/components/home/RecentEvents/RecentEvents";
import { useTranslation } from "react-i18next";

interface EventsData {
  id: number;
  titulo: string;
  descricao: string;
  arquivosMidia: string;
  publicadorNomeESobrenome: string;
  constribuidoresNomeESobrenome: string[];
  dataEvento: string;
}

const EventsPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [Events, setEvents] = useState<EventsData | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const {t} = useTranslation();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return false;
    }
    try {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.id);
      return true;
    } catch (error) {
      console.error(t("Erro ao decodificar o token:"), error);
      return false;
    }
  }, [router, t]);

  const fetchEvents = useCallback(async () => {
    if (!id) {
      console.error(t("ID não encontrado"));
      setNotFoundError(true);
      return;
    }
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    try {
      console.log(t("Fetching Events with ID:"), id);
      const response = await fetch(`${baseUrl}/api/evento/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error(t("Erro na API:"), response.status, response.statusText);
        setNotFoundError(true);
        return;
      }
      const data: EventsData = await response.json();
      if (!data || !data.id) {
        console.error(t("Dados inválidos retornados pela API"));
        setNotFoundError(true);
        return;
      }
      setEvents(data);
    } catch (error) {
      console.error(t("Erro ao buscar os dados do Events:"), error);
      setNotFoundError(true);
    }
  }, [id, baseUrl, t]);

  useEffect(() => {
    if (checkAuth()) {
      fetchEvents();
    }
  }, [checkAuth, fetchEvents]);

  if (notFoundError) {
    return (
      <div className={style.errorContainer}>
        <h2>{t("Evento não encontrada")}</h2>
        <button onClick={() => router.push("/home")}>{t("Voltar para a Página Inicial")}</button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.errorContainer}>
        <h2>{error}</h2>
        <button onClick={() => router.push("/home")}>{t("Voltar para a Página Inicial")}</button>
      </div>
    );
  }

  if (!Events) {
    return <div>{t("Carregando...")}</div>;
  }

  return (
    <section className={style.container}>
      <HeaderEvents
        arquivosMidia={Events.arquivosMidia}
        titulo={Events.titulo}
        publicadorNomeESobrenome={Events.publicadorNomeESobrenome}
        constribuidoresNomeESobrenome={Events.constribuidoresNomeESobrenome}
        dataEvento={Events.dataEvento}
        descricao={Events.descricao}
      />
      <RecentEvents />
    </section>
  );
};

export default EventsPage;