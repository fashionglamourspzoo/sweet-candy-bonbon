import React, { memo, useCallback, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string | null;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

/**
 * ONE header for every screen of the app. Menu, Game, Levels, Recipe Book,
 * Collection, Daily and Settings all render this component and only change the
 * slots, so the header can never drift between screens.
 */
function ScreenHeaderBase({ title, subtitle, leftSlot, rightSlot }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.center}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

type RoundProps = {
  icon: number;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Circular plate button used for MENU / PAUSE. The caption is real text. */
function RoundPlateButtonBase({ icon, label, onPress, accessibilityLabel }: RoundProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.92, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.roundPress}>
      <Animated.View pointerEvents="box-none" style={[styles.roundInner, { transform: [{ scale }] }]}>
        <View style={styles.plate}>
          <Image source={assets.buttonRound} style={styles.plateBg} resizeMode="contain" />
          <Image source={icon} style={styles.plateIcon} resizeMode="contain" />
        </View>
        <Text style={styles.roundLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function StarsBadge({ value }: { value: number }) {
  return (
    <View style={styles.starsBadge}>
      <Star size={16} color={theme.colors.gold} fill={theme.colors.gold} strokeWidth={2} />
      <Text style={styles.starsValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 4,
    gap: 8,
  },
  side: { width: 76, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  roundPress: { width: 72, height: 56, justifyContent: 'center' },
  roundInner: { width: 72, height: 56, flexDirection: 'row', alignItems: 'center', gap: 6 },
  plate: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateBg: { position: 'absolute', width: 40, height: 40, opacity: 0.95 },
  plateIcon: { width: 22, height: 22 },
  roundLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  starsBadge: {
    height: 36,
    minWidth: 62,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.borderWarm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  starsValue: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export const RoundPlateButton = memo(RoundPlateButtonBase);
