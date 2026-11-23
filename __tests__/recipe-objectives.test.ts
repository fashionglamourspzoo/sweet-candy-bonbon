import { allObjectivesDone, objectiveState } from '../src/game/rules';
import { Objective } from '../src/game/types';

describe('complete recipe patterns', () => {
  const objectives: Objective[] = [
    { kind: 'collect', ing: 1, target: 10 },
    { kind: 'syrup', target: 4 },
  ];

  it('reports progress per objective and caps it at the target', () => {
    const state = objectiveState(objectives[0], [0, 14, 0, 0, 0], 0, 0);
    expect(state.current).toBe(10);
    expect(state.done).toBe(true);
  });

  it('is only complete when every objective is met', () => {
    expect(allObjectivesDone(objectives, [0, 10, 0, 0, 0], 3, 0)).toBe(false);
    expect(allObjectivesDone(objectives, [0, 10, 0, 0, 0], 4, 0)).toBe(true);
  });

  it('never completes an empty objective list', () => {
    expect(allObjectivesDone([], [0, 0, 0, 0, 0], 0, 0)).toBe(false);
  });
});
