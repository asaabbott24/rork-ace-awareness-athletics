export interface FlowDimension {
  id: string;
  title: string;
  definition: string;
  athleteExperience: string;
  science: string;
  icon: string;
}

export interface FlowNeurochemistry {
  id: string;
  title: string;
  chemical: string;
  effect: string;
  athleteFeeling: string;
  color: string;
}

export interface CultivationDrill {
  id: string;
  title: string;
  duration: string;
  instruction: string;
  mechanism: string;
  whenToUse: string;
}

export interface FlowChapterData {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export const FLOW_CHAPTERS: FlowChapterData[] = [
  { id: 'theory', title: 'The 8 Dimensions', icon: 'BookOpen', color: '#00D9FF' },
  { id: 'neuro', title: 'Neurochemistry', icon: 'FlaskConical', color: '#FF6B6B' },
  { id: 'channel', title: 'Flow Channel', icon: 'TrendingUp', color: '#4ADE80' },
  { id: 'drills', title: 'Cultivation', icon: 'Target', color: '#FFD60A' },
];

export const FLOW_DIMENSIONS: FlowDimension[] = [
  {
    id: 'challenge_skill',
    title: 'Challenge-Skill Balance',
    definition: 'The sweet spot where the difficulty of the task matches your ability level.',
    athleteExperience: 'You feel stretched but not overwhelmed. The game feels "just right"—hard enough to demand focus, but within your reach.',
    science: 'When challenge exceeds skill, the amygdala triggers anxiety. When skill exceeds challenge, the brain seeks stimulation elsewhere (boredom). Balance activates the dorsal striatum for optimal engagement.',
    icon: 'Scale',
  },
  {
    id: 'action_awareness',
    title: 'Merging of Action & Awareness',
    definition: 'Action becomes automatic. You stop "thinking" about the move and simply execute.',
    athleteExperience: 'Your crossover happens before you consciously decide to do it. The ball feels like an extension of your hand. You and the game become one.',
    science: 'The prefrontal cortex (your "thinking" brain) quiets down—a state called Transient Hypofrontality. Motor patterns stored in the basal ganglia take over.',
    icon: 'Merge',
  },
  {
    id: 'clear_goals',
    title: 'Clear Goals',
    definition: 'You know exactly what you need to do in each moment.',
    athleteExperience: 'No confusion. No hesitation. Get the bucket. Lock up your man. Box out. Each possession has crystal clear intent.',
    science: 'Clear goals reduce cognitive load, freeing up working memory. The anterior cingulate cortex can focus on execution rather than decision-making.',
    icon: 'Target',
  },
  {
    id: 'immediate_feedback',
    title: 'Immediate Feedback',
    definition: 'You instantly know if your action was successful or not.',
    athleteExperience: 'The swish tells you the shot was pure. The defender\'s stumble tells you the crossover worked. No waiting—just instant data.',
    science: 'Rapid feedback loops strengthen neural pathways through dopaminergic reinforcement. The brain\'s reward system responds in milliseconds.',
    icon: 'Zap',
  },
  {
    id: 'concentration',
    title: 'Total Concentration',
    definition: 'Complete absorption in the activity. The rest of the world disappears.',
    athleteExperience: 'You don\'t hear the crowd. You don\'t see the scouts. There\'s only the court, the ball, and the next play.',
    science: 'Attentional networks narrow to task-relevant stimuli. The Default Mode Network (mind-wandering) goes offline, eliminating distracting thoughts.',
    icon: 'Focus',
  },
  {
    id: 'control',
    title: 'Sense of Control',
    definition: 'A feeling of mastery over your actions and their outcomes.',
    athleteExperience: 'You feel unstoppable. Not arrogant—just certain. You trust your body to do what you\'ve trained it to do.',
    science: 'The insular cortex integrates body awareness with confidence. High HRV (heart rate variability) correlates with this perceived control.',
    icon: 'Shield',
  },
  {
    id: 'loss_self',
    title: 'Loss of Self-Consciousness',
    definition: 'The inner critic goes silent. You stop judging yourself.',
    athleteExperience: 'No more "what if I miss?" No more "they\'re watching." The ego dissolves. You just play.',
    science: 'The medial prefrontal cortex—the brain\'s "self-referential" center—deactivates. Without self-judgment, fear of failure disappears.',
    icon: 'Ghost',
  },
  {
    id: 'time_transformation',
    title: 'Transformation of Time',
    definition: 'Time seems to speed up, slow down, or become irrelevant.',
    athleteExperience: 'The game-winner feels like slow motion. The entire 4th quarter feels like 5 minutes. Time bends to your will.',
    science: 'The brain\'s internal clock (in the basal ganglia) is disrupted when fully absorbed. Dopamine floods alter time perception.',
    icon: 'Clock',
  },
];

export const FLOW_NEUROCHEMISTRY: FlowNeurochemistry[] = [
  {
    id: 'dopamine',
    title: 'Dopamine',
    chemical: 'The Drive Molecule',
    effect: 'Increases focus, motivation, and the desire to pursue goals. Makes the task feel rewarding.',
    athleteFeeling: 'You WANT the ball. You WANT to take the shot. Every possession feels like an opportunity, not a burden.',
    color: '#FF6B6B',
  },
  {
    id: 'norepinephrine',
    title: 'Norepinephrine',
    chemical: 'The Alertness Signal',
    effect: 'Sharpens attention, increases arousal, and prepares the body for action.',
    athleteFeeling: 'Everything feels heightened. Your reactions are faster. You see the play develop before it happens.',
    color: '#FFD60A',
  },
  {
    id: 'endorphins',
    title: 'Endorphins',
    chemical: 'The Pain Killer',
    effect: 'Blocks pain and creates euphoria. Allows you to push through physical discomfort.',
    athleteFeeling: 'Your legs should be burning, but you don\'t feel it. The fatigue is there, but it doesn\'t matter.',
    color: '#4ADE80',
  },
  {
    id: 'anandamide',
    title: 'Anandamide',
    chemical: 'The Bliss Chemical',
    effect: 'Induces a sense of calm, well-being, and lateral thinking. Enhances pattern recognition.',
    athleteFeeling: 'A warm sense of ease. Creative plays appear out of nowhere. The game feels effortless.',
    color: '#A78BFA',
  },
  {
    id: 'serotonin',
    title: 'Serotonin',
    chemical: 'The Mood Stabilizer',
    effect: 'Provides emotional stability and a sense of satisfaction after the performance.',
    athleteFeeling: 'Post-game calm. A deep sense of fulfillment. You did what you were built to do.',
    color: '#00D9FF',
  },
];

export const CULTIVATION_DRILLS: CultivationDrill[] = [
  {
    id: 'micro_flow',
    title: 'The Micro-Flow Drill',
    duration: '2 min',
    instruction: 'Pick up a basketball. For 2 minutes, focus ONLY on the texture of the leather—the bumps, the grooves, the seams. Let your fingers explore. When your mind wanders, gently return.',
    mechanism: 'Trains the attentional networks to focus on a single sensory input, building the "concentration muscle" required for flow.',
    whenToUse: 'Pre-game warm-up or when feeling scattered.',
  },
  {
    id: 'one_percent',
    title: 'The 1% Adjustment',
    duration: 'Ongoing',
    instruction: 'If you feel bored during a drill, increase your speed or add a constraint (weaker hand only). If you feel anxious, simplify the task or slow down by 10%. Stay in the channel.',
    mechanism: 'Real-time calibration of the challenge-skill balance. This is how you actively "steer" yourself into flow.',
    whenToUse: 'During any training session when you notice yourself drifting out of the zone.',
  },
  {
    id: 'clear_intent',
    title: 'Clear Intent Setting',
    duration: '30 sec',
    instruction: 'Before each possession (or drill rep), state ONE clear goal in your mind. "Attack the left hip." "Snap the wrist." "Win the rebound." No vague intentions.',
    mechanism: 'Reduces cognitive load on the anterior cingulate cortex, freeing mental resources for execution rather than decision-making.',
    whenToUse: 'Every single play. Make it a habit.',
  },
  {
    id: 'next_play',
    title: 'The Next Play Reset',
    duration: '3 breaths',
    instruction: 'After any outcome (make or miss, win or loss), take 3 deep breaths. On the exhale, release the previous play. It no longer exists. Enter the new possession empty.',
    mechanism: 'Prevents the amygdala from hijacking focus with emotional residue. Clears working memory for the next task.',
    whenToUse: 'After every mistake, turnover, or even after a great play. Stay present.',
  },
  {
    id: 'friction_audit',
    title: 'The Friction Audit',
    duration: '5 min (post-session)',
    instruction: 'After training, ask: "What pulled me OUT of the zone today?" Was it self-doubt? Distractions? Fatigue? Unclear goals? Identify one friction point to eliminate tomorrow.',
    mechanism: 'Builds metacognitive awareness of flow blockers. Over time, you systematically remove barriers to entry.',
    whenToUse: 'Journaling after every practice or game.',
  },
  {
    id: 'sensory_anchor',
    title: 'The Sensory Anchor',
    duration: '10 sec',
    instruction: 'Create a physical trigger for flow. Before tip-off, press your fingertips together, take one deep breath, and visualize yourself IN the zone. Repeat before every game until it becomes automatic.',
    mechanism: 'Classical conditioning. Over time, the physical gesture primes the nervous system for the flow state through associative learning.',
    whenToUse: 'Pre-game ritual, before big moments, or when you need to reset mid-game.',
  },
];

export const FLOW_HISTORY = {
  title: 'The Evolution of The Zone',
  sections: [
    {
      era: 'Ancient Wisdom',
      description: 'The Stoics called it "Ataraxia"—a state of serene focus. Samurai trained for "Mushin"—the mind of no-mind. Zen archers sought "Zanshin"—total presence.',
    },
    {
      era: 'Modern Science',
      description: 'Mihaly Csikszentmihalyi coined "Flow" in 1975 after studying artists, surgeons, and rock climbers who described the same altered state of optimal experience.',
    },
    {
      era: 'Elite Performance',
      description: 'Michael Jordan\'s "unconscious" game. Kobe\'s "Mamba Mentality" was a systematic pursuit of flow. Steph Curry describes "seeing the rim as big as an ocean."',
    },
  ],
};

export const TRANSIENT_HYPOFRONTALITY = {
  title: 'Transient Hypofrontality',
  subtitle: 'The Brain\'s "Quiet Mode"',
  description: 'During flow, the prefrontal cortex—the brain\'s "CEO" responsible for self-criticism, doubt, and overthinking—temporarily reduces activity. This allows the faster, more intuitive parts of the brain to take over.',
  effects: [
    'The inner critic goes silent',
    'Fear of failure disappears',
    'Self-consciousness dissolves',
    'Time perception warps',
    'Creativity increases',
  ],
  athleteApplication: 'This is why elite athletes describe "not thinking" during peak performances. The conscious mind gets out of the way, allowing thousands of hours of training to express itself automatically.',
};
