export type TaniaPhase = 'FormSelection' | 'FormFilling';
export type TaniaMode = 'Talking' | 'Listening' | 'Thinking1' | 'Thinking2';

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
}
