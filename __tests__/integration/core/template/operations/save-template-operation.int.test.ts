import 'reflect-metadata';
import SaveTemplateOperation from '@core/template/operations/save-template-operation';
import { beforeEach, describe, expect, vi, it } from 'vitest';
import container from '@infrastructure/container/di-container';
import { getSimpleStructureFixture } from '__tests__/fixtures/simple-structure';
import FastGlob from 'fast-glob';
import { getFastGlobStreamMock, mockSaveOptions } from '__tests__/helpers';
import { fs, vol } from 'memfs';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path';
import { resolve } from 'node:path';
import { StubLoaderService } from '@infrastructure/loader/stub-loader-service';

vi.mock('node:fs');
vi.mock('node:fs/promises');
vi.mock('fast-glob');

vi.mock('@infrastructure/file-system/paths/get-path', () => {
    return {
        getStoragePath: vi.fn(),
    };
});

// TODO:
// 	- test force flag
// 	- test invalid input

describe('SaveTemplateOperation Integration Suite', () => {
    let operation: SaveTemplateOperation;

    const templateName = 'test-template';
    const fixture = getSimpleStructureFixture({ isTemplate: false, templateName });
    const storagePath = fixture.storagePath;

    container.register('LoaderService', {
        useValue: new StubLoaderService(),
    });

    beforeEach(() => {
        vi.clearAllMocks();

        operation = container.resolve<SaveTemplateOperation>('SaveTemplateOperation');

        vol.reset();
        vol.fromJSON(fixture.memfsStructure, fixture.memfsCwd);
        fs.mkdirSync('/home/.local/share', { recursive: true });

        vi.mocked(getStoragePath).mockImplementation(() => storagePath);
        vi.mocked(FastGlob.stream).mockImplementation(getFastGlobStreamMock(fixture.globEntries));

        vi.spyOn(process, 'cwd').mockReturnValue(fixture.memfsCwd);
    });

    describe('default behavior', () => {
        it('should create new template without base directory', async () => {
            const input = {
                templateName,
                source: ['./project/**'],
                options: mockSaveOptions(),
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(fs.existsSync(resolve(storagePath, input.templateName))).toBe(true);
            expect(fs.existsSync(resolve(storagePath, input.templateName, 'project'))).toBe(false);

            fixture.expectedRelativePaths.forEach(path => {
                expect(fs.existsSync(resolve(storagePath, input.templateName, path))).toBe(true);
            });
        });
    });

    describe('--force flag behavior', () => {
        it('should overwrite old template with force set to true', async () => {
            vol.fromJSON(
                {
                    [resolve(storagePath, templateName, 'file.txt')]: '.',
                    [resolve(storagePath, templateName, 'dir/file.txt')]: '.',
                },
                fixture.memfsCwd
            );

            const input = {
                templateName,
                source: ['./project/**'],
                options: mockSaveOptions({ force: true }),
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(fs.existsSync(resolve(storagePath, input.templateName))).toBe(true);
            expect(fs.existsSync(resolve(storagePath, input.templateName, 'project'))).toBe(false);

            fixture.expectedRelativePaths.forEach(path => {
                const entry = resolve(storagePath, input.templateName, path);
                expect(fs.existsSync(entry)).toBe(true);
            });
        });
    });

    describe('--recursive flag behavior', () => {
        it('should process directories recursively when --recursive flag is set', async () => {
            const input = {
                templateName,
                source: ['./project'],
                options: mockSaveOptions({ recursive: true }),
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(fs.existsSync(resolve(storagePath, input.templateName))).toBe(true);
            expect(fs.existsSync(resolve(storagePath, input.templateName, 'project'))).toBe(false);

            fixture.expectedRelativePaths.forEach(path => {
                const entry = resolve(storagePath, input.templateName, path);
                expect(fs.existsSync(entry)).toBe(true);
            });
        });
    });

    describe('--preserveLastDir flag behavior', () => {
        it('should create new template with explicit file source', async () => {
            const input = {
                templateName,
                source: ['./project/**', './project/index.html'],
                options: mockSaveOptions({ preserveLastDir: true }),
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(fs.existsSync(resolve(storagePath, input.templateName))).toBe(true);
            expect(fs.existsSync(resolve(storagePath, input.templateName, 'project'))).toBe(true);

            fixture.expectedRelativePaths.forEach(path => {
                if (path !== 'index.html') {
                    const entry = resolve(storagePath, input.templateName, 'project', path);
                    expect(fs.existsSync(entry)).toBe(true);
                }

                if (path === 'index.html') {
                    const entry = resolve(storagePath, input.templateName, path);
                    expect(fs.existsSync(entry)).toBe(true);
                }
            });
        });

        it('should create new template and preserve last directory from source', async () => {
            const input = {
                templateName,
                source: ['./project/**'],
                options: mockSaveOptions({ preserveLastDir: true }),
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(fs.existsSync(resolve(storagePath, input.templateName))).toBe(true);
            expect(fs.existsSync(resolve(storagePath, input.templateName, 'project'))).toBe(true);

            fixture.expectedRelativePaths.forEach(path => {
                const entry = resolve(storagePath, input.templateName, 'project', path);
                expect(fs.existsSync(entry)).toBe(true);
            });
        });
    });
});
