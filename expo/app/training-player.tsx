import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Video, ResizeMode, Audio, AVPlaybackStatus } from 'expo-av';
import { X, Pause, Play, Check, Circle, Clock, SkipForward, Brain, Eye, Sparkles, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { TRAINING_MODULES, BACKGROUND_VIDEO_URL, TrainingModule, CATEGORY_INFO } from '@/constants/trainingLab';
import { BreathworkSession } from '@/components/BreathworkSession';
import { useApp } from '@/contexts/AppContext';
import { ScienceModal } from '@/components/TrainingInfoModal';

const { width } = Dimensions.get('window');

export default function TrainingPlayerScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const module = useMemo(() => 
    TRAINING_MODULES.find(m => m.id === moduleId),
    [moduleId]
  );

  const isBreathwork = module?.pattern !== undefined;
  const isMedia = module?.mediaUrl !== undefined;
  const isSteps = module?.steps !== undefined && module.steps.length > 0;

  if (!module) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Module not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isBreathwork ? (
        <BreathworkPlayer module={module} insets={insets} onClose={() => router.back()} />
      ) : isSteps ? (
        <StepsPlayer module={module} insets={insets} onClose={() => router.back()} />
      ) : isMedia ? (
        <MediaPlayer module={module} insets={insets} onClose={() => router.back()} />
      ) : null}
    </View>
  );
}

interface BreathworkPlayerProps {
  module: TrainingModule;
  insets: { top: number; bottom: number };
  onClose: () => void;
}

function BreathworkPlayer({ module, insets, onClose }: BreathworkPlayerProps) {
  const pattern = module.pattern!;
  const { addCompletedSession } = useApp();
  const [showScience, setShowScience] = useState(false);
  
  const handleComplete = useCallback(() => {
    addCompletedSession(module.id, module.durationMin);
  }, [module.id, module.durationMin, addCompletedSession]);

  return (
    <View style={styles.playerContainer}>
      <ScienceModal 
        visible={showScience}
        onClose={() => setShowScience(false)}
        scienceData={module.sciencePack}
        title={module.title}
      />
      <Video
        source={{ uri: BACKGROUND_VIDEO_URL }}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.closeButton} onPress={() => { handleComplete(); onClose(); }}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
        </View>
        <TouchableOpacity 
          style={styles.infoButton} 
          onPress={() => setShowScience(true)}
          disabled={!module.sciencePack}
        >
          {module.sciencePack && <Info size={24} color="rgba(255,255,255,0.7)" />}
        </TouchableOpacity>
      </View>

      <View style={styles.breathContainer}>
        <BreathworkSession
          pattern={pattern}
          autoStart={true}
          showControls={true}
        />
      </View>
    </View>
  );
}

interface StepsPlayerProps {
  module: TrainingModule;
  insets: { top: number; bottom: number };
  onClose: () => void;
}

function StepsPlayer({ module, insets, onClose }: StepsPlayerProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { addCompletedSession } = useApp();

  const categoryColor = CATEGORY_INFO[module.category].color;
  const isStrength = module.category === 'STRENGTH';

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
      pulseAnim.setValue(1);
    }
    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [isResting, restTimer, pulseAnim]);

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      return newSet;
    });
  };

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds);
    setIsResting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = module.steps ? (completedSteps.size / module.steps.length) * 100 : 0;

  const handleClose = () => {
    if (completedSteps.size > 0) {
      addCompletedSession(module.id, module.durationMin);
    }
    onClose();
  };

  return (
    <View style={styles.playerContainer}>
      <Video
        source={{ uri: BACKGROUND_VIDEO_URL }}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
        </View>
        <View style={styles.timerDisplay}>
          <Clock size={14} color={categoryColor} />
          <Text style={[styles.timerText, { color: categoryColor }]}>{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      <View style={styles.progressHeader}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: categoryColor }]} />
        </View>
        <Text style={styles.progressText}>
          {completedSteps.size} / {module.steps?.length} completed
        </Text>
      </View>

      {isResting && (
        <View style={styles.restOverlay}>
          <Animated.View style={[styles.restCircle, { transform: [{ scale: pulseAnim }], borderColor: categoryColor }]}>
            <Text style={[styles.restTimerText, { color: categoryColor }]}>{restTimer}</Text>
            <Text style={styles.restLabel}>REST</Text>
          </Animated.View>
          <TouchableOpacity style={[styles.skipButton, { backgroundColor: categoryColor }]} onPress={skipRest}>
            <SkipForward size={20} color="#fff" />
            <Text style={styles.skipButtonText}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.stepsScrollView}
        contentContainerStyle={[styles.stepsContent, { paddingBottom: insets.bottom + 180 }]}
        showsVerticalScrollIndicator={false}
      >
        {module.steps?.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.stepItem,
                isCompleted && styles.stepItemCompleted,
                { borderLeftColor: categoryColor }
              ]}
              onPress={() => toggleStep(index)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.stepCheckbox,
                isCompleted && { backgroundColor: categoryColor, borderColor: categoryColor }
              ]}>
                {isCompleted ? (
                  <Check size={16} color="#fff" />
                ) : (
                  <Circle size={16} color="rgba(255,255,255,0.3)" />
                )}
              </View>
              <Text style={[
                styles.stepText,
                isCompleted && styles.stepTextCompleted
              ]}>
                {step}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.stepsControls, { paddingBottom: insets.bottom + 30 }]}>
        {isStrength && !isResting && (
          <View style={styles.restButtons}>
            <TouchableOpacity 
              style={[styles.restPresetButton, { borderColor: categoryColor }]} 
              onPress={() => startRestTimer(60)}
            >
              <Text style={[styles.restPresetText, { color: categoryColor }]}>60s</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.restPresetButton, { borderColor: categoryColor }]} 
              onPress={() => startRestTimer(90)}
            >
              <Text style={[styles.restPresetText, { color: categoryColor }]}>90s</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.restPresetButton, { borderColor: categoryColor }]} 
              onPress={() => startRestTimer(120)}
            >
              <Text style={[styles.restPresetText, { color: categoryColor }]}>2min</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.timerControlButton, isActive && { backgroundColor: categoryColor }]} 
          onPress={() => setIsActive(!isActive)}
        >
          {isActive ? (
            <Pause size={24} color="#fff" />
          ) : (
            <Play size={24} color="#fff" />
          )}
          <Text style={styles.timerControlText}>
            {isActive ? 'Pause Timer' : 'Start Timer'}
          </Text>
        </TouchableOpacity>
        {completedSteps.size === module.steps?.length && (
          <View style={[styles.completeBadge, { backgroundColor: categoryColor }]}>
            <Check size={16} color="#fff" />
            <Text style={styles.completeText}>Workout Complete!</Text>
          </View>
        )}
      </View>
    </View>
  );
}

interface MediaPlayerProps {
  module: TrainingModule;
  insets: { top: number; bottom: number };
  onClose: () => void;
}

function MediaPlayer({ module, insets, onClose }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showScience, setShowScience] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const videoRef = useRef<Video | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { addCompletedSession } = useApp();

  const isVideo = module.mediaUrl?.includes('.mp4');
  const isAudio = !isVideo;
  const categoryColor = CATEGORY_INFO[module.category].color;

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, pulseAnim, rotateAnim]);

  useEffect(() => {
    const loadAudioAsync = async () => {
      try {
        console.log('Loading audio:', module.mediaUrl);
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: module.mediaUrl! },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    };

    if (isAudio && module.mediaUrl) {
      loadAudioAsync();
    }

    return () => {
      if (soundRef.current) {
        console.log('Unloading audio...');
        soundRef.current.unloadAsync();
      }
    };
  }, [module.mediaUrl, isAudio]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isAudio && soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } else if (isVideo && videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  const handleClose = () => {
    if (position > 0) {
      addCompletedSession(module.id, module.durationMin);
    }
    onClose();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.playerContainer}>
      <ScienceModal 
        visible={showScience}
        onClose={() => setShowScience(false)}
        scienceData={module.sciencePack}
        title={module.title}
      />
      {isVideo ? (
        <Video
          ref={videoRef}
          source={{ uri: module.mediaUrl! }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isLooping
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        />
      ) : (
        <>
          <Video
            source={{ uri: BACKGROUND_VIDEO_URL }}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />
        </>
      )}
      
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
        </View>
        <TouchableOpacity 
          style={styles.infoButton} 
          onPress={() => setShowScience(true)}
          disabled={!module.sciencePack}
        >
          {module.sciencePack && <Info size={24} color="rgba(255,255,255,0.7)" />}
        </TouchableOpacity>
      </View>

      <View style={styles.mediaCenter}>
        {isAudio && (
          <View style={styles.visualizationContainer}>
            <Animated.View 
              style={[
                styles.outerRing, 
                { 
                  borderColor: categoryColor,
                  transform: [{ scale: pulseAnim }, { rotate: rotateInterpolate }],
                  opacity: isPlaying ? 0.6 : 0.2,
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.middleRing, 
                { 
                  borderColor: categoryColor,
                  transform: [{ scale: pulseAnim }],
                  opacity: isPlaying ? 0.4 : 0.15,
                }
              ]} 
            />
            <View style={[styles.visualizationCircle, { borderColor: categoryColor }]}>
              <View style={styles.visualizationInner}>
                <Eye size={32} color={categoryColor} />
                <Text style={[styles.visualizationText, { color: categoryColor }]}>VISUALIZE</Text>
              </View>
            </View>
            
            <View style={styles.guidanceCard}>
              <Brain size={18} color={categoryColor} />
              <Text style={styles.guidanceText}>
                Close your eyes. See yourself executing perfectly. Feel the confidence.
              </Text>
            </View>
            
            {isPlaying && (
              <View style={styles.activeIndicator}>
                <Sparkles size={14} color={categoryColor} />
                <Text style={[styles.activeText, { color: categoryColor }]}>Session Active</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={[styles.mediaControls, { paddingBottom: insets.bottom + 30 }]}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: categoryColor }]} />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.mediaPlayButton, { shadowColor: categoryColor }]} 
          onPress={togglePlayPause}
        >
          {isPlaying ? (
            <Pause size={32} color="#000" fill="#000" />
          ) : (
            <Play size={32} color="#000" fill="#000" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  playerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    textAlign: 'center',
  },
  moduleSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    textAlign: 'center',
  },
  breathContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualizationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
  },
  middleRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
  },
  visualizationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualizationInner: {
    alignItems: 'center',
    gap: 8,
  },
  visualizationText: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  guidanceCard: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    maxWidth: width - 60,
  },
  guidanceText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  activeIndicator: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 1,
  },
  mediaControls: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums'] as const,
  },
  progressHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  stepsScrollView: {
    flex: 1,
  },
  stepsContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    gap: 14,
  },
  stepItemCompleted: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  stepCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  stepTextCompleted: {
    color: 'rgba(255,255,255,0.4)',
    textDecorationLine: 'line-through',
  },
  stepsControls: {
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: 'center',
    gap: 12,
  },
  restButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  restPresetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  restPresetText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  restOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  restCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  restTimerText: {
    fontSize: 72,
    fontWeight: '200' as const,
    fontVariant: ['tabular-nums'],
  },
  restLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 3,
    marginTop: 4,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  timerControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
  },
  timerControlText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  completeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#fff',
  },
  mediaPlayButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
