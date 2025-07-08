import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2018',
  minify: false,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.js'
    };
  }
});
