/**
 * Sweet Candy Bonbon — Bonbon Atelier.
 *
 * Navigation is a state machine owned by this file: one Screen union, one
 * setState, no navigation library. Loader -> Menu -> Game -> Result -> Menu is
 * the floor; the hub adds Tutorial, Levels, Recipe Book, Collection, Rewards,
 * Daily Challenge and Settings, each reachable in one tap from the Menu.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { LOADER_DURATION_MS } from './src/constants/config';
import { theme } from './src/constants/theme';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { TutorialScreen } from './src/screens/TutorialScreen';
import { LevelsScreen } from './src/screens/LevelsScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { RecipeBookScreen } from './src/screens/RecipeBookScreen';
import { CollectionScreen, CollectionTab } from './src/screens/CollectionScreen';
import { DailyChallengeScreen } from './src/screens/DailyChallengeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import {
  Progress,
  applyStageResult,
  progressStore,
  totalStarsEarned,
} from './src/game/progressStore';
import {
  currentStageIndex,
  getStage,
  nextStageIndex,
} from './src/game/stages';
import {
  dailyStage,
  dailyStarReward,
  dailyTimerSeconds,
  dayIndex,
  modifierForDay,
  nextStreakValue,
} from './src/game/daily';
import { StageSummary } from './src/game/types';
import { useProgress } from './src/hooks/useProgress';

type Screen =
  | 'loader'
  | 'menu'
  | 'tutorial'
  | 'levels'
  | 'game'
  | 'result'
  | 'recipebook'
  | 'collection'
  | 'daily'
  | 'settings';

function App(): React.JSX.Element {
  const progress = useProgress();

  const [screen, setScreen] = useState<Screen>('loader');
  const [stageIndex, setStageIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [dailyMode, setDailyMode] = useState(false);
  const [timed, setTimed] = useState(false);
  const [summary, setSummary] = useState<StageSummary | null>(null);
  const [collectionTab, setCollectionTab] = useState<CollectionTab>('ingredients');

  const today = useMemo(() => dayIndex(), []);

  // The splash is held by a timer only: no tap-to-skip, no early exit.
  useEffect(() => {
    if (screen !== 'loader') {
      return undefined;
    }
    const handle = setTimeout(() => setScreen('menu'), LOADER_DURATION_MS);
    return () => clearTimeout(handle);
  }, [screen]);

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goLevels = useCallback(() => setScreen('levels'), []);
  const goDaily = useCallback(() => setScreen('daily'), []);
  const goRecipes = useCallback(() => setScreen('recipebook'), []);
  const goSettings = useCallback(() => setScreen('settings'), []);

  // System back returns to the previous place; on the Menu it closes the app.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'loader') {
        return true;
      }
      if (screen === 'menu') {
        return false;
      }
      setScreen('menu');
      return true;
    });
    return () => subscription.remove();
  }, [screen]);

  const startStage = useCallback((index: number, asDaily: boolean, timedRun: boolean) => {
    setStageIndex(index);
    setDailyMode(asDaily);
    setTimed(timedRun);
    setAttempt(a => a + 1);
    setScreen('game');
  }, []);

  const handlePlay = useCallback(() => {
    const next = currentStageIndex(progress.stageStars, totalStarsEarned(progress));
    startStage(next, false, false);
  }, [progress, startStage]);

  const handleSelectStage = useCallback(
    (index: number) => {
      startStage(index, false, false);
    },
    [startStage],
  );

  const handleStartChallenge = useCallback(
    (timedRun: boolean) => {
      startStage(0, true, timedRun);
    },
    [startStage],
  );

  const handleRestart = useCallback(() => {
    setAttempt(a => a + 1);
    setScreen('game');
  }, []);

  const handleTutorial = useCallback(() => {
    progressStore.save({ tutorialSeen: true });
    setScreen('tutorial');
  }, []);

  const handleCollection = useCallback(() => {
    setCollectionTab('ingredients');
    setScreen('collection');
  }, []);

  const handleRewards = useCallback(() => {
    setCollectionTab('rewards');
    setScreen('collection');
  }, []);

  /** Banks the round through the one repository, then shows the result screen. */
  const handleGameOver = useCallback(
    (raw: StageSummary) => {
      const current = progressStore.load();
      let finished = raw;

      if (raw.daily) {
        const collection = current.collection.map((v, i) => v + (raw.collected[i] ?? 0));
        const patch: Partial<Progress> = {
          collection,
          bestScore: Math.max(current.bestScore, raw.score),
        };
        if (raw.won && current.dailyLastDay !== today) {
          patch.dailyLastDay = today;
          patch.dailyStreak = nextStreakValue(current.dailyLastDay, current.dailyStreak, today);
          patch.dailyStars = current.dailyStars + dailyStarReward(timed);
          patch.dailyBestScore = Math.max(current.dailyBestScore, raw.score);
        }
        progressStore.save(patch);
        finished = { ...raw, nextStageIndex: null };
      } else {
        const applied = applyStageResult(
          current,
          raw.stageIndex,
          raw.stars,
          raw.score,
          raw.collected,
          raw.recipeUnlocked,
        );
        progressStore.save(applied.progress);
        const unlockedNext = raw.won
          ? nextStageIndex(
              raw.stageIndex,
              applied.progress.stageStars,
              totalStarsEarned(applied.progress),
            )
          : null;
        finished = {
          ...raw,
          recipeUnlocked: applied.recipeUnlocked,
          nextStageIndex: unlockedNext,
        };
      }

      setSummary(finished);
      setScreen('result');
    },
    [timed, today],
  );

  const handlePlayAgain = useCallback(() => {
    if (!summary) {
      goMenu();
      return;
    }
    startStage(summary.stageIndex, summary.daily, timed);
  }, [goMenu, startStage, summary, timed]);

  const handleNextStage = useCallback(() => {
    if (!summary || summary.nextStageIndex === null) {
      goMenu();
      return;
    }
    startStage(summary.nextStageIndex, false, false);
  }, [goMenu, startStage, summary]);

  const stage = useMemo(
    () => (dailyMode ? dailyStage(today) : getStage(stageIndex)),
    [dailyMode, stageIndex, today],
  );
  const modifier = useMemo(() => modifierForDay(today), [today]);

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          onPlay={handlePlay}
          onLevels={goLevels}
          onDaily={goDaily}
          onRecipes={goRecipes}
          onCollection={handleCollection}
          onRewards={handleRewards}
          onTutorial={handleTutorial}
          onSettings={goSettings}
          dailyAvailable={progress.dailyLastDay !== today}
        />
      ) : null}

      {screen === 'tutorial' ? (
        <TutorialScreen onPlay={handlePlay} onBack={goMenu} />
      ) : null}

      {screen === 'levels' ? (
        <LevelsScreen onBack={goMenu} onSelectStage={handleSelectStage} />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={`${dailyMode ? 'daily' : 'stage'}-${stage.index}-${attempt}`}
          stage={stage}
          attempt={attempt}
          daily={dailyMode}
          timedSeconds={dailyMode ? dailyTimerSeconds(timed) : null}
          caramelRush={dailyMode && modifier.key === 'caramelRush'}
          doubleSyrup={dailyMode && modifier.key === 'doubleSyrup'}
          nextStage={stage.index + 1}
          onMenu={goMenu}
          onRestart={handleRestart}
          onGameOver={handleGameOver}
        />
      ) : null}

      {screen === 'result' && summary ? (
        <ResultScreen
          summary={summary}
          onPlayAgain={handlePlayAgain}
          onNextStage={handleNextStage}
          onMenu={goMenu}
          onLevels={goLevels}
          onRecipes={goRecipes}
        />
      ) : null}

      {screen === 'recipebook' ? <RecipeBookScreen onBack={goMenu} /> : null}

      {screen === 'collection' ? (
        <CollectionScreen initialTab={collectionTab} onBack={goMenu} />
      ) : null}

      {screen === 'daily' ? (
        <DailyChallengeScreen onBack={goMenu} onStartChallenge={handleStartChallenge} />
      ) : null}

      {screen === 'settings' ? <SettingsScreen onBack={goMenu} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});

export default App;
