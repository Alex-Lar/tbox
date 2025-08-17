import { describe, expect, it, vi } from 'vitest';
import { isPrettyError } from '../error';
import { PrettyError } from '@shared/types/error';

const createPrettyErrorMock = (): PrettyError => ({
  formatForDisplay: vi.fn().mockReturnValue('formatted message'),
});

const createInvalidPrettyErrorMock = () => ({
  formatForDisplay: 'invalid pretty error',
});

describe('Error Guards', () => {
  describe('isPrettyError()', () => {
    it('returns true for objects with formatForDisplay method', () => {
      const obj = createPrettyErrorMock();

      const result = isPrettyError(obj);

      expect(result).toBe(true);
    });

    it('returns false for objects without formatForDisplay', () => {
      const obj1 = new Error();
      const obj2 = new TypeError();
      const obj3 = new SyntaxError();
      const obj4 = {};
      const obj5 = createInvalidPrettyErrorMock();

      const r1 = isPrettyError(obj1);
      const r2 = isPrettyError(obj2);
      const r3 = isPrettyError(obj3);
      const r4 = isPrettyError(obj4);
      const r5 = isPrettyError(obj5);

      expect(r1).toBe(false);
      expect(r2).toBe(false);
      expect(r3).toBe(false);
      expect(r4).toBe(false);
      expect(r5).toBe(false);
    });

    it('returns false for primitives', () => {
      const primitives = [
        'string',
        10,
        true,
        Symbol('symbol'),
        null,
        undefined,
      ];

      for (let value of primitives) {
        expect(isPrettyError(value)).toBe(false);
      }
    });
  });
});
