import { GlobEntry } from '@core/file-system/entities';
import { mockDirentDir, mockDirentFile } from '__tests__/helpers';
import { join } from 'node:path';

type SimpleFixtureProps = {
    isTemplate?: boolean;
    templateName?: string;
};

export function getSimpleStructureFixture({
    isTemplate = false,
    templateName = 'test-template',
}: SimpleFixtureProps = {}) {
    // User project paths
    const userProjectRoot = '/home';
    const userProjectRelativePath = './project';

    // Storage paths
    const templateStorageRoot = '/root/.local/share';
    const templateStorageRelativePath = './tbox';
    const storagePath = join(templateStorageRoot, templateStorageRelativePath);

    // Final Paths
    const relativePath = isTemplate
        ? // => "./tb/test-template",
          join(templateStorageRelativePath, templateName)
        : // => "./project"
          userProjectRelativePath;

    const rootPath = isTemplate
        ? // => "/root/.local/share";
          templateStorageRoot
        : // => "/home"
          userProjectRoot;

    return {
        templateName,
        storagePath,
        userCwd: userProjectRoot,
        memfsCwd: rootPath,
        memfsStructure: {
            [`${relativePath}/index.html`]: '.',
            [`${relativePath}/assets/js/main.js`]: '.',
            [`${relativePath}/assets/css/styles.css`]: '.',
        },
        expectedRelativePaths: [
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
                path: join(rootPath, relativePath, 'index.html'),
                dirent: mockDirentFile(),
            },
            {
                name: 'assets',
                path: join(rootPath, relativePath, 'assets'),
                dirent: mockDirentDir(),
            },
            {
                name: 'js',
                path: join(rootPath, relativePath, 'assets/js'),
                dirent: mockDirentDir(),
            },
            {
                name: 'main.js',
                path: join(rootPath, relativePath, 'assets/js/main.js'),
                dirent: mockDirentFile(),
            },
            {
                name: 'css',
                path: join(rootPath, relativePath, 'assets/css'),
                dirent: mockDirentDir(),
            },
            {
                name: 'styles.css',
                path: join(rootPath, relativePath, 'assets/css/styles.css'),
                dirent: mockDirentFile(),
            },
        ] as GlobEntry[],
    } as const;
}
