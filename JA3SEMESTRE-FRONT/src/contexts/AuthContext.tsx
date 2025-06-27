/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { loginUser, registerUser, getUserProfile, refreshToken as refreshTokenService } from '../services/authService';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import { LoginDto, UserProfileDto } from '@/dtos/AuthDtos';

type User = UserProfileDto;

// Tipagem para o contexto
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean; // Para indicar se estamos carregando algo (ex: perfil)
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>; // Mantemos o register aqui
  isExpireModalOpen: boolean;
  handleProlongSession: () => void;
  setIsExpireModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}


// Cria o contexto com um valor padrão (null ou undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

let tokenRefreshTimeout: number;

// O Provider é o componente que vai "segurar" o estado e as funções
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Começa true para tentar carregar o usuário
  const navigate = useNavigate(); // Usa o hook para navegação
  const [isExpireModalOpen, setIsExpireModalOpen] = useState(false);

  // --- FUNÇÕES DE LÓGICA ---

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        clearTimeout(tokenRefreshTimeout);
        setIsExpireModalOpen(false);
        navigate('/login');
    }, [navigate]);
    
    const scheduleTokenRefresh = useCallback((accessToken: string) => {
        clearTimeout(tokenRefreshTimeout);
        try {
            const decodedToken: { exp: number } = jwtDecode(accessToken);
            const expiresAt = decodedToken.exp * 1000;
            const now = Date.now();
            const promptBefore = 2 * 60 * 1000; // Abre o modal 2 minutos antes de expirar
            let timeoutDuration = expiresAt - now - promptBefore;

            if (timeoutDuration < 0) {
                timeoutDuration = 0; // Se o tempo já passou, abre o modal imediatamente
            }
            
            tokenRefreshTimeout = window.setTimeout(() => {
                setIsExpireModalOpen(true);
            }, timeoutDuration);
        } catch {
            logout();
        }
    }, [logout]);

    const handleProlongSession = useCallback(async () => {
        try {
            const newAccessToken = await refreshTokenService();
            if (newAccessToken) {
                toast.success("Sessão prolongada!");
                setIsExpireModalOpen(false);
                scheduleTokenRefresh(newAccessToken);
            } else {
                toast.error("Não foi possível prolongar a sessão.");
                logout();
            }
        } catch {
            logout();
        }
    }, [logout, scheduleTokenRefresh]);



    // --- FUNÇÃO DE LOGIN UNIFICADA E FINAL ---
    const login = useCallback(async (data: LoginDto) => {
        setLoading(true);
        try {
            const response = await loginUser(data);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            const profileData = await getUserProfile();
            setUser(profileData);
            scheduleTokenRefresh(response.accessToken);

            if (profileData.hasPassword === false) {
                toast.info("Bem-vindo! Para sua segurança, por favor, crie sua senha.");
                navigate('/configuracoes');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            toast.error(err.message || 'Falha no login');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [navigate, scheduleTokenRefresh]);

    const register = async (data: any) => {
    setLoading(true);
    try {
        await registerUser(data);
        toast.success('Registro bem-sucedido! Por favor, faça o login.');
        navigate('/login');
    } catch (err: any) {
        toast.error(err.message || 'Falha no registro.');
        throw err;
    } finally {
        setLoading(false);
    }
};
    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                try {
                    // Valida o token existente e agenda a próxima renovação
                    const newAccessToken = await refreshTokenService(); 
                    if (newAccessToken) {
                        const profileData = await getUserProfile();
                        setUser(profileData);
                        scheduleTokenRefresh(newAccessToken);
                    } else {
                        logout();
                    }
                } catch {
                    logout();
                }
            }
            setLoading(false);
        };
        initializeAuth();
        return () => clearTimeout(tokenRefreshTimeout);
    }, [logout, scheduleTokenRefresh]);

  // O valor que será compartilhado pelo contexto.
  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    logout,
    register,
    isExpireModalOpen,
    setIsExpireModalOpen,
    setUser,
    handleProlongSession,
};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto em outros componentes.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};