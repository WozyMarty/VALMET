import api from './apiService'; // Importe ApiErrorResponse se quiser tipar o catch
import {
    GanttResponseDto, GanttTaskDto, CreateGanttTaskDto,
    UpdateGanttTaskDto, DependencyDto, RncDto, CreateRncDto, UpdateRncDto,
    RncMonthlyAreaSummaryDto, AvaliacaoDto, CreateAvaliacaoDto, UpdateAvaliacaoDto
} from '../dtos/GanttDtos'; // Ajuste o caminho se necessário
import { AxiosResponse } from 'axios';

// Busca todos os dados do Gantt para um projeto
export const getProjectGantt = async (projectId: number, viewType?: string): Promise<Partial<GanttResponseDto> | null> => {
    try {
        const params = viewType ? `?viewType=${viewType}` : '';
        const response = await api.get<Partial<GanttResponseDto>>(`/dayshop/${projectId}${params}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados do Gantt (dayShopService):", error);
        throw error; // Relança o erro já padronizado pelo interceptor do apiService
    }
};

// Cria uma nova tarefa
export const createTask = async (projectId: number, taskData: CreateGanttTaskDto): Promise<GanttTaskDto> => {
    try {
        const response = await api.post<GanttTaskDto>(`/dayshop/${projectId}/tasks`, taskData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar tarefa (dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

// Atualiza uma tarefa existente
export const updateTask = async (taskId: number, taskData: UpdateGanttTaskDto): Promise<void> => {
    console.log(`dayShopService: updateTask para ID ${taskId}, eventColor no DTO:`, taskData.eventColor);
    console.log("dayShopService: DTO completo para updateTask:", JSON.parse(JSON.stringify(taskData)));
    
    try {
        await api.put(`/dayshop/tasks/${taskId}`, taskData);
    } catch (error) {
        console.error("Erro ao atualizar tarefa (dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

// Deleta uma tarefa
export const deleteTask = async (taskId: number): Promise<AxiosResponse<any>> => { 
    try {
        // VVVV--- ADICIONE O "return" AQUI ---VVVV
        return await api.delete(`/dayshop/tasks/${taskId}`);
    } catch (error) {
        console.error("Erro ao deletar tarefa (dayShopService):", error);
        throw error;
    }
};
// --- Funções para a Lixeira (Trash) ---

// Define um tipo para os itens que virão da lixeira, para melhor organização
export interface DeletedTaskDto {
    id: number;
    name: string;
    pcs?: string;
    item?: string;
    deletedAt: string; // Virá como string ISO do backend
}

/**
 * Busca todas as tarefas marcadas como excluídas para um projeto.
 * @param projectId O ID do projeto.
 * @returns Uma lista de tarefas na lixeira.
 */
export const getDeletedTasks = async (projectId: number): Promise<DeletedTaskDto[]> => {
    try {
        const response = await api.get<DeletedTaskDto[]>(`/dayshop/${projectId}/deleted-tasks`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar tarefas da lixeira (dayShopService):", error);
        throw error;
    }
};

/**
 * Restaura uma tarefa (e seus descendentes) da lixeira.
 * @param taskId O ID da tarefa a ser restaurada.
 */
export const restoreTask = async (taskId: number): Promise<void> => {
    try {
        await api.post(`/dayshop/tasks/${taskId}/restore`);
    } catch (error) {
        console.error(`Erro ao restaurar tarefa ID ${taskId} (dayShopService):`, error);
        throw error;
    }
};

/**
 * Exclui permanentemente uma tarefa (e seus descendentes) do banco de dados.
 * @param taskId O ID da tarefa a ser excluída permanentemente.
 */
export const deleteTaskPermanently = async (taskId: number): Promise<void> => {
    try {
        await api.delete(`/dayshop/tasks/${taskId}/permanent`);
    } catch (error) {
        console.error(`Erro ao excluir permanentemente a tarefa ID ${taskId} (dayShopService):`, error);
        throw error;
    }
};
/**
 * Salva a data de início do projeto no backend.
 * @param projectId - O ID do projeto a ser atualizado.
 * @param startDate - A nova data de início.
 */
export const saveProjectStartDate = async (projectId: number, startDate: Date): Promise<void> => {
  // A URL agora é relativa à base definida no .env.
  // O seu apiService vai juntar "https://localhost:7250/api" + "/dayshop/project/..."
  const url = `/dayshop/project/${projectId}/startDate`; 
  
  try {
    // Usamos api.put para ser consistente com o resto do seu projeto.
    // Ele já inclui a base da URL, o token de autorização e trata os erros.
    await api.put(url, { startDate: startDate.toISOString() });
  } catch (error) {
    console.error(`Erro ao salvar a data de início do projeto ${projectId} (dayShopService):`, error);
    throw error; // O apiService já deve formatar e relançar o erro
  }
};

// ---- Funções para Dependências ----

export const createDependency = async (projectId: number, dependencyData: Partial<DependencyDto>): Promise<DependencyDto> => {
    try {
        const response = await api.post<DependencyDto>(`/dayshop/${projectId}/dependencies`, dependencyData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar dependência (dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

export const updateDependency = async (dependencyId: number | string, dependencyData: DependencyDto): Promise<void> => {
    try {
        await api.put(`/dayshop/dependencies/${dependencyId}`, dependencyData);
    } catch (error) {
        console.error("Erro ao atualizar dependência (dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

export const deleteDependency = async (dependencyId: number | string): Promise<void> => {
    try {
        await api.delete(`/dayshop/dependencies/${dependencyId}`);
    } catch (error) {
        console.error("Erro ao deletar dependência (dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

// Faz upload do arquivo Excel para DayShop (Tarefas)
export const uploadGanttExcel = async (projectId: number, file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/dayshop/upload/${projectId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao fazer upload (Gantt - dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

// Faz upload do arquivo Excel para RNCs
export const uploadRncExcel = async (projectId: number, file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/Rnc/upload/${projectId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao fazer upload (RNC - dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

// --- Funções para RNC ---
export const getRncDataForProject = async (projectId: number): Promise<RncDto[]> => {
    try {
        const response = await api.get<RncDto[]>(`/rnc/project/${projectId}`);
        return response.data || [];
    } catch (error) {
        console.error(`Erro ao buscar dados RNC para o projeto ${projectId} (dayShopService):`, error);
        throw error; // Relança o erro padronizado
    }
};

export const createRnc = async (rncData: CreateRncDto): Promise<RncDto> => {
    try {
        const response = await api.post<RncDto>('/rnc', rncData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar RNC (dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

export const updateRnc = async (rncId: number, rncData: UpdateRncDto): Promise<void> => {
    try {
        await api.put(`/rnc/${rncId}`, rncData);
    } catch (error) {
        console.error(`Erro ao atualizar RNC ID ${rncId} (dayShopService):`, error);
        throw error; // Relança o erro padronizado
    }
};

export const deleteRnc = async (rncId: number): Promise<void> => {
    try {
        await api.delete(`/rnc/${rncId}`);
    } catch (error) {
        console.error(`Erro ao deletar RNC ID ${rncId} (dayShopService):`, error);
        throw error; // Relança o erro padronizado
    }
};

export const getRncAnnualSummaryByArea = async (
    projectId: number,
    year: number
): Promise<RncMonthlyAreaSummaryDto[]> => {
    try {
        const response = await api.get(`/Rnc/project/${projectId}/annual-summary-by-area`, {
            params: { year }
        });
        // O mapeamento aqui pode ser mantido, pois é específico da estrutura de dados do RNC-MES
        return response.data.map((item: any) => ({
            id: item.id,
            areaOuSetor: item.areaOuSetor,
            jan: item.jan, fev: item.fev, mar: item.mar, abr: item.abr,
            mai: item.mai, jun: item.jun, jul: item.jul, ago: item.ago,
            septCount: item.septCount, out: item.out, nov: item.nov, dez: item.dez,
            totalAnual: item.totalAnual,
            name: item.areaOuSetor,
            leaf: true,
            iconCls: 'b-fa b-fa-table'
        })) as RncMonthlyAreaSummaryDto[];
    } catch (error) {
        console.error("Erro ao buscar resumo anual de RNC (dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

// --- Funções para Avaliações ---
const BASE_URL_AVALIACOES = '/Avaliacoes'; // Definido para consistência

export const getAvaliacoesForProject = async (projectId: number): Promise<AvaliacaoDto[]> => {
    try {
        const response = await api.get<AvaliacaoDto[]>(`${BASE_URL_AVALIACOES}/project/${projectId}`);
        // O mapeamento de datas aqui pode ser necessário dependendo de como o Bryntum as consome
        return response.data.map(a => ({
            ...a,
            dataReceb: a.dataReceb ? new Date(a.dataReceb).toISOString() : null,
            serviceInicio: a.serviceInicio ? new Date(a.serviceInicio).toISOString() : null,
            // ... (converter todas as outras datas se necessário) ...
        })) as AvaliacaoDto[];
    } catch (error) {
        console.error(`Erro ao buscar Avaliações para o projeto ${projectId} (dayShopService):`, error);
        throw error; // Relança o erro padronizado
    }
};

export const createAvaliacao = async (createDto: CreateAvaliacaoDto): Promise<AvaliacaoDto> => {
    try {
        const response = await api.post<AvaliacaoDto>(BASE_URL_AVALIACOES, createDto);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar Avaliação (dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};

export const updateAvaliacao = async (id: number, updateDto: UpdateAvaliacaoDto): Promise<void> => {
    try {
        await api.put(`${BASE_URL_AVALIACOES}/${id}`, updateDto);
    } catch (error) {
        console.error(`Erro ao atualizar Avaliação ID ${id} (dayShopService):`, error);
        throw error; // Relança o erro padronizado
    }
};

export const deleteAvaliacao = async (id: number): Promise<void> => {
    try {
        await api.delete(`${BASE_URL_AVALIACOES}/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar Avaliação ID ${id} (dayShopService):`, error);
        throw error; // Relança o erro padronizado
    }
};

export const uploadAvaliacoesExcel = async (projectId: number, file: File): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`${BASE_URL_AVALIACOES}/upload/${projectId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao fazer upload (Avaliações - dayShopService):", error);
        throw error; // Relança o erro padronizado
    }
};
