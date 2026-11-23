import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Home, Play, RotateCcw } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

type Props = {
  visible: boolean;
  stageTitle: string;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
};

/** In-screen card, not a screen file. Each button has its own caption and its own action. */
function PauseOverlayBase({ visible, stageTitle, onResume, onRestart, onMenu }: Props) {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <Text style={styles.title}>ATELIER PAUSED</Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          {stageTitle}
        </Text>
        <View style={styles.actions}>
          <PrimaryButton label="RESUME" Icon={Play} onPress={onResume} height={56} />
          <SecondaryButton label="RESTART" Icon={RotateCcw} onPress={onRestart} accent={theme.colors.secondary} />
          <SecondaryButton label="MENU" Icon={Home} onPress={onMenu} accent={theme.colors.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(74,32,64,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.bg.surface,
    borderRadius: theme.radius.xxl,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 18,
    paddingVertical: 22,
    alignItems: 'center',
    shadowColor: '#1E0A19',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  actions: { width: '100%', gap: 10 },
});

export const PauseOverlay = memo(PauseOverlayBase);
