import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap } from 'lucide-react-native';


interface AffirmationCardProps {
  affirmation: string | { text: string; mode: string };
}

export default function AffirmationCard({ affirmation }: AffirmationCardProps) {
  const affirmationText = typeof affirmation === 'string' ? affirmation : affirmation.text;
  return (
    <LinearGradient
      colors={['#604a18', '#8f732d', '#e8cd79', '#8f732d', '#604a18']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.shimmerOverlay} />
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Zap color="#000" size={16} fill="#000" />
        </View>
        <Text style={styles.label}>DAILY AFFIRMATION</Text>
      </View>
      <Text style={styles.affirmation}>{affirmationText}</Text>
      <Text style={styles.instruction}>Repeat 3 times with conviction</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8cd79',
    shadowColor: '#e8cd79',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  iconBadge: {
    backgroundColor: '#e8cd79',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: '#e8cd79',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  affirmation: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 32,
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instruction: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});
