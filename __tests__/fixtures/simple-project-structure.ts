import { GlobEntry } from '@core/file-system/entities';
import { mockDirentDir, mockDirentFile } from '__tests__/helpers';
import { join } from 'node:path';

const rootDir = '/home';
const relativeDir = './project';

const simpleProjectStructureFixture = {
    cwd: rootDir,
    json: {
        [`${relativeDir}/index.html`]: '.',
        [`${relativeDir}/assets/js/main.js`]: '.',
        [`${relativeDir}/assets/css/styles.css`]: '.',
    },
    forSearch: [
        'assets',
        'assets/js',
        'assets/js/main.js',
        'assets/css',
        'assets/css/styles.css',
        'index.html',
    ],
    globEntries: [
        {
            name: 'index.html',
            path: join(rootDir, relativeDir, 'index.html'),
            dirent: mockDirentFile(),
        },
        {
            name: 'assets',
            path: join(rootDir, relativeDir, 'assets'),
            dirent: mockDirentDir(),
        },
        {
            name: 'js',
            path: join(rootDir, relativeDir, 'assets/js'),
            dirent: mockDirentDir(),
        },
        {
            name: 'main.js',
            path: join(rootDir, relativeDir, 'assets/js/main.js'),
            dirent: mockDirentFile(),
        },
        {
            name: 'css',
            path: join(rootDir, relativeDir, 'assets/css'),
            dirent: mockDirentDir(),
        },
        {
            name: 'styles.css',
            path: join(rootDir, relativeDir, 'assets/css/styles.css'),
            dirent: mockDirentFile(),
        },
    ] as GlobEntry[],
} as const;

export { simpleProjectStructureFixture };
