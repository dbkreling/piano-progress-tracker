import { describe, it, expect } from 'vitest';
import {
  aggregatePracticeByDay,
  calculateLevelProgress,
} from '../../../src/utils/aggregation';

describe('aggregatePracticeByDay', () => {
  it('returns empty array for empty input', () => {
    expect(aggregatePracticeByDay([])).toEqual([]);
  });

  it('aggregates single session correctly', () => {
    const sessions = [
      { date: '2024-01-15', durationMinutes: 30, rating: 4 },
    ];

    const result = aggregatePracticeByDay(sessions);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      date: '2024-01-15',
      totalMinutes: 30,
      sessionCount: 1,
      averageRating: 4,
    });
  });

  it('combines multiple sessions on same day', () => {
    const sessions = [
      { date: '2024-01-15', durationMinutes: 30, rating: 4 },
      { date: '2024-01-15', durationMinutes: 20, rating: 5 },
    ];

    const result = aggregatePracticeByDay(sessions);

    expect(result).toHaveLength(1);
    expect(result[0].totalMinutes).toBe(50);
    expect(result[0].sessionCount).toBe(2);
    expect(result[0].averageRating).toBe(4.5);
  });

  it('sorts results by date ascending', () => {
    const sessions = [
      { date: '2024-01-17', durationMinutes: 30, rating: 4 },
      { date: '2024-01-15', durationMinutes: 25, rating: 3 },
      { date: '2024-01-16', durationMinutes: 35, rating: 5 },
    ];

    const result = aggregatePracticeByDay(sessions);

    expect(result.map(r => r.date)).toEqual([
      '2024-01-15',
      '2024-01-16',
      '2024-01-17',
    ]);
  });

  it('calculates average rating correctly for multiple sessions', () => {
    const sessions = [
      { date: '2024-01-15', durationMinutes: 30, rating: 3 },
      { date: '2024-01-15', durationMinutes: 20, rating: 4 },
      { date: '2024-01-15', durationMinutes: 10, rating: 5 },
    ];

    const result = aggregatePracticeByDay(sessions);

    expect(result[0].averageRating).toBe(4); // (3 + 4 + 5) / 3 = 4
  });
});

describe('calculateLevelProgress', () => {
  it('returns 0 for empty array', () => {
    expect(calculateLevelProgress([], 'RCM 1')).toBe(0);
  });

  it('returns 0 when no items match level', () => {
    const items = [
      { level: 'RCM 2', status: 'completed' },
    ];
    expect(calculateLevelProgress(items, 'RCM 1')).toBe(0);
  });

  it('calculates percentage correctly', () => {
    const items = [
      { level: 'RCM 1', status: 'completed' },
      { level: 'RCM 1', status: 'completed' },
      { level: 'RCM 1', status: 'in-progress' },
      { level: 'RCM 1', status: 'planned' },
    ];

    // 2 out of 4 = 50%
    expect(calculateLevelProgress(items, 'RCM 1')).toBe(50);
  });

  it('rounds percentage to nearest integer', () => {
    const items = [
      { level: 'RCM 2', status: 'completed' },
      { level: 'RCM 2', status: 'in-progress' },
      { level: 'RCM 2', status: 'planned' },
    ];

    // 1 out of 3 = 33.33... -> 33%
    expect(calculateLevelProgress(items, 'RCM 2')).toBe(33);
  });

  it('returns 100 when all items are completed', () => {
    const items = [
      { level: 'RCM 1', status: 'completed' },
      { level: 'RCM 1', status: 'completed' },
      { level: 'RCM 1', status: 'completed' },
    ];

    expect(calculateLevelProgress(items, 'RCM 1')).toBe(100);
  });

  it('ignores items from other levels', () => {
    const items = [
      { level: 'RCM 1', status: 'completed' },
      { level: 'RCM 1', status: 'in-progress' },
      { level: 'RCM 2', status: 'completed' },
      { level: 'RCM 3', status: 'completed' },
    ];

    // Only 1 out of 2 RCM 1 items is completed = 50%
    expect(calculateLevelProgress(items, 'RCM 1')).toBe(50);
  });
});
