"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import TrocaIdioma from "../trocaIdioma/TrocaIdioma";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { MdLogout } from "react-icons/md";
import style from "./style.module.scss";
import ThemeToggle from "../Theme/ThemeToggle";

export default function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navRef = useRef<HTMLUListElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  const handleHamburgerClick = () => {
    setIsActive((prev) => {
      const newState = !prev;
      if (navRef.current) {
        if (newState) {
          navRef.current.classList.add(style.active);
        } else {
          navRef.current.classList.remove(style.active);
        }
      }
      return newState;
    });
    console.log("Hamburguer clicado");
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("role");

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    toast.success(t("Logout realizado com sucesso!"));
    toast.info(t("Redirecionando para a Página Inicial..."));
    
    setTimeout(() => {
      router.push("/");
    }, 2000); 
  };

  return (
    <div className={style.container}>
      
      <nav className={style.content}>
        <div className={style.logo}>
          <Image src="/LogoWhite.svg" alt="Logo" width={60} height={30} />
          <h1>Sempre Nicea</h1>
        </div>
        <ul ref={navRef} className={`${style.navLinks} nav`}>
          <li>
            <Link
              href="/home"
              className={`${style.navLink} ${
                pathname === "/home" ? style.activeLink : ""
              } ${
                !isActive && isMobile ? style.mobileColor : style.desktopColor
              }`}
            >
              {t("Home")}
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className={`${style.navLink} ${
                pathname === "/projects" ? style.activeLink : ""
              } ${
                !isActive && isMobile ? style.mobileColor : style.desktopColor
              }`}
            >
              {t("Projetos")}
            </Link>
          </li>
          <li>
            <Link
              href="/diarioniceia"
              className={`${style.navLink} ${
                pathname === "/diarioniceia" ? style.activeLink : ""
              } ${
                !isActive && isMobile ? style.mobileColor : style.desktopColor
              }`}
            >
              {t("Diario Niceia")}
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className={`${style.navLink} ${
                pathname === "/profile" ? style.activeLink : ""
              } ${
                !isActive && isMobile ? style.mobileColor : style.desktopColor
              }`}
            >
              {t("Perfil")}
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`${style.navLink} ${
                pathname === "/about" ? style.activeLink : ""
              } ${
                !isActive && isMobile ? style.mobileColor : style.desktopColor
              }`}
            >
              {t("Sobre")}
            </Link>
          </li>
          <li>
            <a
              href="/contact"
              className={`${style.navLink} ${
                pathname === "/contact" ? style.activeLink : ""
              } ${
                !isActive && isMobile ? style.mobileColor : style.desktopColor
              }`}
            >
              {t("Contato")}
            </a>
          </li>
        </ul>
        <div className={style.menuSection}>
          <button
            ref={hamburgerRef}
            className={`${style.navbarHamburguer} ${
              isActive ? style.active : ""
            }`}
            onClick={handleHamburgerClick}
            aria-label={t("Menu")}
          />
          <ThemeToggle />
          <TrocaIdioma />
          <button
            className={style.signOutIcon}
            onClick={handleLogout}
            data-tooltip-id="signOutTooltip"
            data-tooltip-content={t("Sair")}
            aria-label={t("Sair")}
          >
            <MdLogout />
          </button>
          <Tooltip id="signOutTooltip" />
        </div>
      </nav>
    </div>
  );
}