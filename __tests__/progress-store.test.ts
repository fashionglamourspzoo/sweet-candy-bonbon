import {
  applyStageResult,
  availableStars,
  initialProgress,
  progressStore,
  stagesCleared,
  totalStarsEarned,
} from '../src/game/progressStore';

describe('local-only persistence', () => {
  beforeEach(() => {
    progressStore.reset();
  });

  it('reads back everything written through the repository', () => {
    progressStore.save({ bestScore: 4820 });
    expect(progressStore.load().bestScore).toBe(4820);
  });

  it('keeps the best star count for a stage instead of the latest', () => {
    const three = applyStageResult(initialProgress(), 2, 3, 5000, [0, 0, 0, 0, 0], null).progress;
    const one = applyStageResult(three, 2, 1, 900, [0, 0, 0, 0, 0], null).progress;
    expect(one.stageStars[2]).toBe(3);
    expect(totalStarsEarned(one)).toBe(3);
    expect(stagesCleared(one)).toBe(1);
  });

  it('notifies every subscriber on a write', () => {
    const seen: number[] = [];
    const unsubscribe = progressStore.subscribe(value => seen.push(value.bestScore));
    progressStore.save({ bestScore: 10 });
    progressStore.save({ bestScore: 20 });
    unsubscribe();
    progressStore.save({ bestScore: 30 });
    expect(seen).toEqual([10, 20]);
  });

  it('separates stars earned from stars spent', () => {
    const earned = applyStageResult(initialProgress(), 0, 3, 100, [0, 0, 0, 0, 0], null).progress;
    const spent = { ...earned, starsSpent: 2 };
    expect(availableStars(spent)).toBe(1);
  });
});
