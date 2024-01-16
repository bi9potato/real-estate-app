import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0',  // 添加这一行
    
    proxy: {
      '/api':
      {
        // target: 'http://localhost:3000',
        target: 'http://server:3000',
        secure: false,
      },
    },
  },


  plugins: [react()],
});
