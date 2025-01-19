export interface Email {
  id: string;
  subject: string;
  sender: string;
  content: string;
  isPhishing: boolean;
  indicators: string[];
}

export interface UserSkill {
  id: string;
  name: string;
  level: number;
  experience: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  score: number;
  completionTime: number;
  completedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredScore: number;
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  threat_type: string;
  difficulty: number;
  time_limit: number;
} 