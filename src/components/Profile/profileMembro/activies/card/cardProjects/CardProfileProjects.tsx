import React from "react";
import style from "./style.module.scss";
import Image from "next/image";

interface CardProps {
  id: number;
  imagem: string;
  titulo: string;
  descricao: string;
}

const CardProfileProjects = ({ id, imagem, titulo, descricao}: CardProps) => {
  return (
<section className={style.container}>
  <div className={style.content}>
    <div className={style.box}>
      <div className={style.overlay}>
        <Image src={imagem} alt={titulo} width={200} height={200}/>
      </div>
      <div className={style.texts}>
        <div className={style.title}>
          <h3>{titulo}</h3>
        </div>
        <div className={style.description}>
          <p>{descricao}</p>
        </div>
        
      </div>
    </div>
  </div>
  <hr />
</section>

  );
};

export default CardProfileProjects;
