'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope, FaHome } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BrandBox from '@/components/logo/Logo';
import TrocaIdioma from '@/components/trocaIdioma/TrocaIdioma';
import FormLogin from '@/components/login/forms/login/FormLogin';
import FormCadastro from '@/components/login/forms/cadastro/FormCadastro';
import styles from './Acesso.module.scss';
import ThemeToggle from '@/components/Theme/ThemeToggle';

interface AcessoProps {
  ehLogin: boolean;
}

const Acesso: React.FC<AcessoProps> = ({ ehLogin }) => {
  const { t } = useTranslation();
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);

  const toggleFormulario = () => setMostrarFormulario((prev) => !prev);

  return (
    <div className={styles.acessoContainer}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />
      <div className={styles.brandSection}>
        <div className={styles.switchRow}>
        <TrocaIdioma />
        <ThemeToggle />
        </div>
        <BrandBox color="#1D361F" />
        <Link href="/" className={styles.homeButton}>
          <FaHome />
          {t('voltarPaginaInicial')}
        </Link>
      </div>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>
            {ehLogin ? t('facaLogin') : t('cadastre')}
          </h1>
          {!mostrarFormulario && (
            <div className={styles.buttonGroup}>
              {/*}
              <button className={styles.googleButton}>
                <Image
                  src="/Google Logo.svg"
                  alt={t('iconeGoogle')}
                  width={20}
                  height={20}
                />
                {ehLogin ? t('entrarGoogle') : t('cadastreGoogle')}
              </button>
              */}
              <button className={styles.emailButton} onClick={toggleFormulario}>
                <FaEnvelope />
                {ehLogin ? t('entrarEmail') : t('cadastreEmail')}
              </button>
            </div>
          )}
          {mostrarFormulario && (
            ehLogin ? <FormLogin ehLogin={ehLogin} /> : <FormCadastro ehLogin={ehLogin} />
          )}
          <p className={styles.accountText}>
            {ehLogin ? t('naoConta') : t('jaConta')}
            <Link href={ehLogin ? '/register' : '/login'} className={styles.link}>
              {ehLogin ? t('cadastre') : t('facaLogin')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Acesso;