import { create } from 'zustand';
import { TaniaState, TaniaPhase, TaniaMode } from './taniaState';
import { taniaStateLogger } from './taniaMiddleware';
import { Message } from './taniaState';

const initialPhase: TaniaPhase = 'FormSelection';
const initialTaniaMode: TaniaMode = 'Waiting';

export const useTaniaStore = create<TaniaState>(
  taniaStateLogger<TaniaState>({ showOnlyChanges: true })(
    (set: (partial: Partial<TaniaState>) => void, get: () => TaniaState) => ({
      phase: initialPhase,
      taniaMode: initialTaniaMode,
      voice: 'elia',
      accent: 'central',
      type: 'text',
      isWaitingForUserInput: true,
      setPhase: (phase: TaniaPhase) => set({ phase }),

      setTaniaMode: (mode: TaniaMode) => set({ taniaMode: mode }),

      setIsWaitingForUserInput: (isWaiting: boolean) => set({ isWaitingForUserInput: isWaiting }),

      setVoice: (voice: string) => set({ voice }),

      setAccent: (accent: string) => set({ accent }),

      messages: [],

      lastMessage: "",

      addMessage: (message: Omit<Message, 'id' | 'timestamp'>) =>
        set({
          messages: [
            ...get().messages,
            {
              ...message,
              id: Math.random().toString(36),
              timestamp: Date.now(),
            },
          ],
          lastMessage: message.content, // Save easy short reference to last message string (for transcriptions)
        }),

      updateMessage: (id: string, content: string) =>
        set({
          messages: get().messages.map((msg) =>
            msg.id === id ? { ...msg, content } : msg
          ),
        }),
    })
  )
);