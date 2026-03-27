import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export type GameMode = 'pre' | 'post';

interface CompletedSession {
  moduleId: string;
  completedAt: string;
  durationMin: number;
}

interface AppState {
  gameMode: GameMode;
  mentalReps: number;
  currentStreak: number;
  lastCompletedDate: string | null;
  isLoading: boolean;
  favorites: string[];
  completedSessions: CompletedSession[];
  readBooks: string[];
}

interface AppContextValue extends AppState {
  setGameMode: (mode: GameMode) => void;
  incrementMentalReps: () => Promise<void>;
  getAccentColor: () => string;
  toggleFavorite: (moduleId: string) => void;
  isFavorite: (moduleId: string) => boolean;
  addCompletedSession: (moduleId: string, durationMin: number) => void;
  getCompletedToday: () => CompletedSession[];
  getCompletedThisWeek: () => CompletedSession[];
  toggleReadBook: (bookId: string) => void;
  isBookRead: (bookId: string) => boolean;
}

const STORAGE_KEY = '@ace_awareness_app_state';

export const [AppProvider, useApp] = createContextHook<AppContextValue>(() => {
  const [state, setState] = useState<AppState>({
    gameMode: 'pre',
    mentalReps: 0,
    currentStreak: 0,
    lastCompletedDate: null,
    isLoading: true,
    favorites: [],
    completedSessions: [],
    readBooks: [],
  });

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (stored && typeof stored === 'string' && stored.length > 0) {
        try {
          const trimmed = stored.trim();
          
          // Check for common invalid values
          if (
            !trimmed.startsWith('{') || 
            trimmed === 'undefined' || 
            trimmed === 'null' || 
            trimmed === '[object Object]' ||
            trimmed.length < 2
          ) {
            console.warn('Invalid stored data format, clearing:', trimmed.substring(0, 50));
            throw new Error('Invalid JSON format detected');
          }

          const parsed = JSON.parse(trimmed);
          
          // Validate parsed result is an object
          if (typeof parsed !== 'object' || parsed === null) {
            throw new Error('Parsed data is not an object');
          }
          const today = new Date().toDateString();
          const lastDate = parsed.lastCompletedDate;
          
          let streak = parsed.currentStreak || 0;
          if (lastDate) {
            const lastCompletedDate = new Date(lastDate).toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            
            if (lastCompletedDate !== today && lastCompletedDate !== yesterday) {
              streak = 0;
            }
          }
          
          setState({
            gameMode: parsed.gameMode || 'pre',
            mentalReps: parsed.mentalReps || 0,
            currentStreak: streak,
            lastCompletedDate: parsed.lastCompletedDate || null,
            isLoading: false,
            favorites: parsed.favorites || [],
            completedSessions: parsed.completedSessions || [],
            readBooks: parsed.readBooks || [],
          });
        } catch (parseError) {
          console.warn('Corrupt app state found, clearing storage:', parseError);
          await AsyncStorage.removeItem(STORAGE_KEY);
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to load app state:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const saveState = useCallback(async (newState: Partial<AppState>) => {
    try {
      const updatedState = { ...state, ...newState };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
      setState(prev => ({ ...prev, ...newState }));
    } catch (error) {
      console.error('Failed to save app state:', error);
    }
  }, [state]);

  const setGameMode = useCallback((mode: GameMode) => {
    saveState({ gameMode: mode });
  }, [saveState]);

  const incrementMentalReps = useCallback(async () => {
    const today = new Date().toDateString();
    const lastDate = state.lastCompletedDate;
    const lastCompletedDate = lastDate ? new Date(lastDate).toDateString() : null;
    
    let newStreak = state.currentStreak;
    
    if (lastCompletedDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastCompletedDate === yesterday || state.currentStreak === 0) {
        newStreak = state.currentStreak + 1;
      } else {
        newStreak = 1;
      }
    }
    
    await saveState({
      mentalReps: state.mentalReps + 1,
      currentStreak: newStreak,
      lastCompletedDate: new Date().toISOString(),
    });
  }, [state, saveState]);

  const getAccentColor = useCallback(() => {
    return state.gameMode === 'pre' ? '#3B82F6' : '#A855F7';
  }, [state.gameMode]);

  const toggleFavorite = useCallback((moduleId: string) => {
    const newFavorites = state.favorites.includes(moduleId)
      ? state.favorites.filter(id => id !== moduleId)
      : [...state.favorites, moduleId];
    saveState({ favorites: newFavorites });
  }, [state.favorites, saveState]);

  const isFavorite = useCallback((moduleId: string) => {
    return state.favorites.includes(moduleId);
  }, [state.favorites]);

  const addCompletedSession = useCallback((moduleId: string, durationMin: number) => {
    const newSession: CompletedSession = {
      moduleId,
      completedAt: new Date().toISOString(),
      durationMin,
    };
    const newSessions = [...state.completedSessions, newSession].slice(-100);
    saveState({ completedSessions: newSessions });
  }, [state.completedSessions, saveState]);

  const getCompletedToday = useCallback(() => {
    const today = new Date().toDateString();
    return state.completedSessions.filter(
      session => new Date(session.completedAt).toDateString() === today
    );
  }, [state.completedSessions]);

  const getCompletedThisWeek = useCallback(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return state.completedSessions.filter(
      session => new Date(session.completedAt) >= weekAgo
    );
  }, [state.completedSessions]);

  const toggleReadBook = useCallback((bookId: string) => {
    const newReadBooks = state.readBooks.includes(bookId)
      ? state.readBooks.filter(id => id !== bookId)
      : [...state.readBooks, bookId];
    saveState({ readBooks: newReadBooks });
  }, [state.readBooks, saveState]);

  const isBookRead = useCallback((bookId: string) => {
    return state.readBooks.includes(bookId);
  }, [state.readBooks]);

  return {
    ...state,
    setGameMode,
    incrementMentalReps,
    getAccentColor,
    toggleFavorite,
    isFavorite,
    addCompletedSession,
    getCompletedToday,
    getCompletedThisWeek,
    toggleReadBook,
    isBookRead,
  };
});
