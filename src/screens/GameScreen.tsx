import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Droplet, Lightbulb, RotateCcw } from 'lucide-react-native';
import { assets } from '../assets';
import { BOARD_W, COST_SUGAR_DROP, TIMING, motion } from '../constants/config';
import { theme } from '../constants/theme';
import { CandyBoard } from '../components/CandyBoard';
import { ComboLabel } from '../components/ComboLabel';
import { ConfettiBurst } from '../components/ConfettiBurst';
import { MovesCounter } from '../components/MovesCounter';
import { ObjectiveChip } from '../components/ObjectiveChip';
import { PauseOverlay } from '../components/PauseOverlay';
import { PrimaryButton } from '../components/PrimaryButton';
import { RoundPlateButton } from '../components/ScreenHeader';
import { ScreenFrame } from '../components/ScreenFrame';
import { SecondaryButton } from '../components/SecondaryButton';
import { StreakBadge } from '../components/StreakBadge';
import { objectiveState, starsFor, sumCollected } from '../game/rules';
import { StageDef, StageSummary } from '../game/types';
import { usePuzzle } from '../hooks/usePuzzle';
import { useSettings } from '../hooks/useSettings';
import { groupNumber } from '../utils/format';

type Props = {
  stage: StageDef;
  attempt: number;
  daily: boolean;
  timedSeconds: number | null;
  caramelRush?: boolean;
  doubleSyrup?: boolean;
  nextStage: number | null;
  onMenu: () => void;
  onRestart: () => void;
  onGameOver: (summary: StageSummary) => void;
};

export function GameScreen({
  stage,
  attempt,
  daily,
  timedSeconds,
  caramelRush,
  doubleSyrup,
  nextStage,
  onMenu,
  onRestart,
  onGameOver,
}: Props) {
  const { reducedMotion, hintHelper, colourblind } = useSettings();
  const [paused, setPaused] = useState(false);
  const [showControlHint, setShowControlHint] = useState(true);

  const { state, onTilePress, sugarDropAction, showHint } = usePuzzle({
    stage,
    attempt,
    timedSeconds,
    reducedMotion,
    hintHelper,
    caramelRush,
    doubleSyrup,
    paused,
  });

  const endedRef = useRef(false);
  const shake = useRef(new Animated.Value(0)).current;

  const objectives = useMemo(
    () =>
      stage.objectives.map(objective =>
        objectiveState(objective, state.collected, state.syrupCleared, state.score),
      ),
    [stage.objectives, state.collected, state.score, state.syrupCleared],
  );

  useEffect(() => {
    endedRef.current = false;
    setPaused(false);
    setShowControlHint(true);
    const handle = setTimeout(() => setShowControlHint(false), TIMING.controlHintFor);
    return () => clearTimeout(handle);
  }, [stage.index, attempt]);

  // Round end: a short celebration / wilt, then the result screen.
  useEffect(() => {
    if (state.status !== 'complete' && state.status !== 'outOfSugar') {
      return undefined;
    }
    if (endedRef.current) {
      return undefined;
    }
    endedRef.current = true;

    const won = state.status === 'complete';
    if (!won && !reducedMotion) {
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 70, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 70, useNativeDriver: true }),
      ]).start();
    }

    const stars = starsFor(won, state.score, stage.par);
    const summary: StageSummary = {
      stageIndex: stage.index,
      daily,
      won,
      score: state.score,
      par: stage.par,
      movesLeft: state.moves,
      movesTotal: stage.moves,
      stars,
      collected: state.collected,
      ingredientsTotal: sumCollected(state.collected),
      syrupCleared: state.syrupCleared,
      bestCombo: state.bestCombo,
      recipeUnlocked: won ? stage.recipe : null,
      nextStageIndex: won ? nextStage : null,
    };

    const handle = setTimeout(() => {
      onGameOver(summary);
    }, motion(TIMING.celebrate, reducedMotion));
    return () => clearTimeout(handle);
  }, [
    daily,
    nextStage,
    onGameOver,
    reducedMotion,
    shake,
    stage.index,
    stage.moves,
    stage.par,
    stage.recipe,
    state.bestCombo,
    state.collected,
    state.moves,
    state.score,
    state.status,
    state.syrupCleared,
  ]);

  const togglePause = useCallback(() => {
    setPaused(current => !current);
  }, []);
  const resume = useCallback(() => setPaused(false), []);

  const dropDisabled = state.moves < COST_SUGAR_DROP || state.status !== 'idle';
  const hintDisabled = state.hintsLeft <= 0 || state.status !== 'idle';
  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] });

  return (
    <ScreenFrame
      title={stage.title}
      subtitle={`SCORE ${groupNumber(state.score)}`}
      overlay={theme.gradients.game}
      reducedMotion={reducedMotion}
      contentStyle={styles.frame}
      leftSlot={<RoundPlateButton icon={assets.iconHome} label="MENU" onPress={onMenu} />}
      rightSlot={
        <RoundPlateButton icon={assets.iconPause} label="PAUSE" onPress={togglePause} />
      }>
      <Animated.View pointerEvents="box-none" style={[styles.strip, { transform: [{ translateX: shakeX }] }]}>
        {objectives.map((item, i) => (
          <ObjectiveChip
            key={i}
            objective={item.objective}
            current={item.current}
            target={item.target}
            done={item.done}
          />
        ))}
        <MovesCounter
          moves={state.moves}
          low={state.moves <= 3}
          reducedMotion={reducedMotion}
          timeLeft={state.timeLeft}
        />
      </Animated.View>

      <View style={styles.streakRow}>
        <StreakBadge multiplier={state.streak} />
      </View>

      <View style={styles.boardArea}>
        <CandyBoard
          board={state.board}
          selected={state.selected}
          hint={state.hint}
          glyphMode={colourblind}
          reducedMotion={reducedMotion}
          dimmed={state.status === 'outOfSugar'}
          onTilePress={onTilePress}
        />
        <ComboLabel depth={state.combo} reducedMotion={reducedMotion} />
        <ConfettiBurst
          active={state.status === 'complete'}
          size={BOARD_W}
          reducedMotion={reducedMotion}
        />
      </View>

      <View style={styles.controls}>
        {showControlHint || state.status === 'idle' ? (
          <Text style={styles.controlHint}>TAP A CANDY, THEN TAP A NEIGHBOUR TO SWAP</Text>
        ) : null}

        <PrimaryButton
          label="SUGAR DROP"
          Icon={Droplet}
          onPress={sugarDropAction}
          disabled={dropDisabled}
          height={60}
        />

        <View style={styles.secondaryRow}>
          {hintHelper ? (
            <View style={styles.secondarySlot}>
              <SecondaryButton
                label={`HINT ${state.hintsLeft}`}
                Icon={Lightbulb}
                accent={theme.colors.gold}
                onPress={showHint}
                disabled={hintDisabled}
              />
            </View>
          ) : null}
          <View style={styles.secondarySlot}>
            <SecondaryButton
              label="RESTART"
              Icon={RotateCcw}
              accent={theme.colors.secondary}
              onPress={onRestart}
            />
          </View>
        </View>
      </View>

      <PauseOverlay
        visible={paused}
        stageTitle={stage.title}
        onResume={resume}
        onRestart={onRestart}
        onMenu={onMenu}
      />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  frame: { paddingHorizontal: 12 },
  strip: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  streakRow: { height: 30, alignItems: 'center', justifyContent: 'center' },
  boardArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  controls: {
    width: '100%',
    backgroundColor: theme.colors.bg.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 10,
    marginHorizontal: -12,
    shadowColor: '#E0A7C6',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 10,
  },
  controlHint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  secondarySlot: { flex: 1 },
});
