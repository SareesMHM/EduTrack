import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { clean, fieldErrors, passwordRule } from '../../src/utils/validators';

describe('validators', () => {
  it('passwordRule needs 8 chars, a letter and a number', () => {
    expect(passwordRule.safeParse('abc12345').success).toBe(true);
    expect(passwordRule.safeParse('short1').success).toBe(false);
    expect(passwordRule.safeParse('allletters').success).toBe(false);
    expect(passwordRule.safeParse('12345678').success).toBe(false);
  });
  it('fieldErrors maps first issue per field', () => {
    const e = fieldErrors(z.object({ a: z.string().min(2, 'too short') }), { a: 'x' });
    expect(e).toEqual({ a: 'too short' });
    expect(fieldErrors(z.object({ a: z.string() }), { a: 'ok' })).toEqual({});
  });
  it('clean drops empty values', () => expect(clean({ a: '', b: 'x', c: undefined, d: 0 })).toEqual({ b: 'x', d: 0 }));
});
