import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const POWER_DOWN_KEY = 'nightly_power_down_enabled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') return true;
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

export const schedulePowerDown = async (isEnabled: boolean) => {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(POWER_DOWN_KEY, JSON.stringify(isEnabled));
    console.log('Notifications not supported on web, saved preference only');
    return;
  }

  if (!isEnabled) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.setItem(POWER_DOWN_KEY, 'false');
    console.log('Nightly Power-Down notifications cancelled');
    return;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    console.log('Notification permissions denied');
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌙 Nightly Power-Down",
      body: "Time to initiate your biological reset. Tap to start your protocol.",
      data: { screen: 'journal' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 21,
      minute: 0,
      repeats: true,
    },
  });

  await AsyncStorage.setItem(POWER_DOWN_KEY, 'true');
  console.log('Nightly Power-Down notification scheduled for 9:00 PM daily');
};

export const getPowerDownEnabled = async (): Promise<boolean> => {
  try {
    const stored = await AsyncStorage.getItem(POWER_DOWN_KEY);
    return stored === 'true';
  } catch (error) {
    console.log('Error reading power-down preference:', error);
    return false;
  }
};
