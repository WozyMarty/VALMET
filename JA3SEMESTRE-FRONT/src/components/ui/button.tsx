import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/lib/button-variants";

// Definição da interface de props para o componente Button
// É importante que esta interface seja exportada se outros componentes a usarem
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// O componente Button usando React.forwardRef
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => { // <-- 'ref' é o segundo parâmetro aqui
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref} // <-- O REF É PASSADO PARA O COMPONENTE RENDERIZADO
        {...props}
      />
    )
  }
)

Button.displayName = "Button" // Adiciona um nome de exibição para o React DevTools

export { Button}
