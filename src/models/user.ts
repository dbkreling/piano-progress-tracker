export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLevel {
  currentLevel: string;
  assessmentScore?: number;
  assessedAt?: string;
}
