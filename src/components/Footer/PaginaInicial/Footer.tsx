import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GrInstagram } from "react-icons/gr";
import { FaLinkedinIn } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import style from './style.module.scss';
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function FooterInicial(): JSX.Element {
    const { t } = useTranslation();
    const pathname = usePathname();

    const handleSmoothScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        targetId: string
    ) => {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className={style.footer}>
            <div className={style.container}>
                <div className={style.content}>
                    <div className={style.footerLogo}>
                        <Image src="/LogoWhite.svg" alt={t("Logo Alt")} width={100} height={100} />
                        <h2>{t("Sempre Nicea")}</h2>
                    </div>
                    
                    <nav className={style.footerLinks}>
                        <Link
                            href="#promoters"
                            className={style.footerLink}
                            onClick={(e) => handleSmoothScroll(e, "#promoters")}
                        >
                            {t("Instituições")}
                        </Link>
                        <Link
                            href="#atividades-previstas"
                            className={style.footerLink}
                            onClick={(e) => handleSmoothScroll(e, "#atividades-previstas")}
                        >
                            {t("Atividades")}
                        </Link>
                        <Link
                            href="#bibliografia"
                            className={style.footerLink}
                            onClick={(e) => handleSmoothScroll(e, "#bibliografia")}
                        >
                            {t("Bibliografia")}
                        </Link>
                        <Link
                            href="#secretaria-cientifica"
                            className={style.footerLink}
                            onClick={(e) => handleSmoothScroll(e, "#secretaria-cientifica")}
                        >
                            {t("Secretaria")}
                        </Link>
                        <Link
                            href="#team"
                            className={style.footerLink}
                            onClick={(e) => handleSmoothScroll(e, "#team")}
                        >
                            {t("Equipe")}
                        </Link>
                        <Link
                            href="#faq"
                            className={style.footerLink}
                            onClick={(e) => handleSmoothScroll(e, "#faq")}
                        >
                            {t("FAQ")}
                        </Link>
                    </nav>
                    
                    <div className={style.footerIcons}>
                        <a href="https://www.linkedin.com/in/pedro-cezar-77a444270/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedinIn />
                        </a>
                        <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
                            <SiGmail />
                        </a>
                        <a href="https://www.instagram.com/eopedrinho0/" target="_blank" rel="noopener noreferrer">
                            <GrInstagram />
                        </a>
                    </div>
                </div>
                
                <div className={style.footerCopyright}>
                    <hr />
                    <div className={style.groupCopyright}>
                        <p>{t("Copyright")}</p>
                        <div className={style.terms}>
                            <p>{t("Termos do Serviço")}</p>
                            <p>{t("Política de Privacidade")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}