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

  selectedInstance: string | null;
  setSelectedInstance: (instance: string | null) => void;

  setPhase: (phase: TaniaPhase) => void;
  setTaniaMode: (mode: TaniaMode) => void;
  setIsWaitingForUserInput: (isWaiting: boolean) => void;
  setVoice: (voice: string) => void;
  setAccent: (accent: string) => void;

  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, content: string) => void;

  formElementsQueue: FormElement[];
  setFormElementsQueue: (elements: FormElement[]) => void;
  dequeueFormElement: () => void;
  getCurrentFormElement: () => FormElement | undefined;
}

export interface Message {
  id: string;
  timestamp: number;
  type: 'system' | 'user' | 'editable-system';
  content: string;
}

export interface FormElement {
  id: string;
  label: string;
  question: string;
  examples: Array<string>;
}
