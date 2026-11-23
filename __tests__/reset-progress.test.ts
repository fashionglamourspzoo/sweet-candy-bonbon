import { applyStageResult, initialProgress, progressStore } from '../src/game/progressStore';

describe('setting: reset progress', () => {
  it('returns every stored value to its initial state', () => {
    progressStore.reset();
    const played = applyStageResult(
      progressStore.load(),
      0,
      3,
      9000,
      [12, 4, 0, 1, 7],
      0,
    ).progress;
    progressStore.save(played);
    progressStore.saveSettings({ colourblind: true, reducedMotion: true });
    progressStore.save({ dailyStreak: 5, dailyStars: 4, tutorialSeen: true });

    expect(progressStore.load().stageStars[0]).toBe(3);

    const fresh = progressStore.reset();
    expect(fresh).toEqual(initialProgress());
    expect(fresh.settings.colourblind).toBe(false);
    expect(fresh.settings.hintHelper).toBe(true);
    expect(fresh.stageStars.every(s => s === 0)).toBe(true);
    expect(fresh.collection.every(c => c === 0)).toBe(true);
    expect(fresh.dailyStreak).toBe(0);
    expect(fresh.tutorialSeen).toBe(false);
  });
});
