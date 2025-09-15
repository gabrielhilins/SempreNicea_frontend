"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BrandBox from "@/components/logo/Logo";
import TrocaIdioma from "@/components/trocaIdioma/TrocaIdioma";
import ForgotPassword from "@/components/login/forms/forgot-password/ForgotPassword";
import styles from "@/components/login/acesso/Acesso.module.scss";
import { FaHome } from "react-icons/fa";

const ForgotPasswordPage: React.FC = () => {
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
          {t("voltarPaginaInicial")}
        </Link>
      </div>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <ForgotPassword />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
