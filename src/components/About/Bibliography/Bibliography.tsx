'use client';

import { useEffect, useState, useCallback } from 'react';
import style from './style.module.scss';
import { GrDocumentText } from 'react-icons/gr';
import 'aos/dist/aos.css';
import * as AOS from 'aos';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useTranslation } from 'react-i18next';

// Define interface for bibliography data
interface Bibliography {
  id: number;
  title: string;
  date: string;
  link: string;
}

// Define interface for backend DTO
interface BibliografiaDTO {
  id: number;
  titulo: string;
  data: string;
  arquivo: string;
}

const Bibliography = () => {
  const [latestBibliography, setLatestBibliography] = useState<Bibliography | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://semprenicea-back.onrender.com';
  const {t} = useTranslation();

  // Parse date with UTC formatting
  const parseDate = useCallback((dateString: string | undefined): string => {
    if (!dateString) {
      console.warn('No date provided');
      return 'Sem data';
    }
    try {
      console.log('Parsing date:', dateString);
      const date = parseISO(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      const formattedDate = formatInTimeZone(date, 'UTC', 'dd/MM/yyyy');
      console.log('Formatted date:', formattedDate);
      return formattedDate;
    } catch (error) {
      console.warn(`Invalid date format: ${dateString}`, error);
      return 'Sem data';
    }
  }, []);

  // Fetch the most recent bibliography
  const fetchLatestBibliography = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/bibliografia/recentes?limite=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`);
      }
      const data: BibliografiaDTO[] = await response.json();
      console.log('Bibliography response:', data);
      if (data.length > 0) {
        const latest = data[0];
        const bibliography: Bibliography = {
          id: latest.id,
          title: latest.titulo,
          date: parseDate(latest.data),
          link: latest.arquivo || '#',
        };
        console.log('Bibliography link:', bibliography.link);
        setLatestBibliography(bibliography);
        // Validate link with retry
        if (bibliography.link && bibliography.link !== '#') {
          let attempts = 3;
          while (attempts > 0) {
            try {
              const linkResponse = await fetch(bibliography.link, { method: 'HEAD' });
              if (!linkResponse.ok) {
                console.warn(`Invalid bibliography link: ${bibliography.link}, Status: ${linkResponse.status}`);
                toast.warn('O arquivo de bibliografia pode estar indisponível.');
              }
              break;
            } catch (linkError) {
              console.error(`Error checking bibliography link (attempt ${4 - attempts}):`, linkError);
              attempts--;
              if (attempts === 0) {
                toast.warn('Não foi possível verificar o arquivo de bibliografia.');
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      } else {
        console.warn('No bibliography data returned from backend');
        toast.warn('Nenhuma bibliografia encontrada no servidor.');
        setLatestBibliography(null);
      }
    } catch (error: any) {
      console.error('Erro ao carregar bibliografia mais recente:', error);
      toast.error(`Erro ao carregar a bibliografia: ${error.message || 'Tente novamente mais tarde'}`);
      setLatestBibliography(null);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, parseDate]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 30,
      once: false,
    });
    fetchLatestBibliography();
  }, [fetchLatestBibliography]);

  return (
    <div className={style.container} id="bibliografia">
      <div className={style.content} data-aos="fade-up" data-aos-delay="300">
        <div className={style.title}>
          <h2>{t("Bibliografia")}</h2>
          {!loading && latestBibliography && (
            <p>{t("Atualizado em")} {latestBibliography.date}</p>
          )}
        </div>
        <div className={style.description}>
          <div className={style.textContent}>
            <h2>
              {t('Esta seção reúne as referências bibliográficas que fundamentam as pesquisas desenvolvidas e apresentadas neste site. Cada fonte citada reflete o compromisso com a precisão acadêmica, a integridade científica e a valorização do conhecimento produzido por autores e instituições reconhecidas.')}
            </h2>
            <p>{t('Por Riccardo Burigana – Luiz Carlos Luz Marques - Alex Talarico')}</p>
          </div>
          <div className={style.buttonContainer}>
            {latestBibliography && latestBibliography.link && latestBibliography.link !== '#' ? (
              <a
                href={latestBibliography.link}
                target="_blank"
                rel="noopener noreferrer"
                className={style.button}
                aria-label={t('Abrir bibliografia em PDF')}
              >
                <GrDocumentText className={style.icon} />
                <span>{t('Acesse aqui')}</span>
              </a>
            ) : (
              <button
                className={style.button}
                disabled
                aria-label={t('Nenhuma bibliografia disponível')}
              >
                <GrDocumentText className={style.icon} />
                <span>{loading ? t('Carregando...') : t('Bibliografia indisponível')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bibliography;