import pLimit from 'p-limit';

export function createConcurrencyLimiter(limit: number) {
    return pLimit(limit);
}
