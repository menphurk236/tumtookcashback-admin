import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      react({
        babel: {
          // plugins: ["macros"],
        },
      }),
      {
        ...eslint(),
        apply: 'build',
      },
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), './src/assets/icons')],
      }),
      svgr(),
    ],
    optimizeDeps: {
      include: ['react/jsx-runtime'],
      exclude: [],
    },
    // server: {
    //   host: true,
    //   strictPort: true,
    //   port: 3000
    // }
  })
}
