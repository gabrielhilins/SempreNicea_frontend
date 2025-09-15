import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";

interface AreaTematica {
  id: number;
  titulo: string;
}

interface SelectedAreaTematica {
  id: number;
  titulo: string;
}

interface DropdownAreaTematicasProps {
  selectedAreaTematica: AreaTematica | null;
  setSelectedAreaTematica: (value: AreaTematica | null) => void;
  disabled?: boolean;
}

const DropdownAreaTematicas: React.FC<DropdownAreaTematicasProps> = ({
  selectedAreaTematica,
  setSelectedAreaTematica,
  disabled,
}) => {
  const [options, setOptions] = useState<
    { value: string; label: string; areaTematicaData: SelectedAreaTematica }[]
  >([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation();

  useEffect(() => {
    const buscarAreaTematicas = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) {
        toast.error(t("Usuário não autenticado!"));
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

        if (!response.ok) {
          throw new Error(t("Erro ao buscar áreas temáticas"));
        }

        const data: AreaTematica[] = await response.json();

        const formattedOptions = data.map((area) => ({
          value: area.titulo,
          label: area.titulo,
          areaTematicaData: {
            id: area.id,
            titulo: area.titulo,
          },
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Erro ao buscar áreas temáticas:", error);
        toast.error(t("Erro ao carregar áreas temáticas!"));
      }
    };

    buscarAreaTematicas();
  }, [baseUrl, t]);

  const handleChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedAreaTematica(selectedOption.areaTematicaData);
    } else {
      setSelectedAreaTematica(null);
    }
  };

  const customIndicator = (props: any) => (
    <components.DropdownIndicator {...props}>
      {props.selectProps.menuIsOpen ? (
        <IoIosArrowUp size={24} />
      ) : (
        <IoIosArrowDown size={24} />
      )}
    </components.DropdownIndicator>
  );

  return (
    <div className="input-container">
      <label className="label" htmlFor="areaTematicas-dropdown">
        {t("Área Temática")}
      </label>
      <Select
        id="areaTematicas-dropdown"
        options={options}
        isMulti={false}
        placeholder={t("Selecione a área temática...")}
        onChange={handleChange}
        value={options.find(
          (option) => option.areaTematicaData.id === selectedAreaTematica?.id
        )}
        menuPlacement="auto"
        components={{ DropdownIndicator: customIndicator }}
        isDisabled={disabled}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default DropdownAreaTematicas;