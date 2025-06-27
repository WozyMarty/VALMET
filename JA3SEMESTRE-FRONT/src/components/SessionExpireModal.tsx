// Em src/components/SessionExpireModal.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Ajuste o caminho
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { refreshToken as refreshTokenService } from '@/services/authService';
import { Hourglass } from 'lucide-react';
import './SessionExpireDialog.css';
import { toast } from 'sonner';

const MODAL_TIMEOUT_SECONDS = 60; // 1 minuto para o usuário responder

export const SessionExpireModal = () => {
    const { isExpireModalOpen, setIsExpireModalOpen, logout } = useAuth();
    const [countdown, setCountdown] = useState(MODAL_TIMEOUT_SECONDS);

    useEffect(() => {
        if (!isExpireModalOpen) return;

        setCountdown(MODAL_TIMEOUT_SECONDS); // Reseta o contador
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    logout(); // Desloga se o tempo acabar
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isExpireModalOpen, logout]);
    
    const handleProlong = async () => {
        try {
            await refreshTokenService();
            toast.success("Sessão prolongada!");
            setIsExpireModalOpen(false);
        } catch {
            toast.error("Não foi possível prolongar a sessão.");
            logout();
        }
    };
    
    return (
        <AlertDialog open={isExpireModalOpen}>
        <AlertDialogContent className="session-expire-dialog">
            <AlertDialogHeader className="session-expire-header">
                
                {/* Ícone para dar contexto visual imediato */}
                <div className="session-expire-icon animate-hourglass">
                    <Hourglass size={48} />
                </div>

                <div className="session-expire-text-content">
                    <AlertDialogTitle className="session-expire-title">
                        Sua sessão está prestes a expirar!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="session-expire-description">
                        Para sua segurança, você será desconectado em <span className="session-expire-countdown">{countdown}</span> segundos.
                    </AlertDialogDescription>
                </div>

            </AlertDialogHeader>
            <AlertDialogFooter className="session-expire-footer">
                {/* Botão secundário, menos destaque */}
                <AlertDialogCancel onClick={logout} className="session-expire-action-secondary">
                    Sair
                </AlertDialogCancel>
                {/* Botão principal, com destaque total */}
                <AlertDialogAction onClick={handleProlong} className="session-expire-action-primary">
                    Prolongar Sessão
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    );
};