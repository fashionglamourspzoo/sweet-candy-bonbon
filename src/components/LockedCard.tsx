import React, { memo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Lock } from 'lucide-react-native';
import { theme } from '../constants/theme';

type Props = {
  hint: string;
  title?: string;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
};

/** A locked node or card: visibly distinct, never pressable, always says how to open it. */
function LockedCardBase({ hint, title, style, compact = false }: Props) {
  return (
    <View style={[styles.card, compact ? styles.compact : null, style]}>
      <View style={styles.plate}>
        <Lock size={compact ? 18 : 22} color={theme.colors.text.tertiary} strokeWidth={2.5} />
      </View>
      {title ? (
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : null}
      <Text numberOfLines={2} style={styles.hint}>
        {hint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.colors.bg.locked,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: '#E8D3E0',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: { paddingVertical: 10 },
  plate: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8D3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  hint: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});

export const LockedCard = memo(LockedCardBase);
