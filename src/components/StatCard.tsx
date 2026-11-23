import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { groupNumber } from '../utils/format';

type Props = {
  value: number | string;
  label: string;
  accent: string;
  /** Hide the card completely instead of showing an empty box. */
  hideWhenEmpty?: boolean;
};

/**
 * One pill shape for the whole row: same width, height, padding and radius.
 * Only the accent dot colour, the number and the caption differ — a row of
 * these reads as one component family, never as three mismatched sprites.
 */
function StatCardBase({ value, label, accent, hideWhenEmpty = false }: Props) {
  const isEmpty = value === 0 || value === '' || value === '0';
  if (hideWhenEmpty && isEmpty) {
    return null;
  }
  const text = typeof value === 'number' ? groupNumber(value) : value;

  return (
    <View style={[styles.card, { borderColor: accent + '44' }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text numberOfLines={1} style={[styles.value, { color: accent }]}>
        {text}
      </Text>
      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export const StatCard = memo(StatCardBase);

/** Row wrapper: equal slots, equal gaps. Renders nothing below two visible pills. */
export function StatRow({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children).filter(Boolean);
  if (items.length < 2) {
    return null;
  }
  return (
    <View style={rowStyles.row}>
      {items.map((child, i) => (
        <View key={i} style={rowStyles.slot}>
          {child}
        </View>
      ))}
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch', gap: 10, width: '100%' },
  slot: { flex: 1 },
});
