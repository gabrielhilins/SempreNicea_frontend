import React from "react";
import style from "./style.module.scss";
import Image from "next/image";
import { BsViewStacked } from "react-icons/bs";
import { useTranslation } from "react-i18next";

interface ThematicArea {
  id: number;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
}

interface DescriptionAreaProps {
  selectedAreaId: number | null;
  thematicAreas: ThematicArea[];
}

const DescriptionArea = ({ selectedAreaId, thematicAreas }: DescriptionAreaProps) => {
  const selectedArea = thematicAreas.find((area) => area.id === selectedAreaId);
  const { t } = useTranslation();

  return (
    <section className={style.container}>
      <div className={style.content}>
        <div className={style.header}>
          <div className={style.title}>
            <h1>{t("Sobre a Área Temática")}</h1>
            <hr />
          </div>
        </div>
        <div className={style.description}>
          <Image
            src={selectedArea?.imagem || "/heroHome1.png"}
            alt={selectedArea?.titulo || t("Descrição da área temática")}
            width={500}
            height={300}
            className={style.image}
            onError={(e) => {
              console.warn(t("Erro ao carregar imagem:"), selectedArea?.imagem);
              e.currentTarget.src = "/imagemDescriçãoAreaTematica.svg";
            }}
          />
          <div className={style.text}>
            <h2>{selectedArea?.titulo || t("Todas as Áreas Temáticas")}</h2>
            <p>
              {selectedArea?.descricao || t("Selecione uma área temática para ver sua descrição ou explore todos os projetos disponíveis.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DescriptionArea;