import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { BookOpen, Home, Map, Play, Sparkles } from 'lucide-react-native';
import { spriteFor } from '../assets';
import { theme } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { SecondaryButton } from '../components/SecondaryButton';
import { SectionCard } from '../components/SectionCard';
import { StarRow } from '../components/StarRow';
import { StatCard } from '../components/StatCard';
import { RECIPES } from '../game/stages';
import { StageSummary } from '../game/types';
import { useSettings } from '../hooks/useSettings';

type Props = {
  summary: StageSummary;
  onPlayAgain: () => void;
  onNextStage: () => void;
  onMenu: () => void;
  onLevels: () => void;
  onRecipes: () => void;
};

export function ResultScreen({
  summary,
  onPlayAgain,
  onNextStage,
  onMenu,
  onLevels,
  onRecipes,
}: Props) {
  const { reducedMotion } = useSettings();
  const won = summary.won;
  const recipe = summary.recipeUnlocked !== null ? RECIPES[summary.recipeUnlocked] : null;

  return (
    <ScreenFrame
      title={summary.daily ? 'DAILY RESULT' : 'STAGE RESULT'}
      subtitle={won ? 'THE ATELIER SMELLS OF SUGAR' : 'THE SUGAR JAR RAN DRY'}
      overlay={won ? theme.gradients.win : theme.gradients.lose}
      reducedMotion={reducedMotion}
      onBack={onMenu}>
      <View style={styles.body}>
        <View style={styles.outcomeRow}>
          <View style={styles.outcomeTexts}>
            <Text style={styles.outcome}>{won ? 'RECIPE COMPLETE!' : 'OUT OF SUGAR!'}</Text>
          </View>
          <Image source={spriteFor(won ? 3 : 4)} style={styles.character} resizeMode="contain" />
        </View>

        <StarRow earned={summary.stars} total={3} size={34} animate reducedMotion={reducedMotion} />

        <View style={styles.statRow}>
          <View style={styles.statSlot}>
            <StatCard value={summary.score} label="SCORE" accent={theme.colors.primary} />
          </View>
          <View style={styles.statSlot}>
            <StatCard value={summary.movesLeft} label="MOVES LEFT" accent={theme.colors.gold} />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={summary.ingredientsTotal}
              label="INGREDIENTS"
              accent={theme.colors.mint}
            />
          </View>
        </View>

        {recipe ? (
          <SectionCard accent={theme.colors.secondary} style={styles.banner}>
            <View style={styles.bannerRow}>
              <View style={styles.bannerIcon}>
                <BookOpen size={22} color={theme.colors.secondary} strokeWidth={2.5} />
              </View>
              <View style={styles.bannerTexts}>
                <Text style={styles.bannerCaption}>NEW RECIPE LEARNED</Text>
                <Text numberOfLines={1} style={styles.bannerName}>
                  {recipe.name}
                </Text>
              </View>
            </View>
          </SectionCard>
        ) : null}

        {!won ? (
          <View style={styles.tipRow}>
            <Sparkles size={16} color={theme.colors.caramel} strokeWidth={2.5} />
            <Text style={styles.tip}>A SWAP THAT MATCHES NOTHING COSTS NO SUGAR — AIM FIRST</Text>
          </View>
        ) : null}

        <View style={styles.spacer} />

        <View style={styles.actions}>
          <PrimaryButton label="PLAY AGAIN" Icon={Play} onPress={onPlayAgain} height={60} backplate />

          {won && summary.nextStageIndex !== null ? (
            <PrimaryButton
              label="NEXT STAGE"
              Icon={Sparkles}
              colors={theme.gradients.grape}
              onPress={onNextStage}
              height={56}
            />
          ) : null}

          <View style={styles.secondaryRow}>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="MENU" Icon={Home} accent={theme.colors.primary} onPress={onMenu} />
            </View>
            <View style={styles.secondarySlot}>
              <SecondaryButton label="LEVELS" Icon={Map} accent={theme.colors.secondary} onPress={onLevels} />
            </View>
          </View>

          <SecondaryButton
            label="RECIPE BOOK"
            Icon={BookOpen}
            accent={theme.colors.secondary}
            onPress={onRecipes}
          />
        </View>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingTop: 10, paddingBottom: 16, gap: 14 },
  outcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  outcomeTexts: { flex: 1 },
  outcome: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  character: { width: 84, height: 84 },
  statRow: { flexDirection: 'row', gap: 10 },
  statSlot: { flex: 1 },
  banner: { paddingVertical: 12 },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.secondary + '1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTexts: { flex: 1 },
  bannerCaption: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  bannerName: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  tip: {
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.secondary,
  },
  spacer: { flex: 1 },
  actions: { gap: 10 },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  secondarySlot: { flex: 1 },
});
