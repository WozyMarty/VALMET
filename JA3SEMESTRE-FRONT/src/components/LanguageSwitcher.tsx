import { useLanguage } from '@/contexts/LanguageContext'; // Ajuste o caminho se necessário
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import './LanguageSwitcher.css';

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

// Mapeamento de idiomas para nome e caminho do ícone
const localeConfig = {
    PtBr: { name: 'Português', iconSrc: '/images/flag-icon-PT.svg' },
    En:   { name: 'English',   iconSrc: '/images/flag-icon-EN.svg' },
    Es:   { name: 'Español',   iconSrc: '/images/flag-icon-ES.svg' },
};

export function LanguageSwitcher() {
    const { locale, changeLocale } = useLanguage();

     return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* O botão usa a classe CSS customizada e aponta para o seu ícone de globo */}
                <button className="lang-switcher-btn">
                    <img 
                        src={'/images/Trad-icon.svg'} 
                        alt="Ícone de tradução"
                    />
                    <span className="sr-only">Trocar Idioma - {localeConfig[locale].name}</span>
                </button>
            </DropdownMenuTrigger>
            
            {/* O menu também usa a classe CSS customizada para um visual sólido e integrado */}
            <DropdownMenuContent align="end" className="lang-switcher-menu">
                
                {/* LÓGICA CORRIGIDA: O .map() agora renderiza uma única bandeira por item */}
                {(Object.keys(localeConfig) as Array<keyof typeof localeConfig>).map((key) => {
                    const { name, iconSrc } = localeConfig[key];
                    return (
                        <DropdownMenuItem
                            key={key}
                            onClick={() => changeLocale(key)}
                            className="lang-switcher-item" // Classe para estilização de cada item
                        >
                            {/* Usa o caminho do ícone correto para cada idioma */}
                            <img 
                                src={iconSrc} 
                                alt={`Bandeira para ${name}`}
                            />
                            <span className="flex-grow">{name}</span>
                            {/* Mostra o ícone de "check" se o idioma estiver ativo */}
                            {locale === key && <CheckIcon className="ml-auto h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
