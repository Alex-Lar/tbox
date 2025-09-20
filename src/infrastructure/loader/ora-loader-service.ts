import ora, { Ora } from 'ora';
import { injectable } from 'tsyringe';
import { LoaderService } from '@shared/interfaces/loader-service';

@injectable()
export class OraLoaderService implements LoaderService {
    private spinnerInstance: Ora;
    constructor() {
        this.spinnerInstance = ora();
    }

    start(text: string) {
        this.spinnerInstance.start(text);
    }

    succeed(text: string) {
        this.spinnerInstance.succeed(text);
    }

    fail(text: string) {
        this.spinnerInstance.fail(text);
    }

    update(props: { text?: string; suffixText?: string }): void {
        const { text, suffixText } = props;

        if (text) this.spinnerInstance.text = text;
        if (suffixText) this.spinnerInstance.suffixText = suffixText;
    }
}
