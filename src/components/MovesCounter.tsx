import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { clockLabel } from '../utils/format';

type Props = {
  moves: number;
  low: boolean;
  reducedMotion: boolean;
  timeLeft?: number | null;
};

/** Clay pill with the sugar budget. At three moves or fewer it turns pink and pulses. */
function MovesCounterBase({ moves, low, reducedMotion, timeLeft = null }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!low || reducedMotion) {
      pulse.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [low, pulse, reducedMotion]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  return (
    <View style={[styles.pill, low ? styles.pillLow : null]}>
      <Text style={styles.caption}>{timeLeft === null ? 'MOVES' : 'MOVES · TIME'}</Text>
      <View style={styles.valueRow}>
        <Animated.Text
          style={[
            styles.value,
            { color: low ? theme.colors.primary : theme.colors.text.primary, transform: [{ scale }] },
          ]}>
          {moves}
        </Animated.Text>
        {timeLeft === null ? null : <Text style={styles.clock}>{clockLabel(timeLeft)}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 56,
    minWidth: 86,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  pillLow: { borderColor: theme.colors.primary },
  caption: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  value: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  clock: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: theme.colors.caramel,
    fontVariant: ['tabular-nums'],
  },
});

export const MovesCounter = memo(MovesCounterBase);
