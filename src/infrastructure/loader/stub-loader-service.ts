import { injectable } from 'tsyringe';
import { LoaderService } from '@shared/interfaces/loader-service';

@injectable()
export class StubLoaderService implements LoaderService {
    start(_text: string): void {}
    succeed(_text: string): void {}
    warn(_text: string): void {}
    stop(): void {}
    fail(_text: string): void {}
    update(_props: { text?: string; suffixText?: string }): void {}
}
