"use client";

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Image, { StaticImageData } from "next/image";
import style from "./style.module.scss";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import 'aos/dist/aos.css';
import AOS from 'aos';

// Importação das bandeiras
import Italia from "../../../../../public/Flag_of_Italy.svg";

// Importação das logos
import Firenze from "../../../../../public/Avventista Firenze.png";
import Charisma from "../../../../../public/Charisma.png";
import Salernitano from "../../../../../public/Salernitano.png";
import Russia from "../../../../../public/Russia Cristiana.png";

interface Other {
  nome: string;
  logo: StaticImageData;
  bandeira: string;
  localizacao: string;
  url: string;
  color: string;
}

const others: Other[] = [
  {
    nome: "Instituto Adventista Villa Aurora",
    logo: Firenze,
    bandeira: Italia,
    localizacao: "Florença, Toscana, Itália",
    url: "https://villaaurora.it/",
    color: "var(--color-firenze, #1B355F)",
  },
  {
    nome: "Instituto Teológico de Salerno",
    logo: Salernitano,
    bandeira: Italia,
    localizacao: "Salerno, Campânia, Itália",
    url: "https://www.seminario.salerno.it/its",
    color: "var(--color-salernitano, #171717)",
  },
  {
    nome: "Fundação Rússia Cristã",
    logo: Russia,
    bandeira: Italia,
    localizacao: "Seriate, Bergamo, Itália",
    url: "http://www.russiacristiana.org/",
    color: "var(--color-russia, #961D27)",
  },
  {
    nome: "Faculdade Pentecostal de Ciências Religiosas",
    logo: Charisma,
    bandeira: Italia,
    localizacao: "Belizzi, Campânia, Itália",
    url: "http://fondazionecharisma.it/facolta-pentecostale-scienze-religiose/",
    color: "var(--color-charisma, #171717)",
  },
];

const Others = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 50,
      once: true,
    });

    return () => {
      AOS.refreshHard();
    };
  }, []);

  return (
    <div className={style.container} id="outras-instituicoes">
      <div className={style.textContainer}>
        <div className={style.title}>
          <h1>{t('Outras Instituições')}</h1>
        </div>
        <div className={style.subtitle}>
          <p>
            {t('Instituições académicas, centros de investigação e associações científicas que colaboram na criação do projeto internacional de investigação histórico-religiosa Sempre Nicea. Presente, memórias ecumênicas e história do Concílio de Nicéia (325-2025)')}
          </p>
        </div>
      </div>
      <div className={style.others}>
        {others.map((other, index) => (
          <div
            className={style.card}
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 200}
          >
            <div className={style.info}>
              <Image
                src={other.logo}
                alt={`Logo de ${other.nome}`}
                width={200}
                height={120}
                className={style.logo}
                sizes="(max-width: 768px) 100vw, 200px"
              />
              <h2 style={{ color: other.color }}>{t(other.nome)}</h2>
            </div>
            <div className={style.locationContainer}>
              <Image
                src={other.bandeira}
                alt="Bandeira da Itália"
                width={30}
                height={20}
                className={style.bandeira}
              />
              <p>{t(other.localizacao)}</p>
            </div>
            <a
              href={other.url}
              target="_blank"
              rel="noopener noreferrer"
              className={style.link}
              aria-label={`Visitar o site de ${other.nome}`}
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

export default Others;