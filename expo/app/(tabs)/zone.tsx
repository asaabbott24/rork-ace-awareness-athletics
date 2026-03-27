import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { Play, Pause } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SOUNDSCAPES, Soundscape } from '@/constants/soundscapes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ZoneScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);

  // Refs
  const soundRef = useRef<Audio.Sound | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Track playback intent across slides/renders
  const shouldPlayRef = useRef(false);
  const playSessionId = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Format Timer
  const formatTime = useCallback((totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // --- Audio Logic ---

  const stopCurrentSound = useCallback(async (isSwitching: boolean = false) => {
    console.log('[Zone] Stopping current sound...');
    playSessionId.current += 1; // Invalidate pending loads
    
    // Optimistic UI updates
    setIsPlaying(false);
    if (!isSwitching) {
      setIsLoading(false);
    }

    // Stop Timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const sound = soundRef.current;
    soundRef.current = null;

    if (sound) {
      try {
        // Stop first to ensure audio cuts immediately
        await sound.stopAsync();
        await sound.unloadAsync();
        console.log('[Zone] Sound stopped and unloaded successfully');
      } catch (e) {
        // Ignore errors during unload as the sound might be already in a bad state
        console.log('[Zone] Note: Error unloading sound (cleanup):', e);
      }
    }
  }, []);

  const playSound = useCallback(async (soundscape: Soundscape) => {
    // 1. Indicate loading immediately
    setIsLoading(true);

    // 2. Stop any current sound (pass true to keep loading state)
    await stopCurrentSound(true);

    // 3. Start new session
    const currentSessionId = playSessionId.current;

    const loadAudio = async (attempt: number = 1): Promise<void> => {
      try {
        console.log(`[Zone] Loading audio (attempt ${attempt}):`, soundscape.title);
        
        // Create but don't play yet to prevent race conditions
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: soundscape.audioUri },
          { shouldPlay: false, isLooping: true, volume: 1.0 }
        );

        // Verify session is still valid (user hasn't navigated away or clicked another sound)
        if (playSessionId.current !== currentSessionId) {
          console.log('[Zone] Session invalid, unloading.');
          await sound.unloadAsync();
          return;
        }

        if (!status.isLoaded) {
           await sound.unloadAsync(); 
           throw new Error('Audio failed to load');
        }

        // Double check session before assigning
        if (playSessionId.current !== currentSessionId) {
             await sound.unloadAsync();
             return;
        }

        // Assign ref so stopCurrentSound can handle it
        soundRef.current = sound;
        
        // Now play
        await sound.playAsync();
        
        // Check session again in case stopped during playAsync
        if (playSessionId.current !== currentSessionId) {
            // Important: If session became invalid during playAsync (e.g. user paused), 
            // we must ensure the sound is stopped/unloaded. 
            await stopCurrentSound(true);
            return;
        }

        setIsPlaying(true);
        setIsLoading(false);
        
        // Start Timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setSessionSeconds(s => s + 1);
        }, 1000);

      } catch (error) {
        if (playSessionId.current !== currentSessionId) {
            // Ensure cleanup if we are aborting due to session change
             // If sound was created but not assigned to ref, we need to unload it
             // We can't easily access 'sound' variable here if it was defined in try block...
             // But we can check if soundRef.current needs cleanup
        }
        
        // Cleanup if we failed after creating sound
        if (soundRef.current) {
            try {
                await soundRef.current.unloadAsync();
            } catch (e) { console.warn('Unload error in catch:', e); }
            soundRef.current = null;
        }
        
        console.warn(`[Zone] Playback failed attempt ${attempt}:`, error);
        
        // Retry logic for network blips
        if (attempt < 2 && playSessionId.current === currentSessionId) {
            await new Promise(r => setTimeout(r, 500));
            // Check session again before retrying
            if (playSessionId.current === currentSessionId) {
                return loadAudio(attempt + 1);
            }
        }
        
        if (playSessionId.current === currentSessionId) {
             setIsLoading(false);
             setIsPlaying(false);
             shouldPlayRef.current = false; // Reset intent on error
        }
      }
    };

    await loadAudio();
  }, [stopCurrentSound]);

  const togglePlayback = useCallback(async () => {
    // Allow stopping if playing OR loading (to cancel load)
    if (isPlaying || isLoading) {
      // Pause/Stop
      console.log('[Zone] User requested STOP');
      shouldPlayRef.current = false;
      await stopCurrentSound(false);
    } else {
      // Play
      console.log('[Zone] User requested PLAY');
      shouldPlayRef.current = true;
      await playSound(SOUNDSCAPES[currentIndex]);
    }
  }, [isPlaying, isLoading, currentIndex, playSound, stopCurrentSound]);

  const handleExit = useCallback(async () => {
    shouldPlayRef.current = false;
    await stopCurrentSound(false);
    setSessionSeconds(0);
    router.replace('/');
  }, [stopCurrentSound, router]);

  // --- Effects ---

  // 1. Screen Focus/Blur Handling
  useFocusEffect(
    useCallback(() => {
      // On Focus: Setup Audio Mode
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      return () => {
        // On Blur (Tab switch or Unmount): Stop everything
        shouldPlayRef.current = false;
        stopCurrentSound(false);
        setSessionSeconds(0); 
      };
    }, [stopCurrentSound])
  );

  // 2. Swipe Auto-play
  const prevIndexRef = useRef(currentIndex);
  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      // If we were playing (or intended to play), start the new track
      if (shouldPlayRef.current) {
        playSound(SOUNDSCAPES[currentIndex]);
      }
    }
    prevIndexRef.current = currentIndex;
  }, [currentIndex, playSound]);

  // --- UI Config ---

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (typeof index === 'number' && index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }).current;

  const animateTransition = useCallback(() => {
    fadeAnim.setValue(0.7);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderItem = useCallback(({ item, index }: { item: Soundscape; index: number }) => {
    const isActive = index === currentIndex;

    return (
      <View style={styles.slide}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={togglePlayback}
          style={styles.touchableContainer}
          testID={`soundscape-slide-${item.id}`}
        >
          <ImageBackground
            source={{ uri: item.imageUri }}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.8)']}
              locations={[0, 0.4, 1]}
              style={styles.gradient}
            >
              <View style={[styles.topContent, { paddingTop: insets.top + 20 }]}>
                {/* Pagination */}
                <View style={styles.pagination}>
                  {SOUNDSCAPES.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.paginationDot,
                        i === currentIndex && styles.paginationDotActive,
                      ]}
                    />
                  ))}
                </View>

                {/* Session Timer - Hidden when 0 */}
                {sessionSeconds > 0 && (
                   <View style={styles.sessionTimerContainer}>
                     <Text style={styles.sessionTimerText}>{formatTime(sessionSeconds)}</Text>
                   </View>
                )}
              </View>

              <View style={styles.centerContent}>
                {isActive && (
                  <View style={styles.playButtonContainer}>
                    {isLoading ? (
                       <ActivityIndicator size="large" color="#fff" />
                    ) : (
                      <View style={styles.playIconWrapper}>
                         {isPlaying ? (
                          <Pause color="#fff" size={40} fill="#fff" />
                        ) : (
                          <Play color="#fff" size={40} fill="#fff" style={{ marginLeft: 4 }} />
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>

              <View style={[styles.bottomContent, { paddingBottom: insets.bottom + 30 }]}>
                <View style={styles.infoContainer}>
                  {isPlaying && isActive && (
                    <View style={styles.nowPlayingBadge}>
                      <View style={styles.pulsingDot} />
                      <Text style={styles.nowPlayingText}>FLOW ACTIVE</Text>
                    </View>
                  )}
                  
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleExit}
                  style={styles.exitButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.exitButtonText}>End Session</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }, [currentIndex, isPlaying, isLoading, togglePlayback, insets, handleExit, formatTime, sessionSeconds]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={SOUNDSCAPES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="start"
        onMomentumScrollEnd={animateTransition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  touchableContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topContent: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 24,
    opacity: 1,
  },
  sessionTimerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sessionTimerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  playIconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  nowPlayingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  nowPlayingText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4ADE80',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: '80%',
  },
  exitButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
