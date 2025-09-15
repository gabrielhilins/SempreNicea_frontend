'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaArrowDown } from 'react-icons/fa';
import 'swiper/css';
import style from './style.module.scss';
import MovingBar from './MovingBar/MovingBar';
import { Autoplay } from 'swiper/modules';

const slides = [
  {
    title: 'Nós somos o Sempre Nicea',
    description: 'Uma iniciativa dedicada à divulgação e preservação dos estudos sobre o Concílio de Niceia.',
    image: '/reuniaoSempreNiceia2.png',
    buttonText: 'Saiba mais sobre o Projeto',
  },
  {
    title: 'Entenda o Concílio que Mudou a História',
    description: 'Descubra por que o Concílio de Niceia, e m 325 e.c., marcou um divisor de águas na fé cristã. Um evento, uma transformação duradoura.',
    image: '/heroAbout4.jpg',
    buttonText: 'Saiba mais sobre o Concílio',
  },
  {
    title: 'Acesse Pesquisas Científicas de Qualidade',
    description: 'Explore estudos e bibliografias atuais sobre Niceia. Conteúdo rigoroso, organizado e acessível para pesquisadores e curiosos.',
    image: '/heroAbout2.jpg',
    buttonText: 'Ver publicações e estudos',
  },
  {
    title: 'Atualize-se com o que Há de Mais Recente',
    description: 'Fique por dentro das últimas publicações e achados sobre o Concílio e sua influência até hoje. A pesquisa teológica em movimento.',
    image: '/heroAbout3.jpg',
    buttonText: 'Acompanhar novidades',
  },
];

const Header = () => {
  const { t } = useTranslation();

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={style.container} id="header">
      <Swiper 
        className={style.swiper}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        modules={[Autoplay]}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className={style.content}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={style.title}>
                <h1>{t(slide.title)}</h1>
                <h2>{t(slide.description)}</h2>
                <div className={style.aboutButton}>
                  <a
                    href="#emerged-nicea"
                    className={style.navLink}
                    onClick={(e) => handleSmoothScroll(e, '#emerged-nicea')}
                  >
                    <button className={style.Button}>
                      {t(slide.buttonText)} <FaArrowDown className={style.icon} />
                    </button>
                  </a>
                </div>
              </div>
              <div className={style.movingBar}>
                {index !== 0 && <h2>{t('Ilustrações criadas com ferramentas de IA')}</h2>}
                <MovingBar />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Header;