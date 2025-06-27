/* eslint-disable react-refresh/only-export-components */
// src/contexts/ThemeContext.tsx (VERSÃO FINAL E ROBUSTA)

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const storedDarkMode = localStorage.getItem('valmetDashboardDarkMode');
      return storedDarkMode ? JSON.parse(storedDarkMode) : false;
    } catch {
      return false;
    }
  });

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  // ESTE useEffect AGORA FAZ TUDO!
  useEffect(() => {
    // 1. Atualiza o localStorage quando o estado 'isDarkMode' muda
    localStorage.setItem('valmetDashboardDarkMode', JSON.stringify(isDarkMode));

    // 2. Aplica a classe 'dark' no <html> para o CSS funcionar
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 3. ADICIONADO: Lógica para sincronizar entre abas
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'valmetDashboardDarkMode' && event.newValue !== null) {
        try {
          const newIsDark = JSON.parse(event.newValue);
          // Atualiza o estado deste contexto se o valor no localStorage mudar
          if (newIsDark !== isDarkMode) {
            setIsDarkMode(newIsDark);
          }
        } catch { /* empty */ }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Limpa o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, [isDarkMode]); // Roda este efeito sempre que 'isDarkMode' mudar

  const value = { isDarkMode, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};