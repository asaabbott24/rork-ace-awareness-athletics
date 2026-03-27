export interface CourtIQEntry {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  archetype: 'The Leader' | 'The Killer' | 'The Monk';
  scoutingReport: {
    insight: string;
    keyDrill: string;
  };
  summary: string;
  keyPoints: string[];
  purchaseLink: string;
}

export const COURT_IQ_LIBRARY: CourtIQEntry[] = [
  {
    id: '1',
    title: 'The Mindful Athlete',
    author: 'George Mumford',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781941529065-L.jpg',
    archetype: 'The Monk',
    scoutingReport: {
      insight: 'Flow is not an accident; it is a skill you can build by observing your breath in high-stress moments.',
      keyDrill: 'The "Eye of the Hurricane": In the middle of a chaotic drill, stop for 1 second, center your vision, and breathe.'
    },
    summary: "George Mumford, the mindfulness coach for Phil Jackson's Bulls and Lakers, reveals how to cultivate 'pure performance' by quieting the mind. He teaches that the zone isn't a magical place you hope to find, but a state of being you can access through conscious breathing and mindfulness. The book demystifies the 'zone' and provides practical techniques to clear the mind, allowing instinct and training to take over without the interference of doubt or anxiety. Mumford explains that mindfulness is not about relaxation, but about being fully present and engaged in the moment, enabling athletes to perform at their peak even under immense pressure.",
    keyPoints: [
      "The 'Eye of the Hurricane': Finding stillness amidst chaos is the key to elite performance.",
      "A.S.S. (Awareness, Acceptance, Action): The three steps to mindful performance – first be aware of your state, accept it without judgment, then take right action.",
      "Comfort Zone vs. Growth Zone: Why you must embrace discomfort to evolve; true growth only happens when you step outside your safe space.",
      "Five Superpowers: Mindfulness, Concentration, Insight, Right Effort, and Trust.",
      "One Breath, One Mind: Synchronizing your breath with your team creates a collective flow state."
    ],
    purchaseLink: 'https://www.amazon.com/dp/1941529062'
  },
  {
    id: '2',
    title: 'Eleven Rings',
    author: 'Phil Jackson',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780143125341-L.jpg',
    archetype: 'The Leader',
    scoutingReport: {
      insight: 'The strength of the wolf is the pack, and the strength of the pack is the wolf. Leadership is about sacrificing ego for the group.',
      keyDrill: 'The "Silent Captain": Go an entire scrimmage without calling a foul or complaining. Lead only by encouragement and hustle.'
    },
    summary: "The Zen Master shares his leadership philosophy that won 11 NBA championships. Jackson blends Native American traditions, Zen Buddhism, and basketball strategy to show how to build a tribe that plays as one. It's a masterclass in managing egos and finding the sacred in the sport. Jackson details how he managed superstars like Jordan, Pippen, Kobe, and Shaq, not by forcing them into a system, but by helping them discover their own role within the collective. He emphasizes the importance of compassion, mindfulness, and the spiritual connection between teammates.",
    keyPoints: [
      "Bench the Ego: Personal glory must be sacrificed for the team's success; the 'we' is always greater than the 'me'.",
      "Compassionate Leadership: Understanding players' emotional needs unlocks their potential better than fear or anger.",
      "One Breath, One Mind: Synchronizing the team's collective focus through shared mindfulness practices.",
      "Tribal Leadership: Creating a culture where the team regulates itself and holds each other accountable.",
      "The Tao of Basketball: flowing with the game rather than trying to force it."
    ],
    purchaseLink: 'https://www.amazon.com/dp/0143125346'
  },
  {
    id: '3',
    title: 'Relentless',
    author: 'Tim S. Grover',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781476714202-L.jpg',
    archetype: 'The Killer',
    scoutingReport: {
      insight: "Cleaners don't compete with others; they find the opponent's weakness and attack it until the game is over.",
      keyDrill: 'The "Dark Side": Write down the one criticism that makes you angriest. Use that anger as fuel for your next set.'
    },
    summary: "Tim Grover, trainer to Jordan, Kobe, and Wade, categorizes players into Coolers, Closers, and Cleaners. 'Cleaners' are the unstoppable elite who are addicted to the result and don't care about being liked. This book is a manifesto for the ruthless pursuit of excellence. It challenges you to stop thinking and start doing, to trust your instincts, and to embrace the 'dark side' of your competitive nature. Grover argues that being 'good' is the enemy of being great, and that true dominance requires a level of selfishness and obsession that most people are afraid to admit.",
    keyPoints: [
      "The Cleaner Mindset: Never satisfied, always demanding more; when you achieve a goal, you immediately set a higher one.",
      "Don't Think: Instincts must take over; thinking slows you down and introduces doubt.",
      "Pressure is a Privilege: Embrace the high-stakes moments that others fear; Cleaners thrive when the game is on the line.",
      "The Dark Side: Your anger, your fear, and your insecurities can be powerful fuel if channeled correctly.",
      "Decide, Commit, Act, Succeed, Repeat: The simple but brutal cycle of the Cleaner."
    ],
    purchaseLink: 'https://www.amazon.com/dp/1476714207'
  },
  {
    id: '4',
    title: 'Mind Gym',
    author: 'Gary Mack',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780071395977-L.jpg',
    archetype: 'The Monk',
    scoutingReport: {
      insight: 'Your body can only go where your mind has already been. Visualization is just as physical as lifting weights.',
      keyDrill: 'The "Mental Replay": Every night, replay your best play of the day in slow motion 10 times before sleep.'
    },
    summary: "Gary Mack argues that sports are 90% mental. This book provides bite-sized lessons on how to build mental toughness, overcome slumps, and stay positive. It's a practical guide to training your brain just as hard as you train your body. Mack uses real-world examples from professional athletes to illustrate how mental skills like visualization, relaxation, and self-talk can be the difference between winning and losing. He emphasizes that mental toughness is a skill that can be learned and practiced, just like shooting a free throw.",
    keyPoints: [
      "The 90% Rule: The mental game dictates physical performance; talent is not enough.",
      "Breathe and Believe: Using breath to reset confidence instantly and clear negative thoughts.",
      "Visualization: Creating a detailed mental movie of success before it happens pre-programs your muscles.",
      "Control the Controllables: Focus only on what you can change—your effort and your attitude.",
      "Play Present: The only shot that matters is the one you are taking right now."
    ],
    purchaseLink: 'https://www.amazon.com/dp/0071395970'
  },
  {
    id: '5',
    title: 'The Mamba Mentality',
    author: 'Kobe Bryant',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780374201234-L.jpg',
    archetype: 'The Killer',
    scoutingReport: {
      insight: 'If you want to be great, you have to obsess over the details that everyone else ignores.',
      keyDrill: 'The "4 A.M. Contract": Commit to one workout this week that starts before the sun comes up. No excuses.'
    },
    summary: "Kobe Bryant breaks down his famous work ethic and analytical approach to basketball. Through stunning photos and detailed breakdown, he explains how he prepared mentally and physically to dominate. It's a look inside the mind of a master craftsman. Kobe reveals his meticulous study of opponents, his obsession with footwork, and his relentless drive to improve every single day. He discusses playing through pain, studying game film, and the importance of mentorship. This book is a visual and intellectual journey into the heart of a legend.",
    keyPoints: [
      "Process Over Outcome: Fall in love with the daily grind, not just the rings; the journey is the reward.",
      "Detail Obsession: Studying every angle, footwork, and opponent tendency to find the slightest edge.",
      "No Off Days: Consistency is the only secret weapon; greatness is built in the shadows.",
      "Be a Sponge: Learn from everyone, from past legends to current rivals.",
      "Emotional Detachment: Do not let highs or lows affect your focus on the task at hand."
    ],
    purchaseLink: 'https://www.amazon.com/dp/0374201234'
  },
  {
    id: '6',
    title: 'Can\'t Hurt Me',
    author: 'David Goggins',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781544512280-L.jpg',
    archetype: 'The Killer',
    scoutingReport: {
      insight: 'The 40% Rule: When your mind is telling you that you\'re done, you\'re really only 40% done.',
      keyDrill: 'The "Accountability Mirror": Every morning, look yourself in the eye and speak your goals and failures out loud.'
    },
    summary: "David Goggins shares his harrowing life story from abuse and obesity to becoming a Navy SEAL and ultramarathon runner. He teaches that most of us tap into only 40% of our capabilities and that calloussing the mind is the key to unlocking the rest. Goggins challenges the reader to embrace suffering as a path to growth. He introduces the concept of the 'cookie jar'—a mental reservoir of past victories to draw upon when things get tough. His story is a raw, unfiltered testament to the power of the human will to overcome any obstacle.",
    keyPoints: [
      "The 40% Rule: You have a reserve tank of energy you haven't touched yet; push past your perceived limits.",
      "Callous Your Mind: Do things you hate to do to build mental armor against life's challenges.",
      "Cookie Jar: Remember past victories to fuel you through current suffering.",
      "Taking Souls: Using your opponent's doubt and your own excellence to dominate psychologically.",
      "The Accountability Mirror: Facing your true self, flaws and all, to drive improvement."
    ],
    purchaseLink: 'https://www.amazon.com/dp/1544512287'
  },
  {
    id: '7',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
    archetype: 'The Monk',
    scoutingReport: {
      insight: 'Your intuitive System 1 makes quick decisions, but System 2 analysis is what separates good players from great ones.',
      keyDrill: 'The "Pause Protocol": Before every major decision in practice, count to 3 and engage deliberate thinking.'
    },
    summary: "Nobel laureate Daniel Kahneman explores the two systems that drive the way we think. System 1 is fast and emotional; System 2 is slower and more logical. Understanding these helps athletes avoid mental errors and make better decisions under pressure. While not explicitly a sports book, its insights into decision-making, bias, and intuition are invaluable for high-level competition. It teaches you how to trust your gut when appropriate, but also how to check it against logic when time permits, leading to smarter play.",
    keyPoints: [
      "System 1 vs. System 2: Recognizing when to react instinctively and when to analyze deeply.",
      "Cognitive Biases: How your brain tricks you into overconfidence or fear, and how to mitigate them.",
      "Loss Aversion: Why the pain of losing hurts more than the joy of winning, and how this affects risk-taking.",
      "The Illusion of Validity: Being aware that confidence does not imply accuracy.",
      "Priming: How subtle environmental cues influence your behavior and performance."
    ],
    purchaseLink: 'https://www.amazon.com/dp/0374533555'
  },
  {
    id: '8',
    title: 'Legacy',
    author: 'James Kerr',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781472103536-L.jpg',
    archetype: 'The Leader',
    scoutingReport: {
      insight: 'Sweep the sheds. Never be too big to do the small things that need to be done.',
      keyDrill: 'The "Humble Task": After every practice, be the first to help clean up equipment without being asked.'
    },
    summary: "James Kerr goes deep into the heart of the All Blacks rugby team, the most successful professional sporting outfit in history. He reveals 15 practical lessons for leadership and business, centering on character, adaptability, and purpose. The book explores how the All Blacks maintain their dominance not just through physical skill, but through a deeply ingrained culture of humility, excellence, and collective responsibility. It's a blueprint for building a high-performing team that leaves a lasting legacy.",
    keyPoints: [
      "Sweep the Sheds: Humility is the foundation of greatness; no one is bigger than the team.",
      "Champions Do Extra: The standard is set by what you do when no one is watching.",
      "Pass the Ball: Leaders create leaders, not followers; empower those around you.",
      "No Dickheads: Character matters as much as talent; bad attitudes destroy culture.",
      "Whanau: Treating your team like family creates unbreakable bonds."
    ],
    purchaseLink: 'https://www.amazon.com/dp/1472103536'
  }
];
