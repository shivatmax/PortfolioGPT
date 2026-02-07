
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  uiComponent?: 'projects' | 'experience' | 'skills' | 'contact' | 'story';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface Suggestion {
  label: string;
  prompt: string;
}

export type ViewType = 'chat' | 'experience' | 'projects' | 'about' | 'services' | 'story';
