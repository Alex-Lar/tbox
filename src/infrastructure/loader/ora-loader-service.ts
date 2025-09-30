import ora, { Ora } from 'ora';
import { injectable } from 'tsyringe';
import { LoaderService } from '@shared/interfaces/loader-service';
import { ERROR_SYMBOL, SUCCESS_SYMBOL, WARN_SYMBOL } from '@shared/constants';

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
        this.spinnerInstance.stopAndPersist({
            symbol: SUCCESS_SYMBOL,
            text,
        });
    }

    warn(text: string) {
        this.spinnerInstance.stopAndPersist({
            symbol: WARN_SYMBOL,
            text,
        });
    }

    fail(text: string) {
        this.spinnerInstance.stopAndPersist({
            symbol: ERROR_SYMBOL,
            text,
        });
    }

    stop() {
        this.spinnerInstance.stop();
    }

    update(props: { text?: string; suffixText?: string }): void {
        const { text, suffixText } = props;

        if (text) this.spinnerInstance.text = text;
        if (suffixText) this.spinnerInstance.suffixText = suffixText;
    }
}
