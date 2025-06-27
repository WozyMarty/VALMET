// Em src/services/sessionsService.ts

import api from './apiService';

export interface UserSession {
  id: number;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  isCurrent: boolean; // O backend deve nos dizer se é a sessão atual
}

export const getSessions = async (): Promise<UserSession[]> => {
  try {
    const response = await api.get<UserSession[]>('/sessions');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar sessões:", error);
    throw error;
  }
};

export const revokeSession = async (sessionId: number): Promise<void> => {
  try {
    await api.delete(`/sessions/${sessionId}`);
  } catch (error) {
    console.error(`Erro ao revogar sessão ${sessionId}:`, error);
    throw error;
  }
};

export const revokeAllOtherSessions = async (): Promise<void> => {
  try {
    await api.post('/sessions/revoke-all-others');
  } catch (error) {
    console.error("Erro ao revogar todas as outras sessões:", error);
    throw error;
  }
};