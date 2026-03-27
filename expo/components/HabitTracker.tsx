import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check, Zap, Trophy } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Habit {
  id: string;
  name: string;
  color: string;
  completed: boolean[];
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Morning Visualization', color: '#00f0ff', completed: [false, false, false, false, false, false, false] },
  { id: '2', name: 'Post-Workout Journal', color: '#FFD700', completed: [false, false, false, false, false, false, false] },
  { id: '3', name: 'Mind Gym Reading', color: '#ADFF2F', completed: [false, false, false, false, false, false, false] },
];

const STORAGE_KEY = 'ace_habit_tracker';

export const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [celebratingHabit, setCelebratingHabit] = useState<string | null>(null);
  
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const celebrationRotation = useRef(new Animated.Value(0)).current;
  const starAnimations = useRef([...Array(8)].map(() => ({
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored && typeof stored === 'string' && stored.length > 0) {
        const trimmed = stored.trim();
        if (
          !trimmed.startsWith('[') ||
          trimmed === 'undefined' ||
          trimmed === 'null' ||
          trimmed === '[object Object]' ||
          trimmed.length < 2
        ) {
          console.warn('Invalid stored habits format, clearing:', trimmed.substring(0, 50));
          await AsyncStorage.removeItem(STORAGE_KEY);
          return;
        }
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          setHabits(parsed);
        } else {
          console.warn('Stored habits is not an array, resetting');
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.log('Error loading habits:', error);
      await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHabits));
    } catch (error) {
      console.log('Error saving habits:', error);
    }
  };

  const triggerCelebration = (habitId: string) => {
    setCelebratingHabit(habitId);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    celebrationScale.setValue(0);
    celebrationOpacity.setValue(1);
    celebrationRotation.setValue(0);
    
    starAnimations.forEach((anim, i) => {
      anim.scale.setValue(0);
      anim.opacity.setValue(1);
      anim.translateX.setValue(0);
      anim.translateY.setValue(0);
    });

    Animated.parallel([
      Animated.sequence([
        Animated.spring(celebrationScale, {
          toValue: 1.2,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(celebrationScale, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(celebrationRotation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      ...starAnimations.map((anim, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 60 + Math.random() * 30;
        return Animated.parallel([
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: 300,
            delay: i * 40,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateX, {
            toValue: Math.cos(angle) * distance,
            duration: 600,
            delay: i * 40,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: Math.sin(angle) * distance,
            duration: 600,
            delay: i * 40,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 600,
            delay: i * 40 + 200,
            useNativeDriver: true,
          }),
        ]);
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(celebrationOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCelebratingHabit(null);
      });
    }, 1500);
  };

  const toggleHabit = (habitId: string, dayIndex: number) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = [...habit.completed];
        newCompleted[dayIndex] = !newCompleted[dayIndex];
        
        if (newCompleted[dayIndex]) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        const completedCount = newCompleted.filter(Boolean).length;
        if (completedCount === 7 && newCompleted[dayIndex]) {
          setTimeout(() => triggerCelebration(habitId), 100);
        }
        
        return { ...habit, completed: newCompleted };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };

  const getCompletedCount = (habit: Habit) => habit.completed.filter(Boolean).length;
  const isPerfectWeek = (habit: Habit) => getCompletedCount(habit) === 7;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.sectionIndicator, { backgroundColor: '#00f0ff' }]} />
          <Text style={styles.sectionTitle}>DAILY DISCIPLINES</Text>
        </View>
        <Zap size={18} color="rgba(255,255,255,0.3)" />
      </View>
      <Text style={styles.sectionSubtitle}>Build your championship habits</Text>
      
      {habits.map((habit) => {
        const completedCount = getCompletedCount(habit);
        const perfect = isPerfectWeek(habit);
        const isCelebrating = celebratingHabit === habit.id;
        
        return (
          <View key={habit.id} style={styles.habitRow}>
            <View style={styles.habitInfo}>
              <View style={styles.habitNameRow}>
                <View style={[styles.habitDot, { backgroundColor: habit.color }]} />
                <Text style={styles.habitName}>{habit.name}</Text>
                {perfect && (
                  <View style={[styles.perfectBadge, { backgroundColor: habit.color + '20' }]}>
                    <Trophy size={10} color={habit.color} />
                  </View>
                )}
              </View>
              <Text style={[styles.streakCount, perfect && { color: habit.color }]}>
                {completedCount}/7 {perfect ? '🔥 PERFECT' : 'days'}
              </Text>
            </View>
            
            <View style={styles.daysContainer}>
              {habit.completed.map((isDone, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleHabit(habit.id, index)}
                  activeOpacity={0.7}
                  style={[
                    styles.dayCircle,
                    isDone && { 
                      backgroundColor: habit.color, 
                      borderColor: habit.color,
                      shadowColor: habit.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 6,
                      elevation: 4,
                    }
                  ]}
                >
                  {isDone ? (
                    <Check size={14} color="#000" strokeWidth={3} />
                  ) : (
                    <Text style={styles.dayText}>{DAYS[index]}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {isCelebrating && (
              <Animated.View 
                style={[
                  styles.celebrationOverlay,
                  {
                    opacity: celebrationOpacity,
                  }
                ]}
                pointerEvents="none"
              >
                <Animated.View
                  style={[
                    styles.celebrationIcon,
                    {
                      transform: [
                        { scale: celebrationScale },
                        { 
                          rotate: celebrationRotation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                          })
                        }
                      ],
                    }
                  ]}
                >
                  <Trophy size={32} color={habit.color} />
                </Animated.View>
                
                {starAnimations.map((anim, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.star,
                      {
                        backgroundColor: habit.color,
                        opacity: anim.opacity,
                        transform: [
                          { scale: anim.scale },
                          { translateX: anim.translateX },
                          { translateY: anim.translateY },
                        ],
                      }
                    ]}
                  />
                ))}
              </Animated.View>
            )}
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${(completedCount / 7) * 100}%`,
                    backgroundColor: habit.color,
                  }
                ]} 
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  sectionTitle: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 13, 
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginLeft: 13,
    marginBottom: 20,
  },
  habitRow: { 
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  habitInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 14, 
    alignItems: 'center',
  },
  habitNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  habitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  habitName: { 
    color: '#ffffff', 
    fontSize: 15, 
    fontWeight: '600' as const,
  },
  perfectBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  streakCount: { 
    color: 'rgba(255,255,255,0.4)', 
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  daysContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 6,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  dayText: { 
    color: 'rgba(255,255,255,0.4)', 
    fontSize: 11, 
    fontWeight: '700' as const,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    marginTop: 14,
    overflow: 'hidden' as const,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
  },
  celebrationIcon: {
    zIndex: 10,
  },
  star: {
    position: 'absolute' as const,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default HabitTracker;
