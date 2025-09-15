import React from 'react';
import style from './style.module.scss';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface CardProps {
  imagem: string;
  titulo: string;
}

const CardAreas = ({ imagem, titulo }: CardProps) => {
  const {t} = useTranslation();
  return (
    <div
      className={style.content}
      style={{ backgroundImage: `url(${imagem})` }}
    >
      <div className={style.overlay}>
        <div className={style.title}>
          <h3>{titulo}</h3>
        </div>
        <div className={style.button}>
          <button>
            <Link href="/projects">{t('saiba_mais')}</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardAreas;