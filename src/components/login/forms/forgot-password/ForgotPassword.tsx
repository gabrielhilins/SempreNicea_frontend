'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ForgotPassword.module.scss";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email) {
      setEmailError("");
      setEmailValid(false);
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t("E-mail inválido"));
      setEmailValid(false);
      return false;
    }
    setEmailError("");
    setEmailValid(true);
    return true;
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email) {
      toast.error(t("Por favor, preencha o campo de e-mail"));
      return;
    }
    if (!validateEmail(email)) {
      toast.error(t("Por favor, digite um e-mail válido"));
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Sua solicitação de cadastro como Membro ainda está em análise") {
          toast.warn(t("Sua solicitação de cadastro como Membro ainda está em análise"), {
            toastId: "pending-membership",
            autoClose: 5000,
          });
        } else {
          toast.error(t(errorData.message || "E-mail não encontrado"));
        }
        return;
      }
      toast.success(t("E-mail verificado com sucesso!"));
      toast.info(t("Redirecionando para a Página de Redefinir Senha..."));
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (error: any) {
      toast.error(t("Erro ao verificar o e-mail. Tente novamente!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>{t("Esqueceu sua Senha?")}</h2>
        <p className={styles.formDescription}>{t("Digite seu e-mail para prosseguir com a redefinição de senha.")}</p>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => validateEmail(email)}
              required
              className={`${styles.input} ${email ? styles.filled : ""}`}
            />
            <label htmlFor="email">{t("Email")}</label>
          </div>
          {emailError && <p className={styles.errorMessage}>{emailError}</p>}
          {emailValid && email && <p className={styles.successMessage}>{t("E-mail válido")}</p>}
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? <div className={styles.spinner}></div> : t("Prosseguir")}
        </button>
      </form>
    </>
  );
};

export default ForgotPassword;