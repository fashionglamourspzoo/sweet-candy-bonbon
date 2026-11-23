import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';
import { ButtonIcon } from './PrimaryButton';

type Props = {
  label: string;
  subLabel?: string;
  Icon: ButtonIcon;
  accent: string;
  onPress: () => void;
  height: number;
  badge?: boolean;
  delay?: number;
  reducedMotion?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** One bento destination of the Menu hub. Icon 22 in a 40x40 tinted plate, never absolute. */
function HubTileBase({
  label,
  subLabel,
  Icon,
  accent,
  onPress,
  height,
  badge = false,
  delay = 0,
  reducedMotion = false,
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(reducedMotion ? 0 : delay),
      Animated.spring(enter, {
        toValue: 1,
        tension: theme.spring.ui.tension,
        friction: theme.spring.ui.friction,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, enter, reducedMotion]);

  const pressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 0.96, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, tension: 300, friction: 12, useNativeDriver: true }).start();
  }, [scale]);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          { height, opacity: enter, transform: [{ translateY }, { scale }] },
        ]}>
        <View pointerEvents="none" style={styles.topHighlight} />
        <View style={styles.row}>
          <View style={[styles.iconPlate, { backgroundColor: accent + '1F' }]}>
            <Icon size={22} color={accent} strokeWidth={2.5} />
          </View>
          <View style={styles.texts}>
            <Text numberOfLines={1} style={styles.label}>
              {label}
            </Text>
            {subLabel ? (
              <Text numberOfLines={1} style={styles.subLabel}>
                {subLabel}
              </Text>
            ) : null}
          </View>
          {badge ? <View style={styles.badge} /> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { alignSelf: 'stretch', borderRadius: theme.radius.xl },
  tile: {
    width: '100%',
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  topHighlight: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconPlate: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1 },
  label: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  subLabel: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
});

export const HubTile = memo(HubTileBase);
