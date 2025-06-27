// Em src/components/SessionManager.tsx (VERSÃO FINAL SIMPLIFICADA)

import { UserSession } from '@/services/sessionsService';
import { Smartphone, Monitor } from 'lucide-react';
import { UAParser } from 'ua-parser-js';
import './SessionManager.css';

// 1. Defina as props que o componente vai receber do Pai
interface SessionManagerProps {
    sessions: UserSession[];
    loading: boolean;
    onRevoke: (sessionId: number) => void;
}

export const SessionManager = ({ sessions, loading, onRevoke }: SessionManagerProps) => {

    // A função de parse continua aqui, pois é lógica de apresentação
    const parseUserAgent = (uaString: string) => {
        const parser = new UAParser(uaString);
        const result = parser.getResult();
        const deviceType = result.device.type || 'desktop';
        const browser = result.browser.name || 'N/A';
        const os = result.os.name || 'N/A';
        return {
            deviceType,
            displayText: `${browser} - ${os}`
        };
    };

    if (loading) {
        return <p>Carregando sessões...</p>;
    }

    // 2. SEU JSX NÃO MUDA NADA! Ele apenas usa as props recebidas.
    return (
        <div className="space-y-3"> {/* Use space-y ou uma classe customizada */}
            {sessions.map(session => {
                const { deviceType, displayText } = parseUserAgent(session.userAgent);
                return (
                    // Contêiner principal para cada item
                    <div key={session.id} className="session-item">
                        
                        {/* Agrupa Ícone e Textos */}
                        <div className="session-info">
                            {deviceType === 'mobile' ? <Smartphone size={24} className="session-icon" /> : <Monitor size={24} className="session-icon" />}
                            
                            {/* Agrupa os textos verticalmente */}
                            <div className="session-text">
                                <span className="session-device">{displayText}</span>
                                <span className="session-details">
                                    {session.isCurrent 
                                        ? <span className="session-current-tag">Sessão atual</span> 
                                        // A conversão acontece aqui:
                                        : `Ativa em: ${new Date(session.createdAt).toLocaleString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}`
                                    }
                                </span>
                            </div>
                        </div>

                        {/* O botão fica sozinho no final */}
                        {!session.isCurrent && (
                            <button className="btn-revoke" onClick={() => onRevoke(session.id)}>
                                Encerrar
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SessionManager;