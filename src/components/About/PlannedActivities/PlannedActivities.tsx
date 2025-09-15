"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import style from "./style.module.scss";

import Seminario from "../../../../public/Ilustracao Seminario.png";
import Conferencia from "../../../../public/Ilustracao Conferencia.png";
import Bibliografia from "../../../../public/Ilustracao Bibliografia Especializada.png";
import Coleta from "../../../../public/Ilustracao Coleta.png";

const activities = [
  {
    nome: "Realização de Seminários",
    descricao:
      "Realização de seminários com especialistas em história e teologia, abordando temas relacionados ao Concílio de Niceia.",
    imagem: Seminario,
  },
  {
    nome: "Conferência Internacional",
    descricao:
      "Organização de uma conferência internacional com a participação de acadêmicos e especialistas em história da Igreja.",
    imagem: Conferencia,
  },
  {
    nome: "Elaboração de uma Bibliografia Especializada",
    descricao:
      "Criação de uma bibliografia especializada sobre o Concílio de Niceia, com foco em obras acadêmicas e fontes primárias.",
    imagem: Bibliografia,
  },
  {
    nome: "Divulgação de Eventos e Iniciativas do 1700º Aniversário do Concílio",
    descricao:
      "Coleta e publicação de informações sobre eventos e iniciativas relacionadas ao 1700º aniversário do Concílio de Niceia.",
    imagem: Coleta,
  },
];

const PlannedActivities: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className={style.section} id="atividades-previstas">
      <div className={style.title}>
        <h1>{t("Atividades Previstas")}</h1>
      </div>
      <div className={style.underline}></div>
      <div className={style.swiperContainer}>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className={style.swiper}
        >
          {activities.map((activity, index) => (
            <SwiperSlide key={index}>
              <div className={style.activityCard}>
                <div className={style.textContainer}>
                  <h2>{t(activity.nome)}</h2>
                  <p>{t(activity.descricao)}</p>
                </div>
                <Image
                  src={activity.imagem || "/placeholder.svg"}
                  alt={`Imagem da atividade: ${activity.nome}`}
                  width={600}
                  height={400}
                  className={style.image}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PlannedActivities;
