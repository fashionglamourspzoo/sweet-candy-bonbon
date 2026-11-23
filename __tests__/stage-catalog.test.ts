import { PAR_PER_MOVE } from '../src/constants/config';
import { LOCATIONS, STAGES, STAGES_PER_LOCATION, TOTAL_STAGES, getStage } from '../src/game/stages';

describe('puzzle map catalogue', () => {
  it('holds four gardens of five stages', () => {
    expect(LOCATIONS).toHaveLength(4);
    expect(TOTAL_STAGES).toBe(LOCATIONS.length * STAGES_PER_LOCATION);
    expect(STAGES).toHaveLength(TOTAL_STAGES);
  });

  it('gives every stage a sugar budget inside the design range', () => {
    STAGES.forEach(stage => {
      expect(stage.moves).toBeGreaterThanOrEqual(8);
      expect(stage.moves).toBeLessThanOrEqual(24);
      expect(stage.par).toBe(stage.moves * PAR_PER_MOVE);
    });
  });

  it('gives every stage at least one objective and a readable title', () => {
    STAGES.forEach(stage => {
      expect(stage.objectives.length).toBeGreaterThan(0);
      expect(stage.title).toContain('STAGE');
      expect(stage.palette).toBeGreaterThanOrEqual(4);
    });
  });

  it('clamps an out-of-range request instead of crashing', () => {
    expect(getStage(-5).index).toBe(0);
    expect(getStage(999).index).toBe(TOTAL_STAGES - 1);
  });
});
