import 'reflect-metadata';
import { beforeEach, describe, expect, vi, it } from 'vitest';
import container from '@infrastructure/container/di-container';
import { getSimpleStructureFixture } from '__tests__/fixtures/simple-structure';
import { fs, vol } from 'memfs';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path';
import DeleteTemplateOperation from '@core/template/operations/delete-template-operation';
import { join } from 'node:path';
import { StubLoaderService } from '@infrastructure/loader/stub-loader-service';
import PrettyAggregateError from '@shared/errors/pretty-aggregate-error';

vi.mock('node:fs');
vi.mock('node:fs/promises');

vi.mock('@shared/utils/style', () => ({
    success: (str: string) => str,
    error: (str: string) => str,
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

vi.mock('@shared/constants', () => ({
    SUCCESS_SYMBOL: '✔',
    ERROR_SYMBOL: '✖',
    WARN_SYMBOL: '⚠',
    INFO_SYMBOL: 'ℹ',
    TREE_BRANCH: '├─',
    TREE_END: '└─',
    BULLET_SYMBOL: '•',
    APP_NAME: 'tbox',
}));

vi.mock('@shared/utils/logger');

describe('DeleteTemplateOperation Integration Suite', () => {
    let operation: DeleteTemplateOperation;

    container.register('LoaderService', {
        useValue: new StubLoaderService(),
    });

    beforeEach(() => {
        vi.clearAllMocks();
        operation = container.resolve<DeleteTemplateOperation>('DeleteTemplateOperation');
    });

    describe('Simple structure', () => {
        const fixture = getSimpleStructureFixture({
            isTemplate: true,
            templateName: 'test-template',
        });
        const storagePath = fixture.storagePath;
        const templateNames = [fixture.templateName];

        beforeEach(() => {
            vol.reset();
            vol.fromJSON(fixture.memfsStructure, fixture.memfsCwd);

            vi.mocked(getStoragePath).mockImplementation(() => storagePath);
            vi.spyOn(process, 'cwd').mockReturnValue(fixture.memfsCwd);
            vi.spyOn(console, 'log').mockReturnValue(undefined);
        });

        it('should successfully delete one template', async () => {
            const input = { templateNames };
            const templatePath = join(storagePath, input.templateNames[0]!);
            const templateExitsBeforeAct = fs.existsSync(templatePath);

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(templateExitsBeforeAct).toBe(true);
            expect(fs.existsSync(templatePath)).toBe(false);
        });

        it('should successfully delete multiple templates', async () => {
            const templateNames = ['templA', 'templB', 'templC'];
            const input = { templateNames };

            vol.fromJSON(
                {
                    [`${join(storagePath, templateNames[0]!)}`]: '.',
                    [`${join(storagePath, templateNames[1]!)}`]: '.',
                    [`${join(storagePath, templateNames[2]!)}`]: '.',
                },
                fixture.memfsCwd
            );

            const allTemplatesExistsBeforeAct = templateNames.every(name =>
                fs.existsSync(join(storagePath, name))
            );

            await expect(operation.execute(input)).resolves.toBeUndefined();

            expect(allTemplatesExistsBeforeAct).toBe(true);
            templateNames.every(name => {
                expect(fs.existsSync(join(storagePath, name))).toBe(false);
            });
        });

        it('should throw PrettyAggregateErro when template not found', async () => {
            vol.mkdirSync(storagePath, { recursive: true });
            const input = {
                templateNames: ['this-template-does-not-exist'],
            };

            await expect(async () => await operation.execute(input)).rejects.toThrow(
                PrettyAggregateError
            );
        });
    });
});
