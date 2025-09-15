import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUnlock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./FormLogin.module.scss";

interface FormLoginProps {
  ehLogin: boolean;
}

const FormLogin: React.FC<FormLoginProps> = ({ ehLogin }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState<boolean>(false);
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

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    setIsPasswordTyping(true);
  };

  const handlePasswordFocus = (): void => {
    setIsPasswordTyping(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t("Por favor, preencha todos os campos obrigatórios"));
      return;
    }
    if (!validateEmail(email)) {
      toast.error(t("Por favor, digite um email válido"));
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password, rememberMe }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          if (errorData.message === "Sua solicitação de cadastro como Membro ainda está em análise") {
            toast.warn(t("Sua solicitação de cadastro como Membro ainda está em análise"), {
              toastId: "pending-membership",
              autoClose: 5000,
            });
          } else {
            toast.error(t("E-mail ou senha não encontrados"));
          }
        } else if (response.status === 403) {
          toast.error(t("Credenciais inválidas"));
        } else {
          throw new Error(errorData.message || "Erro no login");
        }
        return;
      }
      const data = await response.json();
      localStorage.setItem("role", data.role);
      if (rememberMe) {
        localStorage.setItem("authToken", data.token);
      } else {
        sessionStorage.setItem("authToken", data.token);
      }
      console.log("New token stored:", data.token);
      toast.success(t("Login realizado com sucesso!"));
      setTimeout(() => {
        toast.info(t("Redirecionando para a Página Home..."));
        setTimeout(() => router.push("/home"), 2000);
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || t("Erro ao realizar login. Tente novamente!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form className={styles.formContainer} onSubmit={handleSubmit}>
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
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            {isPasswordTyping ? <FaLock className={styles.inputIcon} /> : <FaUnlock className={styles.inputIcon} />}
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              required
              className={`${styles.input} ${password ? styles.filled : ""}`}
            />
            <label htmlFor="password">{t("Senha")}</label>
            <span className={styles.toggleIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className={styles.optionsSection}>
          <Link href="/forgot-password" className={styles.forgotLink}>
            {t("Esqueceu sua senha?")}
          </Link>
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? <div className={styles.spinner}></div> : t("Entrar")}
        </button>
      </form>
    </>
  );
};

export default FormLogin;