'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaInstagram, FaLink } from 'react-icons/fa';
import style from './style.module.scss';
import { Tooltip } from 'react-tooltip';

import Pedro from '../../../../public/image-pedro.jpeg';
import Gabriel from '../../../../public/Gabriel.png';
import Jhones from '../../../../public/Jhon.png';
import Mayara from '../../../../public/image-mayara.jpeg';
import Arthur from '../../../../public/Arthur.png';
import Yuri from '../../../../public/Yuri.png';
import Carlos from '../../../../public/imagecarlos.jpeg';

const leaders = [
  {
    name: 'Pedro Cezar',
    position: 'Programador Fullstack, Designer UI/UX, Software Architecture',
    image: Pedro,
    instagram: 'https://www.instagram.com/opedro.sites/',
    linkedinthink: 'https://www.linkedin.com/in/pedro-cezarr/',
    github: 'https://github.com/PedroCezardev',
    website: 'https://pedrocezar.vercel.app/',
  },
  {
    name: 'Gabriel Henrique',
    position: 'Programador Fullstack, Designer, Backend Enginner',
    image: Gabriel,
    instagram: 'https://www.instagram.com/_gaabs98/',
    linkedin: 'https://www.linkedin.com/in/gabriel-henrique-lins/',
    github: 'https://github.com/gabrielhilins',
    website: 'https://portfolio-gabriel-henriques-projects.vercel.app/',
  },
  {
    name: 'Jhones Bonifácio',
    position: 'Programador Fullstack, Software Enginner, InfoSecurity',
    image: Jhones,
    instagram: 'https://www.instagram.com/jbtheonee/',
    linkedin: 'https://www.linkedin.com/in/jhonesbonifaciodasilva/',
    github: 'https://github.com/JhonB-DEVLP',
    website: '',
  },
  {
    name: 'Arthur Vinícius',
    position: 'Programador Fullstack, Frontend Enginner',
    image: Arthur,
    instagram: 'https://www.instagram.com/081_neguinho/',
    linkedin: 'https://www.linkedin.com/in/arthur-moraes-830815270/',
    github: 'https://github.com/lngg21',
    website: '',
  },
  {
    name: 'Mayara Wyrla',
    position: 'Test Enginner, Product Owner',
    image: Mayara,
    instagram: 'https://www.instagram.com/maywyrla/',
    linkedin: 'https://www.linkedin.com/in/mayarawyrlanascimento/',
    github: 'https://github.com/Mayaranasciment0',
    website: '',
  },
  {
    name: 'Yuri Catunda',
    position: 'Programador Fullstack',
    image: Yuri,
    instagram: 'https://www.instagram.com/yuri.catunda/',
    linkedin: 'https://www.linkedin.com/in/yuri-catunda-5316402a3/',
    github: 'https://github.com/yuuricathugaa',
    website: '',
  },
  {
    name: 'Carlos Eduardo',
    position: 'Programador Fullstack',
    image: Carlos,
    instagram: 'https://www.instagram.com/edu_23lima/',
    linkedin: 'https://www.linkedin.com/in/eduardo-lima-177w/',
    github: 'https://github.com/Eduard0177',
    website: '',
  },
];

const Team = () => {
  const { t } = useTranslation();

  return (
    <section className={style.container} id="team">
      <div className={style.content}>
        <div className={style.title}>
          <h1>{t('Conheça a Equipe de Desenvolvimento')}</h1>
          <p>
            {t('Estes são alunos dos 4º e 5º períodos do curso de Sistemas para Internet da Universidade Católica de Pernambuco. Em parceria com o Sempre Nicea, eles desenvolveram uma plataforma web dedicada ao armazenamento e à divulgação de todas as pesquisas e conteúdos da iniciativa. Os alunos, verdadeiros prodígios, foram responsáveis por todas as etapas do projeto, desde o design da interface até o desenvolvimento completo do sistema.')}
          </p>
        </div>
        <div className={style.grid}>
          {leaders.map((leader) => (
            <div key={leader.name} className={style.card}>
              <div className={style.photoContainer}>
                <Image
                  src={leader.image}
                  alt={leader.name}
                  className={style.photo}
                  width={280}
                  height={200}
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>
              <div className={style.infoContainer}>
                <h2 className={style.name}>{t(leader.name)}</h2>
                <p className={style.position}>{t(leader.position)}</p>
                <div className={style.socials}>
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tooltip-id={`linkedin-${leader.name}`}
                    data-tooltip-content={t('LinkedIn')}
                  >
                    <FaLinkedin />
                  </a>
                  <Tooltip id={`linkedin-${leader.name}`} place="bottom" />
                  <a
                    href={leader.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tooltip-id={`github-${leader.name}`}
                    data-tooltip-content={t('GitHub')}
                  >
                    <FaGithub />
                  </a>
                  <Tooltip id={`github-${leader.name}`} place="bottom" />
                  <a
                    href={leader.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tooltip-id={`instagram-${leader.name}`}
                    data-tooltip-content={t('Instagram')}
                  >
                    <FaInstagram />
                  </a>
                  <Tooltip id={`instagram-${leader.name}`} place="bottom" />
                  {leader.website && (
                    <a
                      href={leader.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-tooltip-id={`website-${leader.name}`}
                      data-tooltip-content={t('Website')}
                    >
                      <FaLink />
                    </a>
                  )}
                  <Tooltip id={`website-${leader.name}`} place="bottom" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;