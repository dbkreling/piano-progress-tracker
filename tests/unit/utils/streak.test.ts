import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculateStreak } from '../../../src/utils/streak';

describe('calculateStreak', () => {
  beforeEach(() => {
    // Mock current date to 2024-01-15
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 for empty sessions array', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 1 for single session today', () => {
    const sessions = [{ date: '2024-01-15' }];
    expect(calculateStreak(sessions)).toBe(1);
  });

  it('calculates consecutive days correctly', () => {
    const sessions = [
      { date: '2024-01-15' }, // today
      { date: '2024-01-14' },
      { date: '2024-01-13' },
    ];
    expect(calculateStreak(sessions)).toBe(3);
  });

  it('stops at first gap in practice days', () => {
    const sessions = [
      { date: '2024-01-15' },
      { date: '2024-01-14' },
      // gap on Jan 13
      { date: '2024-01-12' },
      { date: '2024-01-11' },
    ];
    expect(calculateStreak(sessions)).toBe(2);
  });

  it('handles multiple sessions on same day', () => {
    const sessions = [
      { date: '2024-01-15' },
      { date: '2024-01-15' }, // duplicate
      { date: '2024-01-14' },
    ];
    expect(calculateStreak(sessions)).toBe(2);
  });

  it('returns 0 if most recent session is not today or yesterday', () => {
    const sessions = [
      { date: '2024-01-10' }, // 5 days ago
      { date: '2024-01-09' },
    ];
    expect(calculateStreak(sessions)).toBe(0);
  });

  it('includes yesterday if no practice today', () => {
    const sessions = [
      { date: '2024-01-14' }, // yesterday
      { date: '2024-01-13' },
    ];
    expect(calculateStreak(sessions)).toBe(2);
  });

  it('handles long streaks correctly', () => {
    const sessions = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.UTC(2024, 0, 15 - i)).toISOString().split('T')[0],
    }));
    expect(calculateStreak(sessions)).toBe(30);
  });
});
