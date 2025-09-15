import React, { useState, useEffect } from 'react';
import Select, { components, MultiValue, ActionMeta } from 'react-select';
import { toast } from 'react-toastify';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

interface Membro {
  id: number;
  nome: string;
  sobrenome: string;
}

interface SelectedMembro {
  id: number;
  nomeCompleto: string;
}

interface DropdownMembrosProps {
  selectedMembros: SelectedMembro[];
  setSelectedMembros: (values: SelectedMembro[]) => void;
  disabled?: boolean;
}

const DropdownMembros: React.FC<DropdownMembrosProps> = ({ selectedMembros, setSelectedMembros, disabled }) => {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [options, setOptions] = useState<{ value: number; label: string; membroData: SelectedMembro }[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation();

  useEffect(() => {
    const buscarMembros = async () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        toast.error(t('Usuário não autenticado!'));
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/membros/aprovados`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(t('Erro ao buscar membros'));
        }

        const data: Membro[] = await response.json();
        setMembros(data);

        const formattedOptions = data.map((membro) => ({
          value: membro.id,
          label: `${membro.nome} ${membro.sobrenome}`,
          membroData: {
            id: membro.id,
            nomeCompleto: `${membro.nome} ${membro.sobrenome}`,
          },
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Erro ao buscar membros:', error);
        toast.error(t('Erro ao carregar membros!'));
      }
    };

    buscarMembros();
  }, [baseUrl, t]);

  const handleChange = (
    selectedOptions: MultiValue<{ value: number; label: string; membroData: SelectedMembro }>,
    actionMeta: ActionMeta<{ value: number; label: string; membroData: SelectedMembro }>
  ) => {
    const selected = selectedOptions ? selectedOptions.map((option) => option.membroData) : [];
    setSelectedMembros(selected);
  };

  const customIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        {props.selectProps.menuPlacement === 'top' ? (
          <IoIosArrowUp size={24} />
        ) : (
          <IoIosArrowDown size={24} />
        )}
      </components.DropdownIndicator>
    );
  };

  return (
    <div>
      <label className="label" htmlFor="membros-dropdown">
        {t('Selecione os Membros Contribuintes')}
      </label>
      <div className="select">
        <Select
          id="membros-dropdown"
          options={options}
          isMulti
          placeholder={t('Selecione membros contribuidores...')}
          onChange={handleChange}
          value={options.filter((option) =>
            selectedMembros.some((membro) => membro.id === option.value)
          )}
          menuPlacement="top"
          components={{
            DropdownIndicator: customIndicator,
          }}
          isDisabled={disabled}
          noOptionsMessage={() => t('Nenhum membro disponível')}
        />
      </div>
    </div>
  );
};

export default DropdownMembros; 