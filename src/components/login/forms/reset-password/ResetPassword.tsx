'use client';

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash, FaLock, FaUnlock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ResetPassword.module.scss";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState<boolean>(false);
  const [isConfirmPasswordTyping, setIsConfirmPasswordTyping] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("");
      return true;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(t("A senha deve ter pelo menos 6 caracteres, incluindo letras e números"));
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!newPassword || !confirmPassword) {
      setConfirmPasswordError("");
      return true;
    }
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError(t("As senhas não coincidem"));
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;
    setNewPassword(password);
    setIsPasswordTyping(true);
    validatePassword(password);
    validateConfirmPassword(confirmPassword);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const confirm = e.target.value;
    setConfirmPassword(confirm);
    setIsConfirmPasswordTyping(true);
    validateConfirmPassword(confirm);
  };

  const handlePasswordFocus = (): void => {
    setIsPasswordTyping(false);
  };

  const handleConfirmPasswordFocus = (): void => {
    setIsConfirmPasswordTyping(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email) {
      toast.error(t("E-mail inválido ou ausente"));
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.error(t("Por favor, preencha todos os campos obrigatórios"));
      return;
    }
    if (!validatePassword(newPassword) || !validateConfirmPassword(confirmPassword)) {
      toast.error(t("Por favor, corrija os erros nos campos"));
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Sua solicitação de cadastro como Membro ainda está em análise") {
          toast.warn(t("Sua solicitação de cadastro como Membro ainda está em análise"), {
            toastId: "pending-membership",
            autoClose: 5000,
          });
        } else {
          toast.error(t(errorData.message || "Erro ao redefinir a senha"));
        }
        return;
      }
      toast.success(t("Senha redefinida com sucesso!"));
      toast.info(t("Redirecionando para a Página de Login..."));
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      toast.error(t("Erro ao redefinir a senha. Tente novamente!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>{t("Redefinir Senha")}</h2>
        <p className={styles.formDescription}>{t("Digite sua nova senha abaixo.")}</p>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            {isPasswordTyping ? <FaLock className={styles.inputIcon} /> : <FaUnlock className={styles.inputIcon} />}
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              required
              className={`${styles.input} ${newPassword ? styles.filled : ""}`}
            />
            <label htmlFor="newPassword">{t("Nova Senha")}</label>
            <span className={styles.toggleIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            {isConfirmPasswordTyping ? <FaLock className={styles.inputIcon} /> : <FaUnlock className={styles.inputIcon} />}
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onFocus={handleConfirmPasswordFocus}
              required
              className={`${styles.input} ${confirmPassword ? styles.filled : ""}`}
            />
            <label htmlFor="confirmPassword">{t("Confirmar Senha")}</label>
            <span className={styles.toggleIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {confirmPasswordError ? (
            <p className={styles.errorMessage}>{confirmPasswordError}</p>
          ) : (
            confirmPassword && newPassword && confirmPassword === newPassword && (
              <p className={styles.successMessage}>{t("As senhas coincidem.")}</p>
            )
          )}
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? <div className={styles.spinner}></div> : t("Redefinir Senha")}
        </button>
      </form>
    </>
  );
};

export default ResetPassword;