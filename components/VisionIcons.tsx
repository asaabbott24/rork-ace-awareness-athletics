import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, G } from 'react-native-svg';

const CYAN_COLOR = '#00f0ff';
const RED_COLOR = '#ff003c';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ScannerOverlay = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg height="100%" width="100%">
        <G opacity={0.15}>
          <Line x1="33%" y1="0" x2="33%" y2="100%" stroke={CYAN_COLOR} strokeWidth="1" />
          <Line x1="66%" y1="0" x2="66%" y2="100%" stroke={CYAN_COLOR} strokeWidth="1" />
          <Line x1="0" y1="33%" x2="100%" y2="33%" stroke={CYAN_COLOR} strokeWidth="1" />
          <Line x1="0" y1="66%" x2="100%" y2="66%" stroke={CYAN_COLOR} strokeWidth="1" />
        </G>

        <Line x1="20" y1="20" x2="60" y2="20" stroke={CYAN_COLOR} strokeWidth="3" strokeLinecap="round" />
        <Line x1="20" y1="20" x2="20" y2="60" stroke={CYAN_COLOR} strokeWidth="3" strokeLinecap="round" />

        <Line x1={SCREEN_WIDTH - 20} y1="20" x2={SCREEN_WIDTH - 60} y2="20" stroke={CYAN_COLOR} strokeWidth="3" strokeLinecap="round" />
        <Line x1={SCREEN_WIDTH - 20} y1="20" x2={SCREEN_WIDTH - 20} y2="60" stroke={CYAN_COLOR} strokeWidth="3" strokeLinecap="round" />
        
        <Line x1="20" y1={SCREEN_HEIGHT - 20} x2="60" y2={SCREEN_HEIGHT - 20} stroke={CYAN_COLOR} strokeWidth="3" strokeLinecap="round" />
        <Line x1="20" y1={SCREEN_HEIGHT - 20} x2="20" y2={SCREEN_HEIGHT - 60} stroke={CYAN_COLOR} strokeWidth="3" strokeLinecap="round" />

        <Line x1={SCREEN_WIDTH - 20} y1={SCREEN_HEIGHT - 20} x2={SCREEN_WIDTH - 60} y2={SCREEN_HEIGHT - 20} stroke={CYAN_COLOR} strokeWidth="3" strokeLinecap="round" />
        <Line x1={SCREEN_WIDTH - 20} y1={SCREEN_HEIGHT - 20} x2={SCREEN_WIDTH - 20} y2={SCREEN_HEIGHT - 60} stroke={CYAN_COLOR} strokeWidth="3" strokeLinecap="round" />

        <G opacity={0.5}>
          <Line x1="50%" y1="48%" x2="50%" y2="52%" stroke={CYAN_COLOR} strokeWidth="1" />
          <Line x1="48%" y1="50%" x2="52%" y2="50%" stroke={CYAN_COLOR} strokeWidth="1" />
        </G>
      </Svg>
    </View>
  );
};

export const RecordingIndicator = ({ isRecording }: { isRecording: boolean }) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isRecording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, { toValue: 0.2, duration: 800, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      animation.start();
    } else {
      opacityAnim.setValue(1);
    }
    return () => animation?.stop();
  }, [isRecording, opacityAnim]);

  return (
    <Animated.View style={{ opacity: opacityAnim }}>
      <Svg height="12" width="12" viewBox="0 0 12 12">
        <Circle cx="6" cy="6" r="6" fill={RED_COLOR} />
      </Svg>
    </Animated.View>
  );
};
