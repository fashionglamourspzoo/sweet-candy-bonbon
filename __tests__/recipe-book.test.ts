import { RECIPES } from '../src/game/stages';
import { applyStageResult, initialProgress, recipesDiscovered } from '../src/game/progressStore';

describe('recipe book', () => {
  it('lists ten recipes, each learned on its own stage', () => {
    expect(RECIPES).toHaveLength(10);
    const stages = RECIPES.map(r => r.stageIndex);
    expect(new Set(stages).size).toBe(RECIPES.length);
  });

  it('discovers a recipe the first time its stage is cleared', () => {
    const start = initialProgress();
    const first = applyStageResult(start, 0, 2, 1000, [0, 0, 0, 0, 0], 0);
    expect(first.recipeUnlocked).toBe(0);
    expect(recipesDiscovered(first.progress)).toBe(1);
  });

  it('does not discover the same recipe twice', () => {
    const start = initialProgress();
    const first = applyStageResult(start, 0, 2, 1000, [0, 0, 0, 0, 0], 0);
    const second = applyStageResult(first.progress, 0, 3, 2000, [0, 0, 0, 0, 0], 0);
    expect(second.recipeUnlocked).toBeNull();
    expect(recipesDiscovered(second.progress)).toBe(1);
  });

  it('learns nothing from a lost stage', () => {
    const start = initialProgress();
    const lost = applyStageResult(start, 0, 0, 400, [0, 0, 0, 0, 0], 0);
    expect(lost.recipeUnlocked).toBeNull();
  });
});
