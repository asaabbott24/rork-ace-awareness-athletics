import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  PanResponder,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  FlaskConical,
  TrendingUp,
  Target,
  ChevronLeft,
  ChevronRight,
  Scale,
  Merge,
  Zap,
  Focus,
  Shield,
  Ghost,
  Clock,
  Brain,
  Sparkles,
  AlertCircle,
  Frown,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  FLOW_CHAPTERS,
  FLOW_DIMENSIONS,
  FLOW_NEUROCHEMISTRY,
  CULTIVATION_DRILLS,
  FLOW_HISTORY,
  TRANSIENT_HYPOFRONTALITY,
  FlowDimension,
  FlowNeurochemistry,
  CultivationDrill,
} from '@/constants/flowMasterclass';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DIMENSION_CARD_WIDTH = SCREEN_WIDTH - 60;

const getIconComponent = (iconName: string, size: number, color: string) => {
  const icons: Record<string, React.ReactNode> = {
    Scale: <Scale size={size} color={color} />,
    Merge: <Merge size={size} color={color} />,
    Target: <Target size={size} color={color} />,
    Zap: <Zap size={size} color={color} />,
    Focus: <Focus size={size} color={color} />,
    Shield: <Shield size={size} color={color} />,
    Ghost: <Ghost size={size} color={color} />,
    Clock: <Clock size={size} color={color} />,
    BookOpen: <BookOpen size={size} color={color} />,
    FlaskConical: <FlaskConical size={size} color={color} />,
    TrendingUp: <TrendingUp size={size} color={color} />,
  };
  return icons[iconName] || <Target size={size} color={color} />;
};

const DimensionCard = React.memo(function DimensionCard({ 
  dimension, 
  index 
}: { 
  dimension: FlowDimension; 
  index: number;
}) {
  return (
    <View style={styles.dimensionCard}>
      <LinearGradient
        colors={['rgba(0, 217, 255, 0.1)', 'rgba(0, 217, 255, 0.02)']}
        style={styles.dimensionGradient}
      />
      <View style={styles.dimensionHeader}>
        <View style={styles.dimensionIconContainer}>
          {getIconComponent(dimension.icon, 28, '#00D9FF')}
        </View>
        <View style={styles.dimensionNumber}>
          <Text style={styles.dimensionNumberText}>{index + 1}/8</Text>
        </View>
      </View>
      
      <Text style={styles.dimensionTitle}>{dimension.title}</Text>
      
      <View style={styles.dimensionSection}>
        <Text style={styles.dimensionLabel}>DEFINITION</Text>
        <Text style={styles.dimensionText}>{dimension.definition}</Text>
      </View>
      
      <View style={styles.dimensionSection}>
        <Text style={[styles.dimensionLabel, { color: '#FFD60A' }]}>THE ATHLETE&apos;S EXPERIENCE</Text>
        <Text style={styles.dimensionText}>{dimension.athleteExperience}</Text>
      </View>
      
      <View style={styles.dimensionSection}>
        <Text style={[styles.dimensionLabel, { color: '#FF6B6B' }]}>THE SCIENCE</Text>
        <Text style={styles.dimensionText}>{dimension.science}</Text>
      </View>
    </View>
  );
});

const NeurochemCard = React.memo(function NeurochemCard({ item }: { item: FlowNeurochemistry }) {
  return (
    <View style={[styles.neurochemCard, { borderLeftColor: item.color }]}>
      <View style={styles.neurochemHeader}>
        <View style={[styles.neurochemDot, { backgroundColor: item.color }]} />
        <Text style={styles.neurochemTitle}>{item.title}</Text>
      </View>
      <Text style={[styles.neurochemChemical, { color: item.color }]}>{item.chemical}</Text>
      <Text style={styles.neurochemEffect}>{item.effect}</Text>
      <View style={styles.neurochemFeeling}>
        <Text style={styles.neurochemFeelingLabel}>ATHLETE FEELING</Text>
        <Text style={styles.neurochemFeelingText}>&ldquo;{item.athleteFeeling}&rdquo;</Text>
      </View>
    </View>
  );
});

const DrillCard = React.memo(function DrillCard({ drill }: { drill: CultivationDrill }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity 
      style={styles.drillCard}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setExpanded(!expanded);
      }}
      activeOpacity={0.8}
    >
      <View style={styles.drillHeader}>
        <View style={styles.drillTitleRow}>
          <Target size={18} color="#FFD60A" />
          <Text style={styles.drillTitle}>{drill.title}</Text>
        </View>
        <View style={styles.drillDuration}>
          <Clock size={12} color="rgba(255,255,255,0.5)" />
          <Text style={styles.drillDurationText}>{drill.duration}</Text>
        </View>
      </View>
      
      <Text style={styles.drillInstruction}>{drill.instruction}</Text>
      
      {expanded && (
        <View style={styles.drillExpanded}>
          <View style={styles.drillExpandedSection}>
            <Text style={styles.drillExpandedLabel}>🔬 MECHANISM</Text>
            <Text style={styles.drillExpandedText}>{drill.mechanism}</Text>
          </View>
          <View style={styles.drillExpandedSection}>
            <Text style={styles.drillExpandedLabel}>⏰ WHEN TO USE</Text>
            <Text style={styles.drillExpandedText}>{drill.whenToUse}</Text>
          </View>
        </View>
      )}
      
      <Text style={styles.drillExpandHint}>
        {expanded ? 'Tap to collapse' : 'Tap for more'}
      </Text>
    </TouchableOpacity>
  );
});

interface FlowChannelChartProps {
  onStateChange?: (state: string) => void;
}

const FlowChannelChart = React.memo(function FlowChannelChart({ onStateChange }: FlowChannelChartProps) {
  const CHART_SIZE = SCREEN_WIDTH - 80;
  const [markerPosition, setMarkerPosition] = useState({ x: CHART_SIZE / 2, y: CHART_SIZE / 2 });
  const pan = useRef(new Animated.ValueXY({ x: CHART_SIZE / 2, y: CHART_SIZE / 2 })).current;

  const getFlowState = useCallback((x: number, y: number) => {
    const normalizedX = x / CHART_SIZE;
    const normalizedY = 1 - (y / CHART_SIZE);
    
    const diff = normalizedY - normalizedX;
    
    if (Math.abs(diff) < 0.15) {
      return { state: 'FLOW', color: '#4ADE80', description: 'Perfect balance. You\'re in the zone.' };
    } else if (diff > 0.15) {
      return { state: 'ANXIETY', color: '#FF6B6B', description: 'Challenge too high. Simplify or slow down.' };
    } else {
      return { state: 'BOREDOM', color: '#FFD60A', description: 'Not enough challenge. Increase difficulty.' };
    }
  }, [CHART_SIZE]);

  const currentState = getFlowState(markerPosition.x, markerPosition.y);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (_, gestureState) => {
        const newX = Math.max(0, Math.min(CHART_SIZE, markerPosition.x + gestureState.dx));
        const newY = Math.max(0, Math.min(CHART_SIZE, markerPosition.y + gestureState.dy));
        pan.setValue({ x: newX, y: newY });
      },
      onPanResponderRelease: (_, gestureState) => {
        const newX = Math.max(0, Math.min(CHART_SIZE, markerPosition.x + gestureState.dx));
        const newY = Math.max(0, Math.min(CHART_SIZE, markerPosition.y + gestureState.dy));
        setMarkerPosition({ x: newX, y: newY });
        pan.setValue({ x: newX, y: newY });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onStateChange?.(getFlowState(newX, newY).state);
      },
    })
  ).current;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Flow Channel Navigator</Text>
      <Text style={styles.chartSubtitle}>Drag the marker to find your current state</Text>
      
      <View style={[styles.chart, { width: CHART_SIZE, height: CHART_SIZE }]}>
        <LinearGradient
          colors={['rgba(255, 107, 107, 0.3)', 'rgba(74, 222, 128, 0.3)', 'rgba(255, 214, 10, 0.3)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.flowChannel} />
        
        <View style={[styles.chartZone, styles.anxietyZone]}>
          <AlertCircle size={20} color="rgba(255, 107, 107, 0.6)" />
          <Text style={styles.zoneLabel}>ANXIETY</Text>
        </View>
        
        <View style={[styles.chartZone, styles.boredomZone]}>
          <Frown size={20} color="rgba(255, 214, 10, 0.6)" />
          <Text style={styles.zoneLabel}>BOREDOM</Text>
        </View>
        
        <View style={[styles.chartZone, styles.flowZone]}>
          <Sparkles size={20} color="rgba(74, 222, 128, 0.8)" />
          <Text style={[styles.zoneLabel, { color: 'rgba(74, 222, 128, 0.8)' }]}>FLOW</Text>
        </View>
        
        <View style={styles.axisLabelX}>
          <Text style={styles.axisText}>SKILL LEVEL →</Text>
        </View>
        
        <View style={styles.axisLabelY}>
          <Text style={styles.axisText}>↑ CHALLENGE</Text>
        </View>
        
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.marker,
            {
              transform: [
                { translateX: Animated.subtract(pan.x, new Animated.Value(20)) },
                { translateY: Animated.subtract(pan.y, new Animated.Value(20)) },
              ],
              backgroundColor: currentState.color,
            },
          ]}
        >
          <View style={styles.markerInner} />
        </Animated.View>
      </View>
      
      <View style={[styles.stateIndicator, { borderColor: currentState.color }]}>
        <View style={[styles.stateIndicatorDot, { backgroundColor: currentState.color }]} />
        <View style={styles.stateIndicatorContent}>
          <Text style={[styles.stateIndicatorTitle, { color: currentState.color }]}>
            {currentState.state}
          </Text>
          <Text style={styles.stateIndicatorDescription}>{currentState.description}</Text>
        </View>
      </View>
    </View>
  );
});

export default function FlowMasterclassScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeChapter, setActiveChapter] = useState('theory');
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const dimensionListRef = useRef<FlatList>(null);

  const handleChapterPress = useCallback((chapterId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveChapter(chapterId);
  }, []);

  const handleDimensionScroll = useCallback((event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (DIMENSION_CARD_WIDTH + 16));
    if (index !== currentDimensionIndex && index >= 0 && index < FLOW_DIMENSIONS.length) {
      setCurrentDimensionIndex(index);
    }
  }, [currentDimensionIndex]);

  const navigateDimension = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? Math.min(currentDimensionIndex + 1, FLOW_DIMENSIONS.length - 1)
      : Math.max(currentDimensionIndex - 1, 0);
    
    if (newIndex !== currentDimensionIndex) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentDimensionIndex(newIndex);
      dimensionListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  }, [currentDimensionIndex]);

  const renderChapterContent = () => {
    switch (activeChapter) {
      case 'theory':
        return (
          <View style={styles.chapterContent}>
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>{FLOW_HISTORY.title}</Text>
              {FLOW_HISTORY.sections.map((section, index) => (
                <View key={index} style={styles.historyCard}>
                  <Text style={styles.historyEra}>{section.era}</Text>
                  <Text style={styles.historyDescription}>{section.description}</Text>
                </View>
              ))}
            </View>

            <View style={styles.dimensionsSection}>
              <Text style={styles.sectionTitle}>The 8 Dimensions of Flow</Text>
              <Text style={styles.sectionSubtitle}>
                Swipe to explore each dimension
              </Text>
              
              <FlatList
                ref={dimensionListRef}
                data={FLOW_DIMENSIONS}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={DIMENSION_CARD_WIDTH + 16}
                decelerationRate="fast"
                contentContainerStyle={styles.dimensionsList}
                onMomentumScrollEnd={handleDimensionScroll}
                renderItem={({ item, index }) => (
                  <DimensionCard dimension={item} index={index} />
                )}
                keyExtractor={(item) => item.id}
                getItemLayout={(_, index) => ({
                  length: DIMENSION_CARD_WIDTH + 16,
                  offset: (DIMENSION_CARD_WIDTH + 16) * index,
                  index,
                })}
              />
              
              <View style={styles.dimensionNav}>
                <TouchableOpacity
                  style={[styles.navButton, currentDimensionIndex === 0 && styles.navButtonDisabled]}
                  onPress={() => navigateDimension('prev')}
                  disabled={currentDimensionIndex === 0}
                >
                  <ChevronLeft size={24} color={currentDimensionIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff'} />
                </TouchableOpacity>
                
                <View style={styles.dimensionDots}>
                  {FLOW_DIMENSIONS.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dimensionDot,
                        index === currentDimensionIndex && styles.dimensionDotActive,
                      ]}
                    />
                  ))}
                </View>
                
                <TouchableOpacity
                  style={[styles.navButton, currentDimensionIndex === FLOW_DIMENSIONS.length - 1 && styles.navButtonDisabled]}
                  onPress={() => navigateDimension('next')}
                  disabled={currentDimensionIndex === FLOW_DIMENSIONS.length - 1}
                >
                  <ChevronRight size={24} color={currentDimensionIndex === FLOW_DIMENSIONS.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'neuro':
        return (
          <View style={styles.chapterContent}>
            <View style={styles.hypofrontalitySection}>
              <View style={styles.hypofrontalityHeader}>
                <Brain size={32} color="#FF6B6B" />
                <Text style={styles.hypofrontalityTitle}>{TRANSIENT_HYPOFRONTALITY.title}</Text>
              </View>
              <Text style={styles.hypofrontalitySubtitle}>{TRANSIENT_HYPOFRONTALITY.subtitle}</Text>
              <Text style={styles.hypofrontalityDescription}>{TRANSIENT_HYPOFRONTALITY.description}</Text>
              
              <View style={styles.hypofrontalityEffects}>
                {TRANSIENT_HYPOFRONTALITY.effects.map((effect, index) => (
                  <View key={index} style={styles.effectItem}>
                    <View style={styles.effectDot} />
                    <Text style={styles.effectText}>{effect}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.applicationCard}>
                <Text style={styles.applicationLabel}>ATHLETE APPLICATION</Text>
                <Text style={styles.applicationText}>{TRANSIENT_HYPOFRONTALITY.athleteApplication}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>The Flow Cocktail</Text>
            <Text style={styles.sectionSubtitle}>
              Five neurochemicals that create the optimal state
            </Text>
            
            {FLOW_NEUROCHEMISTRY.map((item) => (
              <NeurochemCard key={item.id} item={item} />
            ))}
          </View>
        );

      case 'channel':
        return (
          <View style={styles.chapterContent}>
            <FlowChannelChart />
            
            <View style={styles.channelTips}>
              <Text style={styles.channelTipsTitle}>Navigating the Channel</Text>
              
              <View style={styles.tipCard}>
                <View style={[styles.tipDot, { backgroundColor: '#FF6B6B' }]} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Stuck in Anxiety?</Text>
                  <Text style={styles.tipText}>
                    Break the task into smaller pieces. Focus on ONE thing at a time. Slow your breathing to 4-7-8 rhythm.
                  </Text>
                </View>
              </View>
              
              <View style={styles.tipCard}>
                <View style={[styles.tipDot, { backgroundColor: '#FFD60A' }]} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>Stuck in Boredom?</Text>
                  <Text style={styles.tipText}>
                    Add constraints. Use your weak hand. Set a time limit. Compete against yourself. Raise the stakes mentally.
                  </Text>
                </View>
              </View>
              
              <View style={styles.tipCard}>
                <View style={[styles.tipDot, { backgroundColor: '#4ADE80' }]} />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>In Flow?</Text>
                  <Text style={styles.tipText}>
                    Protect it. Don&apos;t check your phone. Don&apos;t think about the score. Stay in the present moment.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 'drills':
        return (
          <View style={styles.chapterContent}>
            <Text style={styles.sectionTitle}>Cultivation Exercises</Text>
            <Text style={styles.sectionSubtitle}>
              Train your nervous system to enter flow on demand
            </Text>
            
            {CULTIVATION_DRILLS.map((drill) => (
              <DrillCard key={drill.id} drill={drill} />
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#0f1419', '#0a0a0a']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.masterclassBadge}>
              <Sparkles size={12} color="#FFD60A" />
              <Text style={styles.masterclassBadgeText}>MASTERCLASS</Text>
            </View>
            <Text style={styles.headerTitle}>The Flow State</Text>
            <Text style={styles.headerSubtitle}>
              Master the psychology of peak performance
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chapterTabs}
        >
          {FLOW_CHAPTERS.map((chapter) => {
            const isActive = activeChapter === chapter.id;
            return (
              <TouchableOpacity
                key={chapter.id}
                style={[styles.chapterTab, isActive && styles.chapterTabActive]}
                onPress={() => handleChapterPress(chapter.id)}
              >
                {getIconComponent(chapter.icon, 16, isActive ? '#000' : chapter.color)}
                <Text style={[styles.chapterTabText, isActive && styles.chapterTabTextActive]}>
                  {chapter.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {renderChapterContent()}
      </ScrollView>
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
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  masterclassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  masterclassBadgeText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: '#FFD60A',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
  },
  chapterTabs: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  chapterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chapterTabActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  chapterTabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.8)',
  },
  chapterTabTextActive: {
    color: '#000',
  },
  chapterContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 20,
  },
  historySection: {
    marginBottom: 40,
  },
  historyCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#00D9FF',
  },
  historyEra: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#00D9FF',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  historyDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  dimensionsSection: {
    marginBottom: 20,
  },
  dimensionsList: {
    paddingRight: 20,
  },
  dimensionCard: {
    width: DIMENSION_CARD_WIDTH,
    backgroundColor: 'rgba(0, 217, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 217, 255, 0.2)',
    overflow: 'hidden',
  },
  dimensionGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  dimensionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dimensionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 217, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dimensionNumber: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dimensionNumberText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.6)',
  },
  dimensionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 20,
  },
  dimensionSection: {
    marginBottom: 16,
  },
  dimensionLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#00D9FF',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  dimensionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  dimensionNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  dimensionDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dimensionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dimensionDotActive: {
    backgroundColor: '#00D9FF',
    width: 20,
  },
  hypofrontalitySection: {
    backgroundColor: 'rgba(255, 107, 107, 0.08)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  hypofrontalityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  hypofrontalityTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
  },
  hypofrontalitySubtitle: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  hypofrontalityDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    marginBottom: 20,
  },
  hypofrontalityEffects: {
    gap: 10,
    marginBottom: 20,
  },
  effectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  effectDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
  },
  effectText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  applicationCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 16,
  },
  applicationLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#FF6B6B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  applicationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  neurochemCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 3,
  },
  neurochemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  neurochemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  neurochemTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
  neurochemChemical: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 1,
    marginBottom: 12,
  },
  neurochemEffect: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  neurochemFeeling: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 14,
  },
  neurochemFeelingLabel: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginBottom: 6,
  },
  neurochemFeelingText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
  },
  chartSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 24,
  },
  chart: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  flowChannel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.4)',
    borderRadius: 20,
    transform: [{ rotate: '45deg' }, { scaleX: 1.5 }],
  },
  chartZone: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  anxietyZone: {
    top: 30,
    left: 30,
  },
  boredomZone: {
    bottom: 30,
    right: 30,
  },
  flowZone: {
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  zoneLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  axisLabelX: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  axisLabelY: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  axisText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  markerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  stateIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    gap: 12,
    width: '100%',
  },
  stateIndicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stateIndicatorContent: {
    flex: 1,
  },
  stateIndicatorTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  stateIndicatorDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  channelTips: {
    marginTop: 8,
  },
  channelTipsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 18,
  },
  drillCard: {
    backgroundColor: 'rgba(255, 214, 10, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.2)',
  },
  drillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  drillTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  drillTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  drillDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  drillDurationText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600' as const,
  },
  drillInstruction: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  drillExpanded: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 16,
  },
  drillExpandedSection: {
    gap: 6,
  },
  drillExpandedLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
  drillExpandedText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },
  drillExpandHint: {
    fontSize: 11,
    color: 'rgba(255, 214, 10, 0.6)',
    textAlign: 'center',
    marginTop: 8,
  },
});
