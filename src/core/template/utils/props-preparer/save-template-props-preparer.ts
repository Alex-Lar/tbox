import { SaveTemplateProps } from '@core/template/operations/types';
import { isDirSync } from '@shared/utils/file-system';
import { isGlobPattern } from '@shared/utils/glob';
import { join, normalize } from '@shared/utils/path';

export class SaveTemplatePropsPreparer {
    static prepare(props: SaveTemplateProps): SaveTemplateProps {
        const { options, source } = props;

        if (options.exclude.length) {
            options.exclude = this.prepareExclude(options.exclude);
        }

        if (source.length) {
            props.source = this.prepareSource(source, options.recursive);
        }

        return {
            ...props,
        };
    }

    private static prepareSource(source: string[], recursive: boolean): string[] {
        const preparedSource: string[] = [];

        for (const path of source) {
            if (isGlobPattern(path)) {
                preparedSource.push(path);
                continue;
            }

            if (!isDirSync(path)) {
                preparedSource.push(normalize(path));
                continue;
            }

            if (recursive) {
                preparedSource.push(join(path, '/**'));
            } else {
                preparedSource.push(join(path, '/*'));
            }
        }

        return preparedSource;
    }

    private static prepareExclude(exclude: string[]): string[] {
        const preparedExclude: string[] = [];
        const pathPatternRegex = /[\.\/\*\.]/;

        for (let pattern of exclude) {
            if (pattern === '' || pathPatternRegex.test(pattern)) {
                preparedExclude.push(pattern);
                continue;
            }
            preparedExclude.push(`**/${pattern}/**`, `**/${pattern}`);
        }

        return preparedExclude;
    }
}
