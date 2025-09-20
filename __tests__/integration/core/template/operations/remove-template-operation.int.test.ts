import 'reflect-metadata';
import { beforeEach, describe, expect, vi, it, MockInstance, afterEach } from 'vitest';
import container from '@infrastructure/container/di-container';
import { getSimpleStructureFixture } from '__tests__/fixtures/simple-structure';
import { fs, vol } from 'memfs';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path';
import RemoveTemplateOperation from '@core/template/operations/remove-template-operation';
import { join } from 'node:path';
import { StubLoaderService } from '@infrastructure/loader/stub-loader-service';

vi.mock('node:fs');
vi.mock('node:fs/promises');

vi.mock('@shared/utils/style', () => ({
    dim: (str: string) => str,
    info: (str: string) => str,
    warning: (str: string) => str,
    important: (str: string) => str,
}));

vi.mock('@infrastructure/file-system/paths/get-path', () => {
    return {
        getStoragePath: vi.fn(),
    };
});

describe('RemoveTemplateOperation Integration Suite', () => {
    let operation: RemoveTemplateOperation;

    container.register('LoaderService', {
        useValue: new StubLoaderService(),
    });

    beforeEach(() => {
        vi.clearAllMocks();
        operation = container.resolve<RemoveTemplateOperation>('RemoveTemplateOperation');
    });

    describe('Simple structure', () => {
        const fixture = getSimpleStructureFixture({
            isTemplate: true,
            templateName: 'test-template',
        });
        const storagePath = fixture.storagePath;
        const templateName = fixture.templateName;

        let consoleSpy: MockInstance;

        beforeEach(() => {
            vol.reset();
            vol.fromJSON(fixture.memfsStructure, fixture.memfsCwd);

            vi.mocked(getStoragePath).mockImplementation(() => storagePath);
            vi.spyOn(process, 'cwd').mockReturnValue(fixture.memfsCwd);

            consoleSpy = vi.spyOn(console, 'log');
            consoleSpy.mockImplementation(() => {});
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('should successfully remove existing template', async () => {
            const input = { templateName };
            const templatePath = join(storagePath, input.templateName);
            const templateExitsBeforeAct = fs.existsSync(templatePath);

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(templateExitsBeforeAct).toBe(true);
            expect(fs.existsSync(templatePath)).toBe(false);
        });

        it('should display appropriate message when template not found', async () => {
            vol.mkdirSync(storagePath, { recursive: true });
            const input = {
                templateName: 'this-template-does-not-exist',
            };

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(consoleSpy).toHaveBeenCalledWith('');
            expect(consoleSpy).toHaveBeenCalledWith('┌────────────────────────────────────────┐');
            expect(consoleSpy).toHaveBeenCalledWith('│           Template not found           │');
            expect(consoleSpy).toHaveBeenCalledWith('└────────────────────────────────────────┘');
            expect(consoleSpy).toHaveBeenCalledWith('');
            expect(consoleSpy).toHaveBeenCalledWith(`Template: ${input.templateName}`);
        });
    });
});
