import React from 'react';
import style from './style.module.scss';
import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface CardProps {
    id: number;
    arquivosMidia?: string;
    titulo: string;
    descricao: string;
    publicadorNomeESobrenome: string;
    contribuidoresNomeESobrenome: string[];
}

const CardEvents = ({
    id,
    arquivosMidia,
    titulo,
    descricao,
    publicadorNomeESobrenome,
    contribuidoresNomeESobrenome
}: CardProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    
    const handleSaibaMais = () => {
        router.push(`/events/${id}`);
    };
    
    const timestamp = Date.now();

    return (
        <section className={style.container}>
            <div className={style.content}>
                <div className={style.imageHeader}>
                    {arquivosMidia ? (
                        <div className={style.imageBackground} style={{ backgroundImage: `url(${arquivosMidia}?t=${timestamp})` }} />
                    ) : (
                        <div className={style.iconContainer}>
                            <FaCalendarAlt size={50} />
                        </div>
                    )}
                </div>
                <div className={style.title}>
                    <h3>{titulo}</h3>
                </div>
                <div className={style.description}>
                    <p>{descricao}</p>
                </div>
                <div className={style.contributors}>
                    <p><strong>{t('publicador')}:</strong> {publicadorNomeESobrenome}</p>
                </div>
                <div className={style.contributors}>
                    <p><strong>{t('contribuidores')}:</strong> {contribuidoresNomeESobrenome.join(', ')}</p>
                </div>
                <div className={style.button} onClick={handleSaibaMais}>
                    <button>{t('saiba_mais')}</button>
                </div>
            </div>
        </section>
    );
};

export default CardEvents;