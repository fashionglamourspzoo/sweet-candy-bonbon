import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';

export type ButtonIcon = LucideIcon;

export const ICON_BOX = 24;
export const ICON_GAP = 10;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: ButtonIcon;
  colors?: readonly string[];
  disabled?: boolean;
  height?: number;
  backplate?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * The CTA of the app. Pressable is the PARENT and the animated scale lives in a
 * child view, so the press always reaches the handler on Android release.
 */
function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  colors = theme.gradients.pink,
  disabled = false,
  height = 60,
  backplate = false,
  style,
  testID,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      tension: theme.spring.press.tension,
      friction: theme.spring.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.spring.press.tension,
      friction: theme.spring.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const palette = disabled ? theme.gradients.muted : colors;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.animated, { height, transform: [{ scale }] }]}>
        <LinearGradient
          colors={[...palette]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, { height, opacity: disabled ? 0.55 : 1 }]}>
          {backplate ? (
            <Image source={assets.buttonRect} style={styles.backplate} resizeMode="stretch" />
          ) : null}
          <View style={styles.row}>
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={20} color={theme.colors.text.inverse} strokeWidth={2.5} />
              </View>
            ) : null}
            <Text numberOfLines={1} style={styles.label}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    borderRadius: 20,
    shadowColor: '#D81B6E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 8,
  },
  animated: { width: '100%', borderRadius: 20 },
  fill: {
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backplate: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ICON_GAP,
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    lineHeight: ICON_BOX,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: theme.colors.text.inverse,
    textShadowColor: 'rgba(122,30,88,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
