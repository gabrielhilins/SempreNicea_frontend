import React from "react";
import style from "./style.module.scss";
import Spinner from "@/components/Spinner/Spinner";
import NewsCard from "./NewsCard/NewsCard";
import { useTranslation } from "react-i18next";

interface News {
  id: number;
  mediaUrl: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  dataPublicacao: string;
}

interface NewsContentProps {
  newsData: News[];
  message: string;
}

const NewsContent: React.FC<NewsContentProps> = ({ newsData, message }) => {
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      <div className={style.mainNews}>
        {message ? (
          <p className={style.noNewsMessage}>{message}</p>
        ) : newsData.length === 0 ? (
          <p className={style.noNewsMessage}>
            {t("Não há notícias do Sempre Nicea disponíveis no momento.")}
          </p>
        ) : (
          newsData.slice(0, 4).map((news, index) => (
            <NewsCard key={news.id} news={news} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default NewsContent;