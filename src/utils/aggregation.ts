export interface DailyPractice {
  date: string;
  totalMinutes: number;
  sessionCount: number;
  averageRating: number;
}

/**
 * Aggregates practice sessions by day, combining multiple sessions
 * on the same day and calculating totals and averages.
 * @param sessions - Array of practice sessions
 * @returns Array of daily practice summaries sorted by date
 */
export function aggregatePracticeByDay(
  sessions: Array<{ date: string; durationMinutes: number; rating: number }>
): DailyPractice[] {
  const dayMap = new Map<string, DailyPractice>();

  for (const session of sessions) {
    const existing = dayMap.get(session.date);

    if (existing) {
      existing.totalMinutes += session.durationMinutes;
      existing.sessionCount += 1;
      existing.averageRating =
        (existing.averageRating * (existing.sessionCount - 1) + session.rating) /
        existing.sessionCount;
    } else {
      dayMap.set(session.date, {
        date: session.date,
        totalMinutes: session.durationMinutes,
        sessionCount: 1,
        averageRating: session.rating,
      });
    }
  }

  return Array.from(dayMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/**
 * Calculates progress percentage for a specific level in the syllabus.
 * @param syllabusItems - Array of syllabus items with level and status
 * @param level - The level to calculate progress for
 * @returns Percentage (0-100) of completed items for the level
 */
export function calculateLevelProgress(
  syllabusItems: Array<{ level: string; status: string }>,
  level: string
): number {
  const levelItems = syllabusItems.filter(item => item.level === level);

  if (levelItems.length === 0) return 0;

  const completed = levelItems.filter(item => item.status === 'completed').length;

  return Math.round((completed / levelItems.length) * 100);
}
