import { initialProgress } from '../src/game/progressStore';
import { REWARDS } from '../src/game/stages';

const FORBIDDEN = ['bet', 'wager', 'deposit', 'withdraw', 'cash', 'money', 'coin', 'jackpot', 'spin', 'reel'];

describe('no casino, wagering or real money', () => {
  it('has no money-shaped field in the stored model', () => {
    const keys = Object.keys(initialProgress()).map(k => k.toLowerCase());
    FORBIDDEN.forEach(word => {
      expect(keys.some(key => key.includes(word))).toBe(false);
    });
  });

  it('uses only earned stars and collected ingredients as currency', () => {
    const progress = initialProgress();
    expect(progress.collection.every(v => v === 0)).toBe(true);
    expect(progress.starsSpent).toBe(0);
    expect(progress.dailyStars).toBe(0);
  });

  it('prices every decoration in stars, never in currency', () => {
    REWARDS.forEach(reward => {
      expect(typeof reward.cost).toBe('number');
      expect(reward.cost).toBeGreaterThan(0);
      FORBIDDEN.forEach(word => {
        expect(reward.name.toLowerCase().includes(word)).toBe(false);
      });
    });
  });
});
