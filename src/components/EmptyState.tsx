import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { theme } from '../constants/theme';

type Props = {
  text: string;
  accent?: string;
};

/** A list that can be empty always says so in the game's own words — never a blank area. */
function EmptyStateBase({ text, accent = theme.colors.secondary }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.plate, { backgroundColor: accent + '1F' }]}>
        <Sparkles size={26} color={accent} strokeWidth={2.5} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  plate: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  text: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export const EmptyState = memo(EmptyStateBase);
