'use client';

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import NavbarInicial from "@/components/Navbar/PaginaInicial/Navbar";
import FooterInicial from "@/components/Footer/PaginaInicial/Footer";
import RoleBasedBotaoPost from "@/components/Post/RoleBasedBotaoPost";

export default function NavbarFooterLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Routes where navbar and footer should not be displayed
  const noLayoutRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

  // Check if current route is the homepage
  const isPaginaInicial = pathname === "/";

  // Show layout (navbar and footer) except for noLayoutRoutes
  const shouldShowLayout = !noLayoutRoutes.includes(pathname);

  return (
    <>
      {/* Show NavbarInicial only on homepage (/) */}
      {isPaginaInicial && <NavbarInicial />}

      {/* Show standard Navbar and BotaoPost for other pages, except noLayoutRoutes */}
      {shouldShowLayout && !isPaginaInicial && <Navbar />}
      {shouldShowLayout && !isPaginaInicial && <RoleBasedBotaoPost />}

      {/* Page content */}
      {children}

      {/* Show FooterInicial on homepage, standard Footer on other pages, except noLayoutRoutes */}
      {isPaginaInicial && <FooterInicial />}
      {shouldShowLayout && !isPaginaInicial && <Footer />}
    </>
  );
}