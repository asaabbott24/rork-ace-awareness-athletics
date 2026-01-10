import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Target } from 'lucide-react-native';
import Colors from '@/constants/colors';
import DailyQuoteCard from '@/components/DailyQuoteCard';
import AffirmationCard from '@/components/AffirmationCard';
import ProInsightCard from '@/components/ProInsightCard';
import { GratitudePrompt } from '@/components/GratitudePrompt';
import GameModeToggle from '@/components/GameModeToggle';
import { dailyContent, postGameContent } from '@/data/protocols';
import { useApp } from '@/contexts/AppContext';
import { useDailyNBA, useDailyZen, useDailyAffirmation } from '@/hooks/useDailyDrop';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { gameMode, mentalReps, currentStreak, getAccentColor } = useApp();
  const accentColor = getAccentColor();
  
  // Daily rotating content
  const dailyNBA = useDailyNBA();
  const dailyZen = useDailyZen();
  const dailyAffirmation = useDailyAffirmation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Reset animations when gameMode changes to re-trigger the effect
    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [gameMode, fadeAnim, slideAnim]);

  const content = useMemo(() => {
    const staticContent = gameMode === 'pre' ? dailyContent : postGameContent;
    
    // Override with daily rotating quotes based on game mode
    const dailyQuote = gameMode === 'pre' ? dailyNBA : dailyZen;
    
    return {
      ...staticContent,
      quote: dailyQuote ? {
        text: dailyQuote.text,
        author: dailyQuote.author,
        context: dailyQuote.type === 'NBA' ? 'Legend Quote' : 'Wisdom',
        mode: staticContent.quote.mode,
      } : staticContent.quote,
      affirmation: dailyAffirmation ? {
        text: dailyAffirmation.text,
        mode: staticContent.affirmation.mode,
      } : staticContent.affirmation,
    };
  }, [gameMode, dailyNBA, dailyZen, dailyAffirmation]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Zone</Text>
        <View style={styles.greetingRow}>
          <View style={[styles.iconBadge, { backgroundColor: `${accentColor}20` }]}>
            <Target color={accentColor} size={20} />
          </View>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, Athlete</Text>
            <Text style={styles.subtitle}>Your daily mental training awaits</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: accentColor }]}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={[styles.statCard, styles.statCardCenter]}>
          <Text style={[styles.statValue, { color: accentColor }]}>{mentalReps}</Text>
          <Text style={styles.statLabel}>Mental Reps</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: accentColor }]}>{Math.floor(mentalReps * 4.2 / 10)}h</Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
      </View>

      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <GameModeToggle />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionAccent, { backgroundColor: accentColor }]} />
            <Text style={styles.sectionTitle}>DAILY DROP</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            {gameMode === 'pre' ? 'Your mental fuel for today' : 'Recovery and restoration'}
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <DailyQuoteCard
            quote={content.quote.text}
            author={content.quote.author}
            context={content.quote.context}
          />
        </View>

        <View style={styles.cardContainer}>
          <AffirmationCard affirmation={content.affirmation} />
        </View>

        <View style={styles.gratitudeContainer}>
          <GratitudePrompt />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionAccent, { backgroundColor: Colors.secondary }]} />
            <Text style={styles.sectionTitle}>PRO INSIGHT</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Learn from the legends</Text>
        </View>

        <View style={styles.cardContainer}>
          <ProInsightCard
            title={content.proInsight.title}
            athlete={content.proInsight.athlete}
            summary={content.proInsight.summary}
            imageUrl={content.proInsight.imageUrl}
          />
        </View>
      </Animated.View>
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
  contentContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 14,
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCardCenter: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800' as const,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  gratitudeContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
});
