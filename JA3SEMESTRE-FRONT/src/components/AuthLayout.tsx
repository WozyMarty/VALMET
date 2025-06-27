// src/components/AuthLayout.tsx (VERSÃO FINAL E À PROVA DE FALHAS)

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
// Não precisamos mais do useTheme aqui, o que torna o componente mais simples

const AuthLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Lemos o tema diretamente do DOM para ser à prova de falhas de timing.
    const isCurrentlyDark = document.documentElement.classList.contains('dark');

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        height: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        // Aplica a cor de fundo correta baseada na leitura direta do DOM
        backgroundColor: isCurrentlyDark ? '#111827' : '#f3f4f6', 
    };

    const textStyle: React.CSSProperties = {
        fontSize: '1.25rem',
        fontWeight: '600',
        // Aplica a cor de texto correta
        color: isCurrentlyDark ? '#d1d5db' : '#1f2937',
    };

    return (
      <div style={containerStyle}>
        <p style={textStyle}>
          Verificando sessão...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Uma vez autenticado, ele renderiza as rotas filhas normalmente.
  return <Outlet />;
};

export default AuthLayout;