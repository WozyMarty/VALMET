// src/services/userService.ts (novo arquivo)
import  api  from './apiService'; // Sua instância do axios

export interface UserDto {
    eventColor: string;
    id: number;
    name: string; // ou UserName, FullName, conforme seu backend
}
interface InviteUserData {
    name: string;
    email: string;
    role: string;
    phoneNumber?: string;
}
export interface InviteUserPayload {
    name: string;
    email: string;
    role: string;
    phoneNumber?: string;
}

export const getUsers = async (): Promise<UserDto[]> => {
    try {
        const response = await api.get<UserDto[]>('/users'); // Ajuste o endpoint se necessário
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
};
export const inviteUser = async (userData: InviteUserData): Promise<{ message: string }> => {
    const response = await api.post('/users/invite', userData);
    return response.data;
};