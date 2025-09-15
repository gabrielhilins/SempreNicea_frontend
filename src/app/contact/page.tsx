"use client"
import Accordion from '@/components/Contact/Accordion/AccordionContent'
import Contact from '@/components/Contact/Contact/Contact'
import HeaderContact from '@/components/Contact/HeaderContact/HeaderContact'
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Contato = () => {
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
      <HeaderContact />
      <Contact />
      <Accordion />
    </>
  )
}
export default Contato
