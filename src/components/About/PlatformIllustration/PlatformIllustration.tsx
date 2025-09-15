"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import styles from "./style.module.scss"
import Image from "next/image"
import { useTranslation } from "react-i18next"


export default function Component() {
  const [activeSlide, setActiveSlide] = useState(0);
  const {t} = useTranslation();

  const slides = [
    {
      id: 1,
      title: t("Ver os Conteúdos Recentes"),
      description: t("Acompanhe todos os contéudos mais recentes"),
      image: "/sempre-nicea-front-neon.vercel.app_home (1).png",
      gradient: "emerald-gradient",
    },
    {
      id: 2,
      title: t("Ver os Projetos Filtrados"),
      description: t("Acesse os projetos filtrados por 4 Áreas temáticas"),
      image: "/sempre-nicea-front-neon.vercel.app_projects (2).png",
      gradient: "teal-gradient",
    },
    {
      id: 3,
      title: t("Ver o Diario Niceia, com Notícias e Eventos"),
      description: t("Fique por dentro de tudo que tá rolando envolvendo o Sempre Nicea"),
      image: "/sempre-nicea-front-neon.vercel.app_projects (1).png",
      gradient: "green-gradient",
    },
    {
      id: 4,
      title: t("Personalizar seu Perfil"),
      description: t("Você pode personalizar seu perfil na plataforma com suas informações!"),
      image: "/sempre-nicea-front-neon.vercel.app_profile.png",
      gradient: "emerald-dark-gradient",
    },
    {
      id: 5,
      title: t("Entrar em Contato com o Suporte"),
      description: t("Caso tenha alguma dúvida ou algo para acrescentar, pode contatar nossa equipe!"),
      image: "/sempre-nicea-front-neon.vercel.app_contact.png",
      gradient: "emerald-dark-gradient",
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.backgroundOverlay} />
      <div className={styles.contentWrapper}>
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>
            {t("Use o Sempre Niceia para")}
          </h1>
          
        </div>
        
        <div className={styles.swiperWrapper}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: `.${styles.swiperButtonNext}`,
              prevEl: `.${styles.swiperButtonPrev}`,
            }}
            pagination={{
              clickable: true,
              bulletClass: styles.paginationBullet,
              bulletActiveClass: styles.paginationBulletActive,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            effect="fade"
            fadeEffect={{
              crossFade: true,
            }}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
            className={styles.swiperContainer}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <div className={styles.slideContainer}>
                  <Image
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    width={1500}
                    height={1500}
                    className={styles.slideImage}
                  />
                  <div className={`${styles.gradientOverlay} ${styles[slide.gradient]}`} />
                  <div className={styles.blurOverlay} />
                  <div className={styles.contentOverlay}>
                    <div className={styles.overlayCard}>
                      <h3 className={styles.overlayTitle}>{slide.title}</h3>
                      <p className={styles.overlayDescription}>{slide.description}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className={`${styles.navigationButton} ${styles.swiperButtonPrev}`}>
            <svg className={styles.navigationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className={`${styles.navigationButton} ${styles.swiperButtonNext}`}>
            <svg className={styles.navigationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div className={styles.progressIndicators}>
          {slides.map((_, index) => (
            <div
              key={index}
              className={`${styles.progressDot} ${
                index === activeSlide ? styles.progressDotActive : styles.progressDotInactive
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}