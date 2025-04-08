import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'react': 'src/react.tsx',
  },
  format: ['esm', 'cjs'],
  dts: false,
  clean: true,
  splitting: false,
  external: ['react', 'react-dom'],
  outDir: 'dist',
}); 