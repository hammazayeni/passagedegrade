import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(({ mode }) => ({
  base: '/Taekwondo-Ptomotion-Test/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['robots.txt'],
      manifest: {
        name: 'Taekwondo Sbeitla',
        short_name: 'Sbeitla',
        start_url: '/Taekwondo-Ptomotion-Test/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#dc2626',
        description: 'Gestion des examens de passage et affichage en projection',
        icons: [
          { src: 'assets/logos/kukkiwon.png', sizes: '180x180', type: 'image/png' },
          { src: 'assets/logos/kukkiwon.png', sizes: '192x192', type: 'image/png' },
          { src: 'assets/logos/kukkiwon.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
