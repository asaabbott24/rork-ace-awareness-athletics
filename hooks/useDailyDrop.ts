import { useState, useEffect } from 'react';
import QUOTE_DATA from '@/assets/quotes.json';

export interface DailyDropItem {
  id: string;
  text: string;
  author: string;
  type: 'NBA' | 'ZEN' | 'AFFIRMATION';
}

const getHashForDate = (dateString: string): number => {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const useDailyDrop = () => {
  const [dailyQuote, setDailyQuote] = useState<DailyDropItem | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const seed = getHashForDate(today);
    const index = seed % QUOTE_DATA.length;
    
    console.log('[DailyDrop] Date:', today, '| Seed:', seed, '| Index:', index);
    console.log('[DailyDrop] Total quotes:', QUOTE_DATA.length);
    console.log('[DailyDrop] Selected:', (QUOTE_DATA[index] as DailyDropItem)?.author);
    
    setDailyQuote(QUOTE_DATA[index] as DailyDropItem);
  }, []);

  return dailyQuote;
};

export const useDailyAffirmation = () => {
  const [affirmation, setAffirmation] = useState<DailyDropItem | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const seed = getHashForDate(today + '_affirmation');
    
    const affirmations = (QUOTE_DATA as DailyDropItem[]).filter(item => item.type === 'AFFIRMATION');
    const index = seed % affirmations.length;
    
    console.log('[DailyAffirmation] Total affirmations:', affirmations.length);
    console.log('[DailyAffirmation] Selected:', affirmations[index]?.text);
    
    setAffirmation(affirmations[index]);
  }, []);

  return affirmation;
};

export const useDailyNBA = () => {
  const [quote, setQuote] = useState<DailyDropItem | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const seed = getHashForDate(today + '_nba');
    
    const nbaQuotes = (QUOTE_DATA as DailyDropItem[]).filter(item => item.type === 'NBA');
    const index = seed % nbaQuotes.length;
    
    console.log('[DailyNBA] Selected:', nbaQuotes[index]?.author);
    
    setQuote(nbaQuotes[index]);
  }, []);

  return quote;
};

export const useDailyZen = () => {
  const [quote, setQuote] = useState<DailyDropItem | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const seed = getHashForDate(today + '_zen');
    
    const zenQuotes = (QUOTE_DATA as DailyDropItem[]).filter(item => item.type === 'ZEN');
    const index = seed % zenQuotes.length;
    
    console.log('[DailyZen] Selected:', zenQuotes[index]?.author);
    
    setQuote(zenQuotes[index]);
  }, []);

  return quote;
};
