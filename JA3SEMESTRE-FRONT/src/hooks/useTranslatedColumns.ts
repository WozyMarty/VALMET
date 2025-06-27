import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DayShopColumns, avaliacoesColumns, rncSColumns, rncMonthlyMatrixColumns } from '../pages/DayShop/columnDefinitions';
import type { MyColumnConfig } from '../pages/DayShop/columnDefinitions';
import type { TranslationKey } from '@/contexts/LanguageContext';

// Esta função auxiliar seleciona o array de colunas base
const getBaseColumns = (viewType: string): MyColumnConfig[] => {
    switch (viewType) {
        case 'dayshop':    return DayShopColumns;
        case 'avaliacoes': return avaliacoesColumns;
        case 'rnc':        return rncSColumns;
        case 'rnc_mes':    return rncMonthlyMatrixColumns;
        default:           return DayShopColumns;
    }
};

/**
 * Hook customizado que retorna um array de colunas do Bryntum
 * com os textos de cabeçalho e renderers devidamente traduzidos
 * de acordo com o idioma selecionado no LanguageContext.
 * @param viewType O tipo de visualização atual (ex: 'dayshop', 'avaliacoes')
 * @returns Um array de configurações de coluna traduzidas e prontas para uso.
 */
export const useTranslatedColumns = (viewType: string) => {
    const { t, locale } = useLanguage();

    const activeColumns = useMemo(() => {
        const baseColumns = getBaseColumns(viewType);

        return baseColumns.map(col => {
            // Cria uma cópia para não modificar a configuração original
            const translatedCol = { ...col };

            // 1. TRADUZ O CABEÇALHO DA COLUNA
            // Usa o `field` como chave, ex: `t('column_pri')`
            if (col.field) {
                translatedCol.text = t(`column_${col.field}` as TranslationKey);
            }

            // 2. SOBRESCREVE O RENDERER PARA TRADUZIR O CONTEÚDO DA CÉLULA
            if (col.field === 'pri') {
                translatedCol.renderer = ({ value }: { value: string }) => {
                    if (!value) return '';
                    
                    const classMap: { [key: string]: string } = { 'High': 'high', 'Medium': 'medium', 'Low': 'low' };
                    const priorityClass = classMap[value] || 'low';

                    const translationKeyMap: { [key: string]: TranslationKey } = {
                        'High': 'priority_high',
                        'Medium': 'priority_medium',
                        'Low': 'priority_low'
                    };
                    
                    const displayText = t(translationKeyMap[value]);
                    return `<div class="priority-badge priority-${priorityClass}">${displayText}</div>`;
                };
            }

            // Adicione outros `if (col.field === 'status')` aqui se precisar
            // traduzir o conteúdo de outras colunas.

            return translatedCol;
        });
    }, [t, viewType, locale]); // Recalcula quando o idioma ou a view mudam

    return activeColumns;
};
