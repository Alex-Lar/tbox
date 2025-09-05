import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'node18',
  format: 'esm',
  outExtension: () => ({ js: '.mjs' }),
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  treeshake: true,
  esbuildOptions(options) {
    options.banner = {
      js: `import 'reflect-metadata';`,
    };
  },
});
