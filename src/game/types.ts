export type Special = 'none' | 'swirlH' | 'swirlV' | 'rainbow';

export type Cell = {
  id: number;
  ing: number;
  special: Special;
};

export type Board = {
  cells: (Cell | null)[];
  /** Syrup belongs to the POSITION, not to the candy — syrup never falls. */
  syrup: number[];
  cols: number;
  rows: number;
  nextId: number;
};

export type MatchGroup = {
  idx: number[];
  dir: 'h' | 'v';
  ing: number;
};

export type ClearResult = {
  board: Board;
  cleared: number[];
  syrupCleared: number;
  popped: number[];
  created: number[];
};

export type ObjectiveKind = 'collect' | 'syrup' | 'score';

export type Objective =
  | { kind: 'collect'; ing: number; target: number }
  | { kind: 'syrup'; target: number }
  | { kind: 'score'; target: number };

export type StageDef = {
  index: number;
  location: number;
  numberInLocation: number;
  title: string;
  moves: number;
  syrup: number;
  palette: number;
  objectives: Objective[];
  par: number;
  recipe: number | null;
};

export type StageSummary = {
  stageIndex: number;
  daily: boolean;
  won: boolean;
  score: number;
  par: number;
  movesLeft: number;
  movesTotal: number;
  stars: number;
  collected: number[];
  ingredientsTotal: number;
  syrupCleared: number;
  bestCombo: number;
  recipeUnlocked: number | null;
  nextStageIndex: number | null;
};
