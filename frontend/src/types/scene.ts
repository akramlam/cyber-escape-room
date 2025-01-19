export interface Email {
  id: string;
  subject: string;
  sender: string;
  content: string;
  isPhishing: boolean;
  indicators: string[];
}

export interface SecurityTool {
  id: string;
  name: string;
  description: string;
  action: () => void;
}

export interface SceneState {
  activeEmail: Email | null;
  selectedTools: string[];
  score: number;
  timeRemaining: number;
} 