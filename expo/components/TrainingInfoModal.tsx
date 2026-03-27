import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { X, FlaskConical, Flower2, Flame } from 'lucide-react-native';
import { TrainingScience } from '@/constants/trainingLab';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface TrainingInfoPackProps {
  scienceData: TrainingScience;
}

export const TrainingInfoPack = ({ scienceData }: TrainingInfoPackProps) => {
  const hasPresence = !!scienceData.presence;
  const hasGrit = !!scienceData.grit;
  const hasAwarenessData = hasPresence || hasGrit;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <FlaskConical size={16} color="#00f0ff" />
          <Text style={styles.sectionHeaderMechanism}>THE MECHANISM</Text>
        </View>
        <Text style={styles.bodyText}>{scienceData.mechanism}</Text>
      </View>

      {hasAwarenessData ? (
        <>
          {hasPresence && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Flower2 size={16} color="#FFD700" />
                <Text style={styles.sectionHeaderPresence}>THE PRESENCE</Text>
              </View>
              <Text style={styles.bodyText}>{scienceData.presence}</Text>
            </View>
          )}

          {hasGrit && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Flame size={16} color="#FF4444" />
                <Text style={styles.sectionHeaderGrit}>THE GRIT</Text>
              </View>
              <Text style={styles.bodyText}>{scienceData.grit}</Text>
            </View>
          )}
        </>
      ) : (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Flower2 size={16} color="#FFD700" />
              <Text style={styles.sectionHeaderPresence}>THE COURT EDGE</Text>
            </View>
            <Text style={styles.bodyText}>{scienceData.gameBenefit}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Flame size={16} color="#FF4444" />
              <Text style={styles.sectionHeaderGrit}>THE MINDSET</Text>
            </View>
            <Text style={styles.bodyText}>{scienceData.lifeBenefit}</Text>
          </View>
        </>
      )}
    </View>
  );
};

interface ScienceModalProps {
  visible: boolean;
  onClose: () => void;
  scienceData: TrainingScience | undefined;
  title: string;
}

export const ScienceModal = ({ visible, onClose, scienceData, title }: ScienceModalProps) => {
  useEffect(() => {
    if (visible && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [visible]);

  if (!scienceData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={styles.blur} tint="dark" />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.tagContainer}>
              <Text style={styles.modalTitle}>EXPERT ANALYSIS</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.drillTitle}>{title}</Text>
          
          <View style={styles.personaBar}>
            <View style={styles.personaItem}>
              <View style={[styles.personaDot, { backgroundColor: '#00f0ff' }]} />
              <Text style={styles.personaLabel}>Huberman</Text>
            </View>
            <View style={styles.personaItem}>
              <View style={[styles.personaDot, { backgroundColor: '#FFD700' }]} />
              <Text style={styles.personaLabel}>Mumford + Betchart</Text>
            </View>
            <View style={styles.personaItem}>
              <View style={[styles.personaDot, { backgroundColor: '#FF4444' }]} />
              <Text style={styles.personaLabel}>Grover</Text>
            </View>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <TrainingInfoPack scienceData={scienceData} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 10, 
    borderRadius: 20 
  },
  section: { 
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionHeaderMechanism: { 
    color: '#00f0ff', 
    fontSize: 12, 
    fontWeight: '800', 
    letterSpacing: 2,
  },
  sectionHeaderPresence: { 
    color: '#FFD700', 
    fontSize: 12, 
    fontWeight: '800', 
    letterSpacing: 2,
  },
  sectionHeaderGrit: { 
    color: '#FF4444', 
    fontSize: 12, 
    fontWeight: '800', 
    letterSpacing: 2,
  },
  bodyText: { 
    color: '#E0E0E0', 
    fontSize: 15, 
    lineHeight: 24, 
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 20,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#0A0A0A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagContainer: {
    backgroundColor: 'rgba(0,240,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.3)',
  },
  modalTitle: {
    color: '#00f0ff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  drillTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  personaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  personaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  personaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  personaLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
