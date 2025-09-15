import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { MdPerson } from 'react-icons/md';
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUnlock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from './FormCadastro.module.scss';

interface FormCadastroProps {
  ehLogin: boolean;
}

const FormCadastro: React.FC<FormCadastroProps> = ({ ehLogin }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [ehMembro, setEhMembro] = useState<boolean | null>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordTyping, setIsPasswordTyping] = useState<boolean>(false);
  const [isConfirmPasswordTyping, setIsConfirmPasswordTyping] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');
  const [sobrenome, setSobrenome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation();

  // Cleanup toasts on component unmount
  useEffect(() => {
    return () => {
      toast.dismiss(); // Clear all toasts when component unmounts
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email) {
      setEmailError('');
      setEmailValid(false);
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t('E-mail inválido'));
      setEmailValid(false);
      return false;
    }
    setEmailError('');
    setEmailValid(true);
    return true;
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('');
      return true;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(t('A senha deve ter pelo menos 6 caracteres, incluindo letras e números'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!password || !confirmPassword) {
      setConfirmPasswordError('');
      return true;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError(t('As senhas não coincidem'));
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordTyping(true);
    validatePassword(newPassword);
    validateConfirmPassword(confirmPassword);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setIsConfirmPasswordTyping(true);
    validateConfirmPassword(newConfirmPassword);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!nome || !email || !sobrenome || !password || !confirmPassword) {
      toast.error(t('Por favor, preencha todos os campos obrigatórios'));
      return;
    }
    if (ehMembro === null) {
      toast.error(t('Por favor, selecione se você é membro ou não'));
      return;
    }
    if (!validateEmail(email) || !validatePassword(password) || !validateConfirmPassword(confirmPassword)) {
      toast.error(t('Por favor, corrija os erros nos campos'));
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = ehMembro ? `${baseUrl}/api/membros/solicitar` : `${baseUrl}/api/usuarios/add`;
      const role = ehMembro ? 'MEMBRO' : 'USUARIO';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, sobrenome, email, senha: password, role }),
      });
      if (!response.ok) throw new Error('Erro no cadastro');
      const data = await response.json();
      console.log('Cadastro bem-sucedido!', data);
      if (ehMembro) {
        toast.success(t('Solicitação de cadastro enviada com sucesso!'));
        setIsModalOpen(true);
      } else {
        toast.success(t('Cadastro realizado com sucesso!'));
        setTimeout(() => {
          toast.info(t('Aguarde um momento e faça seu login!'));
          setTimeout(() => router.push('/login'), 2000);
        }, 1000);
      }
    } catch (error) {
      toast.error(
        ehMembro
          ? t('Erro ao enviar solicitação de cadastro. Tente novamente!')
          : t('Erro ao cadastrar usuário. Tente novamente!')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setTimeout(() => router.push('/login'), 1000);
  };

  return (
    <>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.membroSection}>
          <label className={styles.membroLabel}>
            {t('Você é Membro do Sempre Nicea?')}
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type='radio'
                name='membro'
                value='sim'
                onChange={() => setEhMembro(true)}
                required
                className={styles.radioInput}
              />
              <span>{t('Sim')}</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type='radio'
                name='membro'
                value='nao'
                onChange={() => setEhMembro(false)}
                required
                className={styles.radioInput}
              />
              <span>{t('Não')}</span>
            </label>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <MdPerson className={styles.inputIcon} />
            <input
              type='text'
              id='nome'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className={`${styles.input} ${nome ? styles.filled : ''}`}
            />
            <label htmlFor='nome'>{t('Nome')}</label>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <MdPerson className={styles.inputIcon} />
            <input
              type='text'
              id='sobrenome'
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              required
              className={`${styles.input} ${sobrenome ? styles.filled : ''}`}
            />
            <label htmlFor='sobrenome'>{t('Sobrenome')}</label>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type='email'
              id='email'
              value={email}
              onChange={handleEmailChange}
              onBlur={() => validateEmail(email)}
              required
              className={`${styles.input} ${email ? styles.filled : ''}`}
            />
            <label htmlFor='email'>{t('Email')}</label>
          </div>
          {emailError && <p className={styles.errorMessage}>{emailError}</p>}
          {emailValid && email && <p className={styles.successMessage}>{t('E-mail válido')}</p>}
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            {isPasswordTyping ? <FaLock className={styles.inputIcon} /> : <FaUnlock className={styles.inputIcon} />}
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setIsPasswordTyping(false)}
              required
              className={`${styles.input} ${password ? styles.filled : ''}`}
            />
            <label htmlFor='password'>{t('Senha')}</label>
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
              type={showConfirmPassword ? 'text' : 'password'}
              id='confirmPassword'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onFocus={() => setIsConfirmPasswordTyping(false)}
              required
              className={`${styles.input} ${confirmPassword ? styles.filled : ''}`}
            />
            <label htmlFor='confirmPassword'>{t('Confirmar Senha')}</label>
            <span className={styles.toggleIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {confirmPasswordError ? (
            <p className={styles.errorMessage}>{confirmPasswordError}</p>
          ) : (
            confirmPassword && password && confirmPassword === password && (
              <p className={styles.successMessage}>{t('As senhas coincidem.')}</p>
            )
          )}
        </div>

        <button type='submit' className={styles.submitButton} disabled={loading}>
          {loading ? <div className={styles.spinner}></div> : t('Cadastrar')}
        </button>
      </form>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{t('Solicitação Enviada')}</h2>
            <p className={styles.modalText}>
              {t(
                `Sua solicitação de cadastro como membro foi enviada com sucesso! Você será notificado por e-mail em ${email} sobre a aprovação ou rejeição.`
              )}
            </p>
            <button
              onClick={handleModalClose}
              className={styles.modalButton}
              disabled={loading}
            >
              {t('Entendido')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormCadastro;