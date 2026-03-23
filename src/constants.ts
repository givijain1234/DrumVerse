import { DrumPartType, TutorialStep } from './types';

export const DRUM_MAPPINGS: Record<string, DrumPartType> = {
  ' ': 'kick',
  'a': 'snare',
  's': 'hihat',
  'd': 'tom',
  'f': 'crash',
};

export const DRUM_COLORS: Record<DrumPartType, string> = {
  kick: '#ff00ff', // Neon Pink
  snare: '#00ffff', // Neon Cyan
  hihat: '#ffff00', // Neon Yellow
  tom: '#00ff00', // Neon Green
  crash: '#ff8800', // Neon Orange
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    instruction: "Welcome to DrumVerse! Let's start with the Snare. Press 'A' 4 times.",
    targetSequence: ['snare', 'snare', 'snare', 'snare'],
    visualHints: ['A', 'A', 'A', 'A'],
  },
  {
    id: 2,
    instruction: "Great! Now the Kick drum. Press 'Space' 4 times.",
    targetSequence: ['kick', 'kick', 'kick', 'kick'],
    visualHints: ['Space', 'Space', 'Space', 'Space'],
  },
  {
    id: 3,
    instruction: "The Hi-Hat keeps the beat. Press 'S' 4 times.",
    targetSequence: ['hihat', 'hihat', 'hihat', 'hihat'],
    visualHints: ['S', 'S', 'S', 'S'],
  },
  {
    id: 4,
    instruction: "Basic Rock Beat: Kick, Snare, Kick, Snare.",
    targetSequence: ['kick', 'snare', 'kick', 'snare'],
    visualHints: ['Space', 'A', 'Space', 'A'],
  },
  {
    id: 5,
    instruction: "Add the Hi-Hat: Kick+Hat, Snare+Hat...",
    targetSequence: ['kick', 'hihat', 'snare', 'hihat'],
    visualHints: ['Space', 'S', 'A', 'S'],
  },
  {
    id: 6,
    instruction: "Medium Mode: Double Kick. Kick, Kick, Snare, Kick, Kick, Snare.",
    targetSequence: ['kick', 'kick', 'snare', 'kick', 'kick', 'snare'],
    visualHints: ['Space', 'Space', 'A', 'Space', 'Space', 'A'],
  },
  {
    id: 7,
    instruction: "Advanced Mode: The 'Four on the Floor'. Kick+Hat, Hat, Snare+Hat, Hat.",
    targetSequence: ['kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'hihat'],
    visualHints: ['Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'S'],
  },
  {
    id: 8,
    instruction: "The Fill: Tom, Tom, Snare, Crash!",
    targetSequence: ['tom', 'tom', 'snare', 'crash'],
    visualHints: ['D', 'D', 'A', 'F'],
  },
  {
    id: 9,
    instruction: "Syncopation: Kick, Hat, Snare, Hat, Kick, Kick, Snare, Hat.",
    targetSequence: ['kick', 'hihat', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat'],
    visualHints: ['Space', 'S', 'A', 'S', 'Space', 'Space', 'A', 'S'],
  },
  {
    id: 10,
    instruction: "Final Exam: A full bar of Rock! Kick+Hat, Hat, Snare+Hat, Hat, Kick+Hat, Kick+Hat, Snare+Hat, Hat.",
    targetSequence: ['kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'kick', 'hihat', 'snare', 'hihat'],
    visualHints: ['Space', 'S', 'A', 'S', 'Space', 'S', 'Space', 'S', 'A', 'S'],
  },
];

// Generate 90 more tutorials to reach 100
const generateTutorials = () => {
  const extraSteps: TutorialStep[] = [];
  const parts: DrumPartType[] = ['kick', 'snare', 'hihat', 'tom', 'crash'];
  const keys: Record<DrumPartType, string> = { kick: 'Space', snare: 'A', hihat: 'S', tom: 'D', crash: 'F' };

  for (let i = 11; i <= 100; i++) {
    let sequence: DrumPartType[] = [];
    let hints: string[] = [];
    let length = Math.floor(i / 10) + 3; // Gradually increase length
    
    // Create semi-random but structured patterns
    for (let j = 0; j < length; j++) {
      const part = parts[Math.floor(Math.random() * parts.length)];
      sequence.push(part);
      hints.push(keys[part]);
    }

    extraSteps.push({
      id: i,
      instruction: `Lesson ${i}: ${i % 5 === 0 ? 'Advanced' : 'Practice'} Pattern #${i - 10}`,
      targetSequence: sequence,
      visualHints: hints,
    });
  }
  return extraSteps;
};

export const FULL_TUTORIAL_STEPS = [...TUTORIAL_STEPS, ...generateTutorials()];

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bpm: number;
  tutorials: TutorialStep[];
}

export const FAMOUS_SONGS: Song[] = [
  { 
    id: 'bolly-1', 
    title: 'Kala Chashma', 
    artist: 'Baar Baar Dekho', 
    difficulty: 'Easy', 
    bpm: 120,
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73484.mp3',
    tutorials: [
      { id: 1, instruction: "Intro: Get ready for the party!", cue: "Ting - Ting - Ting - Ting", targetSequence: ['hihat', 'hihat', 'hihat', 'hihat'], visualHints: ['S', 'S', 'S', 'S'] },
      { id: 2, instruction: "Verse 1: Tere Naal Nachna...", cue: "Boom - Ting - Boom - Ting", targetSequence: ['kick', 'hihat', 'kick', 'hihat'], visualHints: ['Space', 'S', 'Space', 'S'] },
      { id: 3, instruction: "Verse 2: Kala Chashma Jachda Ae!", cue: "Boom - Ting - Chak - Dum!", targetSequence: ['kick', 'hihat', 'snare', 'tom'], visualHints: ['Space', 'S', 'A', 'D'] },
      { id: 4, instruction: "Chorus: Jachda Ae Gore Mukhde Pe!", cue: "Boom - Chak - Boom - Chak", targetSequence: ['kick', 'snare', 'kick', 'snare'], visualHints: ['Space', 'A', 'Space', 'A'] },
      { id: 5, instruction: "Bridge: Badshah Rap Section!", cue: "Boom - Boom - Chak - Tak", targetSequence: ['kick', 'kick', 'snare', 'tom'], visualHints: ['Space', 'Space', 'A', 'D'] },
      { id: 6, instruction: "Full Jam: Let's Go!", cue: "Tere Naal... Kala Chashma Jachda Ae!", targetSequence: ['kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom'], visualHints: ['Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D', 'Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D'] },
    ]
  },
  { 
    id: 'bolly-2', 
    title: 'London Thumakda', 
    artist: 'Queen', 
    difficulty: 'Medium', 
    bpm: 115,
    url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb6300833d.mp3',
    tutorials: [
      { id: 1, instruction: "Intro: Wedding Bells!", cue: "Ting - Ting - Ting - Ting", targetSequence: ['hihat', 'hihat', 'hihat', 'hihat'], visualHints: ['S', 'S', 'S', 'S'] },
      { id: 2, instruction: "Verse 1: Tu London Thumakda...", cue: "Dum - Tak - Chak - Tak", targetSequence: ['kick', 'tom', 'snare', 'tom'], visualHints: ['Space', 'D', 'A', 'D'] },
      { id: 3, instruction: "Verse 2: Latthe Di Chaadar...", cue: "Dum - Dum - Chak - Tak", targetSequence: ['kick', 'kick', 'snare', 'tom'], visualHints: ['Space', 'Space', 'A', 'D'] },
      { id: 4, instruction: "Chorus: Poora London Thumakda!", cue: "Boom - Chak - Boom - Chak", targetSequence: ['kick', 'snare', 'kick', 'snare'], visualHints: ['Space', 'A', 'Space', 'A'] },
      { id: 5, instruction: "Full Jam: Wedding Party!", cue: "Poora London Thumakda!", targetSequence: ['kick', 'tom', 'snare', 'tom', 'kick', 'kick', 'snare', 'tom', 'kick', 'tom', 'snare', 'tom', 'kick', 'kick', 'snare', 'tom'], visualHints: ['Space', 'D', 'A', 'D', 'Space', 'Space', 'A', 'D', 'Space', 'D', 'A', 'D', 'Space', 'Space', 'A', 'D'] },
    ]
  },
  { 
    id: 'bolly-3', 
    title: 'Nashe Si Chadh Gayi', 
    artist: 'Befikre', 
    difficulty: 'Medium', 
    bpm: 105,
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1101.mp3',
    tutorials: [
      { id: 1, instruction: "Intro: Smooth Vibes", cue: "Ting - Ting - Ting - Ting", targetSequence: ['hihat', 'hihat', 'hihat', 'hihat'], visualHints: ['S', 'S', 'S', 'S'] },
      { id: 2, instruction: "Verse 1: Patang Se Lad Gayi...", cue: "Boom - Ting - Boom - Ting", targetSequence: ['kick', 'hihat', 'kick', 'hihat'], visualHints: ['Space', 'S', 'Space', 'S'] },
      { id: 3, instruction: "Verse 2: Nashe Si Chadh Gayi...", cue: "Boom - Ting - Chak - Tak", targetSequence: ['kick', 'hihat', 'snare', 'tom'], visualHints: ['Space', 'S', 'A', 'D'] },
      { id: 4, instruction: "Chorus: Kudi Nashe Si Chadh Gayi!", cue: "Boom - Chak - Boom - Chak", targetSequence: ['kick', 'snare', 'kick', 'snare'], visualHints: ['Space', 'A', 'Space', 'A'] },
      { id: 5, instruction: "Full Jam: Smooth Groove", cue: "Nashe Si Chadh Gayi Oye!", targetSequence: ['kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom'], visualHints: ['Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D', 'Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D'] },
    ]
  },
  { 
    id: 'bolly-4', 
    title: 'Ghungroo', 
    artist: 'War', 
    difficulty: 'Medium', 
    bpm: 118,
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_1896894982.mp3',
    tutorials: [
      { id: 1, instruction: "Step 1: Hi-Hat Rhythm", cue: "Ting - Ting - Ting - Ting", targetSequence: ['hihat', 'hihat', 'hihat', 'hihat'], visualHints: ['S', 'S', 'S', 'S'] },
      { id: 2, instruction: "Step 2: Basic Beat", cue: "Boom - Ting - Chak - Ting", targetSequence: ['kick', 'hihat', 'snare', 'hihat'], visualHints: ['Space', 'S', 'A', 'S'] },
      { id: 3, instruction: "Step 3: Funky Tom Bounce", cue: "Boom - Tak - Chak - Ting", targetSequence: ['kick', 'tom', 'snare', 'hihat'], visualHints: ['Space', 'D', 'A', 'S'] },
      { id: 4, instruction: "Step 4: Full Song Performance! (Jam)", cue: "Ghungroo Toot Gaye!", targetSequence: ['kick', 'tom', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat', 'kick', 'tom', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat', 'kick', 'tom', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat', 'kick', 'tom', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat'], visualHints: ['Space', 'D', 'A', 'S', 'Space', 'Space', 'A', 'S', 'Space', 'D', 'A', 'S', 'Space', 'Space', 'A', 'S', 'Space', 'D', 'A', 'S', 'Space', 'Space', 'A', 'S', 'Space', 'D', 'A', 'S', 'Space', 'Space', 'A', 'S'] },
    ]
  },
  { 
    id: 'bolly-5', 
    title: 'Malhari', 
    artist: 'Bajirao Mastani', 
    difficulty: 'Hard', 
    bpm: 128,
    url: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d0b6ff1101.mp3',
    tutorials: [
      { id: 1, instruction: "Step 1: Powerful Dhol Rhythm", cue: "Dum - Chak - Dum - Chak", targetSequence: ['kick', 'snare', 'kick', 'snare'], visualHints: ['Space', 'A', 'Space', 'A'] },
      { id: 2, instruction: "Step 2: Add the Toms", cue: "Tak - Chak - Tak - Chak", targetSequence: ['tom', 'snare', 'tom', 'snare'], visualHints: ['D', 'A', 'D', 'A'] },
      { id: 3, instruction: "Step 3: Combine for Maximum Power!", cue: "Dum - Tak - Chak - Tak - Chak", targetSequence: ['kick', 'tom', 'snare', 'tom', 'snare'], visualHints: ['Space', 'D', 'A', 'D', 'A'] },
      { id: 4, instruction: "Step 4: Full Song Performance! (Jam)", cue: "Dushman Ki Dekho Jo Vaat Laayi!", targetSequence: ['kick', 'tom', 'snare', 'tom', 'snare', 'kick', 'tom', 'snare', 'tom', 'snare', 'kick', 'tom', 'snare', 'tom', 'snare', 'kick', 'tom', 'snare', 'tom', 'snare', 'kick', 'tom', 'snare', 'tom', 'snare', 'kick', 'tom', 'snare', 'tom', 'snare', 'kick', 'tom', 'snare', 'tom', 'snare', 'kick', 'tom', 'snare', 'tom', 'snare'], visualHints: ['Space', 'D', 'A', 'D', 'A', 'Space', 'D', 'A', 'D', 'A', 'Space', 'D', 'A', 'D', 'A', 'Space', 'D', 'A', 'D', 'A', 'Space', 'D', 'A', 'D', 'A', 'Space', 'D', 'A', 'D', 'A', 'Space', 'D', 'A', 'D', 'A', 'Space', 'D', 'A', 'D', 'A'] },
    ]
  },
  { 
    id: 'bolly-6', 
    title: 'Badtameez Dil', 
    artist: 'YJHD', 
    difficulty: 'Medium', 
    bpm: 122,
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73484.mp3',
    tutorials: [
      { id: 1, instruction: "Step 1: Fast Hi-Hats", cue: "Ting - Ting - Ting - Ting", targetSequence: ['hihat', 'hihat', 'hihat', 'hihat'], visualHints: ['S', 'S', 'S', 'S'] },
      { id: 2, instruction: "Step 2: Catch the Beat", cue: "Boom - Ting - Chak - Ting", targetSequence: ['kick', 'hihat', 'snare', 'hihat'], visualHints: ['Space', 'S', 'A', 'S'] },
      { id: 3, instruction: "Step 3: Add the Tom Bounce", cue: "Boom - Tak - Chak - Ting", targetSequence: ['kick', 'tom', 'snare', 'hihat'], visualHints: ['Space', 'D', 'A', 'S'] },
      { id: 4, instruction: "Step 4: Full Song Performance! (Jam)", cue: "Badtameez Dil... Maane Na!", targetSequence: ['kick', 'tom', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat', 'kick', 'tom', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat', 'kick', 'tom', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat', 'kick', 'tom', 'snare', 'hihat', 'kick', 'kick', 'snare', 'hihat'], visualHints: ['Space', 'D', 'A', 'S', 'Space', 'Space', 'A', 'S', 'Space', 'D', 'A', 'S', 'Space', 'Space', 'A', 'S', 'Space', 'D', 'A', 'S', 'Space', 'Space', 'A', 'S', 'Space', 'D', 'A', 'S', 'Space', 'Space', 'A', 'S'] },
    ]
  },
  { 
    id: 'bolly-7', 
    title: 'Kar Gayi Chull', 
    artist: 'Kapoor & Sons', 
    difficulty: 'Medium', 
    bpm: 110,
    url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb6300833d.mp3',
    tutorials: [
      { id: 1, instruction: "Step 1: Simple Hi-Hats", cue: "Ting - Ting - Ting - Ting", targetSequence: ['hihat', 'hihat', 'hihat', 'hihat'], visualHints: ['S', 'S', 'S', 'S'] },
      { id: 2, instruction: "Step 2: Steady Kick", cue: "Boom - Ting - Boom - Ting", targetSequence: ['kick', 'hihat', 'kick', 'hihat'], visualHints: ['Space', 'S', 'Space', 'S'] },
      { id: 3, instruction: "Step 3: Party Tom Groove", cue: "Boom - Ting - Chak - Tak", targetSequence: ['kick', 'hihat', 'snare', 'tom'], visualHints: ['Space', 'S', 'A', 'D'] },
      { id: 4, instruction: "Step 4: Full Song Performance! (Jam)", cue: "Ladki Beautiful, Kar Gayi Chull!", targetSequence: ['kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom'], visualHints: ['Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D', 'Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D', 'Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D', 'Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D'] },
    ]
  },
  { 
    id: 'bolly-8', 
    title: 'Dilbar', 
    artist: 'Satyameva Jayate', 
    difficulty: 'Medium', 
    bpm: 100,
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1101.mp3',
    tutorials: [
      { id: 1, instruction: "Step 1: Deep Kick & Hat", cue: "Boom - Ting - Boom", targetSequence: ['kick', 'hihat', 'kick'], visualHints: ['Space', 'S', 'Space'] },
      { id: 2, instruction: "Step 2: Add the Snare", cue: "Boom - Chak - Boom", targetSequence: ['kick', 'snare', 'kick'], visualHints: ['Space', 'A', 'Space'] },
      { id: 3, instruction: "Step 3: Tom Accent Groove", cue: "Boom - Tak - Chak - Boom", targetSequence: ['kick', 'tom', 'snare', 'kick'], visualHints: ['Space', 'D', 'A', 'Space'] },
      { id: 4, instruction: "Step 4: Full Song Performance! (Jam)", cue: "Dilbar Dilbar...!", targetSequence: ['kick', 'tom', 'snare', 'kick', 'kick', 'tom', 'snare', 'kick', 'kick', 'tom', 'snare', 'kick', 'kick', 'tom', 'snare', 'kick', 'kick', 'tom', 'snare', 'kick', 'kick', 'tom', 'snare', 'kick', 'kick', 'tom', 'snare', 'kick', 'kick', 'tom', 'snare', 'kick'], visualHints: ['Space', 'D', 'A', 'Space', 'Space', 'D', 'A', 'Space', 'Space', 'D', 'A', 'Space', 'Space', 'D', 'A', 'Space', 'Space', 'D', 'A', 'Space', 'Space', 'D', 'A', 'Space', 'Space', 'D', 'A', 'Space', 'Space', 'D', 'A', 'Space'] },
    ]
  },
  { 
    id: 'bolly-9', 
    title: 'Aankh Marey', 
    artist: 'Simmba', 
    difficulty: 'Easy', 
    bpm: 125,
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_1896894982.mp3',
    tutorials: [
      { id: 1, instruction: "Step 1: Basic Hi-Hats", cue: "Ting - Ting - Ting - Ting", targetSequence: ['hihat', 'hihat', 'hihat', 'hihat'], visualHints: ['S', 'S', 'S', 'S'] },
      { id: 2, instruction: "Step 2: Steady Kick Beat", cue: "Boom - Ting - Boom - Ting", targetSequence: ['kick', 'hihat', 'kick', 'hihat'], visualHints: ['Space', 'S', 'Space', 'S'] },
      { id: 3, instruction: "Step 3: Add the Tom Fill", cue: "Boom - Ting - Chak - Tak", targetSequence: ['kick', 'hihat', 'snare', 'tom'], visualHints: ['Space', 'S', 'A', 'D'] },
      { id: 4, instruction: "Step 4: Full Song Performance! (Jam)", cue: "Aankh Marey Ladka Aankh Marey!", targetSequence: ['kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'hihat', 'snare', 'tom'], visualHints: ['Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D', 'Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D', 'Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D', 'Space', 'S', 'A', 'S', 'Space', 'S', 'A', 'D'] },
    ]
  },
  { 
    id: 'bolly-10', 
    title: 'Lungi Dance', 
    artist: 'Chennai Express', 
    difficulty: 'Medium', 
    bpm: 124,
    url: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d0b6ff1101.mp3',
    tutorials: [
      { id: 1, instruction: "Step 1: Quirky Hi-Hats", cue: "Ting - Ting - Ting - Ting", targetSequence: ['hihat', 'hihat', 'hihat', 'hihat'], visualHints: ['S', 'S', 'S', 'S'] },
      { id: 2, instruction: "Step 2: Funky Beat", cue: "Boom - Ting - Chak - Ting", targetSequence: ['kick', 'hihat', 'snare', 'hihat'], visualHints: ['Space', 'S', 'A', 'S'] },
      { id: 3, instruction: "Step 3: Add Tom Variation", cue: "Boom - Tak - Chak", targetSequence: ['kick', 'tom', 'snare'], visualHints: ['Space', 'D', 'A'] },
      { id: 4, instruction: "Step 4: Full Song Performance! (Jam)", cue: "Lungi Dance Lungi Dance!", targetSequence: ['kick', 'hihat', 'snare', 'hihat', 'kick', 'tom', 'snare', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'tom', 'snare', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'tom', 'snare', 'kick', 'hihat', 'snare', 'hihat', 'kick', 'tom', 'snare'], visualHints: ['Space', 'S', 'A', 'S', 'Space', 'D', 'A', 'Space', 'S', 'A', 'S', 'Space', 'D', 'A', 'Space', 'S', 'A', 'S', 'Space', 'D', 'A', 'Space', 'S', 'A', 'S', 'Space', 'D', 'A'] },
    ]
  },
];

export const CHALLENGES: TutorialStep[] = [
  {
    id: 1,
    instruction: "Speed Challenge: 8 Snare hits fast!",
    targetSequence: ['snare', 'snare', 'snare', 'snare', 'snare', 'snare', 'snare', 'snare'],
    visualHints: ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
  },
  {
    id: 2,
    instruction: "Coordination: Kick, Snare, Tom, Crash!",
    targetSequence: ['kick', 'snare', 'tom', 'crash'],
    visualHints: ['Space', 'A', 'D', 'F'],
  },
  {
    id: 3,
    instruction: "The 'Amen Break' (Simplified): Kick, Snare, Kick, Kick, Snare.",
    targetSequence: ['kick', 'snare', 'kick', 'kick', 'snare'],
    visualHints: ['Space', 'A', 'Space', 'Space', 'A'],
  },
];
