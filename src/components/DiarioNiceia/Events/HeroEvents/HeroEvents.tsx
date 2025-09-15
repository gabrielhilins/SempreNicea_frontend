"use client";

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './style.module.scss';
import { useTranslation } from 'react-i18next';


const HeroEvents: React.FC = () => {
  const swiperRef = useRef<SwiperType>();
  const {t} = useTranslation();
  
  const eventosData = [
    {
      id: 1,
      title: t('A Igreja de Bizâncio celebra no sétimo domingo da Páscoa'),
      img: '/reuniaoSempreNiceia2.png',
    },
    {
      id: 2,
      title: t('A Igreja Luterana-Missouri celebra em 12 de junho'),
      img: '/reuniaoSempreNiceia.avif',
    },
    {
      id: 3,
      title: t('A Igreja Copta celebra em 18 de novembro'),
      img: '/reuniaoConcilio.png',
    },
  ];

  return (
    <div className={styles.eventCarouselContainer}>
      <div className={styles.carouselTitle}>
        <h2>{t("Eventos")}</h2>
        <hr className={styles.hr} />
      </div>
      
      <div className={styles.swiperContainer}>
        <Swiper
          modules={[Navigation, Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className={styles.eventCarousel}
        >
          {eventosData.map((evento) => (
            <SwiperSlide key={evento.id}>
              <div className={styles.imageWrapper}
                style={{ backgroundImage: `url(${evento.img})` }}
              >
                <div className={styles.caption}>
                  <h3>{evento.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button 
          className={styles.customPrevButton}
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button 
          className={styles.customNextButton}
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default HeroEvents;