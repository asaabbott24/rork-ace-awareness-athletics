import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy, Leaf, Target } from 'lucide-react-native';
import { useDailyDrop, DailyDropItem } from '@/hooks/useDailyDrop';

interface ThemeConfig {
  color: string;
  icon: React.ReactNode;
  label: string;
  borderColor: string;
}

const getTheme = (type: DailyDropItem['type']): ThemeConfig => {
  switch (type) {
    case 'NBA':
      return {
        color: '#FF5722',
        icon: <Trophy size={14} color="#FF5722" />,
        label: 'LEGEND',
        borderColor: 'rgba(255, 87, 34, 0.3)',
      };
    case 'ZEN':
      return {
        color: '#00E5FF',
        icon: <Leaf size={14} color="#00E5FF" />,
        label: 'WISDOM',
        borderColor: 'rgba(0, 229, 255, 0.3)',
      };
    case 'AFFIRMATION':
      return {
        color: '#FFFFFF',
        icon: <Target size={14} color="#FFFFFF" />,
        label: 'MINDSET',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      };
    default:
      return {
        color: '#FFFFFF',
        icon: <Trophy size={14} color="#FFFFFF" />,
        label: 'DAILY',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      };
  }
};

export const DailyDropCard = () => {
  const quote = useDailyDrop();

  if (!quote) return null;

  const theme = getTheme(quote.type);

  return (
    <View style={[styles.card, { borderColor: theme.borderColor }]}>
      <View style={[styles.badge, { borderColor: theme.color }]}>
        {theme.icon}
        <Text style={[styles.badgeText, { color: theme.color }]}>{theme.label}</Text>
      </View>

      <Text style={styles.quoteText}>{`"${quote.text}"`}</Text>

      <Text style={styles.authorText}>— {quote.author}</Text>
    </View>
  );
};

interface DailyDropCardWithQuoteProps {
  quote: DailyDropItem;
}

export const DailyDropCardWithQuote = ({ quote }: DailyDropCardWithQuoteProps) => {
  const theme = getTheme(quote.type);

  return (
    <View style={[styles.card, { borderColor: theme.borderColor }]}>
      <View style={[styles.badge, { borderColor: theme.color }]}>
        {theme.icon}
        <Text style={[styles.badgeText, { color: theme.color }]}>{theme.label}</Text>
      </View>

      <Text style={styles.quoteText}>{`"${quote.text}"`}</Text>

      <Text style={styles.authorText}>— {quote.author}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
    marginVertical: 10,
    borderWidth: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
    gap: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  quoteText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    marginBottom: 16,
  },
  authorText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default DailyDropCard;
