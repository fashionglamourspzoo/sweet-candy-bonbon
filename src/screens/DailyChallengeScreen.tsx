import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Clock, Flame, Play, Star, Target } from 'lucide-react-native';
import { DAILY_TIMED_SECONDS } from '../constants/config';
import { theme } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenFrame } from '../components/ScreenFrame';
import { SecondaryButton } from '../components/SecondaryButton';
import { SectionCard } from '../components/SectionCard';
import { generateBoard } from '../game/board';
import { dailyStage, dailyStarReward, dayIndex, dayLabel, modifierForDay, streakDots } from '../game/daily';
import { makeSeed } from '../game/rng';
import { useProgress } from '../hooks/useProgress';
import { useSettings } from '../hooks/useSettings';

type Props = {
  onBack: () => void;
  onStartChallenge: (timed: boolean) => void;
};

const PREVIEW_TILE = 18;

export function DailyChallengeScreen({ onBack, onStartChallenge }: Props) {
  const progress = useProgress();
  const { reducedMotion } = useSettings();
  const [timed, setTimed] = useState(false);

  const today = useMemo(() => dayIndex(), []);
  const stage = useMemo(() => dailyStage(today), [today]);
  const modifier = useMemo(() => modifierForDay(today), [today]);
  const preview = useMemo(
    () =>
      generateBoard({
        seed: makeSeed(stage.index + today, 0),
        palette: stage.palette,
        syrupCells: stage.syrup,
        doubleSyrup: modifier.key === 'doubleSyrup',
      }).board,
    [modifier.key, stage.index, stage.palette, stage.syrup, today],
  );

  const playedToday = progress.dailyLastDay === today;
  const dots = useMemo(
    () => streakDots(progress.dailyLastDay, progress.dailyStreak, today),
    [progress.dailyLastDay, progress.dailyStreak, today],
  );

  const toggleTimed = useCallback(() => {
    setTimed(current => !current);
  }, []);

  const handleStart = useCallback(() => {
    onStartChallenge(timed);
  }, [onStartChallenge, timed]);

  const objective = stage.objectives[0];
  const objectiveLabel =
    objective && objective.kind === 'collect'
      ? `COLLECT ${objective.target} ${theme.ingredients[objective.ing].name}`
      : `CLEAR ${stage.syrup} SYRUP CELLS`;

  return (
    <ScreenFrame
      title="DAILY CHALLENGE"
      subtitle={dayLabel()}
      overlay={theme.gradients.library}
      reducedMotion={reducedMotion}
      onBack={onBack}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <SectionCard accent={modifier.accent}>
          <View style={styles.briefRow}>
            <View style={styles.preview}>
              {preview.cells.map((cell, i) => {
                if (!cell) {
                  return null;
                }
                const row = Math.floor(i / preview.cols);
                const col = i % preview.cols;
                return (
                  <View
                    key={cell.id}
                    style={[
                      styles.previewCell,
                      {
                        left: col * PREVIEW_TILE,
                        top: row * PREVIEW_TILE,
                        backgroundColor: theme.ingredients[cell.ing].color,
                        opacity: preview.syrup[i] > 0 ? 0.45 : 1,
                      },
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.briefTexts}>
              <Text style={styles.briefCaption}>MODIFIER OF THE DAY</Text>
              <Text numberOfLines={1} style={[styles.briefTitle, { color: modifier.accent }]}>
                {modifier.name}
              </Text>
              <Text style={styles.briefText}>{modifier.description}</Text>
            </View>
          </View>

          <View style={styles.factRow}>
            <View style={styles.fact}>
              <Target size={16} color={theme.colors.primary} strokeWidth={2.5} />
              <Text style={styles.factText}>{objectiveLabel}</Text>
            </View>
            <View style={styles.fact}>
              <Star size={16} color={theme.colors.gold} fill={theme.colors.gold} strokeWidth={2} />
              <Text style={styles.factText}>{`${dailyStarReward(timed)} STARS · ${stage.moves} MOVES`}</Text>
            </View>
          </View>
        </SectionCard>

        <Pressable
          accessibilityRole="switch"
          accessibilityLabel={`TIMED RUN ${DAILY_TIMED_SECONDS} S`}
          accessibilityState={{ checked: timed }}
          onPress={toggleTimed}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.timedPress}>
          <SectionCard accent={timed ? theme.colors.caramel : undefined} style={styles.timedCard}>
            <View style={styles.timedRow}>
              <View style={[styles.timedIcon, { backgroundColor: theme.colors.caramel + '1F' }]}>
                <Clock size={22} color={theme.colors.caramel} strokeWidth={2.5} />
              </View>
              <View style={styles.timedTexts}>
                <Text style={styles.timedTitle}>{`TIMED RUN · ${DAILY_TIMED_SECONDS} S`}</Text>
                <Text style={styles.timedSub}>
                  {timed ? 'ON — ONE BONUS STAR, CLOCK RUNS' : 'OFF — A NORMAL LIMITED-MOVE RUN'}
                </Text>
              </View>
              <View style={[styles.switchTrack, timed ? styles.switchOn : null]}>
                <View style={[styles.switchKnob, timed ? styles.switchKnobOn : null]} />
              </View>
            </View>
          </SectionCard>
        </Pressable>

        <SectionCard>
          <View style={styles.streakHead}>
            <Flame size={16} color={theme.colors.caramel} strokeWidth={2.5} />
            <Text style={styles.streakText}>{`STREAK ${progress.dailyStreak} DAYS`}</Text>
          </View>
          <View style={styles.dotRow}>
            {dots.map((filled, i) => (
              <View
                key={i}
                style={[styles.dot, filled ? { backgroundColor: theme.colors.gold } : null]}
              />
            ))}
          </View>
          {playedToday ? (
            <Text style={styles.playedText}>
              {`TODAY IS DONE · BEST ${progress.dailyBestScore} · COME BACK TOMORROW`}
            </Text>
          ) : null}
        </SectionCard>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerHint}>
          {playedToday ? 'REPLAYS ARE FOR FUN — STARS ARE PAID ONCE A DAY' : 'ONE SCORING RUN A DAY'}
        </Text>
        <PrimaryButton
          label={playedToday ? 'REPLAY FOR FUN' : 'START CHALLENGE'}
          Icon={Play}
          colors={theme.gradients.caramel}
          onPress={handleStart}
          height={60}
        />
        <SecondaryButton label="BACK" accent={theme.colors.secondary} onPress={onBack} />
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, marginTop: 8 },
  content: { gap: 10, paddingBottom: 12 },
  briefRow: { flexDirection: 'row', gap: 12 },
  preview: {
    width: PREVIEW_TILE * 7,
    height: PREVIEW_TILE * 7,
    borderRadius: 14,
    backgroundColor: theme.colors.bg.sunken,
    overflow: 'hidden',
  },
  previewCell: {
    position: 'absolute',
    width: PREVIEW_TILE - 3,
    height: PREVIEW_TILE - 3,
    margin: 1.5,
    borderRadius: 5,
  },
  briefTexts: { flex: 1 },
  briefCaption: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  briefTitle: {
    marginTop: 2,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  briefText: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  factRow: { marginTop: 12, gap: 6 },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  factText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  timedPress: { width: '100%' },
  timedCard: { paddingVertical: 12 },
  timedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timedIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timedTexts: { flex: 1 },
  timedTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.text.primary,
  },
  timedSub: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  switchTrack: {
    width: 54,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8D3E0',
    justifyContent: 'center',
  },
  switchOn: { backgroundColor: theme.colors.caramel },
  switchKnob: {
    width: 24,
    height: 24,
    marginLeft: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  switchKnobOn: { marginLeft: 27 },
  streakHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  dotRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  dot: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.bg.sunken,
  },
  playedText: {
    marginTop: 10,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
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
