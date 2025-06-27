import api from './apiService';
import { LoginDto } from '@/dtos/AuthDtos';
// Interfaces para tipar os dados (se você usa TypeScript, isso é ótimo!)
interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  expiration: string;
}

// Interfaces para os novos DTOs
export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordWithTokenPayload {
  email: string;
  token: string;
  newPassword: string;
}

interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface UpdateProfileDto {
  name: string;
  phoneNumber?: string;
}


// Função para registrar um usuário.
export const registerUser = async (data: RegisterData) => {
  try {
    // Usamos nossa instância 'api' para fazer um POST para /auth/register.
    // O axios automaticamente junta a baseURL com '/auth/register'.
    const response = await api.post('/auth/register', data);
    return response.data; // Retorna a resposta do back-end (ex: { message: "..." })
  } catch (error: any) {
    // Se der erro, pegamos a mensagem de erro do back-end (se houver)
    // ou a mensagem de erro padrão do axios.
    throw error.response?.data?.message || error.message || 'Erro ao registrar.';
  }
};

export const loginUser = async (loginData: LoginDto): Promise<LoginApiResponse> => {
  try {
    // 1. Faz a chamada para a API
    const response = await api.post<LoginApiResponse>('/auth/login', loginData);
    
    // 2. Apenas retorna os dados que o backend enviou. Nada mais.
    return response.data; 

  } catch (error) {
    console.error("Erro no serviço de login:", error);
    // Relança o erro para que o AuthContext possa lidar com ele
    throw error;
  }
};

// Função para fazer logout.
export const logoutUser = () => {
    // Simplesmente removemos o token do localStorage.
    localStorage.removeItem('authToken');
    // Você também precisará limpar o estado global da sua aplicação aqui.
};

// Função para buscar o perfil (exemplo de chamada protegida).
export const getUserProfile = async () => {
    try {
        // Fazemos um GET para /auth/profile.
        // O interceptor do apiService cuidará de adicionar o token automaticamente!
        const response = await api.get('/auth/profile');
        return response.data;
    } catch (error: any) {
         // Se der erro (ex: 401 Unauthorized se o token for inválido/expirado),
         // podemos tratar aqui, talvez fazendo logout.
         if (error.response?.status === 401) {
             logoutUser();
         }
        throw error.response?.data?.message || error.message || 'Erro ao buscar perfil.';
    }
}

// Função para verificar se há um token (útil para saber se deve tentar manter logado).
export const hasAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
}
interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const changePassword = async (passwordData: ChangePasswordDto): Promise<{ message: string }> => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await api.post('/auth/forgot-password', payload);
  return response.data;
};

export const updateUserProfile = async (profileData: UpdateProfileDto) => {
  try {
    const response = await api.put('/users/profile', profileData); // Chama o endpoint que criamos no backend
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar o perfil do usuário:", error);
    throw error;
  }
};

/**
 * Envia o token e a nova senha para redefinir a senha do usuário.
 */
export const resetPasswordWithToken = async (payload: ResetPasswordWithTokenPayload) => {
  const response = await api.post('/auth/reset-password-with-token', payload);
  return response.data;
};

export const refreshToken = async (): Promise<string | null> => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    const currentAccessToken = localStorage.getItem('accessToken');

    if (!currentRefreshToken || !currentAccessToken) {
        return null;
    }

    try {
        const response = await api.post('/auth/refresh-token', {
            accessToken: currentAccessToken,
            refreshToken: currentRefreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        // Atualiza os tokens no localStorage
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        return newAccessToken;
    } catch (error) {
        console.error("Falha ao renovar token (authService):", error);
        // Limpa tokens antigos se a renovação falhar
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
    }
};
