import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Zap, X } from 'lucide-react-native';
import Colors from '@/constants/colors';


interface ClutchButtonProps {
  visible: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.35;

export default function ClutchButton({ visible }: ClutchButtonProps) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [breatheAnim] = useState(new Animated.Value(1));
  const [videoOpacity] = useState(new Animated.Value(0));
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold-in' | 'exhale' | 'hold-out'>('inhale');



  const startBreathingAnimation = useCallback(() => {
    const breathingCycle = () => {
      setBreathPhase('inhale');
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 2.5,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 2.5,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isActive) {
          breathingCycle();
        }
      });

      setTimeout(() => setBreathPhase('hold-in'), 4000);
      setTimeout(() => setBreathPhase('exhale'), 8000);
      setTimeout(() => setBreathPhase('hold-out'), 12000);
    };

    breathingCycle();
  }, [breatheAnim, isActive]);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    breatheAnim.stopAnimation();
    setTimeout(() => {
      setModalVisible(false);
      breatheAnim.setValue(1);
    }, 1000);
  }, [breatheAnim]);

  useEffect(() => {
    if (isActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      handleComplete();
    }
  }, [countdown, isActive, handleComplete]);

  useEffect(() => {
    if (isActive) {
      startBreathingAnimation();
    }
  }, [isActive, startBreathingAnimation]);

  const handleOpen = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setModalVisible(true);
    setCountdown(60);
    setIsActive(true);
    breatheAnim.setValue(1);
    videoOpacity.setValue(0);
    Animated.timing(videoOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    setIsActive(false);
    setModalVisible(false);
    breatheAnim.stopAnimation();
    breatheAnim.setValue(1);
    videoOpacity.setValue(0);
  };

  if (!visible) return null;

  return (
    <>
      <Pressable style={styles.fab} onPress={handleOpen}>
        <Zap color={Colors.text} size={28} fill={Colors.text} />
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: videoOpacity }]}>
            <Video
              source={{ uri: 'https://player.vimeo.com/external/477617639.sd.mp4?s=d7e35b0351726d5668e64757c2c9d2f2c8d2c20a&profile_id=165&oauth2_token_id=57447761' }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
            />
          </Animated.View>

          <View style={styles.videoOverlay} />

          <Pressable style={styles.closeButton} onPress={handleClose}>
            <X color={Colors.text} size={24} />
          </Pressable>

          <View style={styles.content}>
            <Text style={styles.title}>Box Breathing</Text>
            <Text style={styles.subtitle}>
              {countdown > 0 ? (
                breathPhase === 'inhale' ? 'Breathe In' :
                breathPhase === 'hold-in' ? 'Hold' :
                breathPhase === 'exhale' ? 'Breathe Out' : 'Hold'
              ) : 'Complete!'}
            </Text>

            <View style={styles.circleContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    transform: [{ scale: breatheAnim }],
                  },
                ]}
              />
              <View style={styles.countdownContainer}>
                <Text style={styles.countdownNumber}>{countdown}</Text>
                <Text style={styles.countdownLabel}>seconds</Text>
              </View>
            </View>

            <View style={styles.instructionsContainer}>
              <View style={styles.instructionRow}>
                <View style={styles.instructionDot} />
                <Text style={styles.instructionText}>Inhale as circle expands (4s)</Text>
              </View>
              <View style={styles.instructionRow}>
                <View style={styles.instructionDot} />
                <Text style={styles.instructionText}>Hold at full expansion (4s)</Text>
              </View>
              <View style={styles.instructionRow}>
                <View style={styles.instructionDot} />
                <Text style={styles.instructionText}>Exhale as circle contracts (4s)</Text>
              </View>
              <View style={styles.instructionRow}>
                <View style={styles.instructionDot} />
                <Text style={styles.instructionText}>Hold at smallest size (4s)</Text>
              </View>
            </View>

            {countdown === 0 && (
              <Pressable style={styles.doneButton} onPress={handleClose}>
                <Text style={styles.doneButtonText}>Back to Training</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 60,
  },
  circleContainer: {
    width: CIRCLE_SIZE * 3,
    height: CIRCLE_SIZE * 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  breathingCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 72,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  countdownLabel: {
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 8,
  },
  instructionsContainer: {
    gap: 16,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  instructionText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  doneButton: {
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    backgroundColor: '#FF4444',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
});
