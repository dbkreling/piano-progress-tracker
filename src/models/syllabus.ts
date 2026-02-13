export interface SyllabusItem {
  id: string;
  userId: string;
  title: string;
  category: string;
  level: string;
  status: SyllabusStatus;
  createdAt: string;
  updatedAt: string;
}

export type SyllabusStatus =
  | 'planned'
  | 'in-progress'
  | 'ready-for-exam'
  | 'completed';

export interface SyllabusProgress {
  level: string;
  total: number;
  completed: number;
  percentage: number;
}

export interface CreateSyllabusItemInput {
  title: string;
  category: string;
  level: string;
  status?: SyllabusStatus;
}

export interface UpdateSyllabusItemInput {
  title?: string;
  category?: string;
  level?: string;
  status?: SyllabusStatus;
}
