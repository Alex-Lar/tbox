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
        const destination = '/dest';

        beforeEach(() => {
            vi.clearAllMocks();
            vi.mocked(getStoragePath).mockImplementation(() => destination);
            vi.spyOn(process, 'cwd').mockImplementation(() => '/root');
        });

        it('Should resolve single target path for glob pattern source', () => {
            vi.spyOn(process, 'cwd').mockImplementation(() => '/root');
            const source = ['./project/**'];
            const destinationSubpath = 'subpath';
            const targetPath = '/root/project/dir';

            const result = new DestinationResolver(source, destination).resolve(targetPath, {
                destinationSubpath,
            });

            expect(result).toBe(join(destination, destinationSubpath, 'dir'));
        });

        it('Should resolve multiple target paths for single glob pattern source', () => {
            const source = ['./project/**'];
            const destinationSubpath = 'subpath';
            const targetPaths = [
                '/root/project/dir',
                '/root/project/nested/dir',
                '/root/project/very/nested/dir',
                '/root/project/another/dir/that/is/very/nested',
            ];
            const resolver = new DestinationResolver(source, destination);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve(targetPath, { destinationSubpath });
            });

            expect(result).toEqual([
                join(destination, destinationSubpath, 'dir'),
                join(destination, destinationSubpath, 'nested/dir'),
                join(destination, destinationSubpath, 'very/nested/dir'),
                join(destination, destinationSubpath, 'another/dir/that/is/very/nested'),
            ]);
        });

        it('Should resolve paths correctly for multiple source patterns', () => {
            const source = ['./project/**', './documents/*', './some/stuff/**/*'];
            const destinationSubpath = 'subpath';
            const targetPaths = [
                '/root/project/dir',
                '/root/project/another/dir/that/is/very/nested',
                '/root/some/stuff/very/nested/dir',
                '/root/documents/file.txt',
            ];
            const resolver = new DestinationResolver(source, destination);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve(targetPath, { destinationSubpath });
            });

            expect(result).toEqual([
                join(destination, destinationSubpath, 'dir'),
                join(destination, destinationSubpath, 'another/dir/that/is/very/nested'),
                join(destination, destinationSubpath, 'very/nested/dir'),
                join(destination, destinationSubpath, 'file.txt'),
            ]);
        });

        it('Should preserve last source subpath directory when preserveLastSourceDir is true', () => {
            const source = ['./project/**'];
            const destinationSubpath = 'subpath';
            const targetPath = '/root/project/dir';
            const resolver = new DestinationResolver(source, destination);

            const result = resolver.resolve(targetPath, {
                destinationSubpath,
                preserveLastSourceDir: true,
            });

            expect(result).toBe(join(destination, destinationSubpath, 'project', 'dir'));
        });

        it('Should preserve last directory for multiple sources with preserveLastSourceDir', () => {
            const source = ['./project/**', './documents/*', './some/stuff/**/*'];
            const destinationSubpath = 'subpath';
            const targetPaths = [
                '/root/project/dir',
                '/root/project/another/dir/that/is/very/nested',
                '/root/some/stuff/very/nested/dir',
                '/root/documents/file.txt',
            ];
            const resolver = new DestinationResolver(source, destination);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve(targetPath, {
                    destinationSubpath,
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

        it('Should handle explicit file sources differently that glob patterns with preserveLastSourceDir', () => {
            const source = ['./last-dir/**', './last-dir/file.txt'];
            const targetPaths = [
                '/root/last-dir/file.txt', // from explicit file source
                '/root/last-dir/nested/dir/file.txt', // from glob pattern
                '/root/last-dir/documents/file.txt', // from flob pattern
                '/root/last-dir/README.md', // from flob pattern
            ];
            const resolver = new DestinationResolver(source, destination);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve(targetPath, {
                    preserveLastSourceDir: true,
                });
            });

            expect(result).toEqual([
                join(destination, 'file.txt'),
                join(destination, 'last-dir/nested/dir/file.txt'),
                join(destination, 'last-dir/documents/file.txt'),
                join(destination, 'last-dir/README.md'),
            ]);
        });

        it('Should prioritize most specific pattern when multiple sources match with preserveLastSourceDir', () => {
            const source = ['./projects/**', './projects/utils/*', './projects/utils/helpers/**'];
            const destinationSubpath = 'subpath';
            const targetPaths = [
                '/root/projects/utils/helper.ts',
                '/root/projects/utils/helpers/array.ts',
                '/root/projects/app/main.ts',
                '/root/projects/package.json',
            ];
            const resolver = new DestinationResolver(source, destination);

            const result = targetPaths.map(targetPath => {
                return resolver.resolve(targetPath, {
                    destinationSubpath,
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
