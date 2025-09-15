import React, { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Spinner from '@/components/Spinner/Spinner';
import style from './style.module.scss';
import Card from './CardEvents/CardEvents';
import { useTranslation } from 'react-i18next';

interface RecentEventsData {
  id: number;
  titulo: string;
  descricao: string;
  arquivosMidia: string;
  publicadorNomeESobrenome: string;
  contribuidoresNomeESobrenome: string[];
}

const RecentEvents = () => {
  const { t } = useTranslation();
  const [recentEvents, setRecentEvents] = useState<RecentEventsData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchRecentEvents = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/evento/recentes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(t("Erro ao carregar eventos"));
      const data: RecentEventsData[] = await response.json();
      setRecentEvents(data);
      setError(null);
    } catch (error) {
      setError(t("Nenhum evento disponível"));
    } finally {
      setLoading(false);
    }
  }, [baseUrl, t]);

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      setError(t("Acesso não autorizado"));
      setLoading(false);
      return;
    }
    fetchRecentEvents(token);
  }, [fetchRecentEvents, t]);

  return (
    <section className={style.container}>
      <div className={style.header}>
        <h1>{t("Eventos Recentes")}</h1>
        <hr />
      </div>
      
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={style.error}>{error}</div>
      ) : recentEvents.length === 0 ? (
        <div className={style.noEvents}>
          <p>{t("Nenhum evento encontrado")}</p>
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
          {recentEvents.map((item) => (
            <SwiperSlide key={item.id}>
              <Card
                id={item.id}
                arquivosMidia={item.arquivosMidia}
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

export default RecentEvents;