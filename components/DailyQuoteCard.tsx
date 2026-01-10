import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Quote } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DailyQuoteCardProps {
  quote: string;
  author: string;
  context?: string;
}

export default function DailyQuoteCard({ quote, author, context }: DailyQuoteCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Quote color={Colors.secondary} size={24} />
      </View>
      <Text style={styles.quote}>{quote}</Text>
      <View style={styles.authorContainer}>
        <Text style={styles.author}>{author}</Text>
        {context && <Text style={styles.context}>{context}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  iconContainer: {
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    lineHeight: 26,
    color: Colors.text,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  author: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.secondary,
  },
  context: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
