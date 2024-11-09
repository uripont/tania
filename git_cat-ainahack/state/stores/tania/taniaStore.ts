import { create } from 'zustand';
import { TaniaState, TaniaPhase, TaniaMode } from './taniaState';
import { taniaStateLogger } from './taniaMiddleware';
import { SAVABLE_FIELDS } from '@/constants/PreferencesFields';

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
      setPhase: (phase: TaniaPhase) => set({ phase }),

      setTaniaMode: (mode: TaniaMode) => set({ taniaMode: mode }),
    })
  )
);
