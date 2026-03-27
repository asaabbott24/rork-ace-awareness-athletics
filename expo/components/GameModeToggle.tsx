import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Zap, Moon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp, GameMode } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function GameModeToggle() {
  const { gameMode, setGameMode, getAccentColor } = useApp();
  const accentColor = getAccentColor();

  const handleToggle = (mode: GameMode) => {
    if (gameMode !== mode) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setGameMode(mode);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.option,
          gameMode === 'pre' && [styles.optionActive, { backgroundColor: `${accentColor}20`, borderColor: accentColor }],
        ]}
        onPress={() => handleToggle('pre')}
      >
        <Zap color={gameMode === 'pre' ? accentColor : Colors.textMuted} size={18} />
        <Text style={[styles.optionText, gameMode === 'pre' && { color: accentColor }]}>
          PRE-GAME
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.option,
          gameMode === 'post' && [styles.optionActive, { backgroundColor: `${accentColor}20`, borderColor: accentColor }],
        ]}
        onPress={() => handleToggle('post')}
      >
        <Moon color={gameMode === 'post' ? accentColor : Colors.textMuted} size={18} />
        <Text style={[styles.optionText, gameMode === 'post' && { color: accentColor }]}>
          POST-GAME
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionActive: {
    borderWidth: 2,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
});
