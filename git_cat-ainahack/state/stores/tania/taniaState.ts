export type TaniaPhase = 'FormSelection' | 'FormFilling';
export type TaniaMode = 'Talking' | 'Listening' | 'Thinking1' | 'Thinking2' | 'Waiting';

export interface TaniaState {
  phase: TaniaPhase;
  taniaMode: TaniaMode;

  voice: string;
  accent: string;
  type: string;
  isWaitingForUserInput: boolean; 
  setPhase: (phase: TaniaPhase) => void;
  setTaniaMode: (mode: TaniaMode) => void;
  setIsWaitingForUserInput: (isWaiting: boolean) => void;
  setVoice: (voice: string) => void;
  setAccent: (accent: string) => void;

  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, content: string) => void;
}

export interface Message {
  id: string;
  timestamp: number;
  type: 'system' | 'user' | 'editable-system';
  content: string;
}
