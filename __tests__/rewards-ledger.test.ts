import { REWARDS } from '../src/game/stages';
import { applyStageResult, availableStars, claimReward, initialProgress } from '../src/game/progressStore';

describe('virtual stars and decorative rewards', () => {
  function withStars(count: number) {
    let progress = initialProgress();
    for (let i = 0; i < count; i++) {
      progress = applyStageResult(progress, i, 1, 10, [0, 0, 0, 0, 0], null).progress;
    }
    return progress;
  }

  it('refuses a decoration the player cannot afford', () => {
    const progress = withStars(2);
    expect(availableStars(progress)).toBe(2);
    expect(claimReward(progress, 0, REWARDS[0].cost)).toBeNull();
  });

  it('spends the stars and marks the decoration built', () => {
    const progress = withStars(6);
    const next = claimReward(progress, 0, REWARDS[0].cost);
    expect(next).not.toBeNull();
    expect(next!.rewards[0]).toBe(true);
    expect(availableStars(next!)).toBe(6 - REWARDS[0].cost);
  });

  it('never claims the same decoration twice', () => {
    const progress = withStars(8);
    const once = claimReward(progress, 0, REWARDS[0].cost)!;
    expect(claimReward(once, 0, REWARDS[0].cost)).toBeNull();
  });
});
