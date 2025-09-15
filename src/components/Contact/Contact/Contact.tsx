"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdEmail } from "react-icons/md";
import emailjs from '@emailjs/browser';
import style from './style.module.scss';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    const form = e.currentTarget;

    emailjs
      .sendForm(
        'service_kjxfowp', // Service ID
        'template_ihzie28', // Template ID
        form,
        'XAvL7RxhjDLFfUFEm' // Public Key
      )
      .then(
        () => {
          setSuccessMessage(t("Success Message"));
          form.reset();
        },
        (error) => {
          setErrorMessage(t("Error Message"));
          console.error('Erro no EmailJS:', error.text);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <section className={style.container}>
      <div className={style.contactBox}>
        <div className={style.infoPanel}>
          <h2>{t("Suporte")}</h2>
          <div className={style.infoItem}>
            <MdEmail color="#d4a038" />
            <span>equipesemprenicea@gmail.com</span>
          </div>
        </div>
        <div className={style.formPanel}>
          <h2>
            {t("Contact Title")} <br />
            <span>{t("Contact Subtitle")}</span>
          </h2>
          <form onSubmit={sendEmail}>
            <div className={style.row}>
              <input type="text" name="first_name" placeholder={t("Nome")} required />
              <input type="text" name="last_name" placeholder={t("Sobrenome")} required />
            </div>
            <input type="email" name="email" placeholder={t("Email")} required />
            <input type="text" name="subject" placeholder={t("Assunto")} required />
            <textarea name="message" placeholder={t("Mensagem")} required></textarea>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("Sending") : t("Send")}
            </button>
            {successMessage && <p className={style.success}>{successMessage}</p>}
            {errorMessage && <p className={style.error}>{errorMessage}</p>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;