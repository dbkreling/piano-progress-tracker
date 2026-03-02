import { useMemo } from 'react';
import type { SyllabusItem, SyllabusProgress } from '../../../models/syllabus';

/**
 * Hook for calculating syllabus progress statistics
 */
export function useSyllabusProgress(items: SyllabusItem[]) {
  const progress = useMemo(() => {
    // Group items by level
    const levelMap = new Map<string, SyllabusItem[]>();

    items.forEach((item) => {
      const existing = levelMap.get(item.level);
      if (existing) {
        existing.push(item);
      } else {
        levelMap.set(item.level, [item]);
      }
    });

    // Calculate progress for each level
    const progressByLevel: SyllabusProgress[] = Array.from(levelMap.entries())
      .map(([level, levelItems]) => {
        const total = levelItems.length;
        const completed = levelItems.filter((item) => item.status === 'completed').length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          level,
          total,
          completed,
          percentage,
        };
      })
      .sort((a, b) => {
        // Sort levels in RCM order
        const levelOrder = ['Prep A', 'Prep B', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8', 'Level 9', 'Level 10'];
        const aIndex = levelOrder.indexOf(a.level);
        const bIndex = levelOrder.indexOf(b.level);

        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }

        return a.level.localeCompare(b.level);
      });

    // Calculate overall stats
    const totalItems = items.length;
    const completedItems = items.filter((item) => item.status === 'completed').length;
    const inProgressItems = items.filter((item) => item.status === 'in-progress').length;
    const readyForExamItems = items.filter((item) => item.status === 'ready-for-exam').length;
    const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      progressByLevel,
      totalItems,
      completedItems,
      inProgressItems,
      readyForExamItems,
      overallPercentage,
    };
  }, [items]);

  return progress;
}
