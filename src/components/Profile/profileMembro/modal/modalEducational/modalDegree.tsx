"use client";

import { useState, useEffect } from "react";
import style from "./style.module.scss";
import { IoMdArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface EducationalData {
  id?: number;
  areaEstudo: string;
  instituicao: string;
  situacao: string;
  diploma?: string;
  descricao?: string;
  dataInicio: string;
  dataFim?: string;
}

interface ModalDegreeProps {
  closeModal: (state: boolean) => void;
  educationalData?: EducationalData;
  onSave?: (formacao: EducationalData) => void;
  userId: number;
}

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1940 + 1 },
  (_, i) => currentYear - i
);
const endYears = Array.from(
  { length: currentYear - 1940 + 11 },
  (_, i) => currentYear + 10 - i
);
const situacoes = ["CONCLUIDO", "EM_ANDAMENTO", "INTERROMPIDO"];

export default function ModalDegree({
  closeModal,
  educationalData,
  onSave,
  userId,
}: ModalDegreeProps) {
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [areaEstudo, setAreaEstudo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [diploma, setDiploma] = useState("");
  const [situacao, setSituacao] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const months = [
    t("Janeiro"),
    t("Fevereiro"),
    t("Março"),
    t("Abril"),
    t("Maio"),
    t("Junho"),
    t("Julho"),
    t("Agosto"),
    t("Setembro"),
    t("Outubro"),
    t("Novembro"),
    t("Dezembro"),
  ];

  useEffect(() => {
    if (educationalData) {
      setAreaEstudo(educationalData.areaEstudo);
      setInstituicao(educationalData.instituicao);
      setSituacao(educationalData.situacao);
      setDiploma(educationalData.diploma || "");
      setDescricao(educationalData.descricao || "");
      if (educationalData.dataInicio) {
        const startDate = new Date(educationalData.dataInicio);
        setStartMonth((startDate.getMonth() + 1).toString());
        setStartYear(startDate.getFullYear().toString());
      }
      if (educationalData.dataFim) {
        const endDate = new Date(educationalData.dataFim);
        setEndMonth((endDate.getMonth() + 1).toString());
        setEndYear(endDate.getFullYear().toString());
      }
    }
  }, [educationalData]);

  const validateForm = () => {
    if (!instituicao.trim()) return t("Instituição é obrigatória.");
    if (!areaEstudo.trim()) return t("Área de estudo é obrigatória.");
    if (!situacao) return t("Situação é obrigatória.");
    if (!startMonth || !startYear) return t("Data de início é obrigatória.");
    if (situacao === "CONCLUIDO" && (!endMonth || !endYear)) {
      return t("Data de conclusão é obrigatória para esta situação.");
    }
    return null;
  };

  const formatDate = (month: string, year: string) => {
    if (!month || !year) return undefined;
    const paddedMonth = month.padStart(2, "0");
    return `${year}-${paddedMonth}-01`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const formacao: EducationalData = {
      id: educationalData?.id,
      areaEstudo,
      instituicao,
      situacao,
      diploma: diploma || undefined,
      descricao: descricao || undefined,
      dataInicio: formatDate(startMonth, startYear)!,
      dataFim: formatDate(endMonth, endYear),
    };

    onSave?.(formacao);
    closeModal(false);
  };

  const getEndDateLabel = () => {
    if (situacao === "CONCLUIDO") return t("Data de Conclusão*");
    if (situacao === "EM_ANDAMENTO") return t("Data de Previsão de Conclusão");
    if (situacao === "INTERROMPIDO") return t("Data de Interrupção");
    return t("Data de Término");
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.header}>
          <button
            className={style.backIcon}
            onClick={() => closeModal(false)}
            title={t("Voltar")}
            aria-label={t("Voltar")}
          >
            <IoMdArrowBack />
          </button>
          <h2>
            {educationalData
              ? t("Editar Formação Acadêmica")
              : t("Adicionar Formação Acadêmica")}
          </h2>
        </div>

        {error && <div className={style.errorMessage}>{error}</div>}

        <form className={style.forms} onSubmit={handleSubmit}>
          <label className={style.formLabel}>
            {t("Instituição de Ensino*")}:
            <input
              type="text"
              placeholder={t("Ex: Universidade Católica de Pernambuco")}
              className={style.formInput}
              value={instituicao}
              onChange={(e) => setInstituicao(e.target.value)}
            />
          </label>
          <label className={style.formLabel}>
            {t("Diploma")}:
            <input
              type="text"
              placeholder={t("Ex: Bacharelado, Mestrado")}
              className={style.formInput}
              value={diploma}
              onChange={(e) => setDiploma(e.target.value)}
            />
          </label>
          <label className={style.formLabel}>
            {t("Área de Estudo*")}:
            <input
              type="text"
              placeholder={t("Ex: Ciência da Computação")}
              className={style.formInput}
              value={areaEstudo}
              onChange={(e) => setAreaEstudo(e.target.value)}
            />
          </label>
          <label className={style.formLabel}>
            {t("Situação*")}:
            <select
              value={situacao}
              onChange={(e) => setSituacao(e.target.value)}
            >
              <option value="">{t("Selecione")}</option>
              {situacoes.map((sit) => (
                <option key={sit} value={sit}>
                  {t(sit)}
                </option>
              ))}
            </select>
          </label>
          {situacao && (
            <>
              <label className={style.formLabel}>
                {t("Data de Início*")}:
                <div className={style.dateSelectWrapper}>
                  <select
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                  >
                    <option value="">{t("Mês")}</option>
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                  >
                    <option value="">{t("Ano")}</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label className={style.formLabel}>
                {getEndDateLabel()}:
                <div className={style.dateSelectWrapper}>
                  <select
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                  >
                    <option value="">{t("Mês")}</option>
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                  >
                    <option value="">{t("Ano")}</option>
                    {endYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </>
          )}
          <label className={style.formLabel}>
            {t("Descrição")}:
            <textarea
              placeholder={t("Fale um pouco sobre essa sua formação")}
              className={style.inputDescription}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </label>
          <div className={style.buttonContainer}>
            <button type="submit" className={style.submitButton}>
              {t("Salvar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
