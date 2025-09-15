import React from 'react';
import style from './style.module.scss';
import Image from 'next/image';

const MovingBar = () => {
  const images = [
    { image: "/dicastero 1.png" },
    { image: "/Academia_Romana 1.png" },
    { image: "/Salernitano.png" },
    { image: "/Gesellshaft.png" },
    { image: "/Associazone_Chiesa.png" },
    { image: "/Centro Studi.png" },
    { image: "/Russia Cristiana.png" },
    { image: "/Charisma.png" },
    { image: "/Avventista Firenze.png" },
    { image: "/Unicap.png" },
    { image: "/Pontifica Facolta.png" },
  ];

  // Duplicar o array para criar o efeito loop infinito
  const duplicatedImages = [...images, ...images];

  return (
    <section className={style.container}>
      <div className={style.marquee}>
        <div className={style.track}>
          {duplicatedImages.map((item, index) => (
            <div key={`logo-${index}`} className={style.imageWrapper}>
              <Image 
                src={item.image} 
                alt={`logo-${index}`} 
                width={100} 
                height={100} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovingBar;