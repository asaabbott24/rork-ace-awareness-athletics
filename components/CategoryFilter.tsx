import React from 'react';
import { Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Wind, Flower2, Eye, Layers } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ProtocolCategory, getCategoryColor } from '@/data/protocols';

type FilterOption = 'All' | ProtocolCategory;

interface CategoryFilterProps {
  selected: FilterOption;
  onSelect: (category: FilterOption) => void;
}

const categories: { key: FilterOption; label: string; icon: typeof Wind }[] = [
  { key: 'All', label: 'All', icon: Layers },
  { key: 'Breath', label: 'Breathwork', icon: Wind },
  { key: 'Yoga', label: 'Yoga', icon: Flower2 },
  { key: 'Visual', label: 'Visualization', icon: Eye },
];

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map(({ key, label, icon: Icon }) => {
        const isSelected = selected === key;
        const color = key === 'All' ? Colors.primary : getCategoryColor(key as ProtocolCategory);
        
        return (
          <Pressable
            key={key}
            style={[
              styles.chip,
              isSelected && { backgroundColor: color },
            ]}
            onPress={() => onSelect(key)}
          >
            <Icon 
              color={isSelected ? Colors.text : color} 
              size={16} 
            />
            <Text 
              style={[
                styles.chipText, 
                isSelected && styles.chipTextSelected,
                !isSelected && { color }
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  chipTextSelected: {
    color: Colors.text,
  },
});
