// Em src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Verifique o caminho

// 1. Definimos as propriedades que o componente pode receber
interface ProtectedRouteProps {
  adminOnly?: boolean; // A propriedade é opcional
}

// 2. O componente agora aceita as props
const ProtectedRoute = ({ adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
      return <div>Carregando...</div>;
  }

  // 3. Se não estiver autenticado, sempre redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 4. Se a rota exige admin, mas o usuário não é admin, redireciona para a página principal
  //    Isso impede que um usuário "Membro" acesse as rotas de admin.
  if (adminOnly && user?.role !== 'Admin') {
    return <Navigate to="/" replace />; // Redireciona para o dashboard/home
  }

  // Se passou por todas as verificações, renderiza a página solicitada
  return <Outlet />;
};

export default ProtectedRoute;