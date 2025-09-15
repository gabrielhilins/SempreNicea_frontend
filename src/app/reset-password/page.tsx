"use client";

import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BrandBox from "@/components/logo/Logo";
import TrocaIdioma from "@/components/trocaIdioma/TrocaIdioma";
import ResetPassword from "@/components/login/forms/reset-password/ResetPassword";
import styles from "@/components/login/acesso/Acesso.module.scss";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();

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
        <TrocaIdioma />
        <BrandBox color="#1D361F" />
        <Link href="/" className={styles.homeButton}>
          <FaHome />
          {t('voltarPaginaInicial')}
        </Link>
      </div>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <Suspense fallback={<div>{t("Carregando..")}.</div>}>
            <ResetPassword />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;