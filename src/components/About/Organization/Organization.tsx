'use client';

import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { GiGraduateCap } from 'react-icons/gi';
import { BiWorld } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

// Note: Ensure '/reuniaoConcilio.png' exists and is optimized for responsive loading
const Organization = () => {
  const [academicsCount, setAcademicsCount] = useState(0);
  const [countriesCount, setCountriesCount] = useState(0);
  const {t} = useTranslation();

  useEffect(() => {
    let start = 0;
    const end = 77;
    const duration = 1500; // Faster for mobile
    const increment = end / (duration / 50);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setAcademicsCount(Math.floor(start));
    }, 50);

    return () => clearInterval(counter);
  }, []);

  useEffect(() => {
    let start = 0;
    const end = 13;
    const duration = 1500; // Faster for mobile
    const increment = end / (duration / 50);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setCountriesCount(Math.floor(start));
    }, 50);

    return () => clearInterval(counter);
  }, []);

  return (
    <section className={style.wrapper} id="organização">
      <div className={style.backgroundImage}></div>
      <div className={style.container}>
        <div className={style.title}>
          <h1>{t("O Sempre Nicea reúne")}:</h1>
        </div>
        <div className={style.data}>
          <div className={style.academics}>
            <GiGraduateCap />
            <p>{academicsCount} {t("Acadêmicos")}</p>
          </div>
          <hr />
          <div className={style.countries}>
            <BiWorld />
            <p>{countriesCount} {t("Países")}</p>
          </div>
        </div>
        <div className={style.thematicArea}>
          <p>{t("Os projetos são organizados em 4 áreas temáticas")}:</p>
          <div className={style.thematicAreasCards}>
            <p>1. {t("História do Concílio de Nicéia")}</p>
            <p>2. {t("Niceia e a Reforma")}</p>
            <p>3. {t("Diálogo Ecumênico")}</p>
            <p>4. {t("Niceia e a Igreja no Século XXI")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Organization;