import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert, Platform } from 'react-native';
import { schedulePowerDown, getPowerDownEnabled } from '@/services/notificationService';

export const PowerDownToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreference();
  }, []);

  const loadPreference = async () => {
    try {
      const enabled = await getPowerDownEnabled();
      setIsEnabled(enabled);
    } catch (error) {
      console.log('Error loading power-down preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSwitch = async () => {
    if (Platform.OS === 'web' && !isEnabled) {
      Alert.alert(
        'Web Limitation',
        'Push notifications are not available on web. Your preference will be saved for mobile.'
      );
    }

    const newState = !isEnabled;
    setIsEnabled(newState);
    
    try {
      await schedulePowerDown(newState);
      
      if (newState && Platform.OS !== 'web') {
        Alert.alert(
          '🌙 Power-Down Activated',
          'You\'ll receive a daily reminder at 9:00 PM to begin your biological reset protocol.'
        );
      }
    } catch (error) {
      console.log('Error toggling power-down:', error);
      setIsEnabled(!newState);
      Alert.alert('Error', 'Could not update notification settings. Please try again.');
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.settingRow}>
      <View style={styles.labelContainer}>
        <Text style={styles.settingLabel}>Nightly Power-Down</Text>
        <Text style={styles.settingSub}>Daily 9:00 PM Sleep Protocol</Text>
      </View>
      <Switch
        trackColor={{ false: '#333', true: '#00f0ff' }}
        thumbColor={isEnabled ? '#FFF' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111',
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  labelContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  settingSub: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});
