import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { multiplierLabel } from '../utils/format';

type Props = {
  multiplier: number;
};

/** Hidden at x1.0 — an inactive streak renders nothing instead of an empty chip. */
function StreakBadgeBase({ multiplier }: Props) {
  if (multiplier <= 1) {
    return null;
  }
  return (
    <View style={styles.badge}>
      <Flame size={14} color={theme.colors.caramel} strokeWidth={2.5} />
      <Text style={styles.text}>{`STREAK ${multiplierLabel(multiplier)}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: '#FFF1E4',
    borderWidth: 1.5,
    borderColor: '#FFD4B2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.caramel,
  },
});

export const StreakBadge = memo(StreakBadgeBase);
