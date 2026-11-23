import React, { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';
import { ButtonIcon, ICON_BOX, ICON_GAP } from './PrimaryButton';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: ButtonIcon;
  accent?: string;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Light clay button. Same icon box (24) and same gap (10) as the primary CTA. */
function SecondaryButtonBase({
  label,
  onPress,
  Icon,
  accent = theme.colors.primary,
  disabled = false,
  height = 48,
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
        style={[
          styles.fill,
          {
            height,
            transform: [{ scale }],
            borderColor: disabled ? theme.colors.bg.locked : accent + '55',
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={20} color={disabled ? theme.colors.text.tertiary : accent} strokeWidth={2.5} />
            </View>
          ) : null}
          <Text numberOfLines={1} style={[styles.label, { color: disabled ? theme.colors.text.tertiary : theme.colors.text.primary }]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', borderRadius: 18 },
  fill: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: '#FFF4F9',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
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
    fontSize: 14,
    lineHeight: ICON_BOX,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
