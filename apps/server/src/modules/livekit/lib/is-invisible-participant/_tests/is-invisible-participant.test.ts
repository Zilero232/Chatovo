import { describe, expect, it } from 'vitest';

import { isInvisibleParticipant } from '../is-invisible-participant';

describe('isInvisibleParticipant', () => {
  it('detects the invisible flag', () => {
    expect(isInvisibleParticipant(JSON.stringify({ invisible: true }))).toBe(true);
  });

  it('is false when the flag is absent', () => {
    expect(isInvisibleParticipant(JSON.stringify({ verified: true }))).toBe(false);
  });

  it('is false when the flag is not literally true', () => {
    expect(isInvisibleParticipant(JSON.stringify({ invisible: 'true' }))).toBe(false);
    expect(isInvisibleParticipant(JSON.stringify({ invisible: false }))).toBe(false);
  });

  it('is false for missing or malformed metadata', () => {
    expect(isInvisibleParticipant(undefined)).toBe(false);
    expect(isInvisibleParticipant('')).toBe(false);
    expect(isInvisibleParticipant('{ not json')).toBe(false);
  });
});
