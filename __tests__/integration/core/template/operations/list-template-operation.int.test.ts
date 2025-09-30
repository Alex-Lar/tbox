import 'reflect-metadata';
import { beforeEach, afterEach, describe, expect, vi, it, MockInstance } from 'vitest';
import container from '@infrastructure/container/di-container';
import { vol } from 'memfs';
import { getStoragePath } from '@infrastructure/file-system/paths/get-path';
import path from 'node:path';
import ListTemplateOperation from '@core/template/operations/list-template-operation';
import { TREE_BRANCH, TREE_END } from '@shared/constants';
import { createMemfsStructureFromPaths } from '__tests__/helpers';
import { NoTemplatesFoundError } from '@shared/errors/no-templates-found';

vi.mock('node:fs');
vi.mock('node:fs/promises');

vi.mock('@shared/utils/logger');

vi.mock('@shared/utils/style', () => ({
    success: (str: string) => str,
    error: (str: string) => str,
    dim: (str: string) => str,
    info: (str: string) => str,
    warning: (str: string) => str,
    important: (str: string) => str,
}));

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

vi.mock('@infrastructure/file-system/paths/get-path', () => {
    return {
        getStoragePath: vi.fn(),
    };
});

describe('ListTemplateOperation Integration Suite', () => {
    let operation: ListTemplateOperation;
    const storagePath = '/root/.local/share/tb';

    beforeEach(() => {
        vi.clearAllMocks();
        operation = container.resolve<ListTemplateOperation>('ListTemplateOperation');
    });

    describe('Basic cases', () => {
        const templateNames = ['template1', 'template2', 'template3'];
        const templatePaths = templateNames.map(name => path.join(storagePath, name));
        const memfsStructure = createMemfsStructureFromPaths(templatePaths);

        let consoleSpy: MockInstance;

        beforeEach(() => {
            vol.reset();
            vi.mocked(getStoragePath).mockImplementation(() => storagePath);
            consoleSpy = vi.spyOn(console, 'log');
            consoleSpy.mockImplementation(() => {});
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('should display formatted template list', async () => {
            vol.fromJSON(memfsStructure);

            await expect(operation.execute()).resolves.toBeUndefined();

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining(`Total templates: ${templateNames.length}`)
            );

            const output = consoleSpy.mock.calls.flat().join('\n');

            templateNames.forEach(name => expect(output).toMatch(name));
            expect(output).toMatch(TREE_BRANCH);
            expect(output).toMatch(TREE_END);
        });

        it('should throw NoTemplatesFoundError when no templates found', async () => {
            vol.mkdirSync(storagePath, { recursive: true });

            await expect(() => operation.execute()).rejects.toThrow(NoTemplatesFoundError);
        });

        it('should not display template list when no templates found', async () => {
            vol.mkdirSync(storagePath, { recursive: true });

            await expect(() => operation.execute()).rejects.toThrow(NoTemplatesFoundError);

            const output = consoleSpy.mock.calls.flat().join('\n');
            expect(output).not.toContain('Total templates:');
        });

        it('should throw NoTemplatesFoundError when storage does not exist', async () => {
            await expect(() => operation.execute()).rejects.toThrow(NoTemplatesFoundError);
        });

        it('should not display template list when storage does not exist', async () => {
            await expect(() => operation.execute()).rejects.toThrow(NoTemplatesFoundError);

            const output = consoleSpy.mock.calls.flat().join('\n');
            expect(output).not.toContain('Total templates:');
        });
    });
});
