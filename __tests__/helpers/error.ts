import PrettyError from '@shared/interfaces/pretty-error';
import { vi } from 'vitest';

export const mockPrettyError = (msg?: string): PrettyError => ({
    print: vi.fn().mockReturnValue(msg || 'formatted message'),
    solution: 'solution',
});

export const mockInvalidPrettyError = () => ({
    formatForDisplay: 'invalid pretty error',
});
