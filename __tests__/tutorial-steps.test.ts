import { progressStore } from '../src/game/progressStore';
import { currentStageIndex } from '../src/game/stages';

describe('tutorial screen', () => {
  beforeEach(() => {
    progressStore.reset();
  });

  it('starts with the first-run flag down', () => {
    expect(progressStore.load().tutorialSeen).toBe(false);
  });

  it('remembers that the player stepped through it', () => {
    progressStore.save({ tutorialSeen: true });
    expect(progressStore.load().tutorialSeen).toBe(true);
  });

  it('sends the player into the next unlocked stage', () => {
    const progress = progressStore.load();
    expect(currentStageIndex(progress.stageStars, 0)).toBe(0);

    const stars = progress.stageStars.slice();
    stars[0] = 3;
    expect(currentStageIndex(stars, 3)).toBe(1);
  });
});
