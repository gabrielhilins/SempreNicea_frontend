"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';

const SearchFrequents: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className={style.container}>
      <div className={style.content}>
        <div className={style.title}>
          <h1>{t("Contact Title")}</h1>
        </div>
      </div>
    </section>
  );
};

export default SearchFrequents;