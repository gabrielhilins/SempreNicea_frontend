// Projetos.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroArea from "@/components/thematicArea/HeroArea/HeroArea";
import DescriptionArea from "@/components/thematicArea/DescriptionArea/DescriptionArea";
import FilteredProjects from "@/components/thematicArea/FilteredProjects/FilteredProjects";

interface ThematicArea {
  id: number;
  titulo: string;
  descricao: string | null;
  imagem: string | null;
}

const Projetos = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [thematicAreas, setThematicAreas] = useState<ThematicArea[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      console.log("Usuário autenticado automaticamente");
    }
  }, [router]);

  const handleFilterChange = (term: string, areaId: number | null, areas: ThematicArea[]) => {
    setSearchTerm(term);
    setSelectedAreaId(areaId);
    setThematicAreas(areas);
  };

  return (
    <>
      <HeroArea onFilterChange={handleFilterChange} />
      <DescriptionArea selectedAreaId={selectedAreaId} thematicAreas={thematicAreas} />
      <FilteredProjects
        thematicAreaId={selectedAreaId}
        searchTerm={searchTerm}
        thematicAreas={thematicAreas}
      />
    </>
  );
};

export default Projetos;