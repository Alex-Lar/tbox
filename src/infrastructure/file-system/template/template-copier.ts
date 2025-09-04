import Template from '@core/template/entities/template.ts';
import { FS_CONCURRENCY_LIMIT } from '@shared/config/index.ts';
import { copyFile, ensureDir } from '@shared/utils/file-system.ts';
import { createConcurrencyLimiter } from '@shared/utils/limit.ts';
import { dirname } from '@shared/utils/path.ts';

export default class TemplateCopier {
    static async copyTemplate(template: Template, force = false) {
        const limiter = createConcurrencyLimiter(FS_CONCURRENCY_LIMIT);

        const dirs = new Set<string>();
        for (const entry of template.entries) {
            if (entry.isFile()) {
                dirs.add(dirname(entry.destination));
            } else if (entry.isDirectory()) {
                dirs.add(entry.destination);
            }
        }

        await Promise.all(Array.from(dirs).map(dir => limiter(() => ensureDir(dir))));

        const files = template.entries.filter(entry => entry.isFile());

        try {
            await Promise.all(
                files.map(file => limiter(() => copyFile(file.source, file.destination, force)))
            );
        } catch (error) {
            throw new Error('Error occurred while copying files', { cause: error });
        }
    }
}
