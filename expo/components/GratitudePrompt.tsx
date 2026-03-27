import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Sun, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ace_gratitude_entries';

interface GratitudeEntry {
  date: string;
  entries: string[];
}

export const GratitudePrompt = () => {
  const [entries, setEntries] = useState<string[]>(['', '', '']);
  const [saved, setSaved] = useState(false);
  const [saveAnim] = useState(new Animated.Value(0));

  const getTodayKey = useCallback(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const loadTodaysEntry = useCallback(async () => {
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
          console.warn('Invalid stored gratitude format, clearing:', trimmed.substring(0, 50));
          await AsyncStorage.removeItem(STORAGE_KEY);
          return;
        }
        const parsed: GratitudeEntry[] = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const todayEntry = parsed.find(e => e.date === getTodayKey());
          if (todayEntry) {
            setEntries(todayEntry.entries);
            setSaved(true);
          }
        } else {
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.log('Error loading gratitude:', error);
      await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    }
  }, [getTodayKey]);

  useEffect(() => {
    loadTodaysEntry();
  }, [loadTodaysEntry]);

  const handleSave = async () => {
    const hasContent = entries.some(e => e.trim().length > 0);
    if (!hasContent) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let allEntries: GratitudeEntry[] = [];
      if (stored && typeof stored === 'string' && stored.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(stored.trim());
          if (Array.isArray(parsed)) {
            allEntries = parsed;
          }
        } catch {
          console.warn('Invalid gratitude data during save, starting fresh');
        }
      }
      
      const todayKey = getTodayKey();
      const existingIndex = allEntries.findIndex(e => e.date === todayKey);
      
      if (existingIndex >= 0) {
        allEntries[existingIndex].entries = entries;
      } else {
        allEntries.unshift({ date: todayKey, entries });
      }
      
      allEntries = allEntries.slice(0, 30);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allEntries));
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSaved(true);
      
      Animated.sequence([
        Animated.timing(saveAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(saveAnim, {
          toValue: 0,
          duration: 200,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]).start();
      
      console.log('Gratitude saved successfully');
    } catch (error) {
      console.log('Error saving gratitude:', error);
    }
  };

  const updateEntry = (index: number, text: string) => {
    const newEntries = [...entries];
    newEntries[index] = text;
    setEntries(newEntries);
    if (saved) setSaved(false);
  };

  const filledCount = entries.filter(e => e.trim().length > 0).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.sectionIndicator, { backgroundColor: '#FFD700' }]} />
          <Sun size={18} color="#FFD700" />
          <Text style={styles.title}>MORNING GRATITUDE</Text>
        </View>
        {saved && (
          <View style={styles.savedBadge}>
            <Check size={12} color="#FFD700" />
          </View>
        )}
      </View>
      <Text style={styles.subtitle}>Three things I am thankful for today</Text>

      <View style={styles.entriesContainer}>
        {entries.map((entry, index) => (
          <View key={index} style={styles.inputRow}>
            <View style={[
              styles.inputNumber,
              entry.trim().length > 0 && styles.inputNumberFilled
            ]}>
              <Text style={[
                styles.inputNumberText,
                entry.trim().length > 0 && styles.inputNumberTextFilled
              ]}>
                {index + 1}
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="What are you grateful for?"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={entry}
              onChangeText={(text) => updateEntry(index, text)}
              multiline={false}
              returnKeyType="next"
            />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.progressDots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i < filledCount && { backgroundColor: '#FFD700' }
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.saveButton,
            saved && styles.saveButtonSaved
          ]} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          {saved ? (
            <Check size={16} color="#FFD700" />
          ) : (
            <Text style={styles.saveButtonText}>SAVE</Text>
          )}
        </TouchableOpacity>
      </View>
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
    alignItems: 'center', 
    justifyContent: 'space-between',
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
  title: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 13, 
    fontWeight: '700' as const, 
    letterSpacing: 2,
  },
  savedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: { 
    color: 'rgba(255,255,255,0.35)', 
    fontSize: 12, 
    marginLeft: 13,
    marginBottom: 20,
  },
  entriesContainer: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputNumberFilled: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  inputNumberText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  inputNumberTextFilled: {
    color: '#FFD700',
  },
  input: {
    flex: 1,
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  saveButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  saveButtonSaved: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  saveButtonText: { 
    color: '#FFD700', 
    fontWeight: '700' as const, 
    fontSize: 12,
    letterSpacing: 1,
  },
});

export default GratitudePrompt;
