import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PixiFlex',
      // the proper extensions will be added
      fileName: 'pixi-flex',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['pixi.js'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          'pixi.js': 'PIXI',
        },
      },
    },
  },
  plugins: [dts({ rollupTypes: true })]
})
