export type ProtocolCategory = 'Breath' | 'Yoga' | 'Visual';
export type ContentMode = 'pre' | 'post' | 'all';

export interface Protocol {
  id: string;
  title: string;
  category: ProtocolCategory;
  duration: string;
  description: string;
  athleteReference?: string;
  steps: string[];
  imageUrl: string;
  mode: ContentMode;
  voiceUrl?: string;
  backgroundUrl?: string;
}

export interface DailyContent {
  quote: {
    text: string;
    author: string;
    context?: string;
    mode: ContentMode;
  };
  affirmation: {
    text: string;
    mode: ContentMode;
  };
  proInsight: {
    title: string;
    athlete: string;
    summary: string;
    imageUrl: string;
    mode: ContentMode;
  };
}

export interface JournalPrompt {
  id: string;
  prompt: string;
  category: string;
}

export const protocols: Protocol[] = [
  {
    id: 'breath-1',
    title: 'Box Breathing',
    category: 'Breath',
    duration: '4 min',
    description: 'Navy SEAL technique used by elite athletes to calm the nervous system before high-pressure situations.',
    athleteReference: 'Used by LeBron James before playoff games',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    mode: 'all',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    backgroundUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    steps: [
      'Find a comfortable seated position with your spine straight',
      'Close your eyes and exhale completely through your mouth',
      'Inhale slowly through your nose for 4 seconds, filling your lungs',
      'Hold your breath at the top for 4 seconds',
      'Exhale slowly through your mouth for 4 seconds',
      'Hold at the bottom (empty lungs) for 4 seconds',
      'Repeat this cycle 4-8 times',
      'Return to normal breathing and notice the calm',
    ],
  },
  {
    id: 'breath-2',
    title: '4-7-8 Reset',
    category: 'Breath',
    duration: '3 min',
    description: 'Rapid relaxation technique to recover between quarters or during timeouts.',
    athleteReference: 'Kobe Bryant\'s clutch moment ritual',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    mode: 'post',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    backgroundUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    steps: [
      'Sit with your back supported or stand tall',
      'Place the tip of your tongue behind your upper front teeth',
      'Exhale completely through your mouth with a whoosh sound',
      'Inhale quietly through your nose for 4 seconds',
      'Hold your breath for 7 seconds',
      'Exhale forcefully through your mouth for 8 seconds',
      'This completes one cycle - repeat 3 more times',
      'Practice before free throws or penalty shots',
    ],
  },
  {
    id: 'breath-3',
    title: 'Warrior Breath',
    category: 'Breath',
    duration: '5 min',
    description: 'Energizing breathwork to activate your competitive fire before game time.',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    mode: 'pre',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    backgroundUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    steps: [
      'Stand tall with feet shoulder-width apart',
      'Take 3 normal breaths to center yourself',
      'Begin rapid, powerful inhales and exhales through the nose',
      'Keep the breath equal - 1 second in, 1 second out',
      'Continue for 30 breaths',
      'On the last exhale, hold for as long as comfortable',
      'Inhale deeply and hold for 15 seconds',
      'Release and feel the energy surge through your body',
    ],
  },
  {
    id: 'yoga-1',
    title: 'Pre-Game Flow',
    category: 'Yoga',
    duration: '12 min',
    description: 'Dynamic stretching sequence to prime your body and mind for peak performance.',
    athleteReference: 'Adapted from Kevin Love\'s anxiety management routine',
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800',
    mode: 'pre',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    backgroundUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    steps: [
      'Start in Mountain Pose - ground through your feet, crown reaching up',
      'Flow into Forward Fold - let your head hang heavy',
      'Step back to Downward Dog - pedal your feet to wake up the calves',
      'Flow forward to Plank - hold for 5 breaths, building core heat',
      'Lower to Cobra - open your chest, shoulders back',
      'Push back to Downward Dog',
      'Step forward to Low Lunge - right foot forward, hip flexor stretch',
      'Repeat on the left side',
      'Return to Mountain Pose - feel your body primed and ready',
    ],
  },
  {
    id: 'yoga-2',
    title: 'Hip Mobility Reset',
    category: 'Yoga',
    duration: '10 min',
    description: 'Essential hip openers for explosive lateral movement and injury prevention.',
    athleteReference: 'Part of Steph Curry\'s daily maintenance',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800',
    mode: 'all',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    backgroundUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    steps: [
      'Begin in Figure 4 stretch on your back - right ankle over left knee',
      'Pull your left thigh toward your chest - hold 60 seconds',
      'Switch sides and repeat',
      'Come to seated position for Pigeon Pose prep',
      'Bring right shin parallel to front of mat',
      'Walk hands forward, folding over the leg',
      'Hold for 90 seconds, breathing into the hip',
      'Switch sides - notice any differences left to right',
      'Finish in Happy Baby pose - grab outer feet, knees wide',
    ],
  },
  {
    id: 'yoga-3',
    title: 'Recovery Restoration',
    category: 'Yoga',
    duration: '15 min',
    description: 'Gentle restorative sequence for post-game recovery and nervous system reset.',
    imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800',
    mode: 'post',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    backgroundUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    steps: [
      'Lie on your back with legs up the wall',
      'Arms out to sides, palms up - stay here for 3 minutes',
      'Slowly lower legs and hug knees to chest',
      'Rock gently side to side to massage the lower back',
      'Come into Supine Twist - knees fall to the right',
      'Hold for 2 minutes, then switch sides',
      'Return to center for Savasana',
      'Cover your eyes, let your body melt into the floor',
      'Stay here for 5 minutes minimum - you\'ve earned this rest',
    ],
  },
  {
    id: 'visual-1',
    title: 'Free Throw Focus',
    category: 'Visual',
    duration: '8 min',
    description: 'Mental rehearsal protocol to build automatic confidence at the line.',
    athleteReference: 'Michael Jordan shot 83.5% using this technique',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    mode: 'pre',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    backgroundUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    steps: [
      'Close your eyes and take 3 deep breaths',
      'See yourself walking to the free throw line',
      'Feel the ball in your hands - its texture, its weight',
      'Hear the crowd fade to silence',
      'See the rim clearly - orange against the backboard',
      'Feel your routine: dribbles, spin the ball, deep breath',
      'Watch your perfect release in slow motion',
      'See the ball arc perfectly through the net - swish',
      'Feel the confidence build with each successful shot',
      'Repeat this sequence 10 times before opening your eyes',
    ],
  },
  {
    id: 'visual-2',
    title: 'Clutch Performance',
    category: 'Visual',
    duration: '10 min',
    description: 'Visualize thriving under pressure in game-winning scenarios.',
    athleteReference: 'Kobe Bryant\'s "Mamba Mentality" technique',
    imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338bbe75c8e?w=800',
    mode: 'pre',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    backgroundUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    steps: [
      'Find a quiet space and close your eyes',
      'Set the scene: final seconds, your team down by 1',
      'Feel your heartbeat - acknowledge it, don\'t fight it',
      'See your teammate inbound the ball to you',
      'Feel your feet on the court, your balance perfect',
      'Time slows down - you see the defense clearly',
      'Make your move - every step is decisive, confident',
      'Rise up for the shot - feel the release',
      'Watch the ball rotate perfectly toward the rim',
      'Hear nothing but net - feel the team celebrate',
      'Open your eyes carrying that winning feeling',
    ],
  },
  {
    id: 'visual-3',
    title: 'Defensive Lock-In',
    category: 'Visual',
    duration: '6 min',
    description: 'Mental preparation for shutting down your opponent with elite focus.',
    athleteReference: 'Inspired by Gary Payton\'s "The Glove" mindset',
    imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800',
    mode: 'all',
    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    backgroundUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    steps: [
      'Close your eyes and visualize your defensive stance',
      'Feel your feet quick and light, ready to move',
      'See your opponent in front of you',
      'Watch their hips - they tell you everything',
      'Anticipate their crossover - you\'re already there',
      'Feel the satisfaction of staying in front',
      'See yourself channeling them to your help',
      'Visualize the steal - quick hands, clean take',
      'Feel the momentum shift - you own this possession',
      'Carry this energy into every defensive play',
    ],
  },
];

export const dailyContent: DailyContent = {
  quote: {
    text: "I've missed more than 9,000 shots in my career. I've lost almost 300 games. Twenty-six times I've been trusted to take the game-winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.",
    author: 'Michael Jordan',
    context: '1997 Nike Commercial',
    mode: 'pre',
  },
  affirmation: {
    text: "I am mentally stronger than any obstacle. My focus is unbreakable. I perform at my best when it matters most.",
    mode: 'pre',
  },
  proInsight: {
    title: 'How Steph Curry Uses Breathwork',
    athlete: 'Stephen Curry',
    summary: 'Before every free throw, Curry takes exactly 3 seconds to exhale completely, emptying his mind along with his lungs. This micro-ritual activates his parasympathetic nervous system, dropping his heart rate by up to 10 BPM. The result? An 91% free throw percentage when the game is on the line.',
    imageUrl: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800',
    mode: 'pre',
  },
};

export const postGameContent: DailyContent = {
  quote: {
    text: "Recovery is not a luxury, it's a necessity. Champions understand that rest is where growth happens.",
    author: 'Tim Grover',
    context: 'Relentless: From Good to Great to Unstoppable',
    mode: 'post',
  },
  affirmation: {
    text: "I honor my body's need to recover. Rest is part of my training. I grow stronger in stillness.",
    mode: 'post',
  },
  proInsight: {
    title: 'LeBron James $1.5M Recovery Routine',
    athlete: 'LeBron James',
    summary: 'LeBron invests heavily in recovery protocols including hyperbaric chambers, cryotherapy, and meditation. His post-game routine prioritizes mental decompression just as much as physical recovery. This holistic approach has extended his elite performance well into his late 30s.',
    imageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800',
    mode: 'post',
  },
};

export const journalPrompts: JournalPrompt[] = [
  { id: 'j1', prompt: 'What distracted you during practice today?', category: 'Focus' },
  { id: 'j2', prompt: 'Describe a moment when you felt completely in the zone.', category: 'Flow State' },
  { id: 'j3', prompt: 'What negative thought keeps coming back during games?', category: 'Mental Barriers' },
  { id: 'j4', prompt: 'Who is your mental game role model and why?', category: 'Inspiration' },
  { id: 'j5', prompt: 'What does being clutch mean to you?', category: 'Pressure' },
  { id: 'j6', prompt: 'Write about a time you bounced back from a mistake.', category: 'Resilience' },
  { id: 'j7', prompt: 'What would playing without fear look like for you?', category: 'Confidence' },
];

export const getCategoryIcon = (category: ProtocolCategory): string => {
  switch (category) {
    case 'Breath':
      return 'wind';
    case 'Yoga':
      return 'stretch';
    case 'Visual':
      return 'eye';
    default:
      return 'circle';
  }
};

export const getCategoryColor = (category: ProtocolCategory): string => {
  switch (category) {
    case 'Breath':
      return '#3B82F6';
    case 'Yoga':
      return '#10B981';
    case 'Visual':
      return '#F59E0B';
    default:
      return '#71717A';
  }
};
