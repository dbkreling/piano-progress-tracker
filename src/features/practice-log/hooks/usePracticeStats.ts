import { useMemo } from 'react';
import type { PracticeSession } from '../../../models/practice';
import { calculateStreak } from '../../../utils/streak';
import { aggregatePracticeByDay } from '../../../utils/aggregation';

/**
 * Hook for calculating practice statistics
 */
export function usePracticeStats(sessions: PracticeSession[]) {
  const stats = useMemo(() => {
    // Calculate streak
    const streak = calculateStreak(sessions);

    // Calculate this week's practice time (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thisWeekSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= sevenDaysAgo;
    });

    const thisWeekMinutes = thisWeekSessions.reduce(
      (sum, session) => sum + session.durationMinutes,
      0
    );

    // Calculate total practice time
    const totalMinutes = sessions.reduce(
      (sum, session) => sum + session.durationMinutes,
      0
    );

    // Calculate average rating
    const sessionsWithRating = sessions.filter((s) => s.rating > 0);
    const averageRating =
      sessionsWithRating.length > 0
        ? sessionsWithRating.reduce((sum, s) => sum + s.rating, 0) /
          sessionsWithRating.length
        : 0;

    // Total sessions
    const totalSessions = sessions.length;

    // Daily practice aggregation (for potential charts)
    const dailyPractice = aggregatePracticeByDay(sessions);

    return {
      streak,
      thisWeekMinutes,
      totalMinutes,
      averageRating,
      totalSessions,
      dailyPractice,
    };
  }, [sessions]);

  return stats;
}
