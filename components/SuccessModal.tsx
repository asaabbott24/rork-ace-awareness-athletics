import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { Trophy, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  mentalReps: number;
  streak: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SuccessModal({
  visible,
  onClose,
  mentalReps,
  streak,
}: SuccessModalProps) {
  const { getAccentColor } = useApp();
  const accentColor = getAccentColor();

  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible, scaleAnim, fadeAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <X color={Colors.textMuted} size={20} />
            </Pressable>

            <View style={[styles.iconContainer, { backgroundColor: `${accentColor}20` }]}>
              <Trophy color={accentColor} size={60} />
            </View>

            <Text style={styles.title}>Mental Rep Complete!</Text>
            <Text style={styles.subtitle}>
              You just leveled up your mental game
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: accentColor }]}>
                  {mentalReps}
                </Text>
                <Text style={styles.statLabel}>Season Reps</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: accentColor }]}>
                  {streak}
                </Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: accentColor }]}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>Keep Training</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 400,
  },
  content: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600' as const,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
});
