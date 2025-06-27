/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { LocaleManager } from '@bryntum/gantt';

// Tipos para os locais suportados. Correspondem aos nomes nos arquivos de locale do Bryntum.
type SupportedLocale = 'PtBr' | 'En' | 'Es';
// 1. Dicionário de traduções
const translations = {
    // Cabeçalhos de Coluna
    column_pri: { PtBr: 'PRI', En: 'PRI', Es: 'PRI' },
    column_bu: { PtBr: 'BU', En: 'BU', Es: 'BU' },
    column_pcs: { PtBr: 'PCS', En: 'PCS', Es: 'PCS' },
    column_cliente: { PtBr: 'CLIENTE', En: 'CUSTOMER', Es: 'CLIENTE' },
    column_item: { PtBr: 'ITEM', En: 'ITEM', Es: 'ÍTEM' },
    column_dataEntrega: { PtBr: 'DATA ENTREGA', En: 'DELIVERY DATE', Es: 'FECHA ENTREGA' },
    column_dataReprog: { PtBr: 'DATA REPROG.', En: 'REPR. DATE', Es: 'FECHA REPRO.' },
    column_name: { PtBr: 'Tarefa', En: 'Task', Es: 'Tarea' },
    column_status: { PtBr: 'Status', En: 'Status', Es: 'Estado' },
    column_eventColor:    { PtBr: 'COR', En: 'COLOR', Es: 'COLOR' },
    column_percentDone:   { PtBr: '% Concluído', En: '% DONE', Es: '% COMPL.' },
    column_responsibleId: { PtBr: 'RESPONSÁVEL', En: 'RESPONSIBLE', Es: 'RESPONSABLE' },
    column_observacoes:   { PtBr: 'OBSERVAÇÕES', En: 'NOTES', Es: 'NOTAS' },
    // VVVV--- ADICIONE ESTAS TRADUÇÕES PARA A VIEW DE AVALIAÇÕES ---VVVV
    // Cabeçalhos de colunas agrupadas
    column_service: { PtBr: 'Service', En: 'Service', Es: 'Servicio' },
    column_serviceInicio: { PtBr: 'Início', En: 'Start', Es: 'Inicio' },
    column_serviceReprog: { PtBr: 'Reprog', En: 'Resched.', Es: 'Reprog.' },

    column_group_engEquip: { PtBr: 'Eng. Equip.', En: 'Eng. Equip.', Es: 'Ing. Equipo' },
    column_group_engManuf: { PtBr: 'Eng. Manuf.', En: 'Eng. Manuf.', Es: 'Ing. Manuf.' },
    column_group_pcp: { PtBr: 'PCP', En: 'PCP', Es: 'PCP' },
    column_group_mont: { PtBr: 'Mont.', En: 'Assemb.', Es: 'Mont.' },
    column_group_cald: { PtBr: 'Cald.', En: 'Boilermaking', Es: 'Cald.' },
    column_group_cq: { PtBr: 'CQ', En: 'QA', Es: 'CC' },
    column_group_usin: { PtBr: 'Usin.', En: 'Machining', Es: 'Maq.' },
    column_group_relCq: { PtBr: 'Relatório CQ', En: 'QA Report', Es: 'Informe CC' },
    column_group_orcam: { PtBr: 'Orçam.', En: 'Budget', Es: 'Ppto.' },
    column_group_dataEntregaFinal: { PtBr: 'Data Entrega', En: 'Final Delivery', Es: 'Fecha Entrega' },


    // Cabeçalhos de colunas principais de Avaliações
    column_equipamento: { PtBr: 'Equipamento', En: 'Equipment', Es: 'Equipo' },
    column_dataReceb: { PtBr: 'Data Receb.', En: 'Recv. Date', Es: 'Fecha Rec.' },
    // VVVV--- ADICIONE ESTAS TRADUÇÕES PARA A VIEW DE RNC ---VVVV
    column_relator: { PtBr: 'Relator', En: 'Reporter', Es: 'Informador' },
    column_idRnc: { PtBr: 'ID', En: 'ID', Es: 'ID' },
    column_dataRnc: { PtBr: 'Data', En: 'Date', Es: 'Fecha' },
    column_responsavelRnc: { PtBr: 'Resp.', En: 'Resp.', Es: 'Resp.' },
    column_descricaoRnc: { PtBr: 'Descrição', En: 'Description', Es: 'Descripción' },
    column_setorOrigem: { PtBr: 'Setor Origem', En: 'Source Dept.', Es: 'Sector Origen' },
    column_procRnc: { PtBr: 'Proc', En: 'Proc', Es: 'Proc' },
    column_engERnc: { PtBr: 'Eng E', En: 'Eng E', Es: 'Ing E' },
    column_opRnc: { PtBr: 'OP', En: 'OP', Es: 'OP' },
    column_fabRnc: { PtBr: 'Fab', En: 'Fab', Es: 'Fab' },
    column_supRnc: { PtBr: 'Sup', En: 'Sup', Es: 'Sup' },
    column_ifRnc: { PtBr: 'IF', En: 'IF', Es: 'IF' },
    // VVVV--- ADICIONE ESTAS TRADUÇÕES PARA A VIEW DE RNC MENSAL ---VVVV
    column_rnc_mes_areaSetor: { PtBr: 'ÁREA/SETOR', En: 'AREA/DEPT.', Es: 'ÁREA/SECTOR' },
    month_jan: { PtBr: 'JAN', En: 'JAN', Es: 'ENE' },
    month_fev: { PtBr: 'FEV', En: 'FEB', Es: 'FEB' },
    month_mar: { PtBr: 'MAR', En: 'MAR', Es: 'MAR' },
    month_apr: { PtBr: 'ABR', En: 'APR', Es: 'ABR' },
    month_may: { PtBr: 'MAI', En: 'MAY', Es: 'MAY' },
    month_jun: { PtBr: 'JUN', En: 'JUN', Es: 'JUN' },
    month_jul: { PtBr: 'JUL', En: 'JUL', Es: 'JUL' },
    month_aug: { PtBr: 'AGO', En: 'AUG', Es: 'AGO' },
    month_sep: { PtBr: 'SET', En: 'SEP', Es: 'SEP' },
    month_oct: { PtBr: 'OUT', En: 'OCT', Es: 'OCT' },
    month_nov: { PtBr: 'NOV', En: 'NOV', Es: 'NOV' },
    month_dec: { PtBr: 'DEZ', En: 'DEC', Es: 'DIC' },
    column_totalAnual: { PtBr: 'TOTAL', En: 'TOTAL', Es: 'TOTAL' },
    // ... adicione outras colunas ...

    // Conteúdo das Células
    priority_high: { PtBr: 'Alta', En: 'High', Es: 'Alta' },
    priority_medium: { PtBr: 'Média', En: 'Medium', Es: 'Media' },
    priority_low: { PtBr: 'Baixa', En: 'Low', Es: 'Baja' },
};

export type TranslationKey = keyof typeof translations;

// Interface para o valor do nosso contexto
interface LanguageContextType {
    locale: SupportedLocale;
    changeLocale: (newLocale: SupportedLocale) => void;
    t: (key: TranslationKey) => string; // 2. Nossa função de tradução
}

// Cria o contexto com um valor padrão
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Props para o nosso Provedor
interface LanguageProviderProps {
    children: ReactNode;
}

// O componente Provedor que vai envolver nossa aplicação
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const [locale, setLocale] = useState<SupportedLocale>('PtBr');

    const changeLocale = (newLocale: SupportedLocale) => {
        console.log(`Mudando idioma para: ${newLocale}`);
        LocaleManager.applyLocale(newLocale);
        setLocale(newLocale);
    };

    // 3. Implementação da função 't'
    const t = useCallback((key: TranslationKey): string => {
        return translations[key]?.[locale] || key;
    }, [locale]); // Recria a função apenas se o 'locale' mudar

    const value = { locale, changeLocale, t };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};


// Hook customizado para facilitar o uso do contexto
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
    }
    return context;
};
