export type TaniaPhase = 'FormSelection' | 'FormQuestion' | 'FormAnswer';
export type TaniaMode =
  | 'Talking'
  | 'Listening'
  | 'Transcribing'
  | 'Thinking'
  | 'Waiting';

export interface TaniaState {
  phase: TaniaPhase;
  taniaMode: TaniaMode;

  voice: string;
  accent: string;
  type: string;
  isWaitingForUserInput: boolean;
  lastMessage: string;

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
