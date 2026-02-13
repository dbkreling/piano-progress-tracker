export interface PracticeSession {
  id: string;
  userId: string;
  date: string; // ISO date string
  durationMinutes: number;
  rating: number; // 1-5
  notes: string;
  isForNextLesson: boolean;
  items: PracticeItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PracticeItem {
  id: string;
  practiceSessionId: string;
  name: string;
  category: PracticeCategory;
  createdAt: string;
}

export type PracticeCategory =
  | 'scale'
  | 'repertoire'
  | 'technical'
  | 'sight-reading'
  | 'theory'
  | 'ear-training';

export interface CreatePracticeSessionInput {
  date: string;
  durationMinutes: number;
  rating: number;
  notes: string;
  isForNextLesson?: boolean;
  items: Array<{
    name: string;
    category: PracticeCategory;
  }>;
}

export interface UpdatePracticeSessionInput {
  date?: string;
  durationMinutes?: number;
  rating?: number;
  notes?: string;
  isForNextLesson?: boolean;
}
