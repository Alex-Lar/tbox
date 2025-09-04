import DestinationResolver from '@core/template/services/destination-resolver';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path';
import { join } from 'node:path';

vi.mock('@infrastructure/file-system/paths/get-path', () => {
    return {
        getStoragePath: vi.fn(),
    };
});

describe('DestinationResolver', () => {
    describe('resolve()', () => {
        const storagePath = '/root/.local/share/tb';

        beforeEach(() => {
            vi.clearAllMocks();
            vi.mocked(getStoragePath).mockImplementation(() => storagePath);
            vi.spyOn(process, 'cwd').mockImplementation(() => '/root');
        });

        it('Should resolve target path correctly with one source', () => {
            vi.spyOn(process, 'cwd').mockImplementation(() => '/root');
            const source = ['./project/**'];
            const basePath = 'my-template';
            const targetPath = '/root/project/dir';

            const result = new DestinationResolver(source).resolve({
                basePath,
                targetPath,
            });

            expect(result).toBe(join(storagePath, basePath, 'dir'));
        });

        it('Should resolve many target paths correctly with one source', () => {
            const source = ['./project/**'];
            const basePath = 'my-template';
            const targetPaths = [
                '/root/project/dir',
                '/root/project/nested/dir',
                '/root/project/very/nested/dir',
                '/root/project/another/dir/that/is/very/nested',
            ];
            const resolver = new DestinationResolver(source);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve({ basePath, targetPath });
            });

            expect(result).toEqual([
                join(storagePath, basePath, 'dir'),
                join(storagePath, basePath, 'nested/dir'),
                join(storagePath, basePath, 'very/nested/dir'),
                join(storagePath, basePath, 'another/dir/that/is/very/nested'),
            ]);
        });

        it('Should resolve many target paths correctly with many source paths', () => {
            const source = ['./project/**', './documents/*', './some/stuff/**/*'];
            const basePath = 'my-template';
            const targetPaths = [
                '/root/project/dir',
                '/root/project/another/dir/that/is/very/nested',
                '/root/some/stuff/very/nested/dir',
                '/root/documents/file.txt',
            ];
            const resolver = new DestinationResolver(source);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve({ basePath, targetPath });
            });

            expect(result).toEqual([
                join(storagePath, basePath, 'dir'),
                join(storagePath, basePath, 'another/dir/that/is/very/nested'),
                join(storagePath, basePath, 'very/nested/dir'),
                join(storagePath, basePath, 'file.txt'),
            ]);
        });

        it('Should resolve target path correctly with includeSourceBase flag set to true', () => {
            const source = ['./project/**'];
            const basePath = 'my-template';
            const targetPath = '/root/project/dir';
            const resolver = new DestinationResolver(source);

            const result = resolver.resolve({ basePath, targetPath, includeSourceBase: true });

            expect(result).toBe(join(storagePath, basePath, 'project', 'dir'));
        });

        it('Should resolve many target paths correctly with many source paths and with includeSourceBase flag set to true', () => {
            const source = ['./project/**', './documents/*', './some/stuff/**/*'];
            const basePath = 'my-template';
            const targetPaths = [
                '/root/project/dir',
                '/root/project/another/dir/that/is/very/nested',
                '/root/some/stuff/very/nested/dir',
                '/root/documents/file.txt',
            ];
            const resolver = new DestinationResolver(source);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve({ basePath, targetPath, includeSourceBase: true });
            });

            expect(result).toEqual([
                join(storagePath, basePath, 'project/dir'),
                join(storagePath, basePath, 'project/another/dir/that/is/very/nested'),
                join(storagePath, basePath, 'stuff/very/nested/dir'),
                join(storagePath, basePath, 'documents/file.txt'),
            ]);
        });

        it('Should resolve many target paths correctly with colliding source paths and includeSourceBase flag set to true', () => {
            const source = ['./projects/**', './projects/utils/*', './projects/utils/helpers/**'];
            const basePath = 'my-template';
            const targetPaths = [
                '/root/projects/utils/helper.ts',
                '/root/projects/utils/helpers/array.ts',
                '/root/projects/app/main.ts',
                '/root/projects/package.json',
            ];
            const resolver = new DestinationResolver(source);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve({ basePath, targetPath, includeSourceBase: true });
            });

            expect(result).toEqual([
                join(storagePath, basePath, 'utils', 'helper.ts'),
                join(storagePath, basePath, 'helpers', 'array.ts'),
                join(storagePath, basePath, 'projects', 'app/main.ts'),
                join(storagePath, basePath, 'projects', 'package.json'),
            ]);
        });
    });
});
