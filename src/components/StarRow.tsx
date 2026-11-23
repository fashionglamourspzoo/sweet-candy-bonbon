import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { theme } from '../constants/theme';

type Props = {
  earned: number;
  total?: number;
  size?: number;
  animate?: boolean;
  reducedMotion?: boolean;
};

function StarRowBase({ earned, total = 3, size = 20, animate = false, reducedMotion = false }: Props) {
  const values = useRef(
    Array.from({ length: total }, () => new Animated.Value(animate ? 0 : 1)),
  ).current;

  useEffect(() => {
    if (!animate) {
      return;
    }
    const animations = values.map((value, i) =>
      Animated.sequence([
        Animated.delay(reducedMotion ? i * 50 : i * 120),
        Animated.spring(value, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
    );
    Animated.parallel(animations).start();
  }, [animate, reducedMotion, values]);

  return (
    <View style={[styles.row, { gap: Math.round(size * 0.3) }]}>
      {values.map((value, i) => {
        const filled = i < earned;
        return (
          <Animated.View key={i} style={{ transform: [{ scale: value }] }}>
            <Star
              size={size}
              color={filled ? theme.colors.gold : '#E6D3DF'}
              fill={filled ? theme.colors.gold : '#E6D3DF'}
              strokeWidth={2}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

export const StarRow = memo(StarRowBase);
