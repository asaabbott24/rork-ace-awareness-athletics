import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Trophy, Flame, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { PowerDownToggle } from '@/components/PowerDownToggle';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { mentalReps, currentStreak, getAccentColor } = useApp();
  const accentColor = getAccentColor();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: `${accentColor}20` }]}>
          <User color={accentColor} size={40} />
        </View>
        <Text style={styles.name}>Mental Athlete</Text>
        <Text style={styles.tagline}>Building championship mindset</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SETTINGS</Text>
      </View>

      <View style={styles.settingsContainer}>
        <PowerDownToggle />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PLAYER STATS</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.statCardLarge]}>
          <View style={[styles.statIcon, { backgroundColor: `${accentColor}20` }]}>
            <Trophy color={accentColor} size={32} />
          </View>
          <Text style={[styles.statValue, { color: accentColor }]}>{mentalReps}</Text>
          <Text style={styles.statLabel}>Season Reps</Text>
          <Text style={styles.statDescription}>Total sessions completed</Text>
        </View>

        <View style={[styles.statCard, styles.statCardLarge]}>
          <View style={[styles.statIcon, { backgroundColor: '#F59E0B20' }]}>
            <Flame color="#F59E0B" size={32} />
          </View>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statDescription}>Consecutive training days</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.statIconSmall, { backgroundColor: '#10B98120' }]}>
            <TrendingUp color="#10B981" size={20} />
          </View>
          <Text style={[styles.statValueSmall, { color: '#10B981' }]}>
            {mentalReps > 0 ? ((currentStreak / (mentalReps / 10)) * 100).toFixed(0) : 0}%
          </Text>
          <Text style={styles.statLabelSmall}>Consistency</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, styles.statIconSmall, { backgroundColor: '#3B82F620' }]}>
            <Trophy color="#3B82F6" size={20} />
          </View>
          <Text style={[styles.statValueSmall, { color: '#3B82F6' }]}>
            {Math.floor(mentalReps / 7)}
          </Text>
          <Text style={styles.statLabelSmall}>Weeks Active</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
      </View>

      <View style={styles.achievementsContainer}>
        <View style={[styles.achievementCard, mentalReps >= 1 && styles.achievementUnlocked]}>
          <Text style={styles.achievementIcon}>🏀</Text>
          <Text style={styles.achievementTitle}>First Rep</Text>
          <Text style={styles.achievementSubtitle}>
            {mentalReps >= 1 ? 'Unlocked!' : 'Complete 1 session'}
          </Text>
        </View>

        <View style={[styles.achievementCard, mentalReps >= 10 && styles.achievementUnlocked]}>
          <Text style={styles.achievementIcon}>⚡</Text>
          <Text style={styles.achievementTitle}>Hot Streak</Text>
          <Text style={styles.achievementSubtitle}>
            {mentalReps >= 10 ? 'Unlocked!' : 'Complete 10 sessions'}
          </Text>
        </View>

        <View style={[styles.achievementCard, currentStreak >= 7 && styles.achievementUnlocked]}>
          <Text style={styles.achievementIcon}>🔥</Text>
          <Text style={styles.achievementTitle}>Week Warrior</Text>
          <Text style={styles.achievementSubtitle}>
            {currentStreak >= 7 ? 'Unlocked!' : '7 day streak'}
          </Text>
        </View>

        <View style={[styles.achievementCard, mentalReps >= 50 && styles.achievementUnlocked]}>
          <Text style={styles.achievementIcon}>🏆</Text>
          <Text style={styles.achievementTitle}>Elite Mind</Text>
          <Text style={styles.achievementSubtitle}>
            {mentalReps >= 50 ? 'Unlocked!' : 'Complete 50 sessions'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCardLarge: {
    paddingVertical: 24,
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 48,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  statValueSmall: {
    fontSize: 32,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabelSmall: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  statDescription: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    borderColor: Colors.primary,
  },
  achievementIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
