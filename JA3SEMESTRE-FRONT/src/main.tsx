// No SEU arquivo src/main.tsx
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Se estiver usando router
import App from './App'; // O SEU App principal
import '@bryntum/gantt/gantt.stockholm.css';
import './styles/overrides.scss';
import './styles/index.css'; // Estilos globais, se necessário
import { LocaleManager } from '@bryntum/gantt'; // ou @bryntum/gantt-react? Verifique a doc.
import { AuthProvider } from './contexts/AuthContext'; // Importe o AuthProvider
import './pages/DayShop/locales/gantt.locale.PtBr'; 
import './pages/DayShop/locales/gantt.locale.En';    // Inglês
import './pages/DayShop/locales/gantt.locale.Es';    // Espanhol
import { ErrorProvider } from '@/contexts/ErrorContext'; // Importe a versão do Canvas
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';


LocaleManager.applyLocale('PtBr');


ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <ThemeProvider>
      {/* O LanguageProvider deve envolver todos os componentes que usarão o hook useLanguage */}
      <LanguageProvider>
        <AuthProvider>
          <ErrorProvider>
            <App />
          </ErrorProvider>
        </AuthProvider>
      </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
);