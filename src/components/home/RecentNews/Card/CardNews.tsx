import React from 'react';
import style from './style.module.scss';
import { FaNewspaper } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface CardProps {
  id: number;
  imagemUrl?: string;
  titulo: string;
  conteudo: string;
  publicadorNomeESobrenome: string;
}

const CardNews = ({
  id,
  imagemUrl,
  titulo,
  conteudo,
  publicadorNomeESobrenome
}: CardProps) => {
  const router = useRouter();
  const handleSaibaMais = () => {
    router.push(`/news/${id}`);
  };

  // Generate a timestamp to append to the image URL
  const timestamp = Date.now();
  const {t} = useTranslation();

  return (
    <section className={style.container}>
      <div className={style.content}>
        <div className={style.imageHeader}>
          {imagemUrl ? (
            <div
              className={style.imageBackground}
              style={{ backgroundImage: `url(${imagemUrl}?t=${timestamp})` }} // Append timestamp to avoid caching
            />
          ) : (
            <div className={style.iconContainer}>
              <FaNewspaper size={50} />
            </div>
          )}
        </div>
        <div className={style.title}>
          <h3>{titulo}</h3>
        </div>
        <div className={style.description}>
          <p>{conteudo}</p>
        </div>
        <div className={style.publisher}>
          <p><strong>{t('publicador')}</strong> {publicadorNomeESobrenome}</p>
        </div>
        <div className={style.button} onClick={handleSaibaMais}>
          <button>{t('saiba_mais')}</button>
        </div>
      </div>
    </section>
  );
};

export default CardNews;