"use client";

import { useState, useEffect, useCallback } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { ImNewspaper } from "react-icons/im";
import { IoDocumentText } from "react-icons/io5";
import { MdEvent } from "react-icons/md";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useTranslation } from "react-i18next";

import "./BotaoPost.style.scss";
import PostarEvento from "./Evento/PostarEvento";
import PostarNoticia from "./Noticia/PostarNoticia";
import PostarProjeto from "./Projeto/PostarProjeto";

interface BotaoPostProps {
  currentPath: string;
}

const BotaoPost = ({ currentPath }: BotaoPostProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (isModalOpen) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isModalOpen]);

  const toggleOptions = useCallback(() => {
    setShowOptions((prev) => !prev);
  }, []);

  const openModal = (content: string) => {
    const modals: Record<string, { title: string; content: JSX.Element }> = {
      [t("Postar Evento")]: { title: t("Nova Postagem de Evento"), content: <PostarEvento /> },
      [t("Postar Notícia")]: { title: t("Nova Postagem de Notícia"), content: <PostarNoticia /> },
      [t("Postar Projeto")]: { title: t("Nova Postagem de Projeto"), content: <PostarProjeto /> },
    };

    const selectedModal = modals[content];
    if (selectedModal) {
      setModalTitle(selectedModal.title);
      setModalContent(selectedModal.content);
      setIsModalOpen(true);
      setShowOptions(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalTitle("");
  };

  const handleClickOutside = (event: MouseEvent) => {
    const buttonElement = document.querySelector(".botao-post .botao");
    if (buttonElement && !buttonElement.contains(event.target as Node)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Opções baseadas na rota atual
  const getOptionsForPath = () => {
    if (currentPath === "/projects") {
      return [
        { label: t("Postar Projeto"), icon: <IoDocumentText className="icon-opcao" /> }
      ];
    } else if (currentPath === "/diarioniceia") {
      return [
        { label: t("Postar Evento"), icon: <MdEvent className="icon-opcao" /> },
        { label: t("Postar Notícia"), icon: <ImNewspaper className="icon-opcao" /> }
      ];
    }
    return [];
  };

  const options = getOptionsForPath();

  return (
    <div className="botao-post">
      <div className="botao" onClick={toggleOptions}>
        <MdAdd className="icon-add" />
      </div>

      {showOptions && options.length > 0 && (
        <div
          className={`opcoes-container ${showOptions ? "show" : "hidden"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <div
              key={option.label}
              className="opcao"
              onClick={(e) => {
                e.stopPropagation();
                openModal(option.label);
              }}
            >
              {option.icon}
              {option.label}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        center
        styles={{
          modal: { maxWidth: '600px', width: '100%' },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', transition: 'opacity 0.3s ease' },
        }}
        closeOnOverlayClick={false}
      >
        <div className={`modal-overlay ${showModal ? 'show-background' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="title-modal">{modalTitle}</h2>
            </div>
            <div className="modal-body">{modalContent}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BotaoPost;