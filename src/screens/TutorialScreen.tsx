import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Play } from 'lucide-react-native';
import { spriteFor } from '../assets';
import { theme } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { SecondaryButton } from '../components/SecondaryButton';
import { SectionCard } from '../components/SectionCard';
import { useSettings } from '../hooks/useSettings';

type Props = {
  onPlay: () => void;
  onBack: () => void;
};

const STEPS = [
  {
    title: 'SWAP TWO NEIGHBOURS',
    text: 'TAP A CANDY, THEN TAP A CANDY NEXT TO IT. A LINE OF THREE OR MORE POPS.',
    sprite: 0,
    accent: theme.colors.primary,
  },
  {
    title: 'WATCH THE SUGAR BUDGET',
    text: 'EVERY SUCCESSFUL SWAP COSTS ONE MOVE. A SWAP THAT MATCHES NOTHING BOUNCES BACK FOR FREE.',
    sprite: 1,
    accent: theme.colors.gold,
  },
  {
    title: 'MELT THE SYRUP',
    text: 'POP CANDIES STANDING ON A SYRUP CELL. TWO LAYERS NEED TWO POPS.',
    sprite: 2,
    accent: theme.colors.caramel,
  },
  {
    title: 'MAKE BONBONS',
    text: 'FOUR IN A ROW MAKES A SWIRL BONBON, FIVE MAKES A RAINBOW BONBON. TAP ONE TO SET IT OFF.',
    sprite: 3,
    accent: theme.colors.secondary,
  },
];

function StepArrow({ color }: { color: string }) {
  return (
    <Svg width={18} height={14}>
      <Path d="M1 7 H12 M8 2 L13 7 L8 12" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

export function TutorialScreen({ onPlay, onBack }: Props) {
  const { reducedMotion } = useSettings();

  return (
    <ScreenFrame
      title="HOW TO PLAY"
      subtitle="FOUR STEPS TO THE FIRST RECIPE"
      overlay={theme.gradients.library}
      reducedMotion={reducedMotion}
      onBack={onBack}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {STEPS.map((step, i) => (
          <SectionCard key={step.title} accent={step.accent} style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.plate, { backgroundColor: step.accent + '1F' }]}>
                <Image source={spriteFor(step.sprite)} style={styles.sprite} resizeMode="contain" />
              </View>
              <View style={styles.texts}>
                <View style={styles.titleRow}>
                  <Text style={[styles.stepIndex, { color: step.accent }]}>{`STEP ${i + 1}`}</Text>
                  <StepArrow color={step.accent} />
                  <Text numberOfLines={1} style={styles.title}>
                    {step.title}
                  </Text>
                </View>
                <Text style={styles.text}>{step.text}</Text>
              </View>
            </View>
          </SectionCard>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerHint}>ONE TAP SELECTS · ONE TAP SWAPS</Text>
        <PrimaryButton label="START PLAYING" Icon={Play} onPress={onPlay} height={56} />
        <SecondaryButton label="BACK" accent={theme.colors.secondary} onPress={onBack} />
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, marginTop: 8 },
  scrollContent: { gap: 10, paddingBottom: 12 },
  card: { paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  plate: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: { width: 40, height: 40 },
  texts: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepIndex: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  text: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  footer: { paddingBottom: 16, gap: 10 },
  footerHint: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
