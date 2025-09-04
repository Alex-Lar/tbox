import 'reflect-metadata';
import CreateTemplateOperation from '@core/template/operations/create-template-operation';
import { beforeEach, describe, expect, vi, it } from 'vitest';
import container from '@infrastructure/container/di-container';
import { simpleProjectStructureFixture } from '__tests__/fixtures/simple-project-structure';
import FastGlob from 'fast-glob';
import { getFastGlobStreamMock } from '__tests__/helpers';
import { fs, vol } from 'memfs';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path';
import { resolve } from 'node:path';

vi.mock('node:fs');
vi.mock('node:fs/promises');
vi.mock('fast-glob');

vi.mock('@infrastructure/file-system/paths/get-path', () => {
    return {
        getStoragePath: vi.fn(),
    };
});

// TODO: test force flag
// 	- template exists and force is false
//  - file copy error and force is true

// TODO: test invalid input values
// 	- invalid templateName
//	- invalid source paths
//	- invalid options

describe('CreateTemplateOperation Integration Suite', () => {
    let operation: CreateTemplateOperation;

    beforeEach(() => {
        vi.clearAllMocks();
        operation = container.resolve<CreateTemplateOperation>('CreateTemplateOperation');
    });

    describe('Simple structure', () => {
        const storagePath = '/home/.local/share/tb';
        const { globEntries, cwd, json, forSearch } = simpleProjectStructureFixture;

        beforeEach(() => {
            vol.reset();
            vol.fromJSON(json, cwd);
            fs.mkdirSync('/home/.local/share/', { recursive: true });

            vi.mocked(getStoragePath).mockImplementation(() => storagePath);
            vi.mocked(FastGlob.stream).mockImplementation(getFastGlobStreamMock(globEntries));

            vi.spyOn(process, 'cwd').mockReturnValue(cwd);
        });

        it('should create new template without base directory', async () => {
            const input = {
                templateName: 'new-template',
                source: ['./project/**'],
                options: {
                    base: false,
                    force: false,
                    recursive: false,
                    exclude: [],
                },
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(fs.existsSync(resolve(storagePath, input.templateName))).toBe(true);
            expect(fs.existsSync(resolve(storagePath, input.templateName, 'project'))).toBe(false);
            forSearch.forEach(path => {
                expect(fs.existsSync(resolve(storagePath, input.templateName, path))).toBe(true);
            });
        });

        it('should create new template with base directory', async () => {
            const input = {
                templateName: 'new-template',
                source: ['./project/**'],
                options: {
                    base: true,
                    force: false,
                    recursive: false,
                    exclude: [],
                },
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(fs.existsSync(resolve(storagePath, input.templateName))).toBe(true);
            expect(fs.existsSync(resolve(storagePath, input.templateName, 'project'))).toBe(true);
            forSearch.forEach(path => {
                const entry = resolve(storagePath, input.templateName, 'project', path);
                expect(fs.existsSync(entry)).toBe(true);
            });
        });

        it('should create new template with recursive set to true', async () => {
            const input = {
                templateName: 'new-template',
                source: ['./project'],
                options: {
                    base: false,
                    force: false,
                    recursive: true,
                    exclude: [],
                },
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(fs.existsSync(resolve(storagePath, input.templateName))).toBe(true);
            expect(fs.existsSync(resolve(storagePath, input.templateName, 'project'))).toBe(false);
            forSearch.forEach(path => {
                const entry = resolve(storagePath, input.templateName, path);
                expect(fs.existsSync(entry)).toBe(true);
            });
        });

        it('should overwrite old template with force set to true', async () => {
            const oldTemplate = 'old-template';
            vol.fromJSON(
                {
                    [resolve(storagePath, oldTemplate, 'file.txt')]: '.',
                    [resolve(storagePath, oldTemplate, 'dir/file.txt')]: '.',
                },
                cwd
            );

            const input = {
                templateName: oldTemplate,
                source: ['./project/**'],
                options: {
                    base: false,
                    force: true,
                    recursive: false,
                    exclude: [],
                },
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(fs.existsSync(resolve(storagePath, input.templateName))).toBe(true);
            expect(fs.existsSync(resolve(storagePath, input.templateName, 'project'))).toBe(false);

            forSearch.forEach(path => {
                const entry = resolve(storagePath, input.templateName, path);
                expect(fs.existsSync(entry)).toBe(true);
            });
        });
    });
});
