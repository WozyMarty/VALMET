// Salve este ficheiro como "src/services/kpiApiService.ts" ou similar

import axios from 'axios';
import { hasAuthToken } from './authService'; // Garanta que este caminho está correto

// 1. DEFINA O CLIENTE AXIOS CENTRALIZADO
const apiClient = axios.create({
    baseURL: 'https://localhost:7250/api', // Sua URL base da API
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. USE UM INTERCEPTOR PARA INJETAR O TOKEN AUTOMATICAMENTE
// Isso é muito mais limpo do que adicionar o header em cada chamada.
apiClient.interceptors.request.use(
    (config) => {
        const token = hasAuthToken(); // Sua função que retorna o token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// 3. DEFINA AS INTERFACES NO NÍVEL SUPERIOR
interface KpiQuestionDto {
    id: string; // QuestionIdentifier
    text: string;
    type: 'yesno' | 'text';
}

export interface KpiDashboardItemDto {
    id: number;
    title: string;
    progressColor: string;
    questions: KpiQuestionDto[];
    currentMonthlyProgress: number;
    daysWithEntries: number[];
}

export interface SubmitKpiAnswersDto {
    kpiId: number;
    date: string; // Data em formato string ISO (ex: "2025-06-07T18:00:00Z")
    answers: Record<string, string>;
}


// 4. EXPORTE AS FUNÇÕES DE API CORRETAMENTE
export const getKpiDashboard = async (): Promise<KpiDashboardItemDto[]> => {
    try {
        const response = await apiClient.get('/kpi/dashboard');
        return response.data;
    } catch (error) {
        console.error('Falha ao buscar o dashboard de KPI:', error);
        throw error; // Relança o erro para ser tratado pelo componente que chamou
    }
};

export const submitKpiAnswers = async (data: SubmitKpiAnswersDto): Promise<KpiDashboardItemDto[]> => {
    try {
        const response = await apiClient.post('/kpi/answers', data);
        return response.data;
    } catch (error) {
        console.error('Falha ao enviar respostas do KPI:', error);
        throw error;
    }
};

// Esta função busca as respostas já salvas para um determinado dia
// Útil para preencher o formulário se o usuário já respondeu antes.
export const getKpiAnswersForDay = async (kpiId: number, date: string): Promise<Record<string, string>> => {
    // AVISO: Este endpoint precisa ser criado no seu KpiController no backend.
    try {
        const response = await apiClient.get(`/kpi/answers/${kpiId}/${date}`);
        return response.data || {}; // Retorna os dados ou um objeto vazio se não houver
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return {}; // Se não encontrou (404), é normal, significa que não há respostas.
        }
        console.error('Falha ao buscar respostas do KPI para o dia:', error);
        throw error;
    }
};