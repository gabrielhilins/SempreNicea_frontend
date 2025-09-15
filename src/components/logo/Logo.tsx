import Image from "next/image";
import styles from "./BrandBox.module.scss"; // Importando o arquivo SCSS
import { useTranslation } from "react-i18next";

interface BrandBoxProps {
  color: string;
}

const BrandBox = ({ color }: BrandBoxProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles.brandbox} style={{ color }}>
      <Image
        src="/LogoWhite.svg"
        alt="Logo"
        width={240} // Largura padrão
        height={240} // Altura padrão
        priority
        className={styles.logo} // Usando a classe SCSS
      />
      <div className={styles.wordmark}>

      <p className={styles.title}>SEMPRE NICEA</p>
      <p className={styles.subtitle}>{t("Slogan")}</p>
      <p className={styles.date}>325 - 2025</p>
      </div>
    </div>
  );
};

export default BrandBox;
