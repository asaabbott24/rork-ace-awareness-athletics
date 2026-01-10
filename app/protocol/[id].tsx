import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wind, Flower2, Eye, Clock, ArrowLeft, Play } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { protocols, getCategoryColor, ProtocolCategory } from '@/data/protocols';
import AudioPlayerModal from '@/components/AudioPlayerModal';
import SuccessModal from '@/components/SuccessModal';
import { useApp } from '@/contexts/AppContext';

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

export default function ProtocolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { incrementMentalReps, mentalReps, currentStreak } = useApp();
  
  const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  
  const protocol = protocols.find(p => p.id === id);

  if (!protocol) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Protocol not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const IconComponent = getCategoryIcon(protocol.category);
  const categoryColor = getCategoryColor(protocol.category);

  const handleStartSession = () => {
    setShowAudioPlayer(true);
  };

  const handleAudioComplete = async () => {
    await incrementMentalReps();
    setShowAudioPlayer(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: protocol.imageUrl }} style={styles.image} />
            <View style={styles.imageOverlay} />
            <Pressable 
              style={[styles.backNavButton, { top: insets.top + 10 }]}
              onPress={() => router.back()}
            >
              <ArrowLeft color={Colors.text} size={22} />
            </Pressable>
            <View style={styles.imageContent}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
                <IconComponent color={Colors.text} size={14} />
                <Text style={styles.categoryText}>{protocol.category}</Text>
              </View>
              <Text style={styles.title}>{protocol.title}</Text>
              <View style={styles.metaRow}>
                <Clock color={Colors.textSecondary} size={14} />
                <Text style={styles.duration}>{protocol.duration}</Text>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>{protocol.description}</Text>
            
            {protocol.athleteReference && (
              <View style={styles.athleteRefCard}>
                <Text style={styles.athleteRefLabel}>ELITE INSIGHT</Text>
                <Text style={styles.athleteRef}>{protocol.athleteReference}</Text>
              </View>
            )}

            <View style={styles.stepsSection}>
              <Text style={styles.stepsTitle}>Step-by-Step Guide</Text>
              {protocol.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={[styles.stepNumber, { backgroundColor: `${categoryColor}30` }]}>
                    <Text style={[styles.stepNumberText, { color: categoryColor }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.actionContainer, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable 
            style={({ pressed }) => [
              styles.startButton,
              { backgroundColor: categoryColor },
              pressed && styles.startButtonPressed,
            ]}
            onPress={handleStartSession}
          >
            <Play color={Colors.text} size={22} fill={Colors.text} />
            <Text style={styles.startButtonText}>Start Session</Text>
          </Pressable>
        </View>
      </View>

      <AudioPlayerModal
        visible={showAudioPlayer}
        onClose={() => setShowAudioPlayer(false)}
        title={protocol.title}
        duration={protocol.duration}
        voiceUrl={protocol.voiceUrl}
        backgroundUrl={protocol.backgroundUrl}
        onComplete={handleAudioComplete}
        protocolId={protocol.id}
      />

      <SuccessModal
        visible={showSuccessModal}
        onClose={handleCloseSuccess}
        mentalReps={mentalReps}
        streak={currentStreak}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  imageContainer: {
    height: 320,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backNavButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duration: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    padding: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  athleteRefCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginBottom: 28,
  },
  athleteRefLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.secondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  athleteRef: {
    fontSize: 15,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  stepsSection: {
    marginTop: 8,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 18,
    gap: 14,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
    paddingTop: 4,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  startButton: {
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  startButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
});
