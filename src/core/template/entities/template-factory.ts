import { Factory } from '@shared/types/factory.ts';
import { TemplateProps } from './types.ts';
import Template from './template.ts';
import { injectable } from 'tsyringe';

@injectable()
export default class TemplateFactory implements Factory<Template, TemplateProps> {
    create(props: TemplateProps): Template {
        return new Template(props.name, props.source, props.destination, props.entries);
    }
}
