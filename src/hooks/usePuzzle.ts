import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  COST_BONBON,
  COST_SUGAR_DROP,
  COST_SWAP,
  MAX_HINTS,
  STREAK_LADDER,
  TIMING,
  motion,
} from '../constants/config';
import { generateBoard } from '../game/board';
import {
  areAdjacent,
  clearPositions,
  countSyrup,
  detonationPositions,
  findHint,
  findMatches,
  hasValidSwap,
  resolveStep,
  sugarDrop,
  swapCells,
} from '../game/matcher';
import { makeSeed, mulberry32, Rng } from '../game/rng';
import {
  RUSH_LADDER,
  RoundStatus,
  evaluateRound,
  nextStreak,
  resetStreak,
  scoreForClear,
} from '../game/rules';
import { Board, StageDef } from '../game/types';


export type PuzzleState = {
  board: Board;
  selected: number | null;
  status: RoundStatus;
  moves: number;
  score: number;
  streak: number;
  collected: number[];
  syrupCleared: number;
  syrupTotal: number;
  combo: number;
  bestCombo: number;
  popped: number[];
  bounce: [number, number] | null;
  hint: [number, number] | null;
  hintsLeft: number;
  timeLeft: number | null;
};

export type PuzzleOptions = {
  stage: StageDef;
  attempt: number;
  timedSeconds: number | null;
  reducedMotion: boolean;
  hintHelper: boolean;
  caramelRush?: boolean;
  paused?: boolean;
  doubleSyrup?: boolean;
};

function buildBoard(stage: StageDef, attempt: number, doubleSyrup: boolean) {
  return generateBoard({
    seed: makeSeed(stage.index, attempt),
    palette: stage.palette,
    syrupCells: stage.syrup,
    doubleSyrup,
  });
}

function initState(options: PuzzleOptions): PuzzleState {
  const generated = buildBoard(options.stage, options.attempt, options.doubleSyrup === true);
  return {
    board: generated.board,
    selected: null,
    status: 'idle',
    moves: options.stage.moves,
    score: 0,
    streak: STREAK_LADDER[0],
    collected: [0, 0, 0, 0, 0],
    syrupCleared: 0,
    syrupTotal: countSyrup(generated.board),
    combo: 0,
    bestCombo: 1,
    popped: [],
    bounce: null,
    hint: null,
    hintsLeft: MAX_HINTS,
    timeLeft: options.timedSeconds,
  };
}

const addArrays = (a: number[], b: number[]): number[] => a.map((v, i) => v + (b[i] ?? 0));
const sum = (a: number[]): number => a.reduce((x, y) => x + y, 0);

/**
 * The board state machine. Animation callbacks read the live value from
 * stateRef (never a stale closure) and the busy flag is always cleared in the
 * final callback of a chain.
 */
export function usePuzzle(options: PuzzleOptions) {
  const { stage, attempt, reducedMotion, hintHelper, caramelRush, doubleSyrup, timedSeconds, paused } = options;

  const [state, setState] = useState<PuzzleState>(() => initState(options));
  const stateRef = useRef<PuzzleState>(state);
  const busyRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rngRef = useRef<Rng>(mulberry32((makeSeed(stage.index, attempt) ^ 0x9e3779b9) >>> 0));

  const ladder = useMemo(
    () => (caramelRush === true ? RUSH_LADDER : STREAK_LADDER),
    [caramelRush],
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    const handle = setTimeout(() => {
      timersRef.current = timersRef.current.filter(t => t !== handle);
      fn();
    }, ms);
    timersRef.current.push(handle);
  }, []);

  const commit = useCallback((next: PuzzleState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  // Fresh board whenever the stage or the attempt changes. The loop never
  // outlives the screen: every timer is cancelled on unmount.
  useEffect(() => {
    clearTimers();
    busyRef.current = false;
    rngRef.current = mulberry32((makeSeed(stage.index, attempt) ^ 0x9e3779b9) >>> 0);
    commit(initState({ stage, attempt, timedSeconds, reducedMotion, hintHelper, caramelRush, doubleSyrup }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.index, attempt]);

  useEffect(() => clearTimers, [clearTimers]);

  const finish = useCallback(
    (moves: number, streak: number) => {
      const s = stateRef.current;
      let board = s.board;
      // Never leave the player on a dead board: refresh it with a free dispenser row.
      if (!hasValidSwap(board) && moves > 0) {
        board = sugarDrop(board, rngRef.current, stage.palette);
      }
      const status = evaluateRound(
        stage.objectives,
        s.collected,
        s.syrupCleared,
        s.score,
        moves,
        s.timeLeft,
      );
      commit({
        ...s,
        board,
        moves,
        streak,
        status,
        combo: 0,
        popped: [],
        bounce: null,
        selected: null,
      });
      busyRef.current = false;
    },
    [commit, stage.objectives, stage.palette],
  );

  const runCascade = useCallback(
    (board: Board, moves: number, streak: number, depth: number) => {
      const step = resolveStep(board, rngRef.current, stage.palette);
      if (!step) {
        finish(moves, streak);
        return;
      }
      const s = stateRef.current;
      const cleared = sum(step.cleared);
      commit({
        ...s,
        board: step.board,
        collected: addArrays(s.collected, step.cleared),
        syrupCleared: s.syrupCleared + step.syrupCleared,
        score: s.score + scoreForClear(cleared, depth, streak),
        moves,
        streak,
        status: 'resolving',
        combo: depth,
        bestCombo: Math.max(s.bestCombo, depth),
        popped: step.popped,
        bounce: null,
        selected: null,
        hint: null,
      });
      later(motion(TIMING.cascade, reducedMotion), () => {
        runCascade(step.board, moves, streak, depth + 1);
      });
    },
    [commit, finish, later, reducedMotion, stage.palette],
  );

  const detonate = useCallback(
    (index: number) => {
      const s = stateRef.current;
      const positions = detonationPositions(s.board, index);
      if (positions.length === 0) {
        return;
      }
      busyRef.current = true;
      const step = clearPositions(s.board, positions, rngRef.current, stage.palette, []);
      const moves = Math.max(0, s.moves - COST_BONBON);
      const streak = nextStreak(s.streak, ladder);
      commit({
        ...s,
        board: step.board,
        collected: addArrays(s.collected, step.cleared),
        syrupCleared: s.syrupCleared + step.syrupCleared,
        score: s.score + scoreForClear(sum(step.cleared), 1, streak),
        moves,
        streak,
        status: 'resolving',
        combo: 1,
        popped: step.popped,
        selected: null,
        hint: null,
      });
      later(motion(TIMING.cascade, reducedMotion), () => {
        runCascade(step.board, moves, streak, 2);
      });
    },
    [commit, ladder, later, reducedMotion, runCascade, stage.palette],
  );

  const onTilePress = useCallback(
    (index: number) => {
      const s = stateRef.current;
      if (busyRef.current || s.status !== 'idle') {
        return;
      }
      const cell = s.board.cells[index];
      if (!cell) {
        return;
      }
      if (cell.special !== 'none' && s.selected === null) {
        detonate(index);
        return;
      }
      if (s.selected === null) {
        commit({ ...s, selected: index, hint: null });
        return;
      }
      if (s.selected === index) {
        commit({ ...s, selected: null });
        return;
      }
      if (!areAdjacent(s.board, s.selected, index)) {
        commit({ ...s, selected: index });
        return;
      }

      const from = s.selected;
      const swapped = swapCells(s.board, from, index);

      if (findMatches(swapped).length === 0) {
        // A swap that matches nothing bounces back and costs no sugar.
        busyRef.current = true;
        const original = s.board;
        commit({ ...s, board: swapped, selected: null, status: 'resolving', bounce: [from, index] });
        later(motion(TIMING.bounce, reducedMotion), () => {
          commit({ ...stateRef.current, board: original, bounce: null, status: 'idle' });
          busyRef.current = false;
        });
        return;
      }

      busyRef.current = true;
      const moves = Math.max(0, s.moves - COST_SWAP);
      const streak = nextStreak(s.streak, ladder);
      commit({ ...s, board: swapped, selected: null, status: 'resolving', hint: null });
      later(motion(TIMING.swap, reducedMotion), () => {
        runCascade(swapped, moves, streak, 1);
      });
    },
    [commit, detonate, ladder, later, reducedMotion, runCascade],
  );

  const sugarDropAction = useCallback(() => {
    const s = stateRef.current;
    if (busyRef.current || s.status !== 'idle' || s.moves < COST_SUGAR_DROP) {
      return;
    }
    busyRef.current = true;
    const board = sugarDrop(s.board, rngRef.current, stage.palette);
    const moves = Math.max(0, s.moves - COST_SUGAR_DROP);
    const streak = resetStreak();
    commit({ ...s, board, moves, streak, selected: null, status: 'resolving', hint: null, popped: [] });
    later(motion(TIMING.swap, reducedMotion), () => {
      runCascade(board, moves, streak, 1);
    });
  }, [commit, later, reducedMotion, runCascade, stage.palette]);

  const showHint = useCallback(() => {
    const s = stateRef.current;
    if (busyRef.current || s.status !== 'idle' || s.hintsLeft <= 0) {
      return;
    }
    const hint = findHint(s.board);
    if (!hint) {
      return;
    }
    commit({ ...s, hint, hintsLeft: s.hintsLeft - 1 });
    later(motion(TIMING.hintPulse, reducedMotion), () => {
      commit({ ...stateRef.current, hint: null });
    });
  }, [commit, later, reducedMotion]);

  // Idle helper: after five quiet seconds the board shows a legal swap for free.
  useEffect(() => {
    if (!hintHelper || state.status !== 'idle' || state.hint) {
      return undefined;
    }
    const handle = setTimeout(() => {
      const s = stateRef.current;
      if (s.status !== 'idle' || busyRef.current) {
        return;
      }
      const hint = findHint(s.board);
      if (hint) {
        commit({ ...s, hint });
      }
    }, TIMING.idleHintAfter);
    return () => clearTimeout(handle);
  }, [commit, hintHelper, state.board, state.hint, state.status]);

  // Optional timed run (Daily Challenge). 90 s by design, never under a minute.
  useEffect(() => {
    if (timedSeconds === null) {
      return undefined;
    }
    if (paused === true || state.status === 'complete' || state.status === 'outOfSugar') {
      return undefined;
    }
    const handle = setInterval(() => {
      const s = stateRef.current;
      if (s.timeLeft === null) {
        return;
      }
      const left = Math.max(0, s.timeLeft - 1);
      if (left === 0) {
        commit({ ...s, timeLeft: 0, status: 'outOfSugar', selected: null });
      } else {
        commit({ ...s, timeLeft: left });
      }
    }, 1000);
    return () => clearInterval(handle);
  }, [commit, paused, state.status, timedSeconds]);

  return { state, onTilePress, sugarDropAction, showHint };
}
