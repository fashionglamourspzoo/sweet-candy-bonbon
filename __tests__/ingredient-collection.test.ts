import { MILESTONES } from '../src/constants/config';
import { milestoneFor, sumCollected } from '../src/game/rules';
import { applyStageResult, initialProgress } from '../src/game/progressStore';

describe('collectible ingredients', () => {
  it('banks what a stage collected into the pantry', () => {
    const start = initialProgress();
    const { progress } = applyStageResult(start, 0, 2, 1200, [4, 1, 0, 0, 2], null);
    expect(progress.collection).toEqual([4, 1, 0, 0, 2]);
    expect(sumCollected(progress.collection)).toBe(7);

    const { progress: again } = applyStageResult(progress, 0, 1, 900, [1, 0, 0, 0, 0], null);
    expect(again.collection[0]).toBe(5);
  });

  it('drives the 50 / 150 / 400 milestones', () => {
    expect(MILESTONES).toEqual([50, 150, 400]);
    expect(milestoneFor(0, MILESTONES).next).toBe(50);
    expect(milestoneFor(60, MILESTONES).next).toBe(150);
    expect(milestoneFor(5000, MILESTONES).progress).toBe(1);
  });
});
