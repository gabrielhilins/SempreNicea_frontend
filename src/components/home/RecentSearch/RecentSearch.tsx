import React, { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Spinner from '@/components/Spinner/Spinner';
import style from './style.module.scss';
import Card from './CardSearch/CardSearch';
import { useTranslation } from 'react-i18next';

interface RecentSearchData {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  publicadorNomeESobrenome: string;
  contribuidoresNomeESobrenome: string[]
}

const RecentSearch = () => {
  const [recentSearch, setRecentSearch] = useState<RecentSearchData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const {t} = useTranslation();

  const fetchRecentSearch = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/projeto/recentes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar projetos recentes");
      }

      const data: RecentSearchData[] = await response.json();
      setRecentSearch(data);
      setError(null);
    } catch (error) {
      setError("Não foi possível carregar os projetos recentes");
      console.error("Erro ao buscar projetos recentes:", error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }
    fetchRecentSearch(token);
  }, [fetchRecentSearch]);

  return (
    <section className={style.container}>
      <div className={style.header}>
        <h1>{t("Projetos Recentes")}</h1>
        <hr />
      </div>
      
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={style.error}>{error}</div>
      ) : recentSearch.length === 0 ? (
        <div className={style.noSearch}>
          <p>{t("Nenhum projeto recente encontrado.")}</p>
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className={style.content}
        >
          {recentSearch.map((item) => (
            <SwiperSlide key={item.id}>
              <Card
                id={item.id}
                imagem={item.imagem}
                titulo={item.titulo}
                descricao={item.descricao}
                publicadorNomeESobrenome={item.publicadorNomeESobrenome}
                contribuidoresNomeESobrenome={item.contribuidoresNomeESobrenome}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default RecentSearch;