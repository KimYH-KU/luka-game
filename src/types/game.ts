// 게임 타입 정의
export type Tile = {
  id: string;
  value: number;
  position: { row: number; col: number };
  isNew?: boolean;
  isMerged?: boolean;
};

export type GameBoard = (number | null)[][];

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameState = {
  board: GameBoard;
  score: number;
  bestScore: number;
  isGameOver: boolean;
  isWin: boolean;
  canUndo: boolean;
};

export type AIHint = {
  direction: Direction;
  confidence: number;
  reason: string;
  expectedScore: number;
};

export type AIAnalysis = {
  bestMove: Direction;
  alternativeMoves: AIHint[];
  riskLevel: 'low' | 'medium' | 'high';
  advice: string;
};
