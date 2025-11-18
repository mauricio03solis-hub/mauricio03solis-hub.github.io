// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Cambiar site al URL de tu repositorio GitHub Pages
  site: 'https://mauricio03solis-hub.github.io/',

  // Importante: base path para GitHub Pages
  base: '/',

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
