import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { Audio, Video, ResizeMode } from 'expo-av';
import { X, Play, Pause, Volume2, Music2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import Slider from '@react-native-community/slider';
import { NATURE_LOOPS } from '@/constants/AmbientVideos';

interface AudioPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  duration: string;
  voiceUrl?: string;
  backgroundUrl?: string;
  onComplete: () => void;
  protocolId?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AudioPlayerModal({
  visible,
  onClose,
  title,
  duration,
  voiceUrl,
  backgroundUrl,
  onComplete,
  protocolId,
}: AudioPlayerModalProps) {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [voiceVolume, setVoiceVolume] = useState<number>(1.0);
  const [ambienceVolume, setAmbienceVolume] = useState<number>(0.5);
  const [position, setPosition] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [breathPhase, setBreathPhase] = useState<string>('Ready');
  const [videoSource, setVideoSource] = useState<string>('');
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const breathAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  const isBreathingExercise = protocolId?.startsWith('breath-');

  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDurationMs(status.durationMillis || 0);

      if (status.didJustFinish) {
        setIsPlaying(false);
        onComplete();
      }
    }
  }, [onComplete]);

  const cleanupAudio = useCallback(async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setPosition(0);
    }
  }, [sound]);

  const loadAndPlayAudio = useCallback(async () => {
    try {
      console.log('Loading Audio');
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: voiceUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { shouldPlay: true, volume: voiceVolume },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  }, [voiceUrl, voiceVolume, onPlaybackStatusUpdate]);

  const getBreathingPattern = useCallback(() => {
    switch (protocolId) {
      case 'breath-1':
        return { inhale: 4000, holdIn: 4000, exhale: 4000, holdOut: 4000, label: 'Box Breathing' };
      case 'breath-2':
        return { inhale: 4000, holdIn: 7000, exhale: 8000, holdOut: 0, label: '4-7-8' };
      case 'breath-3':
        return { inhale: 1000, holdIn: 0, exhale: 1000, holdOut: 0, label: 'Warrior' };
      default:
        return { inhale: 4000, holdIn: 4000, exhale: 4000, holdOut: 4000, label: 'Breathe' };
    }
  }, [protocolId]);

  const startBreathingAnimation = useCallback(() => {
    const pattern = getBreathingPattern();
    const phases: {
      animation: Animated.CompositeAnimation;
      label: string;
      duration: number;
    }[] = [];
    
    if (pattern.inhale > 0) {
      phases.push({
        animation: Animated.timing(scaleAnim, {
          toValue: 1.8,
          duration: pattern.inhale,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        label: 'Breathe In',
        duration: pattern.inhale,
      });
    }
    
    if (pattern.holdIn > 0) {
      phases.push({
        animation: Animated.timing(scaleAnim, {
          toValue: 1.8,
          duration: pattern.holdIn,
          useNativeDriver: true,
        }),
        label: 'Hold',
        duration: pattern.holdIn,
      });
    }
    
    if (pattern.exhale > 0) {
      phases.push({
        animation: Animated.timing(scaleAnim, {
          toValue: 1,
          duration: pattern.exhale,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        label: 'Breathe Out',
        duration: pattern.exhale,
      });
    }
    
    if (pattern.holdOut > 0) {
      phases.push({
        animation: Animated.timing(scaleAnim, {
          toValue: 1,
          duration: pattern.holdOut,
          useNativeDriver: true,
        }),
        label: 'Hold',
        duration: pattern.holdOut,
      });
    }
    
    const sequence = Animated.sequence(
      phases.map(phase => phase.animation)
    );
    
    breathAnimationRef.current = Animated.loop(sequence);
    breathAnimationRef.current.start();
    
    setBreathPhase(phases[0]?.label || 'Ready');
    
    const schedulePhaseLabelUpdates = () => {
      let accumulatedTime = 0;
      const timeouts: ReturnType<typeof setTimeout>[] = [];
      
      const scheduleNextCycle = () => {
        phases.forEach((phase, index) => {
          const timeout = setTimeout(() => {
            setBreathPhase(phase.label);
          }, accumulatedTime);
          timeouts.push(timeout);
          accumulatedTime += phase.duration;
        });
        
        const totalCycleDuration = phases.reduce((sum, p) => sum + p.duration, 0);
        const cycleTimeout = setTimeout(scheduleNextCycle, totalCycleDuration);
        timeouts.push(cycleTimeout);
      };
      
      scheduleNextCycle();
      
      return timeouts;
    };
    
    const timeouts = schedulePhaseLabelUpdates();
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [scaleAnim, getBreathingPattern]);

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (visible) {
      if (isBreathingExercise) {
        const randomVideo = NATURE_LOOPS[Math.floor(Math.random() * NATURE_LOOPS.length)];
        setVideoSource(randomVideo.url);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
        
        startBreathingAnimation();
      }
      
      if (voiceUrl) {
        loadAndPlayAudio();
      }
    } else {
      cleanupAudio();
      if (breathAnimationRef.current) {
        breathAnimationRef.current.stop();
      }
      scaleAnim.setValue(1);
      fadeAnim.setValue(0);
      setBreathPhase('Ready');
    }
  }, [visible, voiceUrl, isBreathingExercise, loadAndPlayAudio, cleanupAudio, fadeAnim, scaleAnim, startBreathingAnimation]);

  const togglePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleVoiceVolumeChange = async (value: number) => {
    setVoiceVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };

  const handleClose = () => {
    cleanupAudio();
    if (breathAnimationRef.current) {
      breathAnimationRef.current.stop();
    }
    onClose();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isBreathingExercise) {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        <View style={styles.breathContainer}>
          {videoSource && (
            <Video
              source={{ uri: videoSource }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay
              isMuted
            />
          )}
          
          <View style={styles.videoOverlay} />
          
          <Pressable style={styles.closeButtonBreath} onPress={handleClose}>
            <X color={Colors.text} size={24} />
          </Pressable>
          
          <View style={styles.breathContent}>
            <Animated.View 
              style={[
                styles.breathingCircle,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                },
              ]} 
            />
            <Text style={styles.breathInstruction}>{breathPhase}</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <X color={Colors.text} size={24} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={[styles.artwork, { backgroundColor: `${accentColor}20` }]}>
            <View style={[styles.artworkInner, { backgroundColor: `${accentColor}30` }]}>
              <Music2 color={accentColor} size={80} />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{duration} SESSION</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${durationMs > 0 ? (position / durationMs) * 100 : 0}%`,
                    backgroundColor: accentColor,
                  },
                ]}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
            </View>
          </View>

          <Pressable
            style={[styles.playButton, { backgroundColor: accentColor }]}
            onPress={togglePlayPause}
          >
            {isPlaying ? (
              <Pause color={Colors.background} size={40} fill={Colors.background} />
            ) : (
              <Play color={Colors.background} size={40} fill={Colors.background} />
            )}
          </Pressable>

          <View style={styles.controlsSection}>
            <View style={styles.controlRow}>
              <View style={styles.controlLabel}>
                <Volume2 color={Colors.primary} size={20} />
                <Text style={styles.controlText}>Voice Guide</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={voiceVolume}
                onValueChange={handleVoiceVolumeChange}
                minimumTrackTintColor={accentColor}
                maximumTrackTintColor={Colors.border}
                thumbTintColor={accentColor}
              />
              <Text style={styles.volumeValue}>{Math.round(voiceVolume * 100)}%</Text>
            </View>

            <View style={styles.controlRow}>
              <View style={styles.controlLabel}>
                <Music2 color={Colors.secondary} size={20} />
                <Text style={styles.controlText}>Binaural Ambience</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={ambienceVolume}
                onValueChange={setAmbienceVolume}
                minimumTrackTintColor={Colors.secondary}
                maximumTrackTintColor={Colors.border}
                thumbTintColor={Colors.secondary}
              />
              <Text style={styles.volumeValue}>{Math.round(ambienceVolume * 100)}%</Text>
            </View>
          </View>

          <Text style={styles.hint}>
            Future: Multi-track mixing for voice and binaural beats
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  breathContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButtonBreath: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  breathContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  breathInstruction: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 60,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  artwork: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  artworkInner: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  controlsSection: {
    width: '100%',
    gap: 24,
  },
  controlRow: {
    width: '100%',
  },
  controlLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  controlText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  volumeValue: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  hint: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  },
});
