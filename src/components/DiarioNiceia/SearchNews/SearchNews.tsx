"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";
import NewsContent from "../NewsContent/NewsContent";

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface News {
  id: number;
  mediaUrl: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  dataPublicacao: string;
}

const SearchNews = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [newsData, setNewsData] = useState<News[]>([]);
  const [message, setMessage] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce search input by 300ms

  const fetchNewsData = useCallback(
    async (palavraChave: string) => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        console.error(t("Usuário não autenticado."));
        setMessage(t("Usuário não autenticado."));
        setNewsData([]);
        return;
      }

      try {
        const endpoint = palavraChave
          ? `${baseUrl}/api/noticias/aprovadas/titulo/${palavraChave}`
          : `${baseUrl}/api/noticias/aprovadas`;
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: News[] = await response.json();
          if (data.length === 0) {
            setMessage(
              palavraChave
                ? t("Não há notícias para esta palavra-chave.")
                : t("Não há notícias do Sempre Nicea disponíveis no momento.")
            );
            setNewsData([]);
          } else {
            setNewsData(data);
            setMessage("");
          }
        } else {
          console.error(t("Erro ao buscar dados das notícias."));
          setMessage(t("Erro ao buscar dados das notícias."));
          setNewsData([]);
        }
      } catch (error) {
        console.error(t("Erro na requisição:"), error);
        setMessage(t("Erro na requisição."));
        setNewsData([]);
      }
    },
    [baseUrl, t]
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchNewsData(searchQuery);
    } else {
      setMessage(t("Por favor, insira uma palavra-chave para a pesquisa."));
      setNewsData([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchNewsData(debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchNewsData]);

  return (
    <section className={styles.searchNews}>
      <div className={styles.title}>
        <h2>{t("Pesquisar Notícias")}</h2>
        <div className={styles.underline}></div>
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder={t("Pesquisar notícias")}
          aria-label={t("Pesquisar")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className={styles.searchButton}
          onClick={handleSearch}
          aria-label={t("Buscar notícias")}
        >
          <FaSearch />
        </button>
        {searchQuery && (
          <button
            className={styles.clearButton}
            onClick={() => setSearchQuery("")}
            aria-label={t("Limpar pesquisa")}
          >
            <FaTimes /> {t("Limpar")}
          </button>
        )}
      </div>
      <NewsContent newsData={newsData} message={message} />
    </section>
  );
};

export default SearchNews;