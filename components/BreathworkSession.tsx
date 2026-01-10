import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Pause, Play, RotateCcw } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.85;

// Subtle cosmic star counts
const NUM_STARS_OUTER = 18; 
const NUM_STARS_INNER = 12;

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'idle';

interface BreathPattern {
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

interface BreathingMode {
  id: string;
  label: string;
  subtitle: string;
  pattern: BreathPattern;
  color: string;
}

const BREATHING_MODES: BreathingMode[] = [
  {
    id: 'focus',
    label: 'Focus',
    subtitle: 'Box Breathing',
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    color: '#00D9FF',
  },
  {
    id: 'relax',
    label: 'Relax',
    subtitle: '4-6 Calm',
    pattern: { inhale: 4, hold1: 0, exhale: 6, hold2: 0 },
    color: '#34C759',
  },
  {
    id: 'balance',
    label: 'Balance',
    subtitle: 'Coherent 4-4',
    pattern: { inhale: 4, hold1: 0, exhale: 4, hold2: 0 },
    color: '#A855F7',
  },
  {
    id: 'power',
    label: 'Power',
    subtitle: 'Wim Hof Style',
    pattern: { inhale: 1.5, hold1: 0, exhale: 1.5, hold2: 0 },
    color: '#FF6B35',
  },
];

const PHASE_CONFIG = {
  inhale: { label: 'Breathe In' },
  hold1: { label: 'Hold' },
  exhale: { label: 'Breathe Out' },
  hold2: { label: 'Hold' },
  idle: { label: 'Ready' },
};

interface BreathworkSessionProps {
  pattern?: BreathPattern;
  onCycleComplete?: (count: number) => void;
  showControls?: boolean;
  autoStart?: boolean;
}

export function BreathworkSession({
  pattern: externalPattern,
  onCycleComplete,
  showControls = true,
  autoStart = false,
}: BreathworkSessionProps) {
  const [selectedMode, setSelectedMode] = useState<BreathingMode>(BREATHING_MODES[0]);
  const hasExternalPattern = externalPattern !== undefined;
  const [isActive, setIsActive] = useState(autoStart);
  const [phase, setPhase] = useState<Phase>('idle');
  const [countdown, setCountdown] = useState(selectedMode.pattern.inhale);
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;
  const ringRotation = useRef(new Animated.Value(0)).current;
  const ringRotation2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const starTwinkle = useRef(new Animated.Value(0.3)).current;
  
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    return () => {
    };
  }, [isActive]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const pattern = hasExternalPattern ? externalPattern : selectedMode.pattern;
  const modeColor = selectedMode.color;

  const handleModeChange = useCallback((mode: BreathingMode) => {
    if (isActive) {
      setIsActive(false);
      if (animationRef.current) animationRef.current.stop();
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      ringRotation.stopAnimation();
    }
    
    setSelectedMode(mode);
    setPhase('idle');
    setCycleCount(0);
    setSessionDuration(0);
    setCountdown(mode.pattern.inhale);
    scaleAnim.setValue(0.5);
    glowAnim.setValue(0.2);
    pulseAnim.setValue(1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isActive, scaleAnim, glowAnim, pulseAnim, ringRotation]);

  const triggerHaptic = useCallback((type: 'phase' | 'hold') => {
    if (type === 'phase') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const animateTextTransition = useCallback(() => {
    Animated.sequence([
      Animated.timing(textOpacity, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [textOpacity]);

  const startRingRotation = useCallback(() => {
    ringRotation.setValue(0);
    ringRotation2.setValue(0);
    starTwinkle.setValue(0.3);

    Animated.loop(
      Animated.timing(ringRotation, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(ringRotation2, {
        toValue: -1,
        duration: 25000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starTwinkle, {
          toValue: 0.5,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(starTwinkle, {
          toValue: 0.25,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [ringRotation, ringRotation2, starTwinkle]);

  const runPhase = useCallback((
    phaseType: Phase,
    duration: number,
    targetScale: number,
    targetGlow: number,
    onComplete: () => void
  ) => {
    if (!isActiveRef.current) return;

    setPhase(phaseType);
    setCountdown(Math.ceil(duration));
    animateTextTransition();
    triggerHaptic(phaseType === 'hold1' || phaseType === 'hold2' ? 'hold' : 'phase');

    if (countdownRef.current) clearInterval(countdownRef.current);
    
    let secondsLeft = duration;
    const interval = duration < 2 ? 100 : 1000;
    const decrement = duration < 2 ? 0.1 : 1;
    
    countdownRef.current = setInterval(() => {
      secondsLeft -= decrement;
      if (secondsLeft >= 0) {
        setCountdown(Math.ceil(secondsLeft));
      }
    }, interval);

    const durationMs = duration * 1000;

    if (animationRef.current) {
      animationRef.current.stop();
    }

    const animations = [
      Animated.timing(scaleAnim, {
        toValue: targetScale,
        duration: durationMs,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: targetGlow,
        duration: durationMs,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ];

    if (phaseType === 'hold1' || phaseType === 'hold2') {
      pulseAnim.setValue(1);
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      
      phaseTimeoutRef.current = setTimeout(() => {
        pulseAnimation.stop();
        pulseAnim.setValue(1);
        if (countdownRef.current) clearInterval(countdownRef.current);
        onComplete();
      }, durationMs);
    } else {
      animationRef.current = Animated.parallel(animations);
      animationRef.current.start(({ finished }) => {
        if (finished && isActiveRef.current) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          onComplete();
        }
      });
    }
  }, [scaleAnim, glowAnim, pulseAnim, animateTextTransition, triggerHaptic]);

  const runBreathCycle = useCallback(() => {
    if (!isActiveRef.current) return;

    const runInhale = () => {
      runPhase('inhale', pattern.inhale, 1, 0.8, () => {
        if (pattern.hold1 > 0) {
          runHold1();
        } else {
          runExhale();
        }
      });
    };

    const runHold1 = () => {
      runPhase('hold1', pattern.hold1, 1, 0.8, runExhale);
    };

    const runExhale = () => {
      runPhase('exhale', pattern.exhale, 0.5, 0.2, () => {
        if (pattern.hold2 > 0) {
          runHold2();
        } else {
          completeCycle();
        }
      });
    };

    const runHold2 = () => {
      runPhase('hold2', pattern.hold2, 0.5, 0.2, completeCycle);
    };

    const completeCycle = () => {
      setCycleCount(prev => {
        const newCount = prev + 1;
        onCycleComplete?.(newCount);
        return newCount;
      });
      if (isActiveRef.current) {
        runInhale();
      }
    };

    runInhale();
  }, [pattern, runPhase, onCycleComplete]);

  useEffect(() => {
    if (isActive) {
      startRingRotation();
      runBreathCycle();
    } else {
      if (animationRef.current) animationRef.current.stop();
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      ringRotation.stopAnimation();
      ringRotation2.stopAnimation();
      starTwinkle.stopAnimation();
    }

    return () => {
      if (animationRef.current) animationRef.current.stop();
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      ringRotation.stopAnimation();
      ringRotation2.stopAnimation();
      starTwinkle.stopAnimation();
    };
  }, [isActive, runBreathCycle, startRingRotation, ringRotation, ringRotation2, starTwinkle]);

  const handleToggle = () => {
    if (!isActive) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsActive(false);
    setCycleCount(0);
    setSessionDuration(0);
    setPhase('idle');
    setCountdown(pattern.inhale);
    scaleAnim.setValue(0.5);
    glowAnim.setValue(0.2);
    pulseAnim.setValue(1);
  };

  const ringRotationInterpolate = ringRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ringRotation2Interpolate = ringRotation2.interpolate({
    inputRange: [-1, 0],
    outputRange: ['-360deg', '0deg'],
  });

  const renderStars = (count: number, radius: number, size: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 360;
      // Subtle cosmic energy look
      const randomScale = 0.5 + Math.random() * 0.6;
      const starSize = size * (1 + (i % 3) * 0.35) * randomScale; 
      
      stars.push(
        <Animated.View
          key={`star-${radius}-${i}`}
          style={[
            styles.star,
            {
              width: starSize,
              height: starSize,
              borderRadius: starSize / 2,
              backgroundColor: i % 4 === 0 ? modeColor : '#fff',
              transform: [
                { rotate: `${angle}deg` },
                { translateY: -radius },
                { scale: starTwinkle.interpolate({
                  inputRange: [0.25, 0.5],
                  outputRange: [0.7, 1.1]
                })}
              ],
              opacity: starTwinkle, 
              shadowColor: modeColor,
              shadowOpacity: 0.7,
              shadowRadius: 6,
              borderWidth: 0,
            },
          ]}
        />
      );
    }
    return stars;
  };

  const getPatternDisplay = () => {
    const parts = [];
    if (pattern.inhale) parts.push(pattern.inhale);
    if (pattern.hold1) parts.push(pattern.hold1);
    if (pattern.exhale) parts.push(pattern.exhale);
    if (pattern.hold2) parts.push(pattern.hold2);
    return parts.join('-');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: modeColor }]}>{cycleCount}</Text>
          <Text style={styles.statLabel}>CYCLES</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: modeColor }]}>{formatTime(sessionDuration)}</Text>
          <Text style={styles.statLabel}>TIME</Text>
        </View>
      </View>

      {!hasExternalPattern && (
        <View style={styles.modeSelector}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modeScrollContent}
          >
            {BREATHING_MODES.map((mode) => {
              const isSelected = selectedMode.id === mode.id;
              return (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.modeChip,
                    isSelected && { borderColor: mode.color, backgroundColor: `${mode.color}20` },
                  ]}
                  onPress={() => handleModeChange(mode)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modeLabel, isSelected && { color: mode.color }]}>
                    {mode.label}
                  </Text>
                  <Text style={[styles.modeSubtitle, isSelected && { color: `${mode.color}99` }]}>
                    {mode.subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={styles.circleWrapper}>
        <View style={styles.circleContainer}>
        {/* Outer Star Ring */}
        <Animated.View
          style={[
            styles.starRing,
            {
              width: CIRCLE_SIZE + 40,
              height: CIRCLE_SIZE + 40,
              borderRadius: (CIRCLE_SIZE + 40) / 2,
              transform: [{ rotate: ringRotationInterpolate }],
              opacity: isActive ? 0.7 : 0.3,
            },
          ]}
        >
          {renderStars(NUM_STARS_OUTER, (CIRCLE_SIZE + 30) / 2, 2.5)}
        </Animated.View>

        {/* Inner Counter-rotating Star Ring */}
        <Animated.View
          style={[
            styles.starRing,
            {
              width: CIRCLE_SIZE + 15,
              height: CIRCLE_SIZE + 15,
              borderRadius: (CIRCLE_SIZE + 15) / 2,
              transform: [{ rotate: ringRotation2Interpolate }],
              opacity: isActive ? 0.6 : 0.25,
            },
          ]}
        >
          {renderStars(NUM_STARS_INNER, (CIRCLE_SIZE + 12) / 2, 2)}
        </Animated.View>

        <Animated.View
          style={[
            styles.glowCircle,
            {
              transform: [{ scale: scaleAnim }],
              opacity: glowAnim,
              backgroundColor: modeColor,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.mainCircle,
            {
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) },
              ],
              borderColor: modeColor,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.innerCircle,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: `${modeColor}15`,
            },
          ]}
        />

        <View style={styles.textContainer} pointerEvents="none">
          <Animated.Text style={[styles.phaseLabel, { opacity: textOpacity, color: modeColor }]}>
            {PHASE_CONFIG[phase].label}
          </Animated.Text>
          <Animated.Text style={[styles.countdown, { opacity: textOpacity }]}>
            {countdown}
          </Animated.Text>
          <Text style={styles.patternText}>
            {getPatternDisplay()}
          </Text>
        </View>
        </View>
      </View>

      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <RotateCcw size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isActive && styles.primaryButtonActive,
              { shadowColor: modeColor },
            ]}
            onPress={handleToggle}
            activeOpacity={0.8}
          >
            {isActive ? (
              <Pause size={32} color="#000" fill="#000" />
            ) : (
              <Play size={32} color="#000" fill="#000" style={{ marginLeft: 4 }} />
            )}
          </TouchableOpacity>

          <View style={[styles.secondaryButton, { opacity: 0 }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Ensure top alignment for stats
    paddingVertical: 40, // More padding from top
  },
  modeSelector: {
    width: '100%',
    marginBottom: 16,
  },
  modeScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  modeChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    minWidth: 90,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  modeSubtitle: {
    fontSize: 10,
    fontWeight: '500' as const,
    color: 'rgba(255,255,255,0.35)',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '200' as const,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    marginTop: 4,
  },
  circleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Center vertically in remaining space
    width: '100%',
    marginTop: -20, // Slight adjustment to center visually with stats at top
  },
  circleContainer: {
    width: CIRCLE_SIZE + 40,
    height: CIRCLE_SIZE + 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starRing: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
  glowCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE + 20,
    height: CIRCLE_SIZE + 20,
    borderRadius: (CIRCLE_SIZE + 20) / 2,
  },
  mainCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  innerCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE - 20,
    height: CIRCLE_SIZE - 20,
    borderRadius: (CIRCLE_SIZE - 20) / 2,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  countdown: {
    fontSize: 64,
    fontWeight: '100' as const,
    color: '#fff',
    fontVariant: ['tabular-nums'],
    lineHeight: 72,
  },
  patternText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 3,
    marginTop: 6,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    paddingTop: 20,
    paddingBottom: 10,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  primaryButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  primaryButtonActive: {
    backgroundColor: '#fff',
    shadowOpacity: 0.5,
  },
});
