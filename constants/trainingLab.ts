import { MENTAL_SCIENCE_DATA, AWARENESS_KNOWLEDGE_PACK } from './science';

export type Category = 'BREATH' | 'YOGA' | 'VISUALIZATION' | 'MOVEMENT' | 'STRENGTH' | 'RECOVERY';

export interface TrainingScience {
  mechanism: string;
  gameBenefit: string;
  lifeBenefit: string;
  presence?: string;
  grit?: string;
}

export interface BreathPattern {
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  durationMin: number;
  image: string;
  pattern?: BreathPattern;
  mediaUrl?: string;
  steps?: string[];
  sciencePack?: TrainingScience;
}

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'box_breathing',
    title: 'Box Breathing',
    subtitle: 'Navy SEAL focus technique.',
    category: 'BREATH',
    sciencePack: MENTAL_SCIENCE_DATA.breathwork,
    durationMin: 5,
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2000&auto=format&fit=crop',
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
  },
  {
    id: '478_relax',
    title: '4-7-8 Relaxation',
    subtitle: "Dr. Weil's sleep technique.",
    category: 'BREATH',
    sciencePack: MENTAL_SCIENCE_DATA.breathwork,
    durationMin: 10,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop',
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 }
  },
  {
    id: 'warrior_breath',
    title: 'Warrior Breath',
    subtitle: 'Pre-game activation protocol.',
    category: 'BREATH',
    sciencePack: MENTAL_SCIENCE_DATA.breathwork,
    durationMin: 3,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop',
    pattern: { inhale: 3, hold1: 0, exhale: 3, hold2: 0 }
  },
  {
    id: 'deep_relax',
    title: 'Deep Relax',
    subtitle: '4-6 calming breath for recovery.',
    category: 'BREATH',
    sciencePack: MENTAL_SCIENCE_DATA.breathwork,
    durationMin: 8,
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2000&auto=format&fit=crop',
    pattern: { inhale: 4, hold1: 0, exhale: 6, hold2: 0 }
  },
  {
    id: 'coherent_balance',
    title: 'Coherent Balance',
    subtitle: '4-4 rhythm for heart-brain sync.',
    category: 'BREATH',
    sciencePack: MENTAL_SCIENCE_DATA.breathwork,
    durationMin: 6,
    image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=2000&auto=format&fit=crop',
    pattern: { inhale: 4, hold1: 0, exhale: 4, hold2: 0 }
  },
  {
    id: 'wim_hof_power',
    title: 'Wim Hof Power',
    subtitle: 'Rapid hyperventilation for energy.',
    category: 'BREATH',
    sciencePack: MENTAL_SCIENCE_DATA.breathwork,
    durationMin: 5,
    image: 'https://images.unsplash.com/photo-1552674605-5d2178b849ce?q=80&w=2000&auto=format&fit=crop',
    pattern: { inhale: 1.5, hold1: 0, exhale: 1.5, hold2: 0 }
  },
  {
    id: 'pre_game_focus',
    title: 'Pre-Game Focus',
    subtitle: 'Locked in before tip-off.',
    category: 'BREATH',
    sciencePack: MENTAL_SCIENCE_DATA.breathwork,
    durationMin: 4,
    image: 'https://images.unsplash.com/photo-1628779238951-be2c9f2a59f4?q=80&w=2000&auto=format&fit=crop',
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
  },

  {
    id: 'dynamic_warmup',
    title: 'Game Day Flow',
    subtitle: 'Dynamic activation for hips & ankles.',
    category: 'MOVEMENT',
    durationMin: 12,
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=164&oauth2_token_id=57447761',
    steps: [
      '1. Hip Circles: 30 sec each direction',
      '2. Leg Swings: 15 each leg (front/back)',
      '3. Ankle Circles: 20 each direction',
      '4. Walking Lunges with Twist: 10 each side',
      '5. High Knees: 30 seconds',
      '6. Butt Kicks: 30 seconds',
      '7. Lateral Shuffles: 20 yards each direction',
      '8. A-Skips: 20 yards',
      '9. Carioca: 20 yards each direction',
      '10. Sprint Build-ups: 3x30 yards'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.dynamic_warmup.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.dynamic_warmup.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.dynamic_warmup.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.dynamic_warmup.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.dynamic_warmup.grit
    }
  },
  {
    id: 'post_game_flush',
    title: 'Post-Game Flush',
    subtitle: 'Clear lactic acid and calm the nervous system.',
    category: 'MOVEMENT',
    durationMin: 15,
    image: 'https://images.unsplash.com/photo-1544367563-12123d897571?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38af1e1e363199c5e&profile_id=165&oauth2_token_id=57447761',
    steps: [
      '1. Light Walk: 3 minutes',
      '2. Quad Stretch: 45 sec each leg',
      '3. Hamstring Stretch: 45 sec each leg',
      '4. Hip Flexor Stretch: 60 sec each side',
      '5. Calf Stretch: 30 sec each leg',
      '6. Figure-4 Glute Stretch: 60 sec each side',
      "7. Child's Pose: 60 seconds",
      '8. Cat-Cow: 10 slow reps',
      '9. Supine Twist: 45 sec each side',
      '10. Savasana: 2 minutes (deep breathing)'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.post_game_flush.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.post_game_flush.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.post_game_flush.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.post_game_flush.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.post_game_flush.grit
    }
  },
  {
    id: 'mov_hand_eye',
    title: 'Hand-Eye & Ball Handling IQ',
    subtitle: 'Neurological efficiency.',
    category: 'MOVEMENT',
    durationMin: 15,
    image: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=2000&auto=format&fit=crop',
    steps: [
      '1. Pound Dribble (Waist/Knee/Ankle): 1 min each hand',
      '2. Tennis Ball Toss & Catch (while dribbling): 3x1 min each hand',
      '3. Two Ball Dribble (Alternating): 2 min',
      '4. Crossover with Visual Cue: 3x1 min',
      '5. Eyes Closed Dribbling: 2 min'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.hand_eye.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.hand_eye.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.hand_eye.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.hand_eye.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.hand_eye.grit
    }
  },

  {
    id: 'yoga_hips',
    title: 'Hip Mobility for Hoopers',
    subtitle: 'Unlock tight hips before the game.',
    category: 'YOGA',
    durationMin: 15,
    image: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://player.vimeo.com/external/392900746.sd.mp4?s=d0f48868c783df82987a0774a0050e046394236b&profile_id=164&oauth2_token_id=57447761',
    steps: [
      '1. Deep Squat Hold: 60 seconds',
      '2. 90/90 Stretch: 60 sec each side',
      '3. Pigeon Pose: 90 sec each side',
      '4. Frog Pose: 60 seconds',
      '5. Lizard Pose: 60 sec each side',
      '6. Half Kneeling Hip Flexor: 45 sec each side',
      '7. Butterfly Stretch: 60 seconds',
      '8. Happy Baby: 60 seconds',
      '9. Reclined Pigeon: 45 sec each side',
      '10. Hip Circles on All Fours: 30 sec each direction'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.hip_mobility.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.hip_mobility.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.hip_mobility.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.hip_mobility.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.hip_mobility.grit
    }
  },
  {
    id: 'yoga_recovery',
    title: 'Post-Game Recovery Flow',
    subtitle: 'Release tension and restore.',
    category: 'YOGA',
    durationMin: 20,
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://player.vimeo.com/external/392900746.sd.mp4?s=d0f48868c783df82987a0774a0050e046394236b&profile_id=164&oauth2_token_id=57447761',
    steps: [
      "1. Child's Pose: 90 seconds",
      '2. Thread the Needle: 60 sec each side',
      '3. Downward Dog: 60 seconds',
      '4. Low Lunge: 60 sec each side',
      '5. Standing Forward Fold: 60 seconds',
      '6. Wide-Legged Forward Fold: 60 seconds',
      '7. Reclined Twist: 60 sec each side',
      '8. Legs Up the Wall: 3 minutes',
      '9. Supported Bridge: 60 seconds',
      '10. Final Savasana: 3 minutes'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.recovery_flow.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.recovery_flow.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.recovery_flow.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.recovery_flow.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.recovery_flow.grit
    }
  },

  {
    id: 'vis_free_throw',
    title: 'The Charity Stripe',
    subtitle: 'Mental reps for clutch free throws.',
    category: 'VISUALIZATION',
    sciencePack: MENTAL_SCIENCE_DATA.visualization,
    durationMin: 8,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498fbe?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'vis_game_winner',
    title: 'Game Winner',
    subtitle: 'Visualize the buzzer beater.',
    category: 'VISUALIZATION',
    sciencePack: MENTAL_SCIENCE_DATA.visualization,
    durationMin: 10,
    image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'vis_clutch',
    title: 'The Clutch Gene',
    subtitle: 'Visualize the last 2 minutes. Execute.',
    category: 'VISUALIZATION',
    sciencePack: MENTAL_SCIENCE_DATA.visualization,
    durationMin: 8,
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'vis_defense',
    title: 'Lockdown Defender',
    subtitle: 'See the angles. Anticipate the pass.',
    category: 'VISUALIZATION',
    sciencePack: MENTAL_SCIENCE_DATA.visualization,
    durationMin: 6,
    image: 'https://images.unsplash.com/photo-1519861531473-920026393112?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'sleep_adrenaline',
    title: 'Adrenaline Dump',
    subtitle: 'Transition from Game Mode to Sleep Mode.',
    category: 'VISUALIZATION',
    sciencePack: MENTAL_SCIENCE_DATA.visualization,
    durationMin: 20,
    image: 'https://images.unsplash.com/photo-1455642305367-68834a1da7ab?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },

  {
    id: 'str_armor_lower',
    title: 'Posterior Chain Armor',
    subtitle: 'Trap Bar & RDLs. Build the engine that drives your vertical.',
    category: 'STRENGTH',
    durationMin: 45,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop',
    steps: [
      'Warmup: 5 min Hip Flow',
      '1. Trap Bar Deadlift: 4x5 (Heavy)',
      '2. RDL (Romanian Deadlift): 3x8 (Slow eccentric)',
      '3. Bulgarian Split Squats: 3x8 each leg',
      '4. Weighted Carries: 3x30 seconds'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.posterior_chain.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.posterior_chain.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.posterior_chain.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.posterior_chain.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.posterior_chain.grit
    }
  },
  {
    id: 'str_elasticity',
    title: 'Tendon Elasticity',
    subtitle: 'Bodyweight plyometrics to make you bouncy.',
    category: 'STRENGTH',
    durationMin: 20,
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?q=80&w=2000&auto=format&fit=crop',
    mediaUrl: 'https://player.vimeo.com/external/494246830.sd.mp4?s=087858d43d1a33a395175659837922d56d787723&profile_id=165&oauth2_token_id=57447761',
    steps: [
      '1. Pogo Hops: 3x30 sec',
      '2. Depth Drops (Low Box): 3x5',
      '3. Isometric Lunge Holds: 3x45 sec (The Tim Grover special)',
      '4. Max Effort Box Jumps: 5x1'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.plyometrics.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.plyometrics.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.plyometrics.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.plyometrics.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.plyometrics.grit
    }
  },
  {
    id: 'str_anti_rotation',
    title: 'Anti-Rotation Core',
    subtitle: 'Build stability so you never get bumped off your spot.',
    category: 'STRENGTH',
    durationMin: 25,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000&auto=format&fit=crop',
    steps: [
      '1. Pallof Press: 3x12 each side',
      '2. Dead Bug: 3x10 each side',
      '3. Bird Dog: 3x10 each side',
      '4. Plank with Shoulder Taps: 3x30 sec',
      '5. Side Plank Rotations: 3x8 each side'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.anti_rotation.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.anti_rotation.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.anti_rotation.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.anti_rotation.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.anti_rotation.grit
    }
  },
  {
    id: 'str_lateral_speed',
    title: 'Defensive Lateral Speed',
    subtitle: 'Lockdown defense mechanics.',
    category: 'STRENGTH',
    durationMin: 20,
    image: 'https://images.unsplash.com/photo-1519766304800-c9519df914ce?q=80&w=2000&auto=format&fit=crop',
    steps: [
      '1. Banded Lateral Walks: 3x10 yards',
      '2. Defensive Slides (Lane to Lane): 3x30 sec',
      '3. Lateral Bound & Stick: 3x8 each side',
      '4. Mirror Drill (Reaction): 3x30 sec',
      '5. Wall Sits (Single Leg): 3x30 sec each'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.lateral_speed.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.lateral_speed.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.lateral_speed.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.lateral_speed.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.lateral_speed.grit
    }
  },

  {
    id: 'rec_contrast',
    title: 'Contrast Therapy Protocol',
    subtitle: 'The precise Fire/Ice ratio used by NBA trainers.',
    category: 'RECOVERY',
    durationMin: 35,
    image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=2000&auto=format&fit=crop',
    steps: [
      'Round 1: Sauna/Hot Water (15 min)',
      'Round 1: Ice Bath/Cold Shower (3 min)',
      'Round 2: Sauna/Hot Water (15 min)',
      'Round 2: Ice Bath/Cold Shower (3 min)',
      'End on COLD for recovery, or HEAT for relaxation.'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.contrast_therapy.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.contrast_therapy.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.contrast_therapy.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.contrast_therapy.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.contrast_therapy.grit
    }
  },
  {
    id: 'rec_flush',
    title: 'Lactic Flush Cycle',
    subtitle: 'Spin bike or pool work to clear the legs.',
    category: 'RECOVERY',
    durationMin: 20,
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=2000&auto=format&fit=crop',
    steps: [
      '5 min: Zone 1 (Very Light)',
      '10 min: Zone 2 (Conversational Pace)',
      '5 min: Foam Roll / Percussion Gun'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.lactic_flush.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.lactic_flush.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.lactic_flush.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.lactic_flush.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.lactic_flush.grit
    }
  },
  {
    id: 'rec_percussion',
    title: 'Percussion Gun Protocol',
    subtitle: 'Target areas for maximum muscle recovery.',
    category: 'RECOVERY',
    durationMin: 15,
    image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=2000&auto=format&fit=crop',
    steps: [
      '1. Quads: 2 min each leg',
      '2. Hamstrings: 2 min each leg',
      '3. Glutes: 2 min each side',
      '4. Calves: 1 min each leg',
      '5. Lower Back: 2 min (Avoid spine directly)'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.percussion.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.percussion.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.percussion.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.percussion.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.percussion.grit
    }
  },
  {
    id: 'rec_acupuncture',
    title: 'Acupuncture Recovery',
    subtitle: 'Ancient technique for pain relief & muscle activation.',
    category: 'RECOVERY',
    durationMin: 45,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2000&auto=format&fit=crop',
    steps: [
      '1. Pre-Session: Hydrate well, avoid caffeine 2 hours before',
      '2. Target Zones: Quads, hamstrings, IT band, lower back',
      '3. Session Duration: 30-45 minutes with licensed practitioner',
      '4. Key Points: ST36 (Zusanli) for energy, GB34 for muscle tension',
      '5. Post-Session: Rest 10 min, light stretching, stay hydrated',
      '6. Frequency: 1-2x per week during heavy training blocks',
      '7. Benefits: Reduced inflammation, improved blood flow, faster recovery'
    ],
    sciencePack: {
      mechanism: AWARENESS_KNOWLEDGE_PACK.acupuncture.mechanism,
      gameBenefit: AWARENESS_KNOWLEDGE_PACK.acupuncture.gameBenefit,
      lifeBenefit: AWARENESS_KNOWLEDGE_PACK.acupuncture.lifeBenefit,
      presence: AWARENESS_KNOWLEDGE_PACK.acupuncture.presence,
      grit: AWARENESS_KNOWLEDGE_PACK.acupuncture.grit
    }
  }
];

export const CATEGORY_INFO: Record<Category, { title: string; icon: string; color: string }> = {
  BREATH: { title: 'Breathwork', icon: 'wind', color: '#00D9FF' },
  MOVEMENT: { title: 'Mindful Movement', icon: 'zap', color: '#FF9500' },
  YOGA: { title: 'Yoga', icon: 'activity', color: '#FF6B9D' },
  VISUALIZATION: { title: 'Visualization', icon: 'eye', color: '#A855F7' },
  STRENGTH: { title: 'Strength // Armor', icon: 'dumbbell', color: '#FF3B30' },
  RECOVERY: { title: 'Recovery // Reset', icon: 'snowflake', color: '#34C759' }
};

export const BACKGROUND_VIDEO_URL = 'https://player.vimeo.com/external/517090025.sd.mp4?s=e60375a0225d3df3908db8c045b5e326084824d5&profile_id=164&oauth2_token_id=57447761';
