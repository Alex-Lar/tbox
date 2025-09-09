import { CreateTemplateProps } from '@core/template/operations/types';
import { isDirSync } from '@shared/utils/file-system';
import { join, normalize } from '@shared/utils/path';

export class CreateTemplatePropsPreparer {
    static prepare(props: CreateTemplateProps): CreateTemplateProps {
        const { options } = props;

        if (options.exclude.length) {
            options.exclude = this.prepareExclude(options.exclude);
        }

        if (options.recursive && props.source.length) {
            props.source = this.prepareSource(props.source);
        }

        return {
            ...props,
        };
    }

    private static prepareSource(source: string[]): string[] {
        const preparedSource: string[] = [];
        const globPatternRegex = /[\!\?\*\[\]\{\},]/;

        for (let path of source) {
            if (globPatternRegex.test(path)) {
                preparedSource.push(path);
                continue;
            }

            if (!isDirSync(path)) {
                preparedSource.push(normalize(path));
                continue;
            }

            const globPath = join(path, '/**');
            preparedSource.push(globPath);
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
            console.log(pattern);
            preparedExclude.push(`**/${pattern}/**`, `**/${pattern}`);
        }

        return preparedExclude;
    }
}
