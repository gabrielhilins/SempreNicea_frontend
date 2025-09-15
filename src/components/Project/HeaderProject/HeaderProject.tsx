import React, { useState } from "react";
import style from "./style.module.scss";
import { FaArrowLeft, FaUserCircle, FaRegEye } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import ModalProject from "../ModalProject/ModalProject";
import { useTranslation } from "react-i18next";

interface HeaderProjectProps {
  image: string;
  titulo: string;
  publicador: string;
  constribuidoresNomeESobrenome: string[];
  description: string;
  fileUrl?: string | null;
}

const HeaderProject = ({
  image,
  titulo,
  publicador,
  constribuidoresNomeESobrenome,
  description,
  fileUrl,
}: HeaderProjectProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {t} = useTranslation();

  const handleOpenModal = () => {
    if (fileUrl && fileUrl.trim() !== '') {
      setIsModalOpen(true);
    }
  };

  return (
    <section className={style.container}>
      <div className={style.content}>
        <div
          className={style.headerImage}
          style={{ backgroundImage: `url(${image})` }}
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
            <span>{publicador}</span>
          </div>
          <div className={style.infoItem}>
            <FaUsers />
            <p>{t("contribuidores")}</p>
            {constribuidoresNomeESobrenome && Array.isArray(constribuidoresNomeESobrenome) 
                && constribuidoresNomeESobrenome.length > 0 
                ? constribuidoresNomeESobrenome.join(", ") 
                : t("Nenhum contribuidor")
              }
          </div>
        </div>
        <div className={style.description}>
          <p>{description}</p>
        </div>
        {fileUrl && fileUrl.trim() !== '' && (
          <div className={style.seeProject}>
            <button onClick={handleOpenModal}>
              <FaRegEye />
              {t("Ver Projeto Completo")}
            </button>
          </div>
        )}
      </div>
      <ModalProject
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        fileUrl={fileUrl} 
      />
    </section>
  );
};

export default HeaderProject;