import React from "react";
import style from "./style.module.scss";
import { FaArrowLeft, FaCalendar, FaUserCircle, FaRegEye } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface HeaderNewsProps {
  titulo: string;
  categoria: string;
  mediaUrl: string;
  publicadorNomeESobrenome: string;
  dataPublicacao: string;
  conteudo: string;
}

const HeaderNews = ({
  mediaUrl,
  titulo,
  publicadorNomeESobrenome,
  dataPublicacao,
  categoria,
  conteudo,
}: HeaderNewsProps) => {
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <section className={style.container}>
      <div className={style.content}>
        <div
          className={style.headerImage}
          style={{ backgroundImage: `url(${mediaUrl})` }}
        >
          <button onClick={() => router.back()}>
            <FaArrowLeft />
            {t("Voltar")}
          </button>
        </div>
        <div className={style.title}>
          <h1>{titulo}</h1>
        </div>
        <div className={style.info}>
          <div className={style.infoItem}>
            <FaUserCircle />
            <p>{t("publicador")}</p>
            <span>{publicadorNomeESobrenome}</span>
          </div>
          <div className={style.infoItem}>
            <FaRegNewspaper />
            <p>{t("Categoria")}:</p>
            <span>{categoria}</span>
          </div>
          <div className={style.infoItem}>
            <FaCalendar />
            <p>{t("Data de Publicação")}:</p>
            <span>{dataPublicacao}</span>
          </div>
        </div>
        <div className={style.description}>
          <p>{conteudo}</p>
        </div>
      </div>
    </section>
  );
};

export default HeaderNews;