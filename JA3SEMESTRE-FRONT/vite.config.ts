// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Configuração de alias para o diretório 'src'
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
  // Configuração do servidor de desenvolvimento
  server: {
    host: true,
    port: 5000, // <--- Defina sua porta personalizada aqui (ex: 3000, 8080, 5000)
    open: false, // <--- Desabilita a abertura automática do navegador
    cors: true,
  },
});
