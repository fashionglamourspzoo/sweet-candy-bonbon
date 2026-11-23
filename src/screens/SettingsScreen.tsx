import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Eye, Lightbulb, Trash2, Zap } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { ScreenFrame } from '../components/ScreenFrame';
import { SecondaryButton } from '../components/SecondaryButton';
import { SectionCard } from '../components/SectionCard';
import { SettingRow } from '../components/SettingRow';
import { useSettings, useSettingsActions } from '../hooks/useSettings';

type Props = {
  onBack: () => void;
};

export function SettingsScreen({ onBack }: Props) {
  const settings = useSettings();
  const { toggle, resetProgress } = useSettingsActions();
  const [confirming, setConfirming] = useState(false);

  const toggleColourblind = useCallback(() => toggle('colourblind'), [toggle]);
  const toggleReducedMotion = useCallback(() => toggle('reducedMotion'), [toggle]);
  const toggleHintHelper = useCallback(() => toggle('hintHelper'), [toggle]);

  const askReset = useCallback(() => setConfirming(true), []);
  const cancelReset = useCallback(() => setConfirming(false), []);
  const confirmReset = useCallback(() => {
    resetProgress();
    setConfirming(false);
  }, [resetProgress]);

  return (
    <ScreenFrame
      title="SETTINGS"
      subtitle="EVERY OPTION CHANGES THE GAME"
      overlay={theme.gradients.library}
      reducedMotion={settings.reducedMotion}
      onBack={onBack}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <SettingRow
          label="COLOURBLIND SHAPES"
          description="A UNIQUE WHITE GLYPH ON EVERY CANDY — CIRCLE, TRIANGLE, SQUARE, DROP, STAR"
          value={settings.colourblind}
          accent={theme.colors.info}
          Icon={Eye}
          onToggle={toggleColourblind}
        />
        <SettingRow
          label="REDUCED MOTION"
          description="CASCADES AND TRANSITIONS RUN AT 40 PERCENT AND IDLE LOOPS STOP"
          value={settings.reducedMotion}
          accent={theme.colors.secondary}
          Icon={Zap}
          onToggle={toggleReducedMotion}
        />
        <SettingRow
          label="HINT HELPER"
          description="THE IDLE PULSE AND THE HINT BUTTON ON THE PUZZLE SCREEN"
          value={settings.hintHelper}
          accent={theme.colors.gold}
          Icon={Lightbulb}
          onToggle={toggleHintHelper}
        />

        <SectionCard accent={theme.colors.primary} style={styles.resetCard}>
          <View style={styles.resetRow}>
            <View style={[styles.resetIcon, { backgroundColor: theme.colors.primary + '1F' }]}>
              <Trash2 size={22} color={theme.colors.primary} strokeWidth={2.5} />
            </View>
            <View style={styles.resetTexts}>
              <Text style={styles.resetTitle}>RESET PROGRESS</Text>
              <Text style={styles.resetSub}>
                CLEARS STARS, STAGES, RECIPES, THE PANTRY, DECOR AND THE DAILY STREAK
              </Text>
            </View>
          </View>

          {confirming ? (
            <View style={styles.confirmRow}>
              <View style={styles.confirmSlot}>
                <SecondaryButton
                  label="CONFIRM RESET"
                  accent={theme.colors.primary}
                  onPress={confirmReset}
                />
              </View>
              <View style={styles.confirmSlot}>
                <SecondaryButton label="CANCEL" accent={theme.colors.secondary} onPress={cancelReset} />
              </View>
            </View>
          ) : (
            <View style={styles.confirmRow}>
              <SecondaryButton label="RESET PROGRESS" accent={theme.colors.primary} onPress={askReset} />
            </View>
          )}
        </SectionCard>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SWEET CANDY BONBON · VERSION 1.0</Text>
        <Text style={styles.footerText}>BONBON ATELIER · 12+ · NO REAL MONEY PLAY</Text>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, marginTop: 8 },
  content: { gap: 10, paddingBottom: 12 },
  resetCard: { paddingVertical: 12 },
  resetRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resetIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetTexts: { flex: 1 },
  resetTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.text.primary,
  },
  resetSub: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  confirmRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  confirmSlot: { flex: 1 },
  footer: { paddingBottom: 16, gap: 2 },
  footerText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
