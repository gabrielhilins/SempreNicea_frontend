'use client';

import React, { useState } from 'react';
import style from './style.module.scss';
import AccordionCard from '../../Contact/Accordion/AccordionCard/AccordionCard';
import { useTranslation } from 'react-i18next';

interface FAQItem {
  question: string;
  answer: string;
}

const Accordion: React.FC = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: t('Quem é o responsável pelo grupo Sempre Nicea?'),
      answer: t('O grupo Sempre Nicea é coordenado por uma equipe ecumênica composta por representantes de instituições parceiras, com apoio da Secretaria Científica. Para mais detalhes, consulte a seção "Equipe de Desenvolvimento" no site.'),
    },
    {
      question: t('Como faço meu login?'),
      answer: t('Acesse a página de login, clique em "Cadastrar" para criar uma conta com seu e-mail e senha, ou use "Esqueci minha senha" para recuperar acesso. Após o cadastro, você poderá entrar na área de usuário.'),
    },
    {
      question: t('O que são os membros do Sempre Nicea?'),
      answer: t('Os membros são indivíduos e instituições engajados na preservação da memória ecumênica do Concílio de Niceia. Incluem pesquisadores, estudantes, clérigos e entusiastas que participam de eventos e acessam conteúdos exclusivos.'),
    },
    {
      question: t('Como posso fazer parte do Sempre Nicea?'),
      answer: t('Para se tornar parte, crie uma conta na página de cadastro e participe das atividades previstas, como eventos, cursos e fóruns. Você também pode se inscrever para receber atualizações ou contribuir com projetos.'),
    },
    {
      question: t('Qualquer pessoa pode criar uma conta?'),
      answer: t('Sim, qualquer pessoa interessada na história e legado do Concílio de Niceia pode criar uma conta gratuita para acessar conteúdos e participar da comunidade Sempre Nicea.'),
    },
    {
      question: t('Como acesso conteúdos exclusivos, como o Veritas in Caritate?'),
      answer: t('Após criar sua conta, faça login e acesse a área de usuário. Lá, você encontrará publicações como o Veritas in Caritate e arquivos históricos na seção de arquivos.'),
    },
    {
      question: t('Como posso participar dos eventos do Sempre Nicea?'),
      answer: t('Consulte a seção "Atividades Previstas" no site para ver o calendário de eventos. Após criar sua conta, você pode se inscrever para cursos, palestras e fóruns diretamente na plataforma.'),
    },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={style.container} id="faq">
      <div className={style.title}>
        <h1>{t('Ficou com alguma dúvida?')}</h1>
        <hr />
      </div>
      <div className={style.content}>
        {faqItems.map((item, index) => (
          <AccordionCard
            key={index}
            question={item.question}
            answer={item.answer}
            isActive={activeIndex === index}
            onClick={() => toggleAccordion(index)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default Accordion;