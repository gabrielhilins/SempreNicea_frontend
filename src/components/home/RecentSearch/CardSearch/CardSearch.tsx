import React from 'react';
import style from './style.module.scss';
import Image from 'next/image';
import { IoDocumentText } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface CardProps {
  id: number;
  imagem?: string;
  titulo: string;
  descricao: string;
  publicadorNomeESobrenome: string;
  contribuidoresNomeESobrenome: string[];
}

const CardSearch = ({
  id,
  imagem,
  titulo,
  descricao,
  publicadorNomeESobrenome,
  contribuidoresNomeESobrenome
}: CardProps) => {
  const router = useRouter();
  const handleSaibaMais = () => {
    router.push(`/projects/${id}`);
  };

  // Generate a timestamp to append to the image URL
  const timestamp = Date.now();
  const {t} = useTranslation();

  return (
    <section className={style.container}>
      <div className={style.content}>
        <div className={style.imageHeader}>
          {imagem ? (
            <Image
              src={`${imagem}?t=${timestamp}`}
              alt={titulo}
              width={520}
              height={200}  
            />
          ) : (
            <div className={style.iconContainer}>
              <IoDocumentText size={50} />
            </div>
          )}
        </div>
        <div className={style.title}>
          <h3>{titulo}</h3>
        </div>
        <div className={style.descricao}>
          <p>{descricao}</p>
        </div>
        <div className={style.contributors}>
          <p><strong>{t('publicador')}</strong> {publicadorNomeESobrenome}</p>
        </div>
        <div className={style.contributors}>
          <p><strong>{t('contribuidores')}</strong> {contribuidoresNomeESobrenome.join(', ')}</p> {/* Join array for display */}
        </div>
        <div className={style.button}>
          <button onClick={handleSaibaMais}>{t('saiba_mais')}</button>
        </div>
      </div>
    </section>
  );
};

export default CardSearch;