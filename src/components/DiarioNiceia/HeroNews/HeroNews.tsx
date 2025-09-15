import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import styles from "./style.module.scss";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';

const HeroNews = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef<SwiperType>();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const newsData = [
    {
      id: 1,
      title: t("Niceia e a Nova Evangelização, encontro promovido pela Arquidiocese de Udine."),
      publishedTime: t("Publicado há 2 dias"),
      img: '/reuniaoSempreNiceia2.png',
      type: 'main'
    },
    {
      id: 2,
      title: t("Niceia e a Nova Evangelização, encontro promovido pela Arquidiocese de Udine."),
      publishedTime: t("Publicado há 2 dias"),
      img: '/reuniaoSempreNiceia.avif',
      type: 'side'
    },
    {
      id: 3,
      title: t("Niceia e a Nova Evangelização, encontro promovido pela Arquidiocese de Udine."),
      publishedTime: t("Publicado há 2 dias"),
      img: '/reuniaoConcilio.png',
      type: 'side'
    }
  ];

  if (isMobile) {
    return (
      <section className={styles.heroNewsMobile}>
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
          {newsData.map((news) => (
            <SwiperSlide key={news.id}>
              <div 
                className={styles.slideItem}
                style={{ backgroundImage: `url(${news.img})` }}
              >
                <div className={styles.slideNewsInfo}>
                  <h1>{news.title}</h1>
                  <p>{news.publishedTime}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button 
          className={styles.customPrevButton}
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label={t("Slide anterior")}
        >
          ‹
        </button>
        <button 
          className={styles.customNextButton}
          onClick={() => swiperRef.current?.slideNext()}
          aria-label={t("Próximo slide")}
        >
          ›
        </button>
      </section>
    );
  }

  const mainNews = newsData.find(news => news.type === 'main') || newsData[0];
  const sideNews = newsData.filter(news => news.type === 'side').slice(0, 2);

  return (
    <section className={styles.heroNews}>
      <div className={styles.mainNews} style={{ backgroundImage: `url(${mainNews.img})` }}>
        <div className={styles.newsInfo}>
          <h1>{mainNews.title}</h1>
          <p>{mainNews.publishedTime}</p>
        </div>
      </div>
      <div className={styles.sideNews}>
        {sideNews.map((news, index) => (
          <div 
            key={news.id}
            className={index === 0 ? styles.smallNewsHigh : styles.smallNewsLow}
            style={{ backgroundImage: `url(${news.img})` }}
          >
            <div className={styles.smallNewsInfo}>
              <h1>{news.title}</h1>
              <p>{news.publishedTime}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroNews;