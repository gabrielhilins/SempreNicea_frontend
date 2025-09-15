'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';

import Burigana from '../../../../public/Ricardo Burigana.png';
import Luiz from '../../../../public/Luiz Carlos.png';
import Default from '../../../../public/default-profile.png';

const members = [
  {
    imageUrl: Burigana,
    name: 'Prof. Ricardo Burigana',
    role: 'Coordenador',
  },
  {
    imageUrl: Luiz,
    name: 'Prof. Luiz Carlos',
    role: 'Coordenador',
  },
  {
    imageUrl: Default,
    name: 'Prof. Roberto Della Rocca',
    role: null,
  },
  {
    imageUrl: Default,
    name: 'Prof. Francesco Pesce',
    role: null,
  },
  {
    imageUrl: Default,
    name: 'Profa. Rossella Schirone',
    role: null,
  },
  {
    imageUrl: Default,
    name: 'Prof. Alex Talarico',
    role: null,
  },
];

const ScientificSecretary = () => {
  const { t } = useTranslation();

  return (
    <div className={style.container} id="secretaria-cientifica">
      <div className={style.title}>
        <h1>{t('Conheça a Secretaria Científica')}</h1>
      </div>
      <div className={style.subtitle}>
        <p>
          {t('A Secretaria Científica do Projeto Niceia coordena pesquisas, gerencia publicações e organiza eventos acadêmicos sobre o Concílio de Nicéia. Ela é responsável pelo armazenamento de dados, divulgação científica e apoio administrativo, além de promover educação e buscar financiamentos para pesquisas.')}
        </p>
      </div>

      <div className={style.members}>
        {members.map((member, index) => (
          <div className={style.card} key={index}>
            <Image
              src={member.imageUrl}
              alt={`Foto de ${member.name}`}
              width={150}
              height={150}
              className={style.image}
              sizes="(max-width: 768px) 100vw, 150px"
            />
            <h2>{t(member.name)}</h2>
            {member.role && <p className={style.role}>{t(member.role)}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScientificSecretary;