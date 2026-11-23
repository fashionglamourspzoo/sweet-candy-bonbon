import { theme } from '../src/constants/theme';
import { progressStore } from '../src/game/progressStore';

describe('setting: colourblind shapes', () => {
  beforeEach(() => {
    progressStore.reset();
  });

  it('is off until the player turns it on, and is then remembered', () => {
    expect(progressStore.load().settings.colourblind).toBe(false);
    progressStore.saveSettings({ colourblind: true });
    expect(progressStore.load().settings.colourblind).toBe(true);
  });

  it('leaves the other settings untouched', () => {
    progressStore.saveSettings({ colourblind: true });
    const settings = progressStore.load().settings;
    expect(settings.hintHelper).toBe(true);
    expect(settings.reducedMotion).toBe(false);
  });

  it('has one unique glyph per ingredient, so the badges never repeat', () => {
    const glyphs = theme.ingredients.map(i => i.glyph);
    expect(new Set(glyphs).size).toBe(theme.ingredients.length);
  });
});
