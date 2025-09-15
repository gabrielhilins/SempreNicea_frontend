"use client"
import React from 'react';
import HeroNews from '@/components/DiarioNiceia/HeroNews/HeroNews';
import SearchNews from '@/components/DiarioNiceia/SearchNews/SearchNews';
import ContentEvents from '@/components/DiarioNiceia/Events/ContentEvents/ContentEvents';
import HeroEvents from '@/components/DiarioNiceia/Events/HeroEvents/HeroEvents';
import NewsContent from '@/components/DiarioNiceia/NewsContent/NewsContent';
import styles from './style.module.scss';
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const DiarioNicea = () => {
  const router = useRouter();
  
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  
    if (!token) {
      // Redireciona para a página de login se o token não existir
      router.push("/login");
    } else {
      console.log("Usuário autenticado automaticamente");
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        <HeroNews />
        <SearchNews />
        <HeroEvents />
        <ContentEvents />
      </div>
    </>
    
  );
};

export default DiarioNicea;
