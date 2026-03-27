import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Wind, Flower2, Eye, Clock, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ProtocolCategory, getCategoryColor } from '@/data/protocols';

interface ProtocolCardProps {
  id: string;
  title: string;
  category: ProtocolCategory;
  duration: string;
  description: string;
  athleteReference?: string;
  onPress: () => void;
}

const getCategoryIcon = (category: ProtocolCategory) => {
  switch (category) {
    case 'Breath':
      return Wind;
    case 'Yoga':
      return Flower2;
    case 'Visual':
      return Eye;
    default:
      return Wind;
  }
};

export default function ProtocolCard({ 
  title, 
  category, 
  duration, 
  description,
  athleteReference,
  onPress 
}: ProtocolCardProps) {
  const IconComponent = getCategoryIcon(category);
  const categoryColor = getCategoryColor(category);

  return (
    <Pressable 
      style={({ pressed }) => [styles.container, pressed && styles.pressed]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
        <IconComponent color={categoryColor} size={24} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <ChevronRight color={Colors.textMuted} size={20} />
        </View>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        <View style={styles.footer}>
          <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>{category}</Text>
          </View>
          <View style={styles.duration}>
            <Clock color={Colors.textMuted} size={12} />
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        </View>
        {athleteReference && (
          <Text style={styles.athleteRef} numberOfLines={1}>{athleteReference}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    backgroundColor: Colors.surfaceElevated,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  athleteRef: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
