export interface VisionDrill {
  id: string;
  title: string;
  durationSec: number;
  description: string;
  coachNotes: string;
  audioCues: {
    atSecond: number;
    text: string;
  }[];
}

export const VISION_DRILLS: VisionDrill[] = [
  {
    id: 'form_shooting',
    title: 'Form Shooting (Close)',
    durationSec: 180,
    description: 'One hand only. Focus on the snap.',
    coachNotes: 'Keep your elbow tucked. Hold the follow through.',
    audioCues: [
      { atSecond: 10, text: 'Check your feet. Shoulder width.' },
      { atSecond: 60, text: 'Check your elbow. Keep it tucked.' },
      { atSecond: 120, text: 'Hold your follow through.' },
      { atSecond: 150, text: 'Last 30 seconds. Finish strong.' }
    ]
  },
  {
    id: 'defensive_slide',
    title: 'Defensive Slides',
    durationSec: 60,
    description: 'Lane line to lane line. Stay low.',
    coachNotes: "Chest up. Don't cross your feet.",
    audioCues: [
      { atSecond: 15, text: 'Stay low. Chest up.' },
      { atSecond: 30, text: 'Pick up the pace!' },
      { atSecond: 45, text: "Faster! Don't quit." }
    ]
  },
  {
    id: 'ball_handling',
    title: 'Stationary Handles',
    durationSec: 120,
    description: 'Pound dribbles. Eyes up.',
    coachNotes: 'Keep your head up. Feel the ball.',
    audioCues: [
      { atSecond: 20, text: 'Keep your eyes up. Feel the ball.' },
      { atSecond: 60, text: 'Switch hands. Same intensity.' },
      { atSecond: 90, text: 'Low and tight. Control the ball.' }
    ]
  },
  {
    id: 'free_throws',
    title: 'Free Throw Routine',
    durationSec: 90,
    description: 'Build your ritual. Same routine every time.',
    coachNotes: 'Breathe. Visualize. Execute.',
    audioCues: [
      { atSecond: 10, text: 'Find your spot. Same stance every time.' },
      { atSecond: 30, text: 'Deep breath. Visualize the ball going in.' },
      { atSecond: 60, text: 'Trust your form. Soft touch.' }
    ]
  }
];
