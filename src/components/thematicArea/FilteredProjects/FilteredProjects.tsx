import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import CardFiltered from "./CardFiltered/CardFiltered";
import Spinner from "@/components/Spinner/Spinner";
import { useTranslation } from "react-i18next";

interface Project {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  publicadorNomeESobrenome: string;
  contribuidoresNomeESobrenome: string[];
  mediaAvaliacoes: number;
}

interface ThematicArea {
  id: number;
  titulo: string;
}

interface FilteredProjectsProps {
  thematicAreaId: number | null;
  searchTerm: string;
  thematicAreas: ThematicArea[];
}

const FilteredProjects = ({ thematicAreaId, searchTerm, thematicAreas }: FilteredProjectsProps) => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        setError(t("Usuário não autenticado. Faça login para continuar."));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        let url = `${baseUrl}/api/projeto/aprovados`;
        
        if (thematicAreaId) {
          url = `${baseUrl}/api/areasTematicas/projetos?areaTematicaId=${thematicAreaId}`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const validProjects = Array.isArray(data) ? data : [];
          setProjects(validProjects);
          setFilteredProjects(validProjects);
        } else {
          const errorMessage = await response.text();
          setError(errorMessage || t("Erro ao buscar os projetos."));
          setProjects([]);
          setFilteredProjects([]);
        }
      } catch (error) {
        setError(t("Falha na conexão com o servidor. Verifique sua conexão ou tente novamente mais tarde."));
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [baseUrl, thematicAreaId, thematicAreas, t]);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      searchTerm
        ? project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.publicadorNomeESobrenome.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const selectedAreaTitle = thematicAreaId
    ? thematicAreas.find((area) => area.id === thematicAreaId)?.titulo || t("Área Temática")
    : null;

  return (
    <section className={style.container}>
      <div className={style.header}>
        <h1>
          {selectedAreaTitle 
            ? t("Projetos da Área Temática: {{area}}", { area: selectedAreaTitle }) 
            : t("Todos os Projetos")}
        </h1>
        <hr />
      </div>
      <div className={style.content}>
        {loading ? (
          <div className={style.spinnerContainer}>
            <Spinner />
          </div>
        ) : error ? (
          <div className={style.errorMessage}>
            <p>{error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className={style.noProjectsMessage}>
            <p>
              {searchTerm
                ? t("Nenhum projeto encontrado para a busca.")
                : thematicAreaId
                ? t("Não há projetos disponíveis para esta área temática.")
                : t("Não há projetos disponíveis no momento.")}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <CardFiltered
              key={project.id}
              id={project.id}
              imagem={project.imagem}
              titulo={project.titulo}
              descricao={project.descricao}
              publicadorNomeESobrenome={project.publicadorNomeESobrenome}
              contribuidoresNomeESobrenome={project.contribuidoresNomeESobrenome || []}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default FilteredProjects;