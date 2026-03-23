export type DrumPartType = 'kick' | 'snare' | 'hihat' | 'tom' | 'crash';

export type GameMode = 'basic' | 'medium' | 'advanced' | 'perfection' | 'free';

export interface TutorialStep {
  id: number;
  instruction: string;
  cue?: string; // Lyric or rhythmic cue
  targetSequence: DrumPartType[];
  visualHints: string[]; // e.g. ["A", "A", "A", "A"]
  rhythmPattern?: number[]; // Timing offsets or simplified representation
}

export interface GameState {
  mode: GameMode;
  currentStepIndex: number;
  score: number;
  accuracy: number;
  bpm: number;
  isMetronomeOn: boolean;
}
