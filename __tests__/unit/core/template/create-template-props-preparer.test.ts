import { CreateTemplatePropsPreparer } from '@core/template/utils/props-preparer/create-template-props-preparer';
import * as fileSystem from '@shared/utils/file-system';
import { mockCreateTemplateProps } from '__tests__/helpers';
import { PathLike } from 'node:fs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('CreateTemplatePropsPreparer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('prepare()', () => {
        beforeEach(() => {
            vi.spyOn(fileSystem, 'isDirSync').mockImplementation(() => true);
        });

        it('should convert simple dir paths to recursive glob patterns when recursive is true', () => {
            vi.spyOn(fileSystem, 'isDirSync').mockImplementation((path: PathLike) => {
                return ['dir1/', 'dir2'].some(el => el === path);
            });
            const props = mockCreateTemplateProps({
                source: ['dir1/', 'dir2', 'dir3/*', 'file.txt', '.file'],
                options: { recursive: true },
            });

            const result = CreateTemplatePropsPreparer.prepare(props);

            expect(result.source).toEqual(['dir1/**', 'dir2/**', 'dir3/*', 'file.txt', '.file']);
        });

        it('should convert simple dir paths to glob patterns when recursive is false', () => {
            vi.spyOn(fileSystem, 'isDirSync').mockImplementation((path: PathLike) => {
                return ['dir1/', 'dir2'].some(el => el === path);
            });
            const props = mockCreateTemplateProps({
                source: ['dir1/', 'dir2', 'dir3/*', 'file.txt', '.file'],
                options: { recursive: false },
            });

            const result = CreateTemplatePropsPreparer.prepare(props);

            expect(result.source).toEqual(['dir1/*', 'dir2/*', 'dir3/*', 'file.txt', '.file']);
        });

        it('should convert simple exclude paths to recursive glob patterns', () => {
            const props = mockCreateTemplateProps({
                options: {
                    exclude: ['node_modules', 'dist'],
                },
            });

            const result = CreateTemplatePropsPreparer.prepare(props);

            expect(result.options.exclude).toEqual([
                '**/node_modules/**',
                '**/node_modules',
                '**/dist/**',
                '**/dist',
            ]);
        });

        it('should keep paths with specific path notations unchanged', () => {
            const props = mockCreateTemplateProps({
                options: {
                    exclude: ['./node_modules', '/dist', '/dist/dir', 'dir/*'],
                },
            });

            const result = CreateTemplatePropsPreparer.prepare(props);

            expect(result.options.exclude).toEqual([
                './node_modules',
                '/dist',
                '/dist/dir',
                'dir/*',
            ]);
        });
    });
});
