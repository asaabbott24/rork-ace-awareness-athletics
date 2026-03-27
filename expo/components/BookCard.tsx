import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Linking } from 'react-native';
import { Target, Dumbbell, ExternalLink, Crown, Flame, Brain } from 'lucide-react-native';
import Colors from '@/constants/colors';
import type { CourtIQEntry } from '@/constants/books';

interface BookCardProps {
  book: CourtIQEntry;
}

const archetypeConfig = {
  'The Leader': {
    color: '#4A90E2',
    icon: Crown,
    label: 'LEADER'
  },
  'The Killer': {
    color: '#E53935',
    icon: Flame,
    label: 'KILLER'
  },
  'The Monk': {
    color: '#7E57C2',
    icon: Brain,
    label: 'MONK'
  }
};

export default function BookCard({ book }: BookCardProps) {
  const archetype = archetypeConfig[book.archetype];
  const ArchetypeIcon = archetype.icon;

  const handlePurchase = () => {
    Linking.openURL(book.purchaseLink);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentRow}>
        <Image
          source={{ uri: book.coverImage }}
          style={styles.cover}
          resizeMode="cover"
        />
        
        <View style={styles.details}>
          <View style={[styles.archetypeBadge, { backgroundColor: `${archetype.color}20` }]}>
            <ArchetypeIcon color={archetype.color} size={12} />
            <Text style={[styles.archetypeText, { color: archetype.color }]}>
              {archetype.label}
            </Text>
          </View>
          
          <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
        </View>
      </View>

      <View style={styles.scoutingSection}>
        <View style={styles.scoutingHeader}>
          <Target color={Colors.secondary} size={16} />
          <Text style={styles.scoutingTitle}>SCOUTING REPORT</Text>
        </View>
        
        <View style={styles.insightBox}>
          <Text style={styles.insightLabel}>KEY INSIGHT</Text>
          <Text style={styles.insightText}>{book.scoutingReport.insight}</Text>
        </View>

        <View style={styles.drillBox}>
          <View style={styles.drillHeader}>
            <Dumbbell color={Colors.primary} size={14} />
            <Text style={styles.drillLabel}>KEY DRILL</Text>
          </View>
          <Text style={styles.drillText}>{book.scoutingReport.keyDrill}</Text>
        </View>
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.purchaseButton,
          pressed && styles.purchaseButtonPressed
        ]}
        onPress={handlePurchase}
      >
        <View style={styles.purchaseButtonContent}>
          <Text style={styles.purchaseButtonText}>ADD TO BAG</Text>
          <ExternalLink color={Colors.background} size={16} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 16,
  },
  contentRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 14,
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  details: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 8,
  },
  archetypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  archetypeText: {
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.text,
    lineHeight: 24,
  },
  author: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  scoutingSection: {
    marginBottom: 16,
  },
  scoutingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  scoutingTitle: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: Colors.secondary,
    letterSpacing: 1.2,
  },
  insightBox: {
    backgroundColor: `${Colors.secondary}10`,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.secondary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.text,
    fontStyle: 'italic' as const,
  },
  drillBox: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  drillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  drillLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: 1,
  },
  drillText: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.text,
  },
  purchaseButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  purchaseButtonPressed: {
    opacity: 0.8,
  },
  purchaseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  purchaseButtonText: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: Colors.background,
    letterSpacing: 1,
  },
});
