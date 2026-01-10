import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import { Shield, ExternalLink, Zap, Cpu, Target, Dumbbell, Flame } from 'lucide-react-native';
import { OFFICIAL_ARSENAL, ArsenalItem } from '@/constants/arsenal';

type CategoryFilter = 'ALL' | 'FUEL' | 'RECOVERY' | 'TECH' | 'COURT' | 'BODY';

const CATEGORIES: CategoryFilter[] = ['ALL', 'FUEL', 'RECOVERY', 'TECH', 'COURT', 'BODY'];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  FUEL: Flame,
  RECOVERY: Zap,
  TECH: Cpu,
  COURT: Target,
  BODY: Dumbbell,
};

const CATEGORY_COLORS: Record<string, string> = {
  FUEL: '#00FF00',
  RECOVERY: '#00f0ff',
  TECH: '#a855f7',
  COURT: '#22c55e',
  BODY: '#f97316',
};

export default function ArsenalView() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return OFFICIAL_ARSENAL;
    }
    return OFFICIAL_ARSENAL.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleAcquire = useCallback((link: string) => {
    console.log('Opening affiliate link:', link);
    Linking.openURL(link).catch((err) => {
      console.error('Failed to open link:', err);
    });
  }, []);

  const renderCategoryPill = useCallback(
    (category: CategoryFilter) => {
      const isActive = selectedCategory === category;
      const accentColor = category === 'ALL' ? '#FFFFFF' : CATEGORY_COLORS[category];
      
      return (
        <Pressable
          key={category}
          style={[
            styles.pill,
            isActive && { backgroundColor: accentColor, borderColor: accentColor },
          ]}
          onPress={() => setSelectedCategory(category)}
          testID={`category-${category.toLowerCase()}`}
        >
          <Text
            style={[
              styles.pillText,
              isActive && styles.pillTextActive,
            ]}
          >
            {category}
          </Text>
        </Pressable>
      );
    },
    [selectedCategory]
  );

  const renderItem = useCallback(
    ({ item }: { item: ArsenalItem }) => {
      const CategoryIcon = CATEGORY_ICONS[item.category] || Shield;
      const accentColor = CATEGORY_COLORS[item.category] || '#FFFFFF';

      return (
        <View style={styles.card} testID={`arsenal-item-${item.id}`}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
          <View style={[styles.categoryAccent, { backgroundColor: accentColor }]} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.brandText}>{item.brand.toUpperCase()}</Text>
                <Text style={styles.nameText}>{item.name}</Text>
              </View>
              <View style={[styles.categoryBadge, { borderColor: accentColor }]}>
                <CategoryIcon size={12} color={accentColor} />
                <Text style={[styles.categoryBadgeText, { color: accentColor }]}>
                  {item.category}
                </Text>
              </View>
            </View>

            <View style={styles.intelSection}>
              <View style={styles.intelHeader}>
                <View style={styles.intelDot} />
                <Text style={styles.intelLabel}>COACH&apos;S INTEL</Text>
              </View>
              <Text style={styles.intelText}>{item.coachsTake}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.acquireButton,
                { borderColor: accentColor },
                pressed && { backgroundColor: accentColor, opacity: 0.9 },
              ]}
              onPress={() => handleAcquire(item.affiliateLink)}
              testID={`acquire-${item.id}`}
            >
              {({ pressed }) => (
                <>
                  <Text
                    style={[
                      styles.acquireButtonText,
                      { color: pressed ? '#000000' : '#FFFFFF' },
                    ]}
                  >
                    ACQUIRE // {item.price}
                  </Text>
                  <ExternalLink size={16} color={pressed ? '#000000' : '#FFFFFF'} />
                </>
              )}
            </Pressable>
          </View>
        </View>
      );
    },
    [handleAcquire]
  );

  const keyExtractor = useCallback((item: ArsenalItem) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Shield size={24} color="#00f0ff" />
          <Text style={styles.headerTitle}>THE BAG</Text>
        </View>
        <Text style={styles.headerSubtitle}>GEAR // WHAT&apos;S IN YOUR BAG</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORIES.map(renderCategoryPill)}
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Shield size={48} color="#333" />
            <Text style={styles.emptyText}>No gear in this category.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#00f0ff',
    marginTop: 6,
    letterSpacing: 2,
    fontWeight: '600' as const,
  },
  filterContainer: {
    paddingVertical: 14,
    backgroundColor: '#0D0D0D',
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#333',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#666',
    letterSpacing: 1.5,
  },
  pillTextActive: {
    color: '#000000',
  },
  listContent: {
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#141414',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: '#0A0A0A',
  },
  categoryAccent: {
    height: 3,
    width: '100%',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#666',
    letterSpacing: 2,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  intelSection: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#00f0ff',
  },
  intelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  intelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00f0ff',
  },
  intelLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#00f0ff',
    letterSpacing: 2,
  },
  intelText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 22,
  },
  acquireButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
  },
  acquireButtonText: {
    fontSize: 13,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 1,
  },
});
