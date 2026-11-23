import { PAR_PER_MOVE } from '../src/constants/config';
import { starsFor } from '../src/game/rules';
import { getStage } from '../src/game/stages';

describe('level objectives and 3-star scoring', () => {
  const par = getStage(0).par;

  it('derives par from the sugar budget', () => {
    expect(par).toBe(getStage(0).moves * PAR_PER_MOVE);
  });

  it('pays one star for finishing, two at par and three at 1.6x par', () => {
    expect(starsFor(true, 0, par)).toBe(1);
    expect(starsFor(true, par, par)).toBe(2);
    expect(starsFor(true, Math.ceil(par * 1.6), par)).toBe(3);
  });

  it('pays nothing for a lost stage', () => {
    expect(starsFor(false, par * 4, par)).toBe(0);
  });
});
