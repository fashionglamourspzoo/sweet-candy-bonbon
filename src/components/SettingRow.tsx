import React, { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { ButtonIcon } from './PrimaryButton';
import { SectionCard } from './SectionCard';

type Props = {
  label: string;
  description: string;
  value: boolean;
  accent: string;
  Icon: ButtonIcon;
  onToggle: () => void;
};

const TRACK_W = 54;
const TRACK_H = 30;
const KNOB = 24;

/** Clay row with a custom animated switch. Every switch has a real effect in the game. */
function SettingRowBase({ label, description, value, accent, Icon, onToggle }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      tension: 140,
      friction: 13,
      useNativeDriver: true,
    }).start();
  }, [anim, value]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, TRACK_W - KNOB - 3],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={onToggle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <SectionCard accent={value ? accent : undefined} style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.iconPlate, { backgroundColor: accent + '1F' }]}>
            <Icon size={22} color={accent} strokeWidth={2.5} />
          </View>
          <View style={styles.texts}>
            <Text numberOfLines={1} style={styles.label}>
              {label}
            </Text>
            <Text numberOfLines={2} style={styles.description}>
              {description}
            </Text>
          </View>
          <View style={[styles.track, { backgroundColor: value ? accent : '#E8D3E0' }]}>
            <Animated.View pointerEvents="none" style={[styles.knob, { transform: [{ translateX }] }]} />
          </View>
        </View>
      </SectionCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', minHeight: 72 },
  card: { paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconPlate: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1 },
  label: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.text.primary,
  },
  description: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.secondary,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#8A5E7E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

export const SettingRow = memo(SettingRowBase);
