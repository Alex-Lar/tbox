import 'reflect-metadata';
import { beforeEach, describe, expect, vi, it } from 'vitest';
import container from '@infrastructure/container/di-container';
import { getSimpleStructureFixture } from '__tests__/fixtures/simple-structure';
import FastGlob from 'fast-glob';
import { getFastGlobStreamMock } from '__tests__/helpers';
import { fs, vol } from 'memfs';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path';
import { join, resolve } from 'node:path';
import GetTemplateOperation from '@core/template/operations/get-template-operation';
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
// - test rollback handler (when `TemplateCopier.copyTemplate` throws error)
// - test invalid input (templateName, destination)

describe('GetTemplateOperation Integration Suite', () => {
    let operation: GetTemplateOperation;

    container.register('LoaderService', {
        useValue: new StubLoaderService(),
    });

    beforeEach(() => {
        vi.clearAllMocks();
        operation = container.resolve<GetTemplateOperation>('GetTemplateOperation');
    });

    describe('Simple structure', () => {
        const templateName = 'test-template';
        const fixture = getSimpleStructureFixture({
            isTemplate: true,
            templateName,
        });

        const storagePath = fixture.storagePath;

        beforeEach(() => {
            vol.reset();
            vol.fromJSON(fixture.memfsStructure, fixture.memfsCwd);

            vi.mocked(getStoragePath).mockImplementation(() => storagePath);
            vi.mocked(FastGlob.stream).mockImplementation(
                getFastGlobStreamMock(fixture.globEntries)
            );

            vi.spyOn(process, 'cwd').mockReturnValue(fixture.memfsCwd);
        });

        it('should extract template without specifying the destination path (by default destination resolves to cwd)', async () => {
            const input = {
                templateName,
                destination: fixture.userCwd,
            } as const;

            await expect(operation.execute(input)).resolves.toBeUndefined();

            fixture.expectedRelativePaths.forEach(path => {
                expect(fs.existsSync(resolve(input.destination, path))).toBe(true);
            });
        });

        it('should extract template with the user-specified destination path', async () => {
            const input = {
                templateName,
                destination: join(fixture.userCwd, 'nested/dest/dir'),
            } as const;

            await expect(operation.execute(input)).resolves.toBeUndefined();

            fixture.expectedRelativePaths.forEach(path => {
                expect(fs.existsSync(resolve(input.destination, path))).toBe(true);
            });
        });
    });
});
