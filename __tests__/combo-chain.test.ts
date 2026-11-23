import { COMBO_CAP } from '../src/constants/config';
import { comboMultiplier, scoreForClear } from '../src/game/rules';

describe('combo chains', () => {
  it('multiplies by the cascade depth and caps at three', () => {
    expect(comboMultiplier(1)).toBe(1);
    expect(comboMultiplier(2)).toBe(1.5);
    expect(comboMultiplier(3)).toBe(2);
    expect(comboMultiplier(9)).toBe(COMBO_CAP);
  });

  it('feeds the multiplier straight into the score', () => {
    expect(scoreForClear(3, 1, 1)).toBe(30);
    expect(scoreForClear(3, 2, 1)).toBe(45);
    expect(scoreForClear(3, 2, 2)).toBe(90);
  });
});
