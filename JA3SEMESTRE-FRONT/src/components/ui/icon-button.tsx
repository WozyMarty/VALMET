// Em src/components/ui/icon-button.tsx

import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button'; // Importa o botão base

import { cn } from '@/lib/utils';
// Define as props que nosso novo componente aceitará
interface IconButtonProps extends ButtonProps {
    tooltip: string;
    children: React.ReactNode;
    className?: string;
}

export const IconButton = ({ tooltip, children, className, ...props }: IconButtonProps) => {
    return (
        // Usamos o atributo 'title' para o tooltip nativo e limpo
        <Button
            variant="ghost"
            size="icon"
            title={tooltip} 
            // Usamos 'cn' para mesclar as classes padrão com quaisquer outras que você passar
            className={cn(
                "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700",
                className
            )}
            {...props}
        >
            {children}
            <span className="sr-only">{tooltip}</span>
        </Button>
    );
};