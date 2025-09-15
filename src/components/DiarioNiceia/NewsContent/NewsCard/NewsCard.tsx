import React from 'react';
import Image from 'next/image';
import style from './style.module.scss';
import { IoNewspaperOutline } from "react-icons/io5";
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface NewsCardProps {
  news: {
    id: number;
    mediaUrl: string;
    titulo: string;
    conteudo: string;
    categoria: string;
    dataPublicacao: string;
  };
  index: number;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, index }) => {
  const { t } = useTranslation();
  const formattedDate = news.dataPublicacao.split('T')[0];
    
  return (
    <div className={style.newsCard}>
      <div className={style.imageContainer}>
        {news.mediaUrl ? (
          <Image
            src={news.mediaUrl}
            alt={news.titulo}
            width={300}
            height={200}
            className={style.newsImage}
          />
        ) : (
          <div className={style.defaultIconContainer}>
            <IoNewspaperOutline size={60} className={style.defaultIcon} />
          </div>
        )}
      </div>
      <div className={style.newsInfo}>
        <h3 className={style.newsTitle}>{news.titulo}</h3>
        <p className={style.newsDescription}>{news.conteudo}</p>
        <p className={style.newsDate}>{formattedDate}</p>
      </div>
      <div className={style.newsButton}>
        <Link href={`/news/${news.id}`}>
          <button>{t("Ver notícia")}</button>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;