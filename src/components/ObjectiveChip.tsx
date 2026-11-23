import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Check, Droplet, Trophy } from 'lucide-react-native';
import { spriteFor } from '../assets';
import { theme } from '../constants/theme';
import { Objective } from '../game/types';
import { groupNumber } from '../utils/format';

type Props = {
  objective: Objective | null;
  current: number;
  target: number;
  done: boolean;
};

function captionFor(objective: Objective): string {
  if (objective.kind === 'collect') {
    return theme.ingredients[objective.ing].name;
  }
  if (objective.kind === 'syrup') {
    return 'SYRUP';
  }
  return 'POINTS';
}

function accentFor(objective: Objective): string {
  if (objective.kind === 'collect') {
    return theme.ingredients[objective.ing].color;
  }
  if (objective.kind === 'syrup') {
    return theme.colors.gold;
  }
  return theme.colors.secondary;
}

/** Nothing to show means nothing is rendered — never an empty rounded box. */
function ObjectiveChipBase({ objective, current, target, done }: Props) {
  if (!objective || target <= 0) {
    return null;
  }
  const accent = accentFor(objective);
  const value =
    objective.kind === 'score'
      ? `${groupNumber(current)}/${groupNumber(target)}`
      : `${Math.min(current, target)}/${target}`;

  return (
    <View style={[styles.chip, { borderColor: accent + '66' }]}>
      <View style={[styles.iconPlate, { backgroundColor: accent + '1F' }]}>
        {objective.kind === 'collect' ? (
          <Image source={spriteFor(objective.ing)} style={styles.sprite} resizeMode="contain" />
        ) : objective.kind === 'syrup' ? (
          <Droplet size={20} color={accent} strokeWidth={2.5} />
        ) : (
          <Trophy size={20} color={accent} strokeWidth={2.5} />
        )}
      </View>
      <View style={styles.texts}>
        <Text numberOfLines={1} style={[styles.value, { color: done ? theme.colors.mint : theme.colors.text.primary }]}>
          {value}
        </Text>
        <Text numberOfLines={1} style={styles.caption}>
          {captionFor(objective)}
        </Text>
      </View>
      {done ? (
        <View style={styles.doneBadge}>
          <Check size={13} color="#FFFFFF" strokeWidth={3.5} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 56,
    flex: 1,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  iconPlate: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: { width: 26, height: 26 },
  texts: { flex: 1 },
  value: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  caption: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.secondary,
  },
  doneBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const ObjectiveChip = memo(ObjectiveChipBase);
