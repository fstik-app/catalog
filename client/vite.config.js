import path from 'path';
import fs from 'fs';

import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';

import packageJson from './package.json';


const WRONG_CODE = 'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";';

export default defineConfig({
  plugins: [
    reactVirtualized(),
    svgr(),
    react({
      babel: {
        plugins: ['effector/babel-plugin'],
      },
    }),
    eslint(),
    splitVendorChunkPlugin(),
  ],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks (id) {
          // creating a chunk to @open-ish deps. Reducing the vendor chunk size
          if (id.includes('swiper')) {
            return 'swiper';
          }
        },
      },
    },
  },
  // worker: {
  //   format: 'iife',
  // },
  // server: {
  //   port: 3000,
  //   // hmr: false,
  //   // cors: {
  //   //   origin: 'http://10.0.0.15:8080',
  //   // },
  //   proxy: {
  //     '/styles': {
  //       target: 'http://10.0.0.15:8080',
  //       changeOrigin: true,
  //     },
  //     '/data': {
  //       target: 'http://10.0.0.15:8080',
  //       changeOrigin: true,
  //     },
  //   },
  // },
});

function reactVirtualized () {
  return {
    name: 'flat:react-virtualized',
    // Note: we cannot use the `transform` hook here
    //       because libraries are pre-bundled in vite directly,
    //       plugins aren't able to hack that step currently.
    //       so instead we manually edit the file in node_modules.
    //       all we need is to find the timing before pre-bundling.
    configResolved () {
      const file = require
        .resolve('react-virtualized')
        .replace(
          path.join('dist', 'commonjs', 'index.js'),
          path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js'),
        );
      const code = fs.readFileSync(file, 'utf8');
      const modified = code.replace(WRONG_CODE, '');

      fs.writeFileSync(file, modified);
    },
  };
}
