
export interface UserProgress {
  lastReadPage: number;
  completedDays: number[];
  targetKhatmaDays: number;
  startDate: string; // ISO string
}

export interface DailyWird {
  dayNumber: number;
  fromPage: number;
  toPage: number;
  isCompleted: boolean;
}

export enum AppSection {
  DASHBOARD = 'dashboard',
  READER = 'reader',
  STATS = 'stats',
  SETTINGS = 'settings'
}
