// src/services/apiService.ts
import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7250/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de Requisição (para adicionar o token)
api.interceptors.request.use(
  (config) => {
    // console.log("ApiService: Request Interceptor para:", config.url);
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log("ApiService: Header Authorization ADICIONADO!");
    }
    return config;
  },
  (error) => {
    console.error("ApiService: ERRO no request interceptor:", error);
    return Promise.reject(error);
  }
);

// Interface para o nosso erro padronizado
export interface ApiErrorResponse {
  isApiError: true;
  message: string;
  status?: number;
  operationDescription?: string; // Opcional: para descrever a operação que falhou
  originalError?: AxiosError | Error; // O erro original para depuração
  errors?: Record<string, string[]>; // Para erros de validação do ModelState
}


// Interceptor de Resposta (para padronizar erros)
api.interceptors.response.use(
  (response) => response, // Passa respostas de sucesso diretamente
  (error: AxiosError) => { // Tipar o erro como AxiosError
    console.error('Erro da API (interceptor de resposta):', error.config?.url, error.response?.status, error.response?.data || error.message);

    let userFriendlyMessage = 'Ocorreu um erro inesperado. Tente novamente.';
    let responseStatus: number | undefined = undefined;
    let validationErrors: Record<string, string[]> | undefined = undefined;

    if (error.response) {
      // O servidor respondeu com um status de erro (4xx, 5xx)
      responseStatus = error.response.status;
      const data: any = error.response.data; // 'data' pode ter diferentes formatos

      // Tenta pegar a mensagem do backend. Pode ser data.message, data.title (para problemas de validação), ou só data (se for string)
      if (typeof data === 'string') {
        userFriendlyMessage = data;
      } else if (data?.message && typeof data.message === 'string') {
        userFriendlyMessage = data.message;
      } else if (data?.title && typeof data.title === 'string') { // Comum para erros de validação do ASP.NET Core
        userFriendlyMessage = data.title;
      } else if (error.message) {
        userFriendlyMessage = error.message;
      }
      
      // Para erros de validação do ASP.NET Core (status 400 com um objeto 'errors')
      if (responseStatus === 400 && data?.errors && typeof data.errors === 'object') {
        validationErrors = data.errors;
        // Poderia tentar construir uma mensagem mais detalhada a partir de validationErrors
        // userFriendlyMessage = "Foram encontrados erros de validação.";
      }


      if (responseStatus === 401) {
        userFriendlyMessage = 'Sessão inválida ou expirada. Por favor, faça login novamente.';
        // A lógica de logout pode ser tratada pelo AuthContext/authService ao falhar getUserProfile
      } else if (responseStatus === 403) {
        userFriendlyMessage = 'Acesso negado. Você não tem permissão para esta ação.';
      } else if (responseStatus >= 500) {
        userFriendlyMessage = data?.message || 'Ocorreu um erro no servidor. Tente novamente mais tarde.';
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      userFriendlyMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      responseStatus = 0; // Para indicar erro de rede
    } else {
      // Algo aconteceu ao configurar a requisição
      userFriendlyMessage = error.message || 'Ocorreu um erro ao processar sua solicitação.';
    }
    
    // Cria e rejeita com o nosso objeto de erro padronizado
    const customError: ApiErrorResponse = {
        isApiError: true,
        message: userFriendlyMessage,
        status: responseStatus,
        errors: validationErrors,
        originalError: error
    };
    return Promise.reject(customError);
  }
);



export default api;
