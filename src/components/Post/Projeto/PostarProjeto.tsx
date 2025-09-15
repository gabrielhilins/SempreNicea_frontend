"use client";

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Postagem.style.scss';
import DropdownMembros from '../DropdownMembros';
import { jwtDecode } from 'jwt-decode';
import DropdownAreaTematicas from '../DropdownAreasTematicas';
import { useTranslation } from 'react-i18next';

interface AreaTematica {
  id: number;
  titulo: string;
}

interface Membro {
  id: number;
  nomeCompleto: string;
}

interface ProjetoData {
  titulo: string;
  descricao: string;
  areaTematicaId: number;
  areaTematicaTitulo: string;
  imagem?: string | null;
  arquivo?: string | null;
  publicadorId: number;
  publicadorNomeESobrenome: string;
  contribuidoresId: number[];
  contribuidoresNomeESobrenome: string[];
}

const PostarProjeto = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [selectedAreaTematica, setSelectedAreaTematica] = useState<AreaTematica | null>(null);
  const [selectedMembros, setSelectedMembros] = useState<Membro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const limiteCaracteres = 1000;
  const { t } = useTranslation();

  const validateForm = (): boolean => {
    if (!titulo.trim()) {
      toast.error(t('Título é obrigatório!'));
      return false;
    }
    if (!descricao.trim()) {
      toast.error(t('Descrição é obrigatória!'));
      return false;
    }
    if (!selectedAreaTematica || selectedAreaTematica.id <= 0) {
      toast.error(t('Selecione uma área temática válida!'));
      return false;
    }
    if (!imagem) {
      toast.error(t('Imagem é obrigatória!'));
      return false;
    }
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(imagem.type)) {
      toast.error(t('Formato de imagem inválido (use JPEG, PNG ou JPG)!'));
      return false;
    }
    if (arquivo && !['application/pdf'].includes(arquivo.type)) {
      toast.error(t('Formato de arquivo inválido (use PDF)!'));
      return false;
    }
    if (selectedMembros.length === 0) {
      toast.error(t('Selecione pelo menos um membro contribuinte!'));
      return false;
    }
    return true;
  };

  const getUserFromToken = (): { nome: string; sobrenome: string; id: number } | null => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      const id = Number(decoded.id);
      if (isNaN(id)) throw new Error(t('ID do usuário inválido'));
      return {
        nome: decoded.nome,
        sobrenome: decoded.sobrenome,
        id
      };
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagem(e.target.files[0]);
    }
  };

  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      toast.error(t('Você precisa estar logado para postar.'));
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) throw new Error(t('URL base não configurada'));

      const user = getUserFromToken();
      if (!user) throw new Error(t('Não foi possível identificar o usuário.'));

      const [imagemUrl, arquivoUrl] = await Promise.all([
        imagem ? uploadFile(imagem, `${baseUrl}/api/files/upload-projeto-imagem`, token) : Promise.resolve(null),
        arquivo ? uploadFile(arquivo, `${baseUrl}/api/files/upload-projeto-arquivo`, token) : Promise.resolve(null)
      ]);

      const projetoData: ProjetoData = {
        titulo,
        descricao,
        areaTematicaId: selectedAreaTematica!.id,
        areaTematicaTitulo: selectedAreaTematica!.titulo,
        imagem: imagemUrl,
        arquivo: arquivoUrl,
        publicadorId: user.id,
        publicadorNomeESobrenome: `${user.nome} ${user.sobrenome}`,
        contribuidoresId: selectedMembros.map(membro => membro.id),
        contribuidoresNomeESobrenome: selectedMembros.map(membro => membro.nomeCompleto)
      };

      console.log('Payload sent to backend:', JSON.stringify(projetoData, null, 2));

      const response = await fetch(`${baseUrl}/api/projeto/solicitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projetoData)
      });

      if (!response.ok) {
        let errorMessage = t('Erro ao criar o projeto');
        try {
          const errorData = await response.text();
          try {
            const jsonError = JSON.parse(errorData);
            errorMessage = jsonError.message || jsonError.error || errorData;
          } catch {
            errorMessage = errorData;
          }
        } catch (e) {
          console.error('Error reading error response:', e);
        }
        throw new Error(errorMessage);
      }

      toast.success(t('Solicitação de postagem de projeto enviada com sucesso!'));
      resetForm();
    } catch (error) {
      console.error('Erro ao solicitar postagem de projeto:', error);
      toast.error(t('Erro ao solicitar postagem de projeto'));
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File, url: string, token: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || t('Erro ao fazer upload do arquivo'));
    }

    const data = await response.json();
    return data.mediaUrl;
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setSelectedAreaTematica(null);
    setImagem(null);
    setArquivo(null);
    setSelectedMembros([]);
  };

  return (
    <div className="postar-projeto-container">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="postar-projeto-form">
        <div className="input-container">
          <label className="label" htmlFor="titulo">
            {t('Título')}*
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="input-text"
            autoComplete="off"
            disabled={isLoading}
          />
        </div>

        <div className="input-container">
          <label className="label" htmlFor="descricao">
            {t('Descrição')}*
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className="input-textarea"
            maxLength={limiteCaracteres}
            disabled={isLoading}
          />
          <span className="character-counter">
            {descricao.length}/{limiteCaracteres}
          </span>
        </div>

        <DropdownAreaTematicas
          selectedAreaTematica={selectedAreaTematica}
          setSelectedAreaTematica={setSelectedAreaTematica}
          disabled={isLoading}
        />

        <div className="input-container">
          <label className="label" htmlFor="imagem">
            {t('Imagem do Projeto')}* (JPEG, PNG, JPG)
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="imagem"
              onChange={handleImagemChange}
              accept="image/jpeg,image/png,image/jpg"
              className="input-file"
              disabled={isLoading}
              required
            />
            {imagem && (
              <span className="file-name">
                {imagem.name} ({(imagem.size / 1024).toFixed(2)} KB)
              </span>
            )}
          </div>
        </div>

        <div className="input-container">
          <label className="label" htmlFor="arquivo">
            {t('Documento do Projeto')} (PDF)
          </label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="arquivo"
              onChange={handleArquivoChange}
              accept="application/pdf"
              className="input-file"
              disabled={isLoading}
            />
            {arquivo && (
              <span className="file-name">
                {arquivo.name} ({(arquivo.size / 1024).toFixed(2)} KB)
              </span>
            )}
          </div>
        </div>

        <DropdownMembros
          selectedMembros={selectedMembros}
          setSelectedMembros={setSelectedMembros}
          disabled={isLoading}
        />

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-indicator">{t('Enviando...')}</span>
          ) : (
            t('Solicitar postagem do Projeto')
          )}
        </button>
      </form>
    </div>
  );
};

export default PostarProjeto;