import React from 'react';
import Image from 'next/image';
import styles from './style.module.scss';
import { TbCalendarEvent } from "react-icons/tb";
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface EventCardProps {
  id: number;
  mediaUrl: string;
  title: string;
  timeAgo: string;
  description: string;
}

const EventCard: React.FC<EventCardProps> = ({ id, mediaUrl, title, description, timeAgo }) => {
  const {t} = useTranslation();
  return (
    <div className={styles.eventCardContainer}>
      <div className={styles.eventCard}>
        {mediaUrl ? (
          <Image 
            src={mediaUrl} 
            alt={title} 
            className={styles.eventCardImage}
            layout="intrinsic"
            width={300}
            height={60}
          />
        ) : (
          <div className={styles.defaultIconContainer}>
            <TbCalendarEvent size={60} className={styles.defaultIcon} />
          </div>
        )}
        <div className={styles.eventCardContent}>
          <h2>{title}</h2>
          <h4>{description}</h4>
          <p>{timeAgo}</p>
        </div>
      </div>
      <div className={styles.newsButton}>
        <Link href={`/events/${id}`}>
          <button>{t("Ver Evento")}</button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;