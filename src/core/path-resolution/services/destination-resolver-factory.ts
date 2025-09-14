import { injectable } from 'tsyringe';
import DestinationResolver from './destination-resolver';
import { Factory } from '@shared/interfaces/factory';

type DestinationResolverProps = {
    source: string[];
    destination: string;
};

@injectable()
export default class DestinationResolverFactory
    implements Factory<DestinationResolver, DestinationResolverProps>
{
    create(props: DestinationResolverProps): DestinationResolver {
        return new DestinationResolver(props.source, props.destination);
    }
}
