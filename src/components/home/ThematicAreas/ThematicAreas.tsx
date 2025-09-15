import React, { useEffect, useState, useCallback } from 'react';
import Spinner from '@/components/Spinner/Spinner';
import Card from './Card/CardAreas';
import style from './style.module.scss';
import { useTranslation } from 'react-i18next';

interface ThematicArea {
  id: number;
  imagem: string;
  titulo: string;
}

const ThematicAreas = () => {
  const [thematicAreas, setThematicAreas] = useState<ThematicArea[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const {t} = useTranslation();

  const fetchThematicAreas = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/areasTematicas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setThematicAreas(data);
      } else {
        console.error('Erro ao buscar as áreas temáticas');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      console.error('Usuário não autenticado.');
      setLoading(false);
      return;
    }
    fetchThematicAreas(token);
  }, [fetchThematicAreas]); 

  return (
    <section className={style.container} id="areatematicas">
      <div className={style.header}>
        <h1>{t("Áreas Temáticas")}</h1>
        <hr />
      </div>
      <div className={style.content}>
        {loading ? (
          <Spinner />
        ) : thematicAreas.length === 0 ? (
          <p>{t("Não há áreas temáticas disponíveis no momento.")}</p>
        ) : (
          thematicAreas.map((item) => (
            <Card key={item.id} imagem={item.imagem} titulo={item.titulo} />
          ))
        )}
      </div>
    </section>
  );
};

export default ThematicAreas;