import { useState, useEffect } from "react";
import style from "./style.module.scss";
import { IoMdAdd } from "react-icons/io";
import ModalDegree from "../modal/modalEducational/modalDegree";
import Spinner from "@/components/Spinner/Spinner";
import { toast } from "react-toastify";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface FormacaoAcademica {
  id?: number; // Changed to optional to match EducationalData
  areaEstudo: string;
  instituicao: string;
  situacao: string;
  diploma?: string;
  descricao?: string;
  dataInicio: string;
  dataFim?: string;
}

interface EducationalBackgroundProps {
  userId: number;
}

export default function EducationalBackground({
  userId,
}: EducationalBackgroundProps) {
  const [openModal, setOpenModal] = useState<{
    isOpen: boolean;
    formacao?: FormacaoAcademica;
  }>({ isOpen: false });
  const [formacoes, setFormacoes] = useState<FormacaoAcademica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation();

  const fetchProfileData = async () => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      setError(t("Usuário não autenticado."));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${baseUrl}/api/membros/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || t("Erro ao buscar dados do perfil"));
      }

      const data = await response.json();
      setFormacoes(data.formacoesAcademicas || []);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      setError(t("Não foi possível carregar as formações acadêmicas."));
      toast.error(t("Erro ao carregar perfil!"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [userId, baseUrl]);

  const handleAddFormacao = () => {
    setOpenModal({ isOpen: true });
  };

  const handleEditFormacao = (formacao: FormacaoAcademica) => {
    setOpenModal({ isOpen: true, formacao });
  };

  const handleSaveFormacao = async (formacao: FormacaoAcademica) => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.error(t("Usuário não autenticado."));
      return;
    }

    if (
      !formacao.areaEstudo.trim() ||
      !formacao.instituicao.trim() ||
      !formacao.dataInicio
    ) {
      toast.error(
        t("Área de estudo, instituição e data de início são obrigatórios!")
      );
      return;
    }

    setIsSubmitting(true);
    try {
      let updatedFormacoes;
      if (formacao.id) {
        updatedFormacoes = formacoes.map((f) =>
          f.id === formacao.id ? formacao : f
        );
      } else {
        updatedFormacoes = [...formacoes, formacao]; // No temporary ID needed
      }

      const payload = {
        formacoesAcademicas: updatedFormacoes.map((f) => ({
          id: f.id, // Send undefined for new formations
          areaEstudo: f.areaEstudo.trim(),
          instituicao: f.instituicao.trim(),
          situacao: f.situacao || null,
          diploma: f.diploma?.trim() || undefined,
          descricao: f.descricao?.trim() || undefined,
          dataInicio: f.dataInicio,
          dataFim: f.dataFim || undefined,
        })),
      };

      const response = await fetch(`${baseUrl}/api/membros/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || t("Erro ao salvar formação"));
      }

      const updatedData = await response.json();
      setFormacoes(updatedData.formacoesAcademicas || []);
      setOpenModal({ isOpen: false });
      toast.success(
        t(formacao.id ? "Formação atualizada com sucesso!" : "Formação adicionada com sucesso!")
      );
    } catch (err) {
      console.error("Erro ao salvar formação:", err);
      toast.error(t("Erro ao salvar formação!"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFormacao = async (formacaoId: number | undefined) => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      toast.error(t("Usuário não autenticado."));
      return;
    }

    const userConfirmed = window.confirm(
      t("Tem certeza que deseja excluir esta formação?")
    );
    if (!userConfirmed) {
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedFormacoes = formacoes.filter((f) => f.id !== formacaoId);
      const payload = {
        formacoesAcademicas: updatedFormacoes.map((f) => ({
          id: f.id,
          areaEstudo: f.areaEstudo.trim(),
          instituicao: f.instituicao.trim(),
          situacao: f.situacao || null,
          diploma: f.diploma?.trim() || undefined,
          descricao: f.descricao?.trim() || undefined,
          dataInicio: f.dataInicio,
          dataFim: f.dataFim || undefined,
        })),
      };

      const response = await fetch(`${baseUrl}/api/membros/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || t("Erro ao deletar formação"));
      }

      setFormacoes(updatedFormacoes);
      toast.success(t("Formação removida com sucesso!"));
    } catch (err) {
      console.error("Erro ao deletar formação:", err);
      toast.error(t("Erro ao deletar formação!"));
      await fetchProfileData(); // Revert to server state on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return t("N/A");
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.header}>
          <div className={style.title}>
            <h1>{t("Formação Acadêmica")}</h1>
          </div>
          <div className={style.addDegree}>
            <IoMdAdd
              className={style.iconAdd}
              onClick={handleAddFormacao}
              title={t("Adicionar Formação")}
            />
          </div>
        </div>
        <div className={style.formacoesList}>
          {loading ? (
            <div className={style.spinnerContainer}>
              <Spinner />
            </div>
          ) : error ? (
            <div className={style.errorMessage}>
              <p>{error}</p>
            </div>
          ) : formacoes.length === 0 ? (
            <div className={style.noFormacoesMessage}>
              <p>{t("Nenhuma formação acadêmica registrada.")}</p>
            </div>
          ) : (
            formacoes.map((formacao) => (
              <div
                key={formacao.id || `${formacao.areaEstudo}-${formacao.instituicao}-${formacao.dataInicio}`}
                className={style.formacaoCard}
              >
                <div className={style.divisao}>
                  <div className={style.dataFormacao}>
                    <h3>{formacao.areaEstudo}</h3>
                    <p>
                      <strong>{t("Instituição")}:</strong> {formacao.instituicao}
                    </p>
                    <p>
                      <strong>{t("Situação")}:</strong> {formacao.situacao}
                    </p>
                    {formacao.diploma && (
                      <p>
                        <strong>{t("Diploma")}:</strong> {formacao.diploma}
                      </p>
                    )}
                    {formacao.descricao && (
                      <p>
                        <strong>{t("Descrição")}:</strong> {formacao.descricao}
                      </p>
                    )}
                    <p>
                      <strong>{t("Início")}:</strong>{" "}
                      {formatDate(formacao.dataInicio)}
                    </p>
                    <p>
                      <strong>{t("Fim")}:</strong> {formatDate(formacao.dataFim)}
                    </p>
                  </div>
                  <div className={style.actions}>
                    <button
                      className={style.buttonAction}
                      onClick={() => handleEditFormacao(formacao)}
                      disabled={isSubmitting}
                      title={t("Editar Formação")}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={style.buttonAction}
                      onClick={() => handleDeleteFormacao(formacao.id)}
                      disabled={isSubmitting}
                      title={t("Excluir Formação")}
                    >
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {openModal.isOpen && (
          <ModalDegree
            closeModal={() => setOpenModal({ isOpen: false })}
            onSave={handleSaveFormacao}
            educationalData={openModal.formacao}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}