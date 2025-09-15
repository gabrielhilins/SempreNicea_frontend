"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import style from "./style.module.scss"
import { FaArrowDown } from "react-icons/fa"

export default function HorizontalScrollSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Verificar o tamanho da tela e registrar o listener para resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    // Verificar inicialmente
    checkMobile()
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkMobile)
    
    // Registrar o plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    let ctx: gsap.Context | undefined

    if (!isMobile) {
      ctx = gsap.context(() => {
        // Configuração do GSAP apenas para desktop
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: () => `+=${sectionRef.current?.scrollWidth}`,
            scrub: 0.8,
            pin: true,
          },
        })

        timeline.to(sectionRef.current, {
          x: () => {
            const width = sectionRef.current?.scrollWidth || 0
            const viewportWidth = window.innerWidth
            return -(width - viewportWidth)
          },
          ease: "none",
        })
      })
    }

    return () => {
      // Limpar as animações e listeners
      if (ctx) ctx.revert()
      window.removeEventListener('resize', checkMobile)
    }
  }, [isMobile])

  return (
    <div className={style.scrollContainer} ref={triggerRef} id="emerged-nicea">
      <div className={style.heightContainer}>
        <div ref={sectionRef} className={`${style.contentContainer} ${isMobile ? style.mobileLayout : ''}`}>
          {/* Seção 1 */}
          <div className={style.splitSection}>
            <div className={style.textContent}>
              <h1>{t('Como surgiu o Sempre Nicea?')}</h1>
              <p>
                {t('O Concílio de Nicéia (325) representa um marco fundamental para a história do cristianismo pelos temas debatidos, pelos documentos promulgados, pela forma de sua realização, pelas diversas recepções ao longo dos séculos e pela sua relevância para a vida da Igreja atual, com especial destaque para o diálogo ecumênico.')}
              </p>
            </div>
            <div className={style.imageContent}>
              <Image
                src="/heroAbout0.svg"
                alt={t('Imagem ilustrativa')}
                fill
                className={style.image}
                sizes="(max-width: 768px) 100vw, 45vw"
                priority
              />
            </div>
          </div>
          
          {/* Seção 2 */}
          <div className={style.splitSection}>
            <div className={style.textContent}>
              <h1>{t('O Projeto Sempre Nicea')}</h1>
              <p>
                {t('Por ocasião do 1700º aniversário de sua realização, foi concebido o projeto internacional de pesquisa histórico-religiosa Sempre Nicéia. Presente, memórias ecumênicas e história do Concílio de Nicéia (325-2025) para a fecundidade e a atualidade desse Concílio e de sua recepção em uma perspectiva ecumênica.')}
              </p>
            </div>
            <div className={style.imageContent}>
              <Image
                src="/reuniaoSempreNiceia2.avif"
                alt={t('Imagem ilustrativa')}
                fill
                className={style.image}
                sizes="(max-width: 768px) 100vw, 45vw"
                priority
              />
            </div>
          </div>
          
          {/* Seção Final */}
          <div className={style.finalSection}>
            <div className={style.container}>
              <div className={style.contentWrapper}>
                <h2>{t('Continue Explorando')}</h2>
                <p>
                  {t('Há mais para descobrir conforme você navega por nossa experiência interativa.')}
                </p>
                <a href="#promoters" className={style.buttonExplore}>
                  <FaArrowDown />
                  {t('Explorar')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}