"use client";

import { useParams } from 'next/navigation';
import style from './style.module.scss';
import HeaderProject from '@/components/Project/HeaderProject/HeaderProject';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import RecentSearch from '@/components/home/RecentSearch/RecentSearch';
import { useTranslation } from 'react-i18next';

interface ProjetoData {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  arquivo: string;
  publicadorNomeESobrenome: string;
  contribuidoresNomeESobrenome: string[];
  areaTematicaTitulo: string;
}

const ProjetoPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjetoData | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const {t} = useTranslation();

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.id);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
    }
  }, [router]);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    try {
      const response = await fetch(`${baseUrl}/api/projeto/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Projeto não encontrado ou erro no servidor.");
      }
      const data: ProjetoData = await response.json();
      setProject(data);
    } catch (error) {
      setError("Este projeto não existe mais ou houve um erro ao carregar os dados.");
      console.error("Erro ao buscar os dados do projeto:", error);
    }
  }, [id, baseUrl]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (error) {
    return (
      <div className={style.errorContainer}>
        <h2>{error}</h2>
        <button onClick={() => router.push('/home')}>{t("Voltar para a Página Inicial")}</button>
      </div>
    );
  }

  if (!project) return <div>{t("Carregando...")}</div>;

  return (
    <section className={style.container}>
      <HeaderProject
        image={project.imagem}
        titulo={project.titulo}
        publicador={project.publicadorNomeESobrenome}
        constribuidoresNomeESobrenome={project.contribuidoresNomeESobrenome}
        description={project.descricao}
        fileUrl={project.arquivo}
      />
      <RecentSearch />
    </section>
  );
};

export default ProjetoPage;
