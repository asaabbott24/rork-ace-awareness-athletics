export interface JournalModule {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  prompts: string[];
}

export const JOURNAL_MODULES: JournalModule[] = [
  {
    id: 'pre_game',
    title: 'Pre-Game Visualization',
    subtitle: 'Script your performance before you step on the court.',
    color: '#00f0ff',
    prompts: [
      'What is your primary defensive focus today?',
      'Visualize your first 3 shots going in. Describe the feeling.',
      'One word to define your energy today:'
    ]
  },
  {
    id: 'post_game',
    title: 'The Game Tape',
    subtitle: 'Analyze the data. Leave the emotion.',
    color: '#ff00aa',
    prompts: [
      'What was your biggest "Clutch Moment" today?',
      'Where did you lose focus? Be honest.',
      'One adjustment you will make for tomorrow:'
    ]
  },
  {
    id: 'free_throw',
    title: 'Free Throw Line',
    subtitle: 'Clear your head. Vent it out.',
    color: '#ffffff',
    prompts: ['What is on your mind?']
  }
];

export interface StatSheet {
  confidence: number;
  focus: number;
  aggression: number;
}

export interface MindGymEntry {
  id: string;
  timestamp: string;
  moduleId: string;
  moduleTitle: string;
  stats: StatSheet;
  responses: { prompt: string; response: string }[];
}

export const STAT_LABELS = {
  confidence: { low: 'Shaky', high: 'Unbreakable' },
  focus: { low: 'Distracted', high: 'Laser' },
  aggression: { low: 'Passive', high: 'Killer Mode' },
};
