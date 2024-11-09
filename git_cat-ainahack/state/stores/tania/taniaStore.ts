import { create } from 'zustand';
import { TaniaState, TaniaPhase, TaniaMode } from './taniaState';
import { taniaStateLogger } from './taniaMiddleware';

const initialPhase: TaniaPhase = 'FormSelection';
const initialTaniaMode: TaniaMode = 'Listening';

export const useTaniaStore = create<TaniaState>(
  taniaStateLogger<TaniaState>({ showOnlyChanges: true })(
    (set: (partial: Partial<TaniaState>) => void) => ({
      phase: initialPhase,
      taniaMode: initialTaniaMode,
      voice: 'elia',
      accent: 'central',
      type: 'text',
      isWaitingForUserInput: false,
      setPhase: (phase: TaniaPhase) => set({ phase }),

      setTaniaMode: (mode: TaniaMode) => set({ taniaMode: mode }),

      setIsWaitingForUserInput: (isWaiting: boolean) => set({ isWaitingForUserInput: isWaiting }),

      setVoice: (voice: string) => set({ voice }),

      setAccent: (accent: string) => set({ accent }),
    })
  )
);