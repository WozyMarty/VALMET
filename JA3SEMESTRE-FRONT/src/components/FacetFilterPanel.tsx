import React, { useState, useEffect, useCallback } from 'react';
import { Gantt, TaskStore } from '@bryntum/gantt';
import { ChevronDown } from 'lucide-react'; // Usaremos um ícone para a seta
import './FacetFilterPanel.css';

// As interfaces FilterOption e FilterCategory continuam as mesmas
interface FilterOption {
    value: string | number | boolean;
    label: string;
    count?: number;
}
interface FilterCategory {
    id: string;
    title: string;
    options: FilterOption[];
}

// A interface das Props continua a mesma
export interface FacetFilterPanelProps {
    ganttInstance?: Gantt;
    fieldsToFilter: readonly {
        readonly fieldName: string;
        readonly title: string;
        readonly type?: 'string' | 'boolean' | 'number' | 'custom';
        readonly customOptions?: readonly FilterOption[];
    }[];
    isVisible: boolean;
}

const FacetFilterPanel: React.FC<FacetFilterPanelProps> = ({ ganttInstance, fieldsToFilter, isVisible }) => {
    // A lógica de filtros continua a mesma
    const [activeFilters, setActiveFilters] = useState<Record<string, (string | number | boolean)[]>>({});
    const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([]);

    // VVVV--- NOVA LÓGICA PARA CONTROLAR O ACCORDION ---VVVV
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        setOpenItems(prevOpenItems =>
            prevOpenItems.includes(id)
                ? prevOpenItems.filter(itemId => itemId !== id)
                : [...prevOpenItems, id]
        );
    };
    // ^^^^-------------------------------------------------^^^^

    // A lógica de 'getDistinctValues' e os 'useEffect' para os filtros continuam os mesmos
    const getDistinctValues = useCallback((field: FacetFilterPanelProps['fieldsToFilter'][number]): FilterOption[] => {
        if (!ganttInstance || !ganttInstance.taskStore) return [];
        if (field.customOptions) return field.customOptions.slice();
        const taskStore = ganttInstance.taskStore as TaskStore;
        const values = taskStore.getDistinctValues(field.fieldName, true).map(val => val === null || val === undefined ? null : String(val)).filter((val): val is string => val !== null);
        if (field.type === 'boolean') return [{ value: true, label: 'Sim' }, { value: false, label: 'Não' }];
        return values.sort((a, b) => String(a).localeCompare(String(b))).map(val => ({ value: val, label: String(val) }));
    }, [ganttInstance]);

    useEffect(() => {
        if (ganttInstance && ganttInstance.taskStore) {
            const categories: FilterCategory[] = fieldsToFilter.map(field => ({ id: field.fieldName, title: field.title, options: getDistinctValues(field) }));
            setFilterCategories(categories);
            setOpenItems(categories.map(c => c.id)); // Começa com todos abertos
        }
    }, [ganttInstance, fieldsToFilter, getDistinctValues]);
    
    const handleFilterChange = (fieldName: string, value: string | number | boolean, checked: boolean) => {
        setActiveFilters(prev => ({...prev, [fieldName]: checked ? [...(prev[fieldName] || []), value] : prev[fieldName].filter(v => v !== value) }));
    };

    useEffect(() => {
        if (!ganttInstance || !ganttInstance.taskStore) return;
        const taskStore = ganttInstance.taskStore;
        fieldsToFilter.forEach(field => taskStore.removeFilter(field.fieldName));
        Object.entries(activeFilters).forEach(([fieldName, values]) => {
            if (values.length > 0) taskStore.filter({ id: fieldName, property: fieldName, operator: 'isIncludedIn', value: values });
        });
    }, [activeFilters, ganttInstance, fieldsToFilter]);

    if (!isVisible) {
        return null;
    }

    // VVVV--- NOVO JSX SEM COMPONENTES <Accordion> ---VVVV
    return (
    <div className="facet-filter-panel">

        {/* ✅ PASSO 1: Mova o H3 para ser um filho direto do painel */}
        <h3>Filtrar Tarefas</h3>

        {/* ✅ PASSO 2: A ScrollArea agora envolve APENAS a lista de filtros */}
        <div className="filter-scroll-container">
            <div className="facet-accordion-container">
                {filterCategories.map((category) => (
                    category.options.length > 0 && (
                        <div className="facet-accordion-item" key={category.id}>
                            <button
                                className={`facet-accordion-trigger ${openItems.includes(category.id) ? 'open' : ''}`}
                                onClick={() => toggleItem(category.id)}
                            >
                                {category.title}
                                <ChevronDown className="facet-accordion-chevron" />
                            </button>
                            <div className={`facet-accordion-content ${openItems.includes(category.id) ? 'open' : ''}`}>
                                <div className="filter-options-container">
                                    {category.options.map((option) => (
                                        <div key={`${category.id}-${String(option.value)}`} className="filter-option-row">
                                            <label className="filter-label-container">
                                                <input
                                                    type="checkbox"
                                                    className="facet-filter-checkbox"
                                                    checked={(activeFilters[category.id] || []).includes(option.value)}
                                                    onChange={(e) => handleFilterChange(category.id, option.value, e.target.checked)}
                                                />
                                                <span className="filter-label-text">
                                                    {category.id === 'eventColor' && (
                                                        <span
                                                            className="color-swatch"
                                                            style={{ backgroundColor: String(option.value) }}
                                                        ></span>
                                                    )}
                                                    {option.label}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    </div>
);
};

export default FacetFilterPanel;