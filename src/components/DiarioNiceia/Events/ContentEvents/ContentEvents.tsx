import React, { useState, useEffect, useCallback } from 'react';
import EventCard from './EventCard/EventCard';
import styles from './style.module.scss';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import Spinner from '@/components/Spinner/Spinner';
import { useTranslation } from 'react-i18next';

interface Event {
  id: number;
  mediaUrl: string;
  titulo: string;
  descricao: string;
  dataEvento: string;
}

const ContentEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchEventsData = useCallback(async () => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      console.error(t("Usuário não autenticado."));
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/evento/aprovados`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.length ? data : []);
      } else {
        console.error(t("Erro ao buscar dados dos eventos."));
      }
    } catch (error) {
      console.error(t("Erro na requisição:"), error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, t]);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  return (
    <section className={styles.eventsListSection}>
      <div className={styles.eventsList}>
        {loading ? (
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        ) : events.length === 0 ? (
          <div className={styles.noEventsCard}>
            <p className={styles.noEventsMessage}>
              {t("Não há eventos do Sempre Nicea disponíveis no momento.")}
            </p>
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              mediaUrl={event.mediaUrl}
              title={event.titulo}
              description={event.descricao}
              timeAgo={event.dataEvento}
            />
          ))
        )}
        
      </div>
    </section>
  );
};

export default ContentEvents;