import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  active: boolean;
  size: number;
  reducedMotion: boolean;
};

const SHARDS = 12;

/** Twelve candy shards fly out of the board centre when a recipe is completed. */
function ConfettiBurstBase({ active, size, reducedMotion }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      progress.setValue(0);
      return;
    }
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: reducedMotion ? 360 : 900,
      useNativeDriver: true,
    }).start();
  }, [active, progress, reducedMotion]);

  if (!active) {
    return null;
  }

  const radius = size * 0.42;

  return (
    <View pointerEvents="none" style={styles.wrap}>
      {Array.from({ length: SHARDS }, (_v, i) => {
        const angle = (i / SHARDS) * Math.PI * 2;
        const ingredient = theme.ingredients[i % theme.ingredients.length];
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(angle) * radius],
        });
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(angle) * radius],
        });
        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${(i % 2 === 0 ? 1 : -1) * 220}deg`],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 0.65, 1],
          outputRange: [1, 0.9, 0],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.shard,
              {
                backgroundColor: ingredient.color,
                opacity,
                transform: [{ translateX }, { translateY }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shard: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 5,
  },
});

export const ConfettiBurst = memo(ConfettiBurstBase);
