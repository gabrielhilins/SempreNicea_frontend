import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface ThematicArea {
  id: number;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
}

interface HeroAreaProps {
  onFilterChange: (searchTerm: string, thematicAreaId: number | null, thematicAreas: ThematicArea[]) => void;
}

const HeroArea = ({ onFilterChange }: HeroAreaProps) => {
  const [thematicAreas, setThematicAreas] = useState<ThematicArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation();

  useEffect(() => {
    const fetchThematicAreas = async () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) {
        console.error(t("Usuário não autenticado."));
        setError(t("Usuário não autenticado. Por favor, faça login."));
        setLoadingAreas(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/areasTematicas`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const uniqueAreas = Array.isArray(data)
            ? data
                .filter((area: any, index: number, self: any[]) => {
                  const isValid =
                    area.id != null &&
                    !isNaN(Number(area.id)) &&
                    area.titulo &&
                    typeof area.titulo === "string";
                  return isValid && index === self.findIndex((a) => a.id === area.id);
                })
                .map((area: any) => ({
                  id: Number(area.id),
                  titulo: String(area.titulo || t("Área sem título")),
                  descricao: area.descricao ? String(area.descricao) : null,
                  imagem: area.imagem ? String(area.imagem) : null
                }))
            : [];
          setThematicAreas(uniqueAreas);
          setError(null);
        } else {
          setError(t("Falha ao carregar áreas temáticas."));
        }
      } catch (error) {
        setError(t("Erro ao conectar com o servidor. Tente novamente mais tarde."));
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchThematicAreas();
  }, [baseUrl, t]);

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const areaId = value === "" ? null : Number(value);
    if (areaId !== null && isNaN(areaId)) return;
    setSelectedArea(areaId);
    onFilterChange(searchTerm, areaId, thematicAreas);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onFilterChange(term, selectedArea, thematicAreas);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedArea(null);
    onFilterChange("", null, thematicAreas);
  };

  return (
    <section className={style.container}>
      <div className={style.content}>
        <div className={style.title}>
          <h1>{t("Explore Projetos")}</h1>
          <p>
            {t("Veja todos os projetos disponíveis ou refine sua busca por nome do projeto, autor ou área temática.")}
          </p>
        </div>
        <div className={style.filterControls}>
          <div className={style.searchBar}>
            <FaSearch />
            <input
              type="text"
              placeholder={t("Pesquise por nome do projeto ou autor...")}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {(searchTerm || selectedArea !== null) && (
              <FaTimes className={style.clearIcon} onClick={handleClearFilters} />
            )}
          </div>
          <div className={style.thematicFilters}>
            {loadingAreas ? (
              <p className={style.loading}>{t("Carregando áreas...")}</p>
            ) : error ? (
              <p className={style.error}>{error}</p>
            ) : thematicAreas.length === 0 ? (
              <p className={style.noAreas}>
                {t("Nenhuma área temática disponível.")}
              </p>
            ) : (
              <select
                className={style.filterSelect}
                value={selectedArea === null ? "" : String(selectedArea)}
                onChange={handleAreaChange}
              >
                <option value="">{t("Todos os Projetos")}</option>
                {thematicAreas.map((area) => (
                  <option
                    key={area.id}
                    value={String(area.id)}
                    title={area.descricao || t("Sem descrição disponível")}
                  >
                    {area.titulo}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroArea;