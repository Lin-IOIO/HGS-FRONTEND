import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      componentes: path.resolve(__dirname, 'src/componentes'),
      contexto: path.resolve(__dirname, 'src/contexto'),
      apis: path.resolve(__dirname, 'src/apis'),
      hooks: path.resolve(__dirname, 'src/hooks')
    }
  },
  plugins: [react()],
})
