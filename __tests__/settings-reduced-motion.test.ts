import { TIMING, motion } from '../src/constants/config';
import { progressStore } from '../src/game/progressStore';

describe('setting: reduced motion', () => {
  beforeEach(() => {
    progressStore.reset();
  });

  it('cuts every duration to 40 percent', () => {
    expect(motion(TIMING.cascade, false)).toBe(TIMING.cascade);
    expect(motion(TIMING.cascade, true)).toBe(Math.round(TIMING.cascade * 0.4));
    expect(motion(TIMING.celebrate, true)).toBe(Math.round(TIMING.celebrate * 0.4));
  });

  it('never shortens an animation to zero', () => {
    expect(motion(10, true)).toBeGreaterThanOrEqual(40);
  });

  it('is persisted through the one repository', () => {
    expect(progressStore.load().settings.reducedMotion).toBe(false);
    progressStore.saveSettings({ reducedMotion: true });
    expect(progressStore.load().settings.reducedMotion).toBe(true);
  });
});
