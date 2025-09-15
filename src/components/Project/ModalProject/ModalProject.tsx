import React from 'react';
import styles from './style.module.scss';
import { useTranslation } from 'react-i18next';

interface ModalProjectProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl?: string | null;
}

const ModalProject: React.FC<ModalProjectProps> = ({ isOpen, onClose, fileUrl }) => {
  const{t} = useTranslation();
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t("Visualização do Projeto")}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>
        
        {fileUrl ? (
          <div className={styles.pdfContainer}>
            <iframe
              src={fileUrl}
              title={t("Visualização do PDF")}
              className={styles.pdfIframe}
              frameBorder="0"
              onLoad={() => console.log('PDF carregado com sucesso:', fileUrl)}
              onError={(e) => console.error('Erro ao carregar PDF:', e)}
            />
          </div>
        ) : (
          <div className={styles.noFileMessage}>
            {t("Arquivo não disponível para visualização")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalProject;