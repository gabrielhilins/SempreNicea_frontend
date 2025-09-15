import { useState, useEffect } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import style from "./style.module.scss"; // Assumindo que você criará um arquivo SCSS para o ThemeToggle

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className={style.themeToggle}>
      {theme && (
        <button className={style.button} onClick={toggleTheme}>
          {theme === "light" ? (
            <MdLightMode className={style.icon} />
          ) : (
            <MdDarkMode className={style.iconActive} />
          )}
        </button>
      )}
    </div>
  );
}