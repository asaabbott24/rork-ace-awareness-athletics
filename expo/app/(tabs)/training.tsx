import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Wind, Activity, Eye, Play, Clock, Zap, Dumbbell, Snowflake, BookOpen, 
  ExternalLink, X, Heart, Search, ChevronRight, CheckCircle, Calendar,
  Star, Info, Moon, Battery, Sparkles, Brain
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { TRAINING_MODULES, CATEGORY_INFO, Category, TrainingModule } from '@/constants/trainingLab';
import { COURT_IQ_LIBRARY, CourtIQEntry } from '@/constants/books';
import { PILLAR_SCIENCE_DATA } from '@/constants/science';
import { useApp } from '@/contexts/AppContext';
import { ScienceModal } from '@/components/TrainingInfoModal';
import * as Linking from 'expo-linking';

const getArchetypeColor = (archetype: string) => {
  switch (archetype) {
    case 'The Killer': return '#FF3B30';
    case 'The Leader': return '#FFD60A';
    case 'The Monk': return '#30D158';
    default: return '#00D9FF';
  }
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 200;

const CategoryIcon = ({ category, size = 16 }: { category: Category; size?: number }) => {
  const color = CATEGORY_INFO[category].color;
  switch (category) {
    case 'BREATH':
      return <Wind size={size} color={color} />;
    case 'MOVEMENT':
      return <Zap size={size} color={color} />;
    case 'YOGA':
      return <Activity size={size} color={color} />;
    case 'VISUALIZATION':
      return <Eye size={size} color={color} />;
    case 'STRENGTH':
      return <Dumbbell size={size} color={color} />;
    case 'RECOVERY':
      return <Snowflake size={size} color={color} />;
    default:
      return <Activity size={size} color={color} />;
  }
};

interface ModuleCardProps {
  module: TrainingModule;
  onPress: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onInfoPress: (module: TrainingModule) => void;
}

const ModuleCard = React.memo(function ModuleCard({ module, onPress, isFavorite, onToggleFavorite, onInfoPress }: ModuleCardProps) {
  const categoryColor = CATEGORY_INFO[module.category].color;

  const handleFavorite = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleFavorite();
  };

  const handleInfo = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInfoPress(module);
  };

  const hasScience = !!module.sciencePack;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: module.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
        style={styles.cardGradient}
      />
      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={handleFavorite}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Heart 
          size={18} 
          color={isFavorite ? '#FF3B30' : 'rgba(255,255,255,0.6)'} 
          fill={isFavorite ? '#FF3B30' : 'transparent'}
        />
      </TouchableOpacity>
      
      {hasScience && (
        <TouchableOpacity 
          style={styles.infoButton} 
          onPress={handleInfo}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Info 
            size={18} 
            color="#00f0ff"
          />
        </TouchableOpacity>
      )}

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
            <CategoryIcon category={module.category} size={12} />
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {CATEGORY_INFO[module.category].title}
            </Text>
          </View>
          <View style={styles.durationBadge}>
            <Clock size={10} color="#fff" />
            <Text style={styles.durationText}>{module.durationMin} min</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{module.title}</Text>
        <Text style={styles.cardSubtitle}>{module.subtitle}</Text>
        <View style={styles.playButton}>
          <Play size={14} color="#000" fill="#000" />
          <Text style={styles.playText}>Begin</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

interface CategorySectionProps {
  category: Category;
  modules: TrainingModule[];
  onModulePress: (module: TrainingModule) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  onInfoPress: (module: TrainingModule) => void;
}

const CategorySection = React.memo(function CategorySection({ 
  category, 
  modules, 
  onModulePress,
  isFavorite,
  toggleFavorite,
  onInfoPress
}: CategorySectionProps) {
  const categoryInfo = CATEGORY_INFO[category];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <CategoryIcon category={category} size={20} />
          <Text style={styles.sectionTitle}>{categoryInfo.title}</Text>
        </View>
        <Text style={styles.sectionCount}>{modules.length} sessions</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 16}
      >
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onPress={() => onModulePress(module)}
            isFavorite={isFavorite(module.id)}
            onToggleFavorite={() => toggleFavorite(module.id)}
            onInfoPress={onInfoPress}
          />
        ))}
      </ScrollView>
    </View>
  );
});

interface BookModalProps {
  book: CourtIQEntry | null;
  visible: boolean;
  onClose: () => void;
  isRead: boolean;
  onToggleRead: () => void;
}

const BookModal = React.memo(function BookModal({ book, visible, onClose, isRead, onToggleRead }: BookModalProps) {
  if (!book) return null;
  
  const archetypeColor = getArchetypeColor(book.archetype);

  const handlePurchase = () => {
    Linking.openURL(book.purchaseLink);
  };

  const handleToggleRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleRead();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.container}>
        <View style={modalStyles.header}>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={modalStyles.content} showsVerticalScrollIndicator={false}>
          <Image source={{ uri: book.coverImage }} style={modalStyles.cover} resizeMode="contain" />
          
          <View style={[modalStyles.archetypeBadge, { backgroundColor: `${archetypeColor}20` }]}>
            <Text style={[modalStyles.archetypeText, { color: archetypeColor }]}>{book.archetype}</Text>
          </View>
          
          <Text style={modalStyles.title}>{book.title}</Text>
          <Text style={modalStyles.author}>by {book.author}</Text>
          
          <TouchableOpacity 
            style={[modalStyles.readButton, isRead && modalStyles.readButtonActive]}
            onPress={handleToggleRead}
          >
            <CheckCircle size={18} color={isRead ? '#34C759' : 'rgba(255,255,255,0.5)'} />
            <Text style={[modalStyles.readButtonText, isRead && { color: '#34C759' }]}>
              {isRead ? 'Completed' : 'Mark as Read'}
            </Text>
          </TouchableOpacity>

          <View style={modalStyles.infoSection}>
            <Text style={modalStyles.sectionLabel}>THE GIST</Text>
            <Text style={modalStyles.bodyText}>{book.summary}</Text>
          </View>

          <View style={modalStyles.infoSection}>
            <Text style={modalStyles.sectionLabel}>KEY TAKEAWAYS</Text>
            <View style={modalStyles.bulletList}>
              {book.keyPoints.map((point, index) => (
                <View key={index} style={modalStyles.bulletPoint}>
                  <View style={[modalStyles.bullet, { backgroundColor: archetypeColor }]} />
                  <Text style={modalStyles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={modalStyles.scoutingSection}>
            <Text style={modalStyles.scoutingLabel}>SCOUTING REPORT</Text>
            <Text style={modalStyles.insightText}>&ldquo;{book.scoutingReport.insight}&rdquo;</Text>
            
            <View style={modalStyles.drillCard}>
              <Text style={modalStyles.drillLabel}>KEY DRILL</Text>
              <Text style={modalStyles.drillText}>{book.scoutingReport.keyDrill}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={modalStyles.purchaseButton} onPress={handlePurchase} activeOpacity={0.8}>
            <ExternalLink size={18} color="#000" />
            <Text style={modalStyles.purchaseText}>Get on Amazon</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  cover: {
    width: 180,
    height: 270,
    borderRadius: 12,
    marginBottom: 20,
  },
  archetypeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  archetypeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  author: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 20,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 28,
  },
  readButtonActive: {
    borderColor: '#34C759',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  readButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.5)',
  },
  infoSection: {
    width: '100%',
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#00D9FF',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 24,
  },
  bulletList: {
    gap: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
  },
  scoutingSection: {
    width: '100%',
    marginBottom: 28,
  },
  scoutingLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#00D9FF',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  insightText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  drillCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#00D9FF',
  },
  drillLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#00D9FF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  drillText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  purchaseText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
  },
});

export default function TrainingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedBook, setSelectedBook] = React.useState<CourtIQEntry | null>(null);
  const [bookModalVisible, setBookModalVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [scienceModalVisible, setScienceModalVisible] = useState(false);
  const [selectedScienceModule, setSelectedScienceModule] = useState<TrainingModule | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<typeof PILLAR_SCIENCE_DATA['circadian'] | null>(null);
  
  const { 
    toggleFavorite,  
    isFavorite, 
    toggleReadBook, 
    isBookRead,
    getCompletedToday,
    getCompletedThisWeek,
    favorites
  } = useApp();

  const completedToday = getCompletedToday();
  const completedThisWeek = getCompletedThisWeek();

  const handleBookPress = useCallback((book: CourtIQEntry) => {
    setSelectedBook(book);
    setBookModalVisible(true);
  }, []);

  const filterModules = useCallback((modules: TrainingModule[]) => {
    let filtered = modules;
    
    if (showFavoritesOnly) {
      filtered = filtered.filter(m => isFavorite(m.id));
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(query) ||
        m.subtitle.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, showFavoritesOnly, isFavorite]);

  const breathModules = useMemo(() => filterModules(TRAINING_MODULES.filter(m => m.category === 'BREATH')), [filterModules]);
  const movementModules = useMemo(() => filterModules(TRAINING_MODULES.filter(m => m.category === 'MOVEMENT')), [filterModules]);
  const yogaModules = useMemo(() => filterModules(TRAINING_MODULES.filter(m => m.category === 'YOGA')), [filterModules]);
  const visModules = useMemo(() => filterModules(TRAINING_MODULES.filter(m => m.category === 'VISUALIZATION')), [filterModules]);
  const strengthModules = useMemo(() => filterModules(TRAINING_MODULES.filter(m => m.category === 'STRENGTH')), [filterModules]);
  const recoveryModules = useMemo(() => filterModules(TRAINING_MODULES.filter(m => m.category === 'RECOVERY')), [filterModules]);

  const handleModulePress = useCallback((module: TrainingModule) => {
    console.log('Opening training module:', module.id);
    router.push({
      pathname: '/training-player',
      params: { moduleId: module.id }
    });
  }, [router]);

  const handleFeaturedPress = useCallback(() => {
    const boxBreathing = TRAINING_MODULES.find(m => m.id === 'box_breathing');
    if (boxBreathing) {
      handleModulePress(boxBreathing);
    }
  }, [handleModulePress]);

  const handleInfoPress = useCallback((module: TrainingModule) => {
    if (module.sciencePack) {
      setSelectedScienceModule(module);
      setScienceModalVisible(true);
    }
  }, []);

  const handlePillarPress = useCallback((pillar: typeof PILLAR_SCIENCE_DATA['circadian']) => {
    setSelectedPillar(pillar);
    setScienceModalVisible(true);
  }, []);

  const readBooksCount = COURT_IQ_LIBRARY.filter(book => isBookRead(book.id)).length;

  return (
    <View style={styles.container}>
      <ScienceModal 
        visible={scienceModalVisible}
        onClose={() => {
          setScienceModalVisible(false);
          setSelectedScienceModule(null);
          setSelectedPillar(null);
        }}
        scienceData={selectedScienceModule?.sciencePack || selectedPillar || undefined}
        title={selectedScienceModule?.title || selectedPillar?.title || ''}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Training Lab</Text>
              <Text style={styles.subtitle}>
                Premium protocols for peak performance
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.iconButton, showFavoritesOnly && styles.iconButtonActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowFavoritesOnly(!showFavoritesOnly);
                }}
              >
                <Heart 
                  size={20} 
                  color={showFavoritesOnly ? '#FF3B30' : '#fff'} 
                  fill={showFavoritesOnly ? '#FF3B30' : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.iconButton, showSearch && styles.iconButtonActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowSearch(!showSearch);
                  if (showSearch) setSearchQuery('');
                }}
              >
                <Search size={20} color={showSearch ? '#00D9FF' : '#fff'} />
              </TouchableOpacity>
            </View>
          </View>
          
          {showSearch && (
            <View style={styles.searchContainer}>
              <Search size={18} color="rgba(255,255,255,0.4)" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search exercises..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {completedToday.length > 0 && (
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Calendar size={16} color="#00D9FF" />
                <Text style={styles.statValue}>{completedToday.length}</Text>
                <Text style={styles.statLabel}>Today</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Star size={16} color="#FFD60A" />
                <Text style={styles.statValue}>{completedThisWeek.length}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Clock size={16} color="#34C759" />
                <Text style={styles.statValue}>
                  {completedThisWeek.reduce((acc, s) => acc + s.durationMin, 0)}
                </Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.featuredCard} onPress={handleFeaturedPress} activeOpacity={0.9}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2000&auto=format&fit=crop' }}
            style={styles.featuredImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.featuredGradient}
          />
          <View style={styles.featuredContent}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>START HERE</Text>
            </View>
            <Text style={styles.featuredTitle}>Begin Your Journey</Text>
            <Text style={styles.featuredSubtitle}>
              Master your breath. Control your mind. Dominate the game.
            </Text>
            <View style={styles.featuredAction}>
              <Text style={styles.featuredActionText}>Start Box Breathing</Text>
              <ChevronRight size={18} color="#000" />
            </View>
          </View>
        </TouchableOpacity>

        {showFavoritesOnly && favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={48} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyStateText}>
              Tap the heart icon on any exercise to save it here
            </Text>
          </View>
        ) : (
          <>
            {breathModules.length > 0 && (
              <CategorySection
                category="BREATH"
                modules={breathModules}
                onModulePress={handleModulePress}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                onInfoPress={handleInfoPress}
              />
            )}

            {movementModules.length > 0 && (
              <CategorySection
                category="MOVEMENT"
                modules={movementModules}
                onModulePress={handleModulePress}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                onInfoPress={handleInfoPress}
              />
            )}

            {yogaModules.length > 0 && (
              <CategorySection
                category="YOGA"
                modules={yogaModules}
                onModulePress={handleModulePress}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                onInfoPress={handleInfoPress}
              />
            )}

            {visModules.length > 0 && (
              <CategorySection
                category="VISUALIZATION"
                modules={visModules}
                onModulePress={handleModulePress}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                onInfoPress={handleInfoPress}
              />
            )}

            {strengthModules.length > 0 && (
              <CategorySection
                category="STRENGTH"
                modules={strengthModules}
                onModulePress={handleModulePress}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                onInfoPress={handleInfoPress}
              />
            )}

            {recoveryModules.length > 0 && (
              <CategorySection
                category="RECOVERY"
                modules={recoveryModules}
                onModulePress={handleModulePress}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                onInfoPress={handleInfoPress}
              />
            )}
          </>
        )}

        {!showFavoritesOnly && !searchQuery && (
          <TouchableOpacity 
            style={styles.flowMasterclassCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/flow-masterclass');
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(255, 214, 10, 0.15)', 'rgba(255, 214, 10, 0.05)']}
              style={styles.flowMasterclassGradient}
            />
            <View style={styles.flowMasterclassContent}>
              <View style={styles.flowMasterclassBadge}>
                <Sparkles size={12} color="#FFD60A" />
                <Text style={styles.flowMasterclassBadgeText}>MASTERCLASS</Text>
              </View>
              <Text style={styles.flowMasterclassTitle}>The Flow State</Text>
              <Text style={styles.flowMasterclassSubtitle}>
                Master the psychology of peak performance. Learn the 8 dimensions, neurochemistry, and cultivation drills.
              </Text>
              <View style={styles.flowMasterclassAction}>
                <Brain size={16} color="#000" />
                <Text style={styles.flowMasterclassActionText}>Enter Masterclass</Text>
                <ChevronRight size={16} color="#000" />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {!showFavoritesOnly && !searchQuery && (
          <View style={styles.mindGymSection}>
            <View style={styles.mindGymHeader}>
              <View style={styles.sectionTitleRow}>
                <BookOpen size={20} color="#00D9FF" />
                <Text style={styles.sectionTitle}>Mind Gym</Text>
              </View>
              <View style={styles.readProgress}>
                <Text style={styles.readProgressText}>{readBooksCount}/{COURT_IQ_LIBRARY.length} read</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mindGymScroll}
            >
              {COURT_IQ_LIBRARY.map((book) => {
                const archetypeColor = getArchetypeColor(book.archetype);
                const bookIsRead = isBookRead(book.id);
                return (
                  <TouchableOpacity 
                    key={book.id} 
                    style={styles.mindGymCard} 
                    activeOpacity={0.85}
                    onPress={() => handleBookPress(book)}
                  >
                    <Image
                      source={{ uri: book.coverImage }}
                      style={styles.mindGymImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.85)']}
                      style={styles.mindGymGradient}
                    />
                    {bookIsRead && (
                      <View style={styles.readBadge}>
                        <CheckCircle size={14} color="#34C759" />
                      </View>
                    )}
                    <View style={[styles.typeBadge, { backgroundColor: `${archetypeColor}20` }]}>
                      <Text style={[styles.typeBadgeText, { color: archetypeColor }]}>{book.archetype}</Text>
                    </View>
                    <View style={styles.mindGymInfo}>
                      <Text style={styles.mindGymTitle} numberOfLines={2}>{book.title}</Text>
                      <Text style={styles.mindGymAuthor}>{book.author}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.deepDiveContainer}>
              <View style={styles.deepDiveHeader}>
                <Text style={styles.sectionLabel}>PERFORMANCE PILLARS</Text>
              </View>
              <View style={styles.pillarsGrid}>
                {Object.values(PILLAR_SCIENCE_DATA).map((pillar, index) => {
                  let IconComponent = Activity;
                  if (pillar.icon === 'Moon') IconComponent = Moon;
                  if (pillar.icon === 'Zap') IconComponent = Zap;
                  if (pillar.icon === 'Battery') IconComponent = Battery;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.pillarCard}
                      onPress={() => handlePillarPress(pillar)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.pillarIconContainer}>
                        <IconComponent size={24} color="#00D9FF" />
                      </View>
                      <View style={styles.pillarContent}>
                        <Text style={styles.pillarTitle}>{pillar.title}</Text>
                        <Text style={styles.pillarSubtitle}>{pillar.subtitle}</Text>
                      </View>
                      <View style={styles.pillarArrow}>
                        <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <BookModal
        book={selectedBook}
        visible={bookModalVisible}
        onClose={() => setBookModalVisible(false)}
        isRead={selectedBook ? isBookRead(selectedBook.id) : false}
        onToggleRead={() => selectedBook && toggleReadBook(selectedBook.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '400' as const,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#fff',
  },
  statsCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#00D9FF',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  featuredCard: {
    marginHorizontal: 20,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '80%',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredBadge: {
    backgroundColor: '#00D9FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#000',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 6,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  featuredActionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#000',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#fff',
  },
  sectionCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },
  mindGymSection: {
    marginBottom: 32,
  },
  mindGymHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  readProgress: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  readProgressText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#34C759',
  },
  mindGymScroll: {
    paddingHorizontal: 20,
    gap: 15,
  },
  mindGymCard: {
    width: 160,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  mindGymImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mindGymGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  readBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mindGymInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  mindGymTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
    lineHeight: 18,
  },
  mindGymAuthor: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 4,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButton: {
    position: 'absolute',
    top: 12,
    right: 56, // Position to the left of favorite button
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.7,
  },
  durationText: {
    fontSize: 11,
    color: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  playText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#000',
  },
  deepDiveContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  deepDiveHeader: {
    marginBottom: 16,
  },
  pillarsGrid: {
    gap: 12,
  },
  pillarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pillarIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pillarContent: {
    flex: 1,
  },
  pillarTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  pillarSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  pillarArrow: {
    paddingLeft: 8,
  },
  flowMasterclassCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.3)',
  },
  flowMasterclassGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  flowMasterclassContent: {
    padding: 24,
  },
  flowMasterclassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 214, 10, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  flowMasterclassBadgeText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: '#FFD60A',
    letterSpacing: 1,
  },
  flowMasterclassTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
  },
  flowMasterclassSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 16,
  },
  flowMasterclassAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFD60A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  flowMasterclassActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#000',
  },
});
