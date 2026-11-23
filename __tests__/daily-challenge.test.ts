import { DAILY_MOVES, DAILY_TARGET, DAILY_TIMED_SECONDS } from '../src/constants/config';
import {
  DAILY_MODIFIERS,
  dailyStage,
  dailyStarReward,
  dailyTimerSeconds,
  modifierForDay,
  nextStreakValue,
} from '../src/game/daily';

describe('optional time challenge', () => {
  const stage = dailyStage(20000);

  it('is a normal limited-move run by default', () => {
    expect(stage.moves).toBe(DAILY_MOVES);
    expect(stage.objectives[0]).toMatchObject({ kind: 'collect', target: DAILY_TARGET });
    expect(dailyTimerSeconds(false)).toBeNull();
  });

  it('carries a clock of at least a minute when switched on, and pays a bonus star', () => {
    expect(dailyTimerSeconds(true)).toBe(DAILY_TIMED_SECONDS);
    expect(DAILY_TIMED_SECONDS).toBeGreaterThanOrEqual(60);
    expect(dailyStarReward(true)).toBe(dailyStarReward(false) + 1);
  });

  it('rotates one modifier of the day', () => {
    expect(DAILY_MODIFIERS).toHaveLength(3);
    expect(modifierForDay(0).key).toBe(DAILY_MODIFIERS[0].key);
    expect(modifierForDay(4).key).toBe(DAILY_MODIFIERS[1].key);
  });

  it('extends the streak only on consecutive days', () => {
    expect(nextStreakValue(99, 3, 100)).toBe(4);
    expect(nextStreakValue(90, 3, 100)).toBe(1);
    expect(nextStreakValue(100, 3, 100)).toBe(3);
  });
});
