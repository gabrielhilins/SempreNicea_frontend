"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";
import AccordionCard from "./AccordionCard/AccordionCard";

interface FAQItem {
  question: string;
  answer: string;
}

const Accordion: React.FC = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: t("FAQ1 Question"),
      answer: t("FAQ1 Answer"),
    },
    {
      question: t("FAQ2 Question"),
      answer: t("FAQ2 Answer"),
    },
    {
      question: t("FAQ3 Question"),
      answer: t("FAQ3 Answer"),
    },
    {
      question: t("FAQ4 Question"),
      answer: t("FAQ4 Answer"),
    },
    {
      question: t("FAQ5 Question"),
      answer: t("FAQ5 Answer"),
    },
    {
      question: t("FAQ6 Question"),
      answer: t("FAQ6 Answer"),
    },
    {
      question: t("FAQ7 Question"),
      answer: t("FAQ7 Answer"),
    },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={style.container}>
      <div className={style.title}>
        <h1>{t("FAQ Title")}</h1>
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