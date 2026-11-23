import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  depth: number;
  reducedMotion: boolean;
};

/** Pops over the board when a refill chains into another match. */
function ComboLabelBase({ depth, reducedMotion }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (depth < 2) {
      anim.setValue(0);
      return;
    }
    anim.setValue(0);
    Animated.sequence([
      Animated.spring(anim, { toValue: 1, tension: 90, friction: 7, useNativeDriver: true }),
      Animated.delay(reducedMotion ? 120 : 420),
      Animated.timing(anim, { toValue: 0, duration: reducedMotion ? 80 : 200, useNativeDriver: true }),
    ]).start();
  }, [anim, depth, reducedMotion]);

  if (depth < 2) {
    return null;
  }

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, { opacity: anim, transform: [{ scale }] }]}>
      <Text style={styles.text}>{`COMBO x${depth}`}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,46,134,0.92)',
  },
  text: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: theme.colors.text.inverse,
  },
});

export const ComboLabel = memo(ComboLabelBase);
