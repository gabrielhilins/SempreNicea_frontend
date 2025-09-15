/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './style.module.scss';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '@/locales/118n';
import { FaArrowDown } from 'react-icons/fa';

const TrocaIdioma: React.FC = () => {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('pt');

  const ehLoginOuCadastro = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const savedLang = sessionStorage.getItem('app-language');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
      setSelectedLanguage(savedLang);
    } else {
      i18n.changeLanguage('pt');
      setSelectedLanguage('pt');
    }
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('app-language', lng);
    setSelectedLanguage(lng);
    setIsOpen(false);
  };

  const flagMap: Record<string, { src: string; alt: string; label: string }> = {
    de: { src: '/Flag_of_Germany.svg', alt: 'Deutsch', label: 'DE' },
    en: { src: '/Flag_of_United_States.svg', alt: 'English', label: 'EN-US' },
    es: { src: '/Flag_of_Spain.svg', alt: 'Español', label: 'ES' },
    fr: { src: '/Flag_of_France.svg', alt: 'Français', label: 'FR' },
    it: { src: '/Flag_of_Italy.svg', alt: 'Italiano', label: 'IT' },
    pt: { src: '/Flag_of_Brazil.svg', alt: 'Português', label: 'PT-BR' },
  };

  return (
    <div className={`${styles.dropdownContainer} ${ehLoginOuCadastro ? styles.loginCadastroStyle : ''}`}>
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${styles.dropdownButton} ${ehLoginOuCadastro ? styles.loginCadastroButton : ''}`}
        >
          <Image
            src={flagMap[selectedLanguage]?.src || '/Flag_of_Brazil.svg'}
            alt={'Flag'}
            width={32}
            height={32}
            className={styles.flagImage}
          />
          <FaArrowDown className={`${styles.arrowIcon} ${isOpen ? styles.rotated : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className={`${styles.dropdownMenu} ${ehLoginOuCadastro ? styles.loginCadastroMenu : ''}`}>
          <div className="py-1">
            {Object.entries(flagMap).map(([lng, { src, alt, label }]) => (
              <button key={lng} onClick={() => changeLanguage(lng)} className={styles.languageButton}>
                <Image src={src} alt={alt} width={32} height={32} className={styles.flagImage} />
                <span className={styles.languageText}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrocaIdioma;