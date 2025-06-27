// src/contexts/ErrorContext.tsx (Versão Corrigida e Simplificada)
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ErrorContextType {
  showErrorModal: (message: string, title?: string) => void;
  closeErrorModal: () => void;
  isErrorModalOpen: boolean;
  errorMessage: string | null;
  errorTitle: string;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState<string>("Ocorreu um Erro");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const showErrorModal = (message: string, title: string = "Ocorreu um Erro") => {
    setErrorMessage(message);
    setErrorTitle(title);
    setIsErrorModalOpen(true);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    // Opcional: resetar o estado após o fecho para evitar "piscar" de conteúdo antigo
    setTimeout(() => {
        setErrorMessage(null);
    }, 300); 
  };

  const value = {
    showErrorModal,
    closeErrorModal,
    isErrorModalOpen,
    errorMessage,
    errorTitle,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError deve ser usado dentro de um ErrorProvider');
  }
  return context;
};