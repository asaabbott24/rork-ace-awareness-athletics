import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Volume2, VolumeX, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { VISION_DRILLS, VisionDrill } from '@/constants/vision';
import { ScannerOverlay, RecordingIndicator } from '@/components/VisionIcons';

type DrillState = 'IDLE' | 'COUNTDOWN' | 'RECORDING' | 'REVIEW';

export default function VisionView() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(true);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  
  const [drillState, setDrillState] = useState<DrillState>('IDLE');
  const [selectedDrillIndex, setSelectedDrillIndex] = useState(0);
  const [audioCoachEnabled, setAudioCoachEnabled] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const spokenCuesRef = useRef<Set<number>>(new Set());
  
  const cameraRef = useRef<CameraView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const selectedDrill: VisionDrill = VISION_DRILLS[selectedDrillIndex];

  useEffect(() => {
    if (drillState === 'RECORDING') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      blinkAnim.setValue(1);
    }
  }, [drillState, blinkAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const cleanupTimers = useCallback(() => {
    if (Platform.OS !== 'web' && cameraRef.current) {
      try {
        console.log('Stopping recording on cleanup...');
        cameraRef.current.stopRecording();
      } catch (error) {
        console.log('Failed to stop recording on cleanup:', error);
      }
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupTimers();
      Speech.stop();
    };
  }, [cleanupTimers]);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
        cleanupTimers();
        Speech.stop();
        setDrillState('IDLE');
        setTimeRemaining(0);
      };
    }, [cleanupTimers])
  );

  const speakCoachCue = useCallback((text: string) => {
    if (audioCoachEnabled && Platform.OS !== 'web') {
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
      });
    }
  }, [audioCoachEnabled]);

  const startRecording = useCallback(async () => {
    setDrillState('RECORDING');
    setTimeRemaining(selectedDrill.durationSec);
    spokenCuesRef.current = new Set();
    
    speakCoachCue("Let's go!");

    if (Platform.OS !== 'web' && cameraRef.current) {
      try {
        console.log('Starting video recording...');
        cameraRef.current.recordAsync().then((video) => {
          if (video) {
            console.log('Video recorded:', video.uri);
          }
        }).catch((err) => {
          console.log('Recording error:', err);
        });
      } catch (error) {
        console.log('Failed to start recording:', error);
      }
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const elapsed = selectedDrill.durationSec - prev + 1;
        
        selectedDrill.audioCues.forEach((cue) => {
          if (cue.atSecond === elapsed && !spokenCuesRef.current.has(cue.atSecond)) {
            spokenCuesRef.current.add(cue.atSecond);
            speakCoachCue(cue.text);
          }
        });

        if (prev <= 1) {
          cleanupTimers();
          Speech.stop();
          
          if (Platform.OS !== 'web' && cameraRef.current) {
            try {
              cameraRef.current.stopRecording();
              console.log('Recording stopped');
            } catch (error) {
              console.log('Failed to stop recording:', error);
            }
          }

          speakCoachCue('Drill complete. Great work.');
          setDrillState('REVIEW');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selectedDrill, speakCoachCue, cleanupTimers]);

  const startCountdown = useCallback(() => {
    setDrillState('COUNTDOWN');
    setCountdown(3);
    
    speakCoachCue('Get ready');
    
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [speakCoachCue, startRecording]);

  const stopRecording = useCallback(() => {
    cleanupTimers();
    Speech.stop();
    
    if (Platform.OS !== 'web' && cameraRef.current) {
      try {
        cameraRef.current.stopRecording();
        console.log('Recording stopped');
      } catch (error) {
        console.log('Failed to stop recording:', error);
      }
    }

    speakCoachCue('Drill complete. Great work.');
    setDrillState('REVIEW');
  }, [cleanupTimers, speakCoachCue]);

  const resetDrill = useCallback(() => {
    cleanupTimers();
    Speech.stop();
    setDrillState('IDLE');
    setTimeRemaining(0);
    spokenCuesRef.current = new Set();
  }, [cleanupTimers]);

  const nextDrill = useCallback(() => {
    setSelectedDrillIndex((prev) => (prev + 1) % VISION_DRILLS.length);
  }, []);

  const prevDrill = useCallback(() => {
    setSelectedDrillIndex((prev) => (prev - 1 + VISION_DRILLS.length) % VISION_DRILLS.length);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!cameraPermission || !micPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer]}>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionTitle}>PERMISSION REQUIRED</Text>
          <Text style={styles.permissionText}>
            Court Vision needs camera and microphone access to record your training sessions.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              await requestCameraPermission();
              await requestMicPermission();
            }}
          >
            <Text style={styles.permissionButtonText}>GRANT ACCESS</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="front"
          mode="video"
        />
      )}

      <ScannerOverlay />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topBarContent}>
          {/* Exit Button - Critical for navigation since tab bar is hidden */}
          <TouchableOpacity 
            style={styles.exitButton} 
            onPress={() => router.replace('/')}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <X color="rgba(255,255,255,0.7)" size={24} />
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <Text style={styles.topBarTitle}>COURT VISION</Text>
            <Text style={styles.topBarDivider}>{'//'}</Text>
            <Text style={styles.topBarStatus}>
              {drillState === 'RECORDING' ? 'RECORDING' : drillState === 'COUNTDOWN' ? 'STARTING' : 'LIVE'}
            </Text>
            {drillState === 'RECORDING' && (
              <RecordingIndicator isRecording={true} />
            )}
          </View>
        </View>
      </View>

      {drillState === 'COUNTDOWN' && (
        <View style={styles.countdownOverlay}>
          <Animated.View style={[styles.countdownCircle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
          </Animated.View>
          <Text style={styles.countdownLabel}>GET READY</Text>
        </View>
      )}

      {drillState === 'RECORDING' && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>TIME REMAINING</Text>
          <Text style={styles.timerValue}>{formatTime(timeRemaining)}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(timeRemaining / selectedDrill.durationSec) * 100}%` }
              ]} 
            />
          </View>
        </View>
      )}

      {drillState === 'REVIEW' && (
        <View style={styles.reviewOverlay}>
          <View style={styles.reviewBox}>
            <Text style={styles.reviewTitle}>DRILL COMPLETE</Text>
            <Text style={styles.reviewDrill}>{selectedDrill.title}</Text>
            <Text style={styles.reviewDuration}>{formatTime(selectedDrill.durationSec)}</Text>
            <TouchableOpacity style={styles.reviewButton} onPress={resetDrill}>
              <Text style={styles.reviewButtonText}>NEW DRILL</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 100 }]}>
        {drillState === 'IDLE' && (
          <>
            <View style={styles.drillSelector}>
              <TouchableOpacity onPress={prevDrill} style={styles.drillArrow}>
                <ChevronLeft color="#00f0ff" size={28} />
              </TouchableOpacity>
              <View style={styles.drillInfo}>
                <Text style={styles.drillTitle}>{selectedDrill.title}</Text>
                <Text style={styles.drillDescription}>{selectedDrill.description}</Text>
                <Text style={styles.drillDuration}>{formatTime(selectedDrill.durationSec)}</Text>
              </View>
              <TouchableOpacity onPress={nextDrill} style={styles.drillArrow}>
                <ChevronRight color="#00f0ff" size={28} />
              </TouchableOpacity>
            </View>

            <View style={styles.coachNotesBox}>
              <Text style={styles.coachNotesLabel}>COACH&apos;S NOTE</Text>
              <Text style={styles.coachNotesText}>{selectedDrill.coachNotes}</Text>
            </View>

            <View style={styles.controlsRow}>
              <TouchableOpacity 
                style={styles.audioToggle}
                onPress={() => setAudioCoachEnabled(!audioCoachEnabled)}
              >
                {audioCoachEnabled ? (
                  <Volume2 color="#00f0ff" size={24} />
                ) : (
                  <VolumeX color="#666" size={24} />
                )}
                <Text style={[styles.audioToggleText, !audioCoachEnabled && styles.audioToggleTextOff]}>
                  AUDIO COACH
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.recButton} onPress={startCountdown}>
                <View style={styles.recButtonInner}>
                  <Text style={styles.recButtonText}>REC</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.audioToggle}>
                <Text style={styles.drillCountText}>
                  {selectedDrillIndex + 1}/{VISION_DRILLS.length}
                </Text>
              </View>
            </View>
          </>
        )}

        {drillState === 'RECORDING' && (
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
            <View style={styles.stopButtonInner} />
            <Text style={styles.stopButtonText}>STOP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionBox: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00f0ff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    maxWidth: 320,
  },
  permissionTitle: {
    color: '#00f0ff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 16,
  },
  permissionText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#00f0ff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  exitButton: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topBarTitle: {
    color: '#00f0ff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
  },
  topBarDivider: {
    color: '#444',
    fontSize: 14,
  },
  topBarStatus: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },

  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  countdownCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#00f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
  },
  countdownNumber: {
    color: '#00f0ff',
    fontSize: 80,
    fontWeight: '200',
  },
  countdownLabel: {
    color: '#00f0ff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 4,
    marginTop: 24,
  },
  timerContainer: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timerLabel: {
    color: '#666',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },
  timerValue: {
    color: '#00f0ff',
    fontSize: 64,
    fontWeight: '200',
    letterSpacing: 4,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00f0ff',
    borderRadius: 2,
  },
  reviewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  reviewBox: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00f0ff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  reviewTitle: {
    color: '#00f0ff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 16,
  },
  reviewDrill: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  reviewDuration: {
    color: '#666',
    fontSize: 18,
    marginBottom: 32,
  },
  reviewButton: {
    backgroundColor: '#00f0ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  drillSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  drillArrow: {
    padding: 8,
  },
  drillInfo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  drillTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  drillDescription: {
    color: '#888',
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
  },
  drillDuration: {
    color: '#00f0ff',
    fontSize: 14,
    fontWeight: '600',
  },
  coachNotesBox: {
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#00f0ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  coachNotesLabel: {
    color: '#00f0ff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  coachNotesText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 100,
  },
  audioToggleText: {
    color: '#00f0ff',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  audioToggleTextOff: {
    color: '#666',
  },
  drillCountText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  recButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  recButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  stopButton: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  stopButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ff0000',
    marginBottom: 8,
  },
  stopButtonText: {
    color: '#ff0000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
