import React from "react";
import style from "./style.module.scss";
import { FaArrowLeft, FaUserCircle, FaRegEye } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface HeaderEventProps {
  titulo: string;
  arquivosMidia: string;
  publicadorNomeESobrenome: string;
  constribuidoresNomeESobrenome: string[];
  dataEvento: string;
  descricao: string;
}

const HeaderEvent = ({
  arquivosMidia,
  titulo,
  publicadorNomeESobrenome,
  constribuidoresNomeESobrenome,
  dataEvento,
  descricao,
}: HeaderEventProps) => {
  const router = useRouter();
  const {t} = useTranslation();

  return (
    <section className={style.container}>
      <div className={style.content}>
        <div
          className={style.headerImage}
          style={{ backgroundImage: `url(${arquivosMidia})` }}
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
            <FaUsers />
            <p>{t("contribuidores")}</p>
            <span>
              {constribuidoresNomeESobrenome && Array.isArray(constribuidoresNomeESobrenome) 
                && constribuidoresNomeESobrenome.length > 0 
                ? constribuidoresNomeESobrenome.join(", ") 
                : t("Nenhum contribuidor")
              }
            </span>
          </div>
          <div className={style.infoItem}>
            <MdEvent />
            <p>{t("Data do Evento")}:</p>
            <span>{dataEvento}</span>
          </div>
        </div>
        <div className={style.description}>
          <p>{descricao}</p>
        </div>
      </div>
    </section>
  );
};

export default HeaderEvent;