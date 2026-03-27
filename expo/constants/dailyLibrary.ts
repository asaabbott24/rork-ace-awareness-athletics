export type ContentType = 'NBA' | 'ZEN' | 'AFFIRMATION';

export interface DailyDropItem {
  id: string;
  text: string;
  author: string;
  type: ContentType;
}

export const MASTER_LIBRARY: DailyDropItem[] = [
  // --- NBA LEGENDS (The Killer) ---
  { id: '1', type: 'NBA', author: 'Kobe Bryant', text: 'Everything negative - pressure, challenges - is all an opportunity for me to rise.' },
  { id: '2', type: 'NBA', author: 'Michael Jordan', text: 'I have failed over and over and over again in my life. And that is why I succeed.' },
  { id: '3', type: 'NBA', author: 'Larry Bird', text: 'Push yourself again. Do not give an inch until the final buzzer sounds.' },
  { id: '4', type: 'NBA', author: 'Allen Iverson', text: 'I do not want to be Jordan. I do not want to be Bird or Isiah. I want to look in the mirror and say I did it my way.' },
  { id: '5', type: 'NBA', author: 'Tim Duncan', text: 'Good, better, best. Never let it rest. Until your good is better and your better is best.' },
  { id: '6', type: 'NBA', author: 'Kevin Garnett', text: 'Anything is possible!' },
  { id: '7', type: 'NBA', author: 'Dwyane Wade', text: 'If you do not believe in yourself, no one is going to believe in you.' },
  { id: '8', type: 'NBA', author: 'LeBron James', text: 'I like criticism. It makes you strong.' },

  // --- MINDFULNESS (The Monk) ---
  { id: '9', type: 'ZEN', author: 'Phil Jackson', text: 'The strength of the team is each individual member. The strength of each member is the team.' },
  { id: '10', type: 'ZEN', author: 'Bruce Lee', text: 'Empty your mind, be formless, shapeless - like water.' },
  { id: '11', type: 'ZEN', author: 'George Mumford', text: 'Respond from the center of the hurricane, rather than reacting to the chaos of the storm.' },
  { id: '12', type: 'ZEN', author: 'Marcus Aurelius', text: 'You have power over your mind - not outside events. Realize this, and you will find strength.' },
  { id: '13', type: 'ZEN', author: 'Miyamoto Musashi', text: 'Perception is strong and sight weak. In strategy it is important to see distant things as if they were close and to take a distanced view of close things.' },
  { id: '14', type: 'ZEN', author: 'Lao Tzu', text: 'Nature does not hurry, yet everything is accomplished.' },
  { id: '15', type: 'ZEN', author: 'Seneca', text: 'We suffer more often in imagination than in reality.' },
  { id: '16', type: 'ZEN', author: 'Thich Nhat Hanh', text: 'Breathe in deeply to bring your mind home to your body.' },

  // --- AFFIRMATIONS (The Leader) ---
  { id: '17', type: 'AFFIRMATION', author: 'Self', text: 'I control my pace. I do not let the defense speed me up.' },
  { id: '18', type: 'AFFIRMATION', author: 'Self', text: 'My shot is fluid. My mind is clear. The rim is huge.' },
  { id: '19', type: 'AFFIRMATION', author: 'Self', text: 'I am the calmest person in the gym.' },
  { id: '20', type: 'AFFIRMATION', author: 'Self', text: 'Fatigue is a feeling, not a reality. I can go harder.' },
  { id: '21', type: 'AFFIRMATION', author: 'Self', text: 'I embrace the pressure. I was built for this moment.' },
  { id: '22', type: 'AFFIRMATION', author: 'Self', text: 'My defense is suffocating. I anticipate every move.' },
  { id: '23', type: 'AFFIRMATION', author: 'Self', text: 'I am locked in. Nothing can break my focus.' },
  { id: '24', type: 'AFFIRMATION', author: 'Self', text: 'I trust my training. My body knows what to do.' },
];
