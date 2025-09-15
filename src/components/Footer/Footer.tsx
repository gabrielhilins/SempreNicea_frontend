import Image from "next/image";
import Link from "next/link";
import { GrInstagram } from "react-icons/gr";
import { FaLinkedinIn } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import style from './style.module.scss';
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Footer(): JSX.Element {

    const { t } = useTranslation();
    const pathname = usePathname();
    
    return (
        <div className={style.footer}>
            <div className={style.container}>
                <div className={style.content}>
                    <div className={style.footerLogo}>
                        <Image src="/LogoWhite.svg" alt={t("Logo Alt")} width={100} height={100} />
                        <h2>Sempre Nicea</h2>
                    </div>
                    <ul className={`${style.footerLinks} nav`}>
                        <li>
                            <Link
                            href="/home"
                            className={`${style.footerLink} ${
                                pathname === "/home" ? style.activeLink : ""
                            } `}
                            >
                            {t("Home")}
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/projects"
                            className={`${style.footerLink} ${
                                pathname === "/projects" ? style.activeLink : ""
                            } `}
                            >
                            {t("Projetos")}
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/diarioniceia"
                            className={`${style.footerLink} ${
                                pathname === "/diarioniceia" ? style.activeLink : ""
                            } `}
                            >
                            {t("Diario Nicea")}
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/perfilMembro"
                            className={`${style.footerLink} ${
                                pathname === "/perfilMembro" ? style.activeLink : ""
                            } `}
                            >
                            {t("Perfil")}
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/about"
                            className={`${style.footerLink} ${
                                pathname === "/about" ? style.activeLink : ""
                            } `}
                            >
                            {t("Sobre")}
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/contact"
                            className={`${style.footerLink} ${
                                pathname === "/contact" ? style.activeLink : ""
                            } `}
                            >
                            {t("Contato")}
                            </Link>
                        </li>
                    </ul>
                    <div className={style.group}>
                        <div className={style.footerIcons}>
                            <a href="https://www.linkedin.com/in/pedro-cezar-77a444270/" target="_blank" rel="noopener noreferrer"> <FaLinkedinIn /> </a>
                            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer"> <SiGmail /> </a>
                            <a href="https://www.instagram.com/eopedrinho0/" target="_blank" rel="noopener noreferrer"> <GrInstagram /> </a>
                        </div>
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