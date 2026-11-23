import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { spriteFor } from '../assets';
import { theme } from '../constants/theme';
import { Special } from '../game/types';
import { GlossHighlight } from './GlossHighlight';

type Props = {
  index: number;
  ing: number;
  special: Special;
  syrup: number;
  size: number;
  left: number;
  top: number;
  selected: boolean;
  hinted: boolean;
  glyphMode: boolean;
  reducedMotion: boolean;
  onPress: (index: number) => void;
};

/** One unique shape per ingredient for the colourblind helper. */
function GlyphBadge({ ing, size }: { ing: number; size: number }) {
  const s = size;
  const half = s / 2;
  return (
    <Svg width={s} height={s}>
      {ing === 0 ? <Circle cx={half} cy={half} r={half - 1} fill="#FFFFFF" /> : null}
      {ing === 1 ? (
        <Polygon points={`${half},1 ${s - 1},${s - 1} 1,${s - 1}`} fill="#FFFFFF" />
      ) : null}
      {ing === 2 ? <Rect x={1} y={1} width={s - 2} height={s - 2} rx={2} fill="#FFFFFF" /> : null}
      {ing === 3 ? (
        <Path d={`M${half} 1 L${s - 1} ${half + 2} L${half} ${s - 1} L1 ${half + 2} Z`} fill="#FFFFFF" />
      ) : null}
      {ing === 4 ? (
        <Polygon
          points={`${half},1 ${s * 0.66},${s * 0.38} ${s - 1},${s * 0.4} ${s * 0.74},${s * 0.64} ${s * 0.82},${s - 1} ${half},${s * 0.78} ${s * 0.18},${s - 1} ${s * 0.26},${s * 0.64} 1,${s * 0.4} ${s * 0.34},${s * 0.38}`}
          fill="#FFFFFF"
        />
      ) : null}
    </Svg>
  );
}

function CandyTileBase({
  index,
  ing,
  special,
  syrup,
  size,
  left,
  top,
  selected,
  hinted,
  glyphMode,
  reducedMotion,
  onPress,
}: Props) {
  const inner = size - 6;
  const ingredient = theme.ingredients[ing] ?? theme.ingredients[0];

  const enter = useRef(new Animated.Value(0)).current;
  const select = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: theme.spring.board.tension,
      friction: theme.spring.board.friction,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    Animated.spring(select, {
      toValue: selected ? 1.12 : 1,
      tension: 200,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [select, selected]);

  useEffect(() => {
    if (!hinted || reducedMotion) {
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
  }, [hinted, pulse, reducedMotion]);

  const hintScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const enterScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  const handlePress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${ingredient.name} candy`}
      onPress={handlePress}
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
      style={[styles.press, { width: size, height: size, left, top }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.center,
          { width: size, height: size, opacity: enter, transform: [{ scale: enterScale }] },
        ]}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.candy,
            {
              width: inner,
              height: inner,
              borderRadius: inner * 0.34,
              backgroundColor: ingredient.color,
              borderColor: selected ? '#FFFFFF' : ingredient.soft,
              borderWidth: selected ? 3 : 1.5,
              shadowColor: ingredient.color,
              transform: [{ scale: select }, { scale: hintScale }],
            },
          ]}>
          <GlossHighlight size={inner} radius={inner * 0.34} opacity={0.45} />
          <Image
            source={spriteFor(ing)}
            style={{ width: size * 0.62, height: size * 0.62 }}
            resizeMode="contain"
          />
          {special !== 'none' ? (
            <View
              style={[
                styles.specialRing,
                {
                  width: inner - 8,
                  height: inner - 8,
                  borderRadius: (inner - 8) * 0.34,
                  borderColor: special === 'rainbow' ? '#FFFFFF' : theme.colors.gold,
                },
              ]}
            />
          ) : null}
          {glyphMode ? (
            <View style={styles.glyph}>
              <GlyphBadge ing={ing} size={12} />
            </View>
          ) : null}
        </Animated.View>

        {syrup > 0 ? (
          <View
            pointerEvents="none"
            style={[
              styles.syrup,
              {
                width: inner,
                height: inner,
                borderRadius: inner * 0.34,
                backgroundColor: syrup > 1 ? 'rgba(216,120,0,0.6)' : 'rgba(255,179,0,0.55)',
              },
            ]}
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { position: 'absolute' },
  center: { alignItems: 'center', justifyContent: 'center' },
  candy: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  specialRing: {
    position: 'absolute',
    borderWidth: 2.5,
  },
  glyph: {
    position: 'absolute',
    right: 3,
    top: 3,
    width: 12,
    height: 12,
  },
  syrup: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.45)',
  },
});

export const CandyTile = memo(CandyTileBase);
