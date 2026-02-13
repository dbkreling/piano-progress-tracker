export interface TheoryLevel {
  id: string;
  levelName: string;
  scalesList?: ScaleDefinition[];
  repertoire?: RepertoireList;
  technicalRequirements?: TechnicalRequirement[];
  createdAt: string;
}

export interface ScaleDefinition {
  name: string;
  type: 'major' | 'minor-natural' | 'minor-harmonic' | 'minor-melodic';
  key: string;
  hands: 'separate' | 'together' | 'both';
  octaves: number;
}

export interface RepertoireList {
  listA?: RepertoirePiece[]; // Baroque
  listB?: RepertoirePiece[]; // Classical
  listC?: RepertoirePiece[]; // Romantic
  listD?: RepertoirePiece[]; // Contemporary
}

export interface RepertoirePiece {
  title: string;
  composer: string;
  period: 'baroque' | 'classical' | 'romantic' | 'contemporary';
  difficulty?: number;
}

export interface TechnicalRequirement {
  type: 'arpeggio' | 'chord' | 'etude' | 'study';
  description: string;
  key?: string;
}

export interface UserTheoryProgress {
  id: string;
  userId: string;
  level: string;
  topic: string;
  score: number; // 0-100
  lastReview: string;
  createdAt: string;
}

export interface CreateTheoryProgressInput {
  level: string;
  topic: string;
  score: number;
}

export interface TheoryExercise {
  id: string;
  level: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}
