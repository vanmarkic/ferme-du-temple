import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Replace 'yourusername' with your GitHub username
// Use base: '/ferme-du-temple' for GitHub Pages deployment
export default defineConfig({
  site: process.env.NETLIFY_DEPLOY ? 'https://ferme-du-temple.netlify.app' : 'https://vanmarkic.github.io',
  base: process.env.NETLIFY_DEPLOY ? '/' : (process.env.NODE_ENV === 'production' ? '/ferme-du-temple' : '/'),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
