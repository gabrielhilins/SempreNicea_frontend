'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';
import { GrBook } from 'react-icons/gr';
import 'aos/dist/aos.css';
import { toast } from 'react-toastify';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Define interface for edition data
interface Edition {
  id: number;
  title: string;
  date: string;
  link: string;
}

// Define interface for backend DTO
interface VeritasInCaritateDTO {
  id: number;
  titulo: string;
  data: string;
  arquivo: string;
}

const VeritasInCaritate = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editions, setEditions] = useState<Edition[]>([]);
  const [latestEdition, setLatestEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://semprenicea-back.onrender.com';

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  // Parse date with UTC formatting
  const parseDate = useCallback((dateString: string | undefined): string => {
    if (!dateString) {
      console.warn('No date provided');
      return t('Sem data');
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
      return t('Sem data');
    }
  }, [t]);

  // Fetch all editions
  const fetchEditions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/veritas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`);
      }
      const data: VeritasInCaritateDTO[] = await response.json();
      console.log('Veritas editions response:', data);
      const formattedEditions: Edition[] = data.map((item) => {
        const edition: Edition = {
          id: item.id,
          title: item.titulo,
          date: parseDate(item.data),
          link: item.arquivo || '#',
        };
        console.log('Veritas edition link:', edition.link);
        return edition;
      });
      // Validate links with retry
      for (const edition of formattedEditions) {
        if (edition.link && edition.link !== '#') {
          let attempts = 3;
          while (attempts > 0) {
            try {
              const linkResponse = await fetch(edition.link, { method: 'HEAD' });
              if (!linkResponse.ok) {
                console.warn(`Invalid veritas link: ${edition.link}, Status: ${linkResponse.status}`);
                toast.warn(t('O arquivo de Veritas pode estar indisponível.'));
              }
              break;
            } catch (linkError) {
              console.error(`Error checking veritas link (attempt ${4 - attempts}):`, linkError);
              attempts--;
              if (attempts === 0) {
                toast.warn(t('Não foi possível verificar o arquivo de Veritas.'));
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      }
      setEditions(formattedEditions);
    } catch (error: any) {
      console.error('Erro ao carregar edições:', error);
      toast.error(t('Erro ao carregar edições do Veritas in Caritate'));
      setEditions([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, parseDate, t]);

  // Fetch the most recent edition
  const fetchLatestEdition = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/veritas/recentes?limite=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`);
      }
      const data: VeritasInCaritateDTO[] = await response.json();
      console.log('Veritas latest response:', data);
      if (data.length > 0) {
        const latest = data[0];
        const edition: Edition = {
          id: latest.id,
          title: latest.titulo,
          date: parseDate(latest.data),
          link: latest.arquivo || '#',
        };
        console.log('Veritas latest link:', edition.link);
        setLatestEdition(edition);
        // Validate link with retry
        if (edition.link && edition.link !== '#') {
          let attempts = 3;
          while (attempts > 0) {
            try {
              const linkResponse = await fetch(edition.link, { method: 'HEAD' });
              if (!linkResponse.ok) {
                console.warn(`Invalid veritas link: ${edition.link}, Status: ${linkResponse.status}`);
                toast.warn(t('O arquivo de Veritas mais recente pode estar indisponível.'));
              }
              break;
            } catch (linkError) {
              console.error(`Error checking veritas link (attempt ${4 - attempts}):`, linkError);
              attempts--;
              if (attempts === 0) {
                toast.warn(t('Não foi possível verificar o arquivo de Veritas mais recente.'));
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      } else {
        console.warn('No veritas data returned from backend');
        toast.warn(t('Nenhuma edição encontrada no servidor.'));
        setLatestEdition(null);
      }
    } catch (error: any) {
      console.error('Erro ao carregar edição mais recente:', error);
      toast.error(t('Erro ao carregar a edição mais recente'));
      setLatestEdition(null);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, parseDate, t]);

  useEffect(() => {
    fetchEditions();
    fetchLatestEdition();
  }, [fetchEditions, fetchLatestEdition]);

  const filteredEditions: Edition[] = editions.filter((edition) =>
    edition.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className={style.veritasSection} id="veritas-in-caritate">
      <div className={style.header}>
        <h1>{t('Veritas in Caritate')}</h1>
        <div className={style.underline}></div>
        {!loading && latestEdition && (
          <p className={style.updateDate}>{t('Atualizado em')} {latestEdition.date}</p>
        )}
      </div>
      <div className={style.contentWrapper}>
        <div className={style.content}>
          <div className={style.description}>
            <p>
              {t('O projeto Veritas in Caritate é dedicado à busca da verdade com amor e caridade. Inspirado por princípios acadêmicos e éticos, promove reflexões e estudos que unem rigor intelectual e compromisso com valores humanos, oferecendo uma plataforma para diálogos profundos e significativos.')}
            </p>
            <p className={style.authors}>{t('Por Gianluca Blancini, Riccardo Burigana, Mauro Lucchesi, Luiz Carlos Luz Marques, Francesco Pesce e Alex Talarico')}</p>
          </div>
          <div className={style.actionContainer}>
            {latestEdition && latestEdition.link && latestEdition.link !== '#' ? (
              <a
                href={latestEdition.link}
                target="_blank"
                rel="noopener noreferrer"
                className={style.primaryButton}
                aria-label={t('Acessar a edição mais recente do Veritas in Caritate')}
              >
                <GrBook className={style.icon} />
                {t('Acesse o mais recente')}
              </a>
            ) : (
              <button
                className={style.primaryButton}
                disabled
                aria-label={t('Nenhuma edição recente disponível')}
              >
                <GrBook className={style.icon} />
                <span>{loading ? t('Carregando...') : t('Edição recente indisponível')}</span>
              </button>
            )}
            <button
              className={style.archiveButton}
              onClick={toggleModal}
              aria-label={t('Ver todas as edições do Veritas in Caritate')}
              disabled={loading}
            >
              {t('Ver todas as edições')}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <div className={style.modalHeader}>
              <h2>{t('Todas as Edições do Veritas In Caritate')}</h2>
              <button className={style.closeButton} onClick={toggleModal}>
                ×
              </button>
            </div>
            <input
              type="text"
              placeholder={t('Pesquisar edições...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={style.searchInput}
              disabled={loading}
            />
            <div className={style.editionsList}>
              {loading ? (
                <p>{t('Carregando edições...')}</p>
              ) : filteredEditions.length > 0 ? (
                filteredEditions.map((edition) => (
                  <div key={edition.id} className={style.editionItem}>
                    <div className={style.editionDetails}>
                      <h3>{edition.title}</h3>
                      <p>{edition.date}</p>
                    </div>
                    <a
                      href={edition.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={style.viewButton}
                    >
                      {t('Ver')}
                    </a>
                  </div>
                ))
              ) : (
                <p>{t('Nenhuma edição encontrada.')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VeritasInCaritate;