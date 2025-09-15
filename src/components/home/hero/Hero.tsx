'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import { TiArrowSortedDown } from 'react-icons/ti';
import style from './style.module.scss';
import { useTranslation } from 'react-i18next';

const Hero = () => {
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

  const heroSlides = [
    {
      id: 1,
      title: t('slide1_title'),
      description: t('slide1_description'),
      image: '/heroHome1.jpg',
    },
    {
      id: 2,
      title: t('slide2_title'),
      description: t('slide2_description'),
      image: '/heroHome2.jpg',
    },
    {
      id: 3,
      title: t('slide3_title'),
      description: t('slide3_description'),
      image: '/heroHome3.jpg',
    },
  ];

  return (
    <section className={style.container}>
      <Swiper
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className={style.swiperContainer}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={style.content}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={style.title}>
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
              </div>
              <div className={style.scroll}>
                <a
                  href="#areatematicas"
                  className={style.navLink}
                  onClick={(e) => handleSmoothScroll(e, '#areatematicas')}
                >
                  <TiArrowSortedDown />
                </a>
              </div>
              <div className={style.imageIA}>
                <h2>{t('ai_disclaimer')}</h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;