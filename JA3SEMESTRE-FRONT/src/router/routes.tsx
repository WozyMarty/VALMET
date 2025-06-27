// src/router/routes.tsx
import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Páginas Públicas e de Autenticação
import LoginPage from "@/pages/LoginPage";
import PublicRoute from "@/components/PublicRoute";

// Layout de Proteção e Páginas Protegidas
import AuthLayout from "@/components/AuthLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
// 2. MODIFICADO: Importe as páginas que serão carregadas preguiçosamente com 'lazy'
const HomePage = lazy(() => import("@/pages/home/HomePage").then(module => ({ default: module.HomePage })));
const GanttPage = lazy(() => import("@/pages/DayShop/GanttPage"));
const Status = lazy(() => import("@/pages/StatusPage/status").then(module => ({ default: module.Status })));
const Configuracao = lazy(() => import("@/pages/Configurações/Configuracao"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const InviteUserPage = lazy(() => import("@/pages/Admin/InviteUserPage"));
const MapasLayout = lazy(() => import("@/pages/MapaGeral/MapaLayout").then(module => ({ default: module.MapasLayout })));
const MapaComponent = lazy(() => import("@/pages/MapaGeral").then(module => ({ default: module.MapaComponent })));
const LayoutUsinagem = lazy(() => import("@/pages/home/views").then(module => ({ default: module.LayoutUsinagem })));
const LayoutMontagem = lazy(() => import("@/pages/home/views").then(module => ({ default: module.LayoutMontagem })));
const LayoutProducao = lazy(() => import("@/pages/home/views").then(module => ({ default: module.LayoutProducao })));
const LayoutDeposito = lazy(() => import("@/pages/home/views").then(module => ({ default: module.LayoutDeposito })));
const ResponsiveHomePage = lazy(() => import("@/pages/home/ResponsiveHomePage"));


export function AppRoutes() {
  return (
    <Routes>
      {/* ROTA DE LOGIN */}
      <Route
        path="/login"
        element={<PublicRoute element={<LoginPage />} />}
      />
      
      <Route element={<ProtectedRoute adminOnly />}>
    <Route path="/admin/invite-user" element={<InviteUserPage />} />
    {/* Outras rotas de admin aqui */}
    </Route>

      {/* ROTA RAIZ */}
      <Route path="/" element={<Navigate to="/home" replace />} />


      {/* ROTAS PROTEGIDAS */}
      <Route element={<AuthLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/hometest" element={<ResponsiveHomePage />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* <--- ADICIONE A ROTA AQUI */}
        <Route path="/gantt" element={<GanttPage />} />
        <Route path="/status" element={<Status />} />

        {/* Rotas Mapas */}
        <Route path="/mapas" element={<MapasLayout />}>
          <Route index element={<MapaComponent />} />
        </Route>

        {/* Rotas Layouts Específicos */}
        <Route path="/tela-usinagem" element={<LayoutUsinagem />} />
        <Route path="/tela-montagem" element={<LayoutMontagem />} />
        <Route path="/tela-producao" element={<LayoutProducao />} />
        <Route path="/tela-deposito" element={<LayoutDeposito />} />

        {/* Rota Configurações */}
        <Route path="/configuracoes" element={<Configuracao />} />
      </Route>

      {/* ROTA 404 */}
      <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-2xl font-bold">404 - Página Não Encontrada</h1>
          </div>
        }
      />
    </Routes>
  );
}