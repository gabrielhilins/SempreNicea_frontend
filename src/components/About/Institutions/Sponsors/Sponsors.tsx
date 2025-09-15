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
import Alemanha from "../../../../../public/Flag_of_Germany.svg";
import Vaticano from "../../../../../public/Flag_Of_Vatican.svg";
import Romenia from '../../../../../public/Flag_of_Romania.svg';

// Importação das logos
import Dicastero from "../../../../../public/dicastero 1.png";
import Romana from "../../../../../public/Academia_Romana 1.png";
import Sociedade from "../../../../../public/Gesellshaft.png";
import Associacao from "../../../../../public/Associazone_Chiesa.png";

interface Sponsor {
  nome: string;
  logo: StaticImageData;
  bandeira: string;
  localizacao: string;
  url: string;
  color: string;
}

const sponsors: Sponsor[] = [
  {
    nome: "Institutia Academia Româna",
    logo: Romana,
    bandeira: Romenia,
    localizacao: "Bucareste, Munícipio de Bucareste, Romênia",
    url: "https://acad.ro/academia_romana/",
    color: "var(--color-romania, #235186)",
  },
  {
    nome: "Dicastero para a Promoção da Unidade dos Cristãos",
    logo: Dicastero,
    bandeira: Vaticano,
    localizacao: "Vaticano, Cidade do Vaticano",
    url: "http://www.christianunity.va/",
    color: "var(--color-vaticano, #A78B31)",
  },
  {
    nome: "Associação Italiana dos Professores de História da Igreja",
    logo: Associacao,
    bandeira: Italia,
    localizacao: "Roma, Lácio, Itália",
    url: "http://www.storiadellachiesa.it/",
    color: "var(--color-italia, #D72510)",
  },
  {
    nome: "Sociedade para a Pesquisa da História dos Concílios",
    logo: Sociedade,
    bandeira: Alemanha,
    localizacao: "Tübingen, Baden-Württemberg, Alemanha",
    url: "http://www.konziliengeschichte.org/",
    color: "var(--color-alemanha, #C35871)",
  },
];

const Sponsors = () => {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 50,
      once: false,
    });

    return () => {
      AOS.refreshHard();
    };
  }, []);

  return (
    <div className={style.container} id="Patrocinadores">
      <div className={style.textContainer}>
        <div className={style.title}>
          <h1>{t('Instituições Patrocinadoras')}</h1>
        </div>
        <div className={style.subtitle}>
          <p>
            {t('Organismos Ecumênicos, Instituições Acadêmicas e Associações Científicas que concederam patrocínio ao projeto internacional de pesquisa histórico-religiosa Semper Nicea. Presente, memórias ecumênicas e história do Concílio de Nicéia (325-2025)')}
          </p>
        </div>
      </div>
      <div className={style.sponsors}>
        {sponsors.map((sponsor, index) => (
          <div
            className={style.card}
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 200}
          >
            <div className={style.info}>
              <Image
                src={sponsor.logo}
                alt={`Logo de ${sponsor.nome}`}
                width={200}
                height={150}
                className={style.logo}
                sizes="(max-width: 768px) 100vw, 200px"
              />
              <h2 style={{ color: sponsor.color }}>{t(sponsor.nome)}</h2>
            </div>
            <div className={style.locationContainer}>
              <Image
                src={sponsor.bandeira}
                alt={`Bandeira de ${sponsor.localizacao.split(',')[1]?.trim() || 'país'}`}
                width={30}
                height={20}
                className={style.bandeira}
              />
              <p>{t(sponsor.localizacao)}</p>
            </div>
            <a
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className={style.link}
              aria-label={`Visitar o site de ${sponsor.nome}`}
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

export default Sponsors;