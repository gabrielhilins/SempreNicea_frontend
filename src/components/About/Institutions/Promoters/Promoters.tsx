'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import style from './style.module.scss';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import 'aos/dist/aos.css';
import * as AOS from 'aos';

// Importação das bandeiras
import Italia from '../../../../../public/Flag_of_Italy.svg';
import Brasil from '../../../../../public/Flag_of_Brazil.svg';

// Importação das logos
import Unicap from '../../../../../public/Unicap.png';
import Pontifica from '../../../../../public/Pontifica Facolta.png';
import CentroStudi from '../../../../../public/Centro Studi.png';

const promoters = [
  {
    nome: 'Universidade Católica de Pernambuco - Unicap',
    logo: Unicap,
    bandeira: Brasil,
    localizacao: 'Recife, Pernambuco, Brasil',
    url: 'https://portal.unicap.br/',
    color: '#A9854B',
  },
  {
    nome: 'Pontifícia Faculdade Teológica do Sul da Itália – Seção São Tomás de Aquino',
    logo: Pontifica,
    bandeira: Italia,
    localizacao: 'Nápoles, Campânia, Itália',
    url: 'https://santommaso.pftim.it/',
    color: '#375F6C',
  },
  {
    nome: 'Centro de Estudos para o Ecumenismo na Itália',
    logo: CentroStudi,
    bandeira: Italia,
    localizacao: 'Florença, Toscana, Itália',
    url: 'https://centroecumenismo.it/',
    color: '#E9983C',
  },
];

const Promoters = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 50,
    });
  }, []);

  return (
    <div className={style.container} id="promoters">
      <div className={style.textContainer}>
        <div className={style.title}>
          <h1>{t('Quem promove o Projeto?')}</h1>
        </div>
        <div className={style.subtitle}>
          <p>
            {t('O projeto é impulsionado por instituições de referência no campo teológico e acadêmico, unindo esforços para fortalecer o diálogo ecumênico e a pesquisa histórica. Entre os principais promotores estão:')}
          </p>
        </div>
      </div>
      <div className={style.promoters}>
        {promoters.map((promoter, index) => (
          <div className={style.card} key={index} data-aos="fade-up" data-aos-delay={index * 600} data-aos-once="false">
            <div className={style.info}>
              <Image
                src={promoter.logo}
                alt={`Logo de ${promoter.nome}`}
                className={style.logo}
                width={200}
                height={150}
                sizes="(max-width: 768px) 100vw, 350px"
              />
              <h2 style={{ color: promoter.color }}>{t(promoter.nome)}</h2>
            </div>
            <div className={style.locationContainer}>
              <Image
                src={promoter.bandeira}
                alt={`Bandeira de ${promoter.localizacao}`}
                width={30}
                height={20}
                className={style.bandeira}
                sizes="30px"
              />
              <p>{t(promoter.localizacao)}</p>
            </div>
            <a
              href={promoter.url}
              target="_blank"
              rel="noopener noreferrer"
              className={style.link}
            >
              <span>{t('Saiba Mais')}</span>
              <FaArrowUpRightFromSquare className={style.arrowIcon} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promoters;