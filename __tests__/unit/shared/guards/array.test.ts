import { describe, expect, it } from 'vitest';
import { isStringArray } from '@shared/guards';

describe('Array Guards', () => {
  describe('isStringArray()', () => {
    it('returns false if argument is not an array', () => {
      let obj = {};
      let num = 5;
      let str = 'string';
      let fn = () => {};

      const r1 = isStringArray(obj);
      const r2 = isStringArray(num);
      const r3 = isStringArray(str);
      const r4 = isStringArray(fn);
      const r5 = isStringArray(null);
      const r6 = isStringArray(undefined);

      expect(r1).toBe(false);
      expect(r2).toBe(false);
      expect(r3).toBe(false);
      expect(r4).toBe(false);
      expect(r5).toBe(false);
      expect(r6).toBe(false);
    });

    it('returns false if an array contains non-string values.', () => {
      const arr1 = ['string', 5, 'string'];
      const arr2 = ['string', {}, 'string'];
      const arr3 = ['string', [], 'string'];
      const arr4 = ['string', null, 'string'];
      const arr5 = ['string', undefined, 'string'];
      const arr6 = ['string', () => {}, 'string'];

      const r1 = isStringArray(arr1);
      const r2 = isStringArray(arr2);
      const r3 = isStringArray(arr3);
      const r4 = isStringArray(arr4);
      const r5 = isStringArray(arr5);
      const r6 = isStringArray(arr6);

      expect(r1).toBe(false);
      expect(r2).toBe(false);
      expect(r3).toBe(false);
      expect(r4).toBe(false);
      expect(r5).toBe(false);
      expect(r6).toBe(false);
    });

    it('returns true if an array contains only strings', () => {
      const arr1 = [''];
      const arr2 = ['', ''];
      const arr3 = ['string'];
      const arr4 = ['string', 'string'];

      const r1 = isStringArray(arr1);
      const r2 = isStringArray(arr2);
      const r3 = isStringArray(arr3);
      const r4 = isStringArray(arr4);

      expect(r1).toBe(true);
      expect(r2).toBe(true);
      expect(r3).toBe(true);
      expect(r4).toBe(true);
    });
  });
});
