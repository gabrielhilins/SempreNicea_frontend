import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import style from './style.module.scss';

interface AccordionCardProps {
  question: string;
  answer: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const AccordionCard: React.FC<AccordionCardProps> = ({ question, answer, isActive, onClick, index }) => {
  return (
    <div key={index} className={style.accordionItem}>
      <button
        className={style.accordionHeader}
        onClick={onClick}
        aria-expanded={isActive}
        aria-controls={`faq-content-${index}`}
      >
        <p className={style.question}>{question}</p>
        <FaChevronDown
          className={`${style.icon} ${isActive ? style.active : ''}`}
        />
      </button>
      <div
        id={`faq-content-${index}`}
        className={`${style.accordionContent} ${isActive ? style.active : ''}`}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default AccordionCard;
