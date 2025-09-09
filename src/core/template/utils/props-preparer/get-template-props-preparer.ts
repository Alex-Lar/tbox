import { GetTemplateProps } from '@core/template/operations/types';
import { resolve } from '@shared/utils/path';

export class GetTemplatePropsPreparer {
    static prepare(props: GetTemplateProps): GetTemplateProps {
        let { destination } = props;

        const preparedDestination = this.prepareDestination(destination);

        return {
            ...props,

            // Prepared
            destination: preparedDestination,
        };
    }

    private static prepareDestination(destination: string): string {
        return resolve(destination);
    }
}
