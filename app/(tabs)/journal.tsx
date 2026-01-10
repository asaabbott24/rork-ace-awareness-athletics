import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brain, Target, Flame, ChevronRight, Save, History, X } from 'lucide-react-native';
import { HabitTracker } from '@/components/HabitTracker';
import { GratitudePrompt } from '@/components/GratitudePrompt';
import { PowerDownChecklist } from '@/components/PowerDownChecklist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { 
  JOURNAL_MODULES, 
  STAT_LABELS, 
  JournalModule, 
  MindGymEntry, 
  StatSheet 
} from '@/constants/mindGym';

const STORAGE_KEY = 'ace_mind_gym_entries';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<StatSheet>({
    confidence: 50,
    focus: 50,
    aggression: 50,
  });
  const [selectedModule, setSelectedModule] = useState<JournalModule | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [entries, setEntries] = useState<MindGymEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showPowerDown, setShowPowerDown] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadEntries();
    checkPowerDownTime();
    
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    
    return () => pulse.stop();
  }, [pulseAnim]);

  useEffect(() => {
    if (selectedModule) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedModule, slideAnim]);

  const checkPowerDownTime = () => {
    const hour = new Date().getHours();
    if (hour >= 21 || hour < 6) {
      setTimeout(() => setShowPowerDown(true), 1000);
    }
  };

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (stored && typeof stored === 'string' && stored.length > 0) {
        try {
          // Validate that stored value looks like valid JSON
          const trimmed = stored.trim();
          
          // Check for common invalid values
          if (
            !trimmed.startsWith('[') || 
            trimmed === 'undefined' || 
            trimmed === 'null' || 
            trimmed === '[object Object]' ||
            trimmed.length < 2
          ) {
            console.warn('Invalid stored entries format, clearing:', trimmed.substring(0, 50));
            throw new Error('Invalid JSON format detected');
          }
          
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            setEntries(parsed as MindGymEntry[]);
            console.log('Loaded', parsed.length, 'mind gym entries');
          } else {
            console.warn('Stored entries is not an array, resetting');
            await AsyncStorage.removeItem(STORAGE_KEY);
          }
        } catch (parseError) {
          console.warn('Corrupt journal entries found, clearing storage:', parseError);
          await AsyncStorage.removeItem(STORAGE_KEY);
          // Don't throw, just let it be empty
        }
      }
    } catch (error) {
      console.log('Error loading mind gym entries:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedModule) return;
    
    const filledResponses = selectedModule.prompts.map((prompt, index) => ({
      prompt,
      response: responses[index]?.trim() || '',
    }));
    
    const hasContent = filledResponses.some(r => r.response.length > 0);
    if (!hasContent) {
      Alert.alert('Empty Entry', 'Write at least one response before saving.');
      return;
    }

    try {
      const newEntry: MindGymEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        moduleId: selectedModule.id,
        moduleTitle: selectedModule.title,
        stats: { ...stats },
        responses: filledResponses,
      };

      const updatedEntries = [newEntry, ...entries];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
      
      setSelectedModule(null);
      setResponses({});
      setStats({ confidence: 50, focus: 50, aggression: 50 });
      
      Alert.alert('Entry Logged', 'Your mental box score has been recorded.');
      console.log('Mind gym entry saved successfully');
    } catch (error) {
      console.log('Error saving mind gym entry:', error);
      Alert.alert('Error', 'Could not save your entry. Please try again.');
    }
  };

  const handleModuleSelect = (module: JournalModule) => {
    if (selectedModule?.id === module.id) {
      setSelectedModule(null);
      setResponses({});
    } else {
      setSelectedModule(module);
      setResponses({});
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case 'confidence': return <Target size={18} color="#00f0ff" />;
      case 'focus': return <Brain size={18} color="#ff00aa" />;
      case 'aggression': return <Flame size={18} color="#ff6b00" />;
      default: return null;
    }
  };

  const getStatColor = (stat: string) => {
    switch (stat) {
      case 'confidence': return '#00f0ff';
      case 'focus': return '#ff00aa';
      case 'aggression': return '#ff6b00';
      default: return '#ffffff';
    }
  };

  const renderSlider = (stat: 'confidence' | 'focus' | 'aggression') => {
    const value = stats[stat];
    const labels = STAT_LABELS[stat];
    const color = getStatColor(stat);
    
    return (
      <View style={styles.sliderContainer} key={stat}>
        <View style={styles.sliderHeader}>
          <View style={styles.sliderLabelRow}>
            {getStatIcon(stat)}
            <Text style={[styles.sliderLabel, { color }]}>
              {stat.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.statValueBadge, { borderColor: color }]}>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
          </View>
        </View>
        <View style={styles.sliderTrackContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={value}
            onValueChange={(val) => setStats(prev => ({ ...prev, [stat]: Math.round(val) }))}
            minimumTrackTintColor={color}
            maximumTrackTintColor="rgba(255,255,255,0.1)"
            thumbTintColor={color}
          />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderMinLabel}>{labels.low}</Text>
          <Text style={styles.sliderMaxLabel}>{labels.high}</Text>
        </View>
      </View>
    );
  };

  const renderModuleCard = (module: JournalModule) => {
    const isSelected = selectedModule?.id === module.id;
    
    return (
      <Pressable
        key={module.id}
        style={({ pressed }) => [
          styles.moduleCard,
          isSelected && { borderColor: module.color, borderWidth: 2 },
          pressed && styles.moduleCardPressed,
        ]}
        onPress={() => handleModuleSelect(module)}
      >
        <Animated.View 
          style={[
            styles.moduleGlow,
            isSelected && { 
              backgroundColor: module.color,
              opacity: 0.15,
              transform: [{ scale: pulseAnim }],
            }
          ]} 
        />
        <View style={styles.moduleContent}>
          <View style={styles.moduleHeader}>
            <View style={[styles.moduleIndicator, { backgroundColor: module.color }]} />
            <Text style={styles.moduleTitle}>{module.title}</Text>
          </View>
          <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
          <View style={styles.moduleFooter}>
            <Text style={styles.promptCount}>{module.prompts.length} PROMPTS</Text>
            <ChevronRight size={18} color={isSelected ? module.color : 'rgba(255,255,255,0.3)'} />
          </View>
        </View>
      </Pressable>
    );
  };

  const renderWritingBlock = () => {
    if (!selectedModule) return null;

    return (
      <Animated.View 
        style={[
          styles.writingBlock,
          {
            opacity: slideAnim,
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }]
          }
        ]}
      >
        <View style={[styles.writingHeader, { borderLeftColor: selectedModule.color }]}>
          <Text style={styles.writingTitle}>{selectedModule.title.toUpperCase()}</Text>
          <Pressable onPress={() => setSelectedModule(null)} style={styles.closeButton}>
            <X size={20} color="rgba(255,255,255,0.5)" />
          </Pressable>
        </View>

        {selectedModule.prompts.map((prompt, index) => (
          <View key={index} style={styles.promptBlock}>
            <Text style={styles.promptText}>{prompt}</Text>
            <TextInput
              style={[styles.promptInput, { borderColor: selectedModule.color + '40' }]}
              placeholder="Type your response..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              value={responses[index] || ''}
              onChangeText={(text) => setResponses(prev => ({ ...prev, [index]: text }))}
              textAlignVertical="top"
            />
          </View>
        ))}

        <Pressable 
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: selectedModule.color },
            pressed && styles.saveButtonPressed,
          ]}
          onPress={handleSave}
        >
          <Save size={20} color="#0d0d0d" />
          <Text style={styles.saveButtonText}>LOG ENTRY</Text>
        </Pressable>
      </Animated.View>
    );
  };

  const renderHistory = () => {
    if (!showHistory) return null;

    return (
      <View style={styles.historySection}>
        <View style={styles.historySectionHeader}>
          <Text style={styles.sectionTitle}>MENTAL HISTORY</Text>
          <Pressable onPress={() => setShowHistory(false)}>
            <X size={18} color="rgba(255,255,255,0.5)" />
          </Pressable>
        </View>
        
        {entries.length === 0 ? (
          <Text style={styles.noEntriesText}>No entries yet. Start logging your mental game.</Text>
        ) : (
          entries.slice(0, 5).map((entry) => {
            const module = JOURNAL_MODULES.find(m => m.id === entry.moduleId);
            const color = module?.color || '#ffffff';
            
            return (
              <View key={entry.id} style={[styles.historyCard, { borderLeftColor: color }]}>
                <View style={styles.historyCardHeader}>
                  <Text style={[styles.historyModule, { color }]}>{entry.moduleTitle}</Text>
                  <Text style={styles.historyDate}>{formatDate(entry.timestamp)}</Text>
                </View>
                <View style={styles.historyStats}>
                  <View style={styles.historyStatItem}>
                    <Target size={12} color="#00f0ff" />
                    <Text style={styles.historyStatValue}>{entry.stats.confidence}</Text>
                  </View>
                  <View style={styles.historyStatItem}>
                    <Brain size={12} color="#ff00aa" />
                    <Text style={styles.historyStatValue}>{entry.stats.focus}</Text>
                  </View>
                  <View style={styles.historyStatItem}>
                    <Flame size={12} color="#ff6b00" />
                    <Text style={styles.historyStatValue}>{entry.stats.aggression}</Text>
                  </View>
                </View>
                {entry.responses[0]?.response && (
                  <Text style={styles.historyPreview} numberOfLines={2}>
                    {entry.responses[0].response}
                  </Text>
                )}
              </View>
            );
          })
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>GAME LOG</Text>
              <Text style={styles.subtitle}>Mental Box Score System</Text>
            </View>
            <Pressable 
              style={styles.historyButton}
              onPress={() => setShowHistory(!showHistory)}
            >
              <History size={20} color={showHistory ? '#00f0ff' : 'rgba(255,255,255,0.5)'} />
            </Pressable>
          </View>
        </View>

        {renderHistory()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>STAT SHEET</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Log your current mental state</Text>
          
          <View style={styles.statSheet}>
            {renderSlider('confidence')}
            {renderSlider('focus')}
            {renderSlider('aggression')}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIndicator, { backgroundColor: '#ff00aa' }]} />
            <Text style={styles.sectionTitle}>DRILL SELECTION</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Choose your mental training protocol</Text>
          
          <View style={styles.moduleGrid}>
            {JOURNAL_MODULES.map(renderModuleCard)}
          </View>
        </View>

        {renderWritingBlock()}

        <GratitudePrompt />
        <HabitTracker />
      </ScrollView>

      <PowerDownChecklist 
        visible={showPowerDown} 
        onClose={() => setShowPowerDown(false)} 
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '900' as const,
    color: '#ffffff',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginTop: 4,
  },
  historyButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  sectionIndicator: {
    width: 3,
    height: 16,
    backgroundColor: '#00f0ff',
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginLeft: 13,
    marginBottom: 16,
  },
  statSheet: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
  },
  statValueBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800' as const,
  },
  sliderTrackContainer: {
    marginHorizontal: -8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  sliderMinLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.5,
  },
  sliderMaxLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.5,
  },
  moduleGrid: {
    gap: 12,
  },
  moduleCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  moduleCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  moduleGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  moduleContent: {
    padding: 18,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  moduleIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  moduleSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 14,
    lineHeight: 18,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginLeft: 14,
  },
  promptCount: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
  writingBlock: {
    marginTop: 8,
    marginBottom: 20,
  },
  writingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 14,
    borderLeftWidth: 3,
  },
  writingTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ffffff',
    letterSpacing: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptBlock: {
    marginBottom: 24,
  },
  promptText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 24,
  },
  promptInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 15,
    color: '#ffffff',
    minHeight: 100,
    lineHeight: 22,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#0d0d0d',
    letterSpacing: 2,
  },
  historySection: {
    marginBottom: 28,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  noEntriesText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    paddingVertical: 20,
  },
  historyCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyModule: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  historyDate: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
  },
  historyStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  historyStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyStatValue: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.6)',
  },
  historyPreview: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 18,
  },
});
