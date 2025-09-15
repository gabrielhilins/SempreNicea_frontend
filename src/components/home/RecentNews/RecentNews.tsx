import React, { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Spinner from '@/components/Spinner/Spinner';
import style from './style.module.scss';
import Card from './Card/CardNews';
import { useTranslation } from 'react-i18next';

interface RecentNewsData {
  id: number;
  titulo: string;
  conteudo: string;
  imagemUrl: string;
  publicadorNomeESobrenome: string;
}

const RecentNews = () => {
  const [recentNews, setRecentNews] = useState<RecentNewsData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation();

  const fetchRecentNews = useCallback(async (token: string, limite = 5) => {
    try {
      const response = await fetch(`${baseUrl}/api/noticias/recentes?limite=${limite}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t("Erro ao buscar notícias recentes"));
      }

      const data: RecentNewsData[] = await response.json();
      setRecentNews(data);
      setError(null);
    } catch (error) {
      setError(t("Não foi possível carregar as notícias recentes"));
      console.error(t("Erro ao buscar notícias recentes:"), error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, t]);

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      setError(t("Usuário não autenticado"));
      setLoading(false);
      return;
    }
    fetchRecentNews(token);
  }, [fetchRecentNews, t]);

  return (
    <section className={style.container}>
      <div className={style.header}>
        <h1>{t("Notícias Recentes")}</h1>
        <hr />
      </div>
      
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={style.error}>{error}</div>
      ) : recentNews.length === 0 ? (
        <div className={style.noNews}>
          <p>{t("Nenhuma notícia recente encontrada.")}</p>
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
          {recentNews.map((item) => (
            <SwiperSlide key={item.id}>
              <Card
                id={item.id}
                imagemUrl={item.imagemUrl}
                titulo={item.titulo}
                conteudo={item.conteudo}
                publicadorNomeESobrenome={item.publicadorNomeESobrenome}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default RecentNews;