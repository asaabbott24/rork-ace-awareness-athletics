import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { X, Moon, Smartphone, Droplets, Thermometer, CheckCircle2, Circle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  mechanism: string;
  icon: typeof Moon;
  color: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'dim-lights',
    title: 'Dim Lights',
    description: 'Lower ambient light 60 minutes before sleep',
    mechanism: 'Lowers cortisol and signals the pineal gland to begin Melatonin synthesis.',
    icon: Moon,
    color: '#8B5CF6',
  },
  {
    id: 'digital-sunset',
    title: 'Digital Sunset',
    description: 'Disconnect from blue light devices',
    mechanism: 'Prevents blue light from suppressing the "Master Clock" in the Suprachiasmatic Nucleus (SCN).',
    icon: Smartphone,
    color: '#3B82F6',
  },
  {
    id: 'hydration',
    title: 'Magnesium + Hydration',
    description: 'Support muscle recovery and CNS relaxation',
    mechanism: 'Magnesium regulates GABA receptors, promoting neural relaxation and reducing muscle tension.',
    icon: Droplets,
    color: '#10B981',
  },
  {
    id: 'cool-room',
    title: 'Cool Environment',
    description: 'Set room temperature to 65-68°F',
    mechanism: 'A drop in core body temperature is the primary biological signal that it is time to transition into Deep Sleep.',
    icon: Thermometer,
    color: '#00f0ff',
  },
];

interface PowerDownChecklistProps {
  visible: boolean;
  onClose: () => void;
}

export const PowerDownChecklist: React.FC<PowerDownChecklistProps> = ({ visible, onClose }) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
  };

  const allComplete = completedItems.size === CHECKLIST_ITEMS.length;
  const progress = (completedItems.size / CHECKLIST_ITEMS.length) * 100;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>🌙 NIGHTLY POWER-DOWN</Text>
              <Text style={styles.subtitle}>Biological Reset Protocol</Text>
            </View>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="rgba(255,255,255,0.5)" />
            </Pressable>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completedItems.size}/{CHECKLIST_ITEMS.length} COMPLETE
            </Text>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {CHECKLIST_ITEMS.map((item) => {
              const isComplete = completedItems.has(item.id);
              const IconComponent = item.icon;

              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.checklistCard,
                    isComplete && styles.checklistCardComplete,
                    pressed && styles.checklistCardPressed,
                  ]}
                  onPress={() => toggleItem(item.id)}
                >
                  <View style={styles.checklistHeader}>
                    <View style={styles.checklistLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                        <IconComponent size={24} color={item.color} />
                      </View>
                      <View style={styles.checklistTextContainer}>
                        <Text style={[styles.checklistTitle, isComplete && styles.checklistTitleComplete]}>
                          {item.title}
                        </Text>
                        <Text style={styles.checklistDescription}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.checkIcon}>
                      {isComplete ? (
                        <CheckCircle2 size={28} color="#00f0ff" />
                      ) : (
                        <Circle size={28} color="rgba(255,255,255,0.2)" />
                      )}
                    </View>
                  </View>

                  <View style={[styles.scienceSection, { borderLeftColor: item.color }]}>
                    <Text style={styles.scienceLabel}>🔬 THE MECHANISM</Text>
                    <Text style={styles.scienceText}>{item.mechanism}</Text>
                  </View>
                </Pressable>
              );
            })}

            {allComplete && (
              <View style={styles.completionCard}>
                <Text style={styles.completionIcon}>🏆</Text>
                <Text style={styles.completionTitle}>Protocol Complete</Text>
                <Text style={styles.completionText}>
                  Your body is primed for deep, restorative sleep. Prepare to unlock peak performance tomorrow.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#0d0d0d',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#ffffff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00f0ff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  checklistCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  checklistCardComplete: {
    backgroundColor: 'rgba(0,240,255,0.05)',
    borderColor: 'rgba(0,240,255,0.2)',
  },
  checklistCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checklistLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistTextContainer: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 4,
  },
  checklistTitleComplete: {
    opacity: 0.7,
  },
  checklistDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 18,
  },
  checkIcon: {
    marginLeft: 12,
    marginTop: 10,
  },
  scienceSection: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: 12,
  },
  scienceLabel: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: '#00f0ff',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  scienceText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  completionCard: {
    backgroundColor: 'rgba(0,240,255,0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.3)',
  },
  completionIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#00f0ff',
    marginBottom: 8,
  },
  completionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
});
