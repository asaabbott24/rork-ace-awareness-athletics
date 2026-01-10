import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { ArrowRight, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ProInsightCardProps {
  title: string;
  athlete: string;
  summary: string;
  imageUrl: string;
  onPress?: () => void;
}

export default function ProInsightCard({ title, athlete, summary, imageUrl, onPress }: ProInsightCardProps) {
  return (
    <Pressable 
      style={({ pressed }) => [styles.container, pressed && styles.pressed]} 
      onPress={onPress}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Star color={Colors.secondary} size={12} fill={Colors.secondary} />
          <Text style={styles.badgeText}>PRO INSIGHT</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.summary} numberOfLines={3}>{summary}</Text>
        <View style={styles.footer}>
          <Text style={styles.athlete}>{athlete}</Text>
          <ArrowRight color={Colors.primary} size={20} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    height: 320,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245,158,11,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.secondary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 28,
  },
  summary: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  athlete: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
