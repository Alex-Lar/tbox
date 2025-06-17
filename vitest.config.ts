import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'istanbul',
        },
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, './src'),
            '@tests': path.resolve(__dirname, './tests'),
        },
    },
});
