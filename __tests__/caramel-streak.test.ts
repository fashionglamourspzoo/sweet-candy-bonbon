import { STREAK_LADDER } from '../src/constants/config';
import { RUSH_LADDER, nextStreak, resetStreak, scoreForClear } from '../src/game/rules';

describe('caramel streak multiplier', () => {
  it('climbs 1 -> 1.2 -> 1.5 -> 2 and stops there', () => {
    expect(STREAK_LADDER).toEqual([1, 1.2, 1.5, 2]);
    let streak = 1;
    streak = nextStreak(streak);
    expect(streak).toBe(1.2);
    streak = nextStreak(streak);
    expect(streak).toBe(1.5);
    streak = nextStreak(streak);
    expect(streak).toBe(2);
    expect(nextStreak(streak)).toBe(2);
  });

  it('climbs to x3 under the Caramel Rush modifier', () => {
    expect(nextStreak(2, RUSH_LADDER)).toBe(2.5);
    expect(nextStreak(3, RUSH_LADDER)).toBe(3);
  });

  it('drops back to x1 when the run is interrupted', () => {
    expect(resetStreak()).toBe(1);
  });

  it('scales the score with the streak', () => {
    expect(scoreForClear(4, 1, 1)).toBe(40);
    expect(scoreForClear(4, 1, 1.5)).toBe(60);
  });
});
