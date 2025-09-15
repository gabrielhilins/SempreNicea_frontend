"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import TrocaIdioma from "@/components/trocaIdioma/TrocaIdioma";
import style from "./style.module.scss";
import "react-tooltip/dist/react-tooltip.css";

const NavbarInicial = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    setIsMenuOpen(false); // Close menu on link click
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className={style.container} data-testid="navbar">
        <nav className={style.content}>
          <div className={style.logo}>
            <Image
              src="/LogoWhite.svg"
              alt="Logo"
              width={80}
              height={30}
              sizes="80px"
            />
          </div>
          <div className={style.mobileControls}>
            <div className={style.mobileLanguage}>
              <TrocaIdioma />
            </div>
            <button
              className={`${style.hamburger} ${isMenuOpen ? style.active : ""}`}
              onClick={toggleMenu}
              aria-label={t("Menu")}
              aria-expanded={isMenuOpen}
            >
            </button>
          </div>

          <ul className={`${style.navLinks} ${isMenuOpen ? style.active : ""}`}>
            <li>
              <Link
                href="#promoters"
                className={style.navLink}
                onClick={(e) => handleSmoothScroll(e, "#promoters")}
              >
                {t("Instituições")}
              </Link>
            </li>
            <li>
              <Link
                href="#atividades-previstas"
                className={style.navLink}
                onClick={(e) => handleSmoothScroll(e, "#atividades-previstas")}
              >
                {t("Atividades")}
              </Link>
            </li>
            <li>
              <Link
                href="#bibliografia"
                className={style.navLink}
                onClick={(e) => handleSmoothScroll(e, "#bibliografia")}
              >
                {t("Bibliografia")}
              </Link>
            </li>
            <li>
              <Link
                href="#secretaria-cientifica"
                className={style.navLink}
                onClick={(e) => handleSmoothScroll(e, "#secretaria-cientifica")}
              >
                {t("Secretaria")}
              </Link>
            </li>
            <li>
              <Link
                href="#team"
                className={style.navLink}
                onClick={(e) => handleSmoothScroll(e, "#team")}
              >
                {t("Equipe Técnica")}
              </Link>
            </li>
            <li>
              <Link
                href="#daq"
                className={style.navLink}
                onClick={(e) => handleSmoothScroll(e, "#faq")}
              >
                {t("FAQ")}
              </Link>
            </li>
            <li className={style.mobileOnly}>
              <a href="/register" className={style.getStartedLink}>
                <button className={style.getStartedButton}>
                  <FaPlay style={{ marginRight: "0.5rem" }} />
                  {t("Acessar")}
                </button>
              </a>
            </li>
          </ul>

          <div className={style.groupButtons}>
            <div className={style.desktopOnly}>
              <TrocaIdioma />
            </div>
            <div className={`${style.getStarted} ${style.desktopOnly}`}>
              <a href="/register" className={style.getStartedLink}>
                <button className={style.getStartedButton}>
                  <FaPlay style={{ marginRight: "0.5rem" }} />
                  {t("Acessar")}
                </button>
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div 
        className={`${style.overlay} ${isMenuOpen ? style.active : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default NavbarInicial;