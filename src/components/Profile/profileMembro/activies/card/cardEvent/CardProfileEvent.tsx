import React from "react";
import style from "./style.module.scss";
import Image from "next/image";

interface EventCardProps {
  id: number;
  titulo: string;
  descricao: string;
  arquivosMidia: string;
  dataEvento: string;
}

const CardProfileEvents = ({ id, arquivosMidia, titulo, descricao, dataEvento}: EventCardProps) => {
  return (
<section className={style.container}>
  <div className={style.content}>
    <div className={style.box}>
      <div className={style.overlay}>
        <Image  src={arquivosMidia || "/event-default.png"} alt={titulo} width={200} height={200}/>
      </div>
      <div className={style.texts}>
        <div className={style.title}>
          <h3>{titulo}</h3>
        </div>
        <div className={style.description}>
          <p>{descricao}</p>
        </div>
        <div className={style.description}>
          <p>{dataEvento}</p>
        </div>
        
      </div>
    </div>
  </div>
  <hr />
</section>

  );
};

export default CardProfileEvents;
