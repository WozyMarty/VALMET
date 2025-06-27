// src/App.tsx (VERSÃO FINAL)

import { Suspense } from 'react'; // Importe Suspense
import { AppRoutes } from './router/routes';
import { Toaster } from 'sonner';
import { SessionExpireModal } from '@/components/SessionExpireModal';
import { GlobalErrorModal } from '@/components/GlobalErrorModal';

// O loader pode ser definido aqui ou importado
const PageLoader = () => (
    <div className="flex h-screen w-full items-center justify-center">
        <p className="text-xl font-semibold text-white">Carregando...</p>
    </div>
);


function App() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow overflow-auto">
        {/* Envolva APENAS o AppRoutes com Suspense */}
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>

        {/* Modais e Toasters ficam fora do Suspense para não serem afetados */}
        <Toaster richColors position="top-right" />
        <SessionExpireModal /> 
        <GlobalErrorModal />
      </main>
    </div>
  );
}

export default App;