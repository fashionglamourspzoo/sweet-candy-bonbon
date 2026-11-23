import { COST_BONBON, COST_SUGAR_DROP, COST_SWAP } from '../src/constants/config';
import { evaluateRound } from '../src/game/rules';
import { Objective } from '../src/game/types';

describe('limited-move stages', () => {
  const objectives: Objective[] = [{ kind: 'collect', ing: 0, target: 10 }];

  it('prices every action', () => {
    expect(COST_SWAP).toBe(1);
    expect(COST_BONBON).toBe(1);
    expect(COST_SUGAR_DROP).toBe(2);
  });

  it('keeps playing while sugar is left and the objective is open', () => {
    expect(evaluateRound(objectives, [2, 0, 0, 0, 0], 0, 0, 5, null)).toBe('idle');
  });

  it('ends as outOfSugar when the budget is empty and the objective is unmet', () => {
    expect(evaluateRound(objectives, [2, 0, 0, 0, 0], 0, 0, 0, null)).toBe('outOfSugar');
  });

  it('prefers the win when the last move completes the objective', () => {
    expect(evaluateRound(objectives, [10, 0, 0, 0, 0], 0, 0, 0, null)).toBe('complete');
  });

  it('cannot end by itself while the player does nothing', () => {
    expect(evaluateRound(objectives, [0, 0, 0, 0, 0], 0, 0, 8, null)).toBe('idle');
  });
});
