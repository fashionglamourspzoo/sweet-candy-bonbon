import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: string;
  muted?: boolean;
};

/** The clay container shared by Tutorial, Recipe, Collection, Daily and Settings rows. */
function SectionCardBase({ children, style, accent, muted = false }: Props) {
  return (
    <View
      style={[
        styles.card,
        muted ? styles.muted : null,
        accent ? { borderColor: accent + '55' } : null,
        style,
      ]}>
      <View pointerEvents="none" style={styles.topHighlight} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    padding: 14,
    overflow: 'hidden',
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  muted: {
    backgroundColor: theme.colors.bg.locked,
    borderColor: '#E8D3E0',
  },
  topHighlight: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});

export const SectionCard = memo(SectionCardBase);
