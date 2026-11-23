import { LOCATIONS, STAGES_PER_LOCATION, locationUnlocked, stageUnlocked } from '../src/game/stages';
import { STARS_PER_LOCATION } from '../src/constants/config';

describe('unlock new garden locations', () => {
  it('opens the first garden for free and the rest at eight stars each', () => {
    expect(locationUnlocked(0, 0)).toBe(true);
    expect(locationUnlocked(1, STARS_PER_LOCATION - 1)).toBe(false);
    expect(locationUnlocked(1, STARS_PER_LOCATION)).toBe(true);
    expect(LOCATIONS[3].starsToOpen).toBe(STARS_PER_LOCATION * 3);
  });

  it('keeps a stage locked until the one before it is cleared', () => {
    const stars = new Array(20).fill(0);
    expect(stageUnlocked(0, stars, 0)).toBe(true);
    expect(stageUnlocked(1, stars, 0)).toBe(false);
    stars[0] = 2;
    expect(stageUnlocked(1, stars, 2)).toBe(true);
  });

  it('keeps a whole garden shut while its star price is unpaid', () => {
    const stars = new Array(20).fill(3);
    expect(stageUnlocked(STAGES_PER_LOCATION, stars, 0)).toBe(false);
  });
});
