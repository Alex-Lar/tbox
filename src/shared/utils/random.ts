import { randomBytes } from 'node:crypto';

export function generateTempDirName(prefix = 'tmp-', length = 6): string {
    const randomString = randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);

    return `${prefix}${randomString}`;
}
