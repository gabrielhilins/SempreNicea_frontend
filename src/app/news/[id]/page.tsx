"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import style from "./style.module.scss";
import Headernews from "@/components/News/HeaderNews/HeaderNews";
import { jwtDecode } from "jwt-decode";
import RecentNews from "@/components/home/RecentNews/RecentNews";
import { useTranslation } from "react-i18next";

interface NewsData {
  id: number;
  titulo: string;
  conteudo: string;
  categoria: string;
  imagemUrl: string;
  publicadorNomeESobrenome: string;
  dataPublicacao: string;
}

const NewsPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsData | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation();

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

  const fetchNews = useCallback(async () => {
    if (!id) {
      console.error(t("ID não encontrado"));
      setNotFoundError(true);
      return;
    }
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    try {
      console.log(t("Buscando notícia com ID:"), id);
      const response = await fetch(`${baseUrl}/api/noticias/${id}`, {
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
      const data: NewsData = await response.json();
      if (!data || !data.id) {
        console.error(t("Dados inválidos retornados pela API"));
        setNotFoundError(true);
        return;
      }
      setNews(data);
    } catch (error) {
      console.error(t("Erro ao buscar os dados da notícia:"), error);
      setNotFoundError(true);
    }
  }, [id, baseUrl, t]);

  useEffect(() => {
    if (checkAuth()) {
      fetchNews();
    }
  }, [checkAuth, fetchNews]);

  if (notFoundError) {
    return (
      <div className={style.errorContainer}>
        <h2>{t("Notícia não encontrada")}</h2>
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

  if (!news) {
    return <div>{t("Carregando...")}</div>;
  }

  return (
    <section className={style.container}>
      <Headernews
        mediaUrl={news.imagemUrl}
        titulo={news.titulo}
        categoria={news.categoria}
        publicadorNomeESobrenome={news.publicadorNomeESobrenome}
        dataPublicacao={new Date(news.dataPublicacao).toLocaleDateString()}
        conteudo={news.conteudo}
      />
      <RecentNews />
    </section>
  );
};

export default NewsPage;