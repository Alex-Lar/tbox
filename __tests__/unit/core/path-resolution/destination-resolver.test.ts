import DestinationResolver from '@core/path-resolution/services/destination-resolver';
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
        const destination = '/root/.local/share/tb';

        beforeEach(() => {
            vi.clearAllMocks();
            vi.mocked(getStoragePath).mockImplementation(() => destination);
            vi.spyOn(process, 'cwd').mockImplementation(() => '/root');
        });

        it('Should resolve target path correctly with one source', () => {
            vi.spyOn(process, 'cwd').mockImplementation(() => '/root');
            const source = ['./project/**'];
            const destinationSubpath = 'my-template';
            const targetPath = '/root/project/dir';

            const result = new DestinationResolver(source, destination).resolve({
                destinationSubpath,
                targetPath,
            });

            expect(result).toBe(join(destination, destinationSubpath, 'dir'));
        });

        it('Should resolve many target paths correctly with one source', () => {
            const source = ['./project/**'];
            const destinationSubpath = 'my-template';
            const targetPaths = [
                '/root/project/dir',
                '/root/project/nested/dir',
                '/root/project/very/nested/dir',
                '/root/project/another/dir/that/is/very/nested',
            ];
            const resolver = new DestinationResolver(source, destination);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve({ destinationSubpath, targetPath });
            });

            expect(result).toEqual([
                join(destination, destinationSubpath, 'dir'),
                join(destination, destinationSubpath, 'nested/dir'),
                join(destination, destinationSubpath, 'very/nested/dir'),
                join(destination, destinationSubpath, 'another/dir/that/is/very/nested'),
            ]);
        });

        it('Should resolve many target paths correctly with many source paths', () => {
            const source = ['./project/**', './documents/*', './some/stuff/**/*'];
            const destinationSubpath = 'my-template';
            const targetPaths = [
                '/root/project/dir',
                '/root/project/another/dir/that/is/very/nested',
                '/root/some/stuff/very/nested/dir',
                '/root/documents/file.txt',
            ];
            const resolver = new DestinationResolver(source, destination);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve({ destinationSubpath, targetPath });
            });

            expect(result).toEqual([
                join(destination, destinationSubpath, 'dir'),
                join(destination, destinationSubpath, 'another/dir/that/is/very/nested'),
                join(destination, destinationSubpath, 'very/nested/dir'),
                join(destination, destinationSubpath, 'file.txt'),
            ]);
        });

        it('Should resolve target path correctly with includeSourceBase flag set to true', () => {
            const source = ['./project/**'];
            const destinationSubpath = 'my-template';
            const targetPath = '/root/project/dir';
            const resolver = new DestinationResolver(source, destination);

            const result = resolver.resolve({
                destinationSubpath,
                targetPath,
                preserveLastSourceDir: true,
            });

            expect(result).toBe(join(destination, destinationSubpath, 'project', 'dir'));
        });

        it('Should resolve many target paths correctly with many source paths and with includeSourceBase flag set to true', () => {
            const source = ['./project/**', './documents/*', './some/stuff/**/*'];
            const destinationSubpath = 'my-template';
            const targetPaths = [
                '/root/project/dir',
                '/root/project/another/dir/that/is/very/nested',
                '/root/some/stuff/very/nested/dir',
                '/root/documents/file.txt',
            ];
            const resolver = new DestinationResolver(source, destination);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve({
                    destinationSubpath,
                    targetPath,
                    preserveLastSourceDir: true,
                });
            });

            expect(result).toEqual([
                join(destination, destinationSubpath, 'project/dir'),
                join(destination, destinationSubpath, 'project/another/dir/that/is/very/nested'),
                join(destination, destinationSubpath, 'stuff/very/nested/dir'),
                join(destination, destinationSubpath, 'documents/file.txt'),
            ]);
        });

        it('Should resolve many target paths correctly with colliding source paths and includeSourceBase flag set to true', () => {
            const source = ['./projects/**', './projects/utils/*', './projects/utils/helpers/**'];
            const destinationSubpath = 'my-template';
            const targetPaths = [
                '/root/projects/utils/helper.ts',
                '/root/projects/utils/helpers/array.ts',
                '/root/projects/app/main.ts',
                '/root/projects/package.json',
            ];
            const resolver = new DestinationResolver(source, destination);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve({
                    destinationSubpath,
                    targetPath,
                    preserveLastSourceDir: true,
                });
            });

            expect(result).toEqual([
                join(destination, destinationSubpath, 'utils', 'helper.ts'),
                join(destination, destinationSubpath, 'helpers', 'array.ts'),
                join(destination, destinationSubpath, 'projects', 'app/main.ts'),
                join(destination, destinationSubpath, 'projects', 'package.json'),
            ]);
        });
    });
});
