// 패턴 보드 2048 게임 타입 정의

import { NonogramPuzzle } from './nonogram';

export type PatternGamePhase = 'nonogram' | 'game2048';

export type PatternTile = {
  value: number | null;
  isNew: boolean;
  isMerged: boolean;
};

export type PatternBoard = PatternTile[][];

export type PatternBoardShape = boolean[][]; // 네모네모로직 완성 패턴

export type PatternGameState = {
  phase: PatternGamePhase;
  board: PatternBoard;
  boardShape: PatternBoardShape; // 게임 가능한 칸들
  score: number;
  bestScore: number;
  isGameOver: boolean;
  isWin: boolean;
  canUndo: boolean;
  selectedPuzzle: NonogramPuzzle;
  moveHistory: {
    board: PatternBoard;
    score: number;
  }[];
};

export type PatternGameStats = {
  currentScore: number;
  bestScore: number;
  targetTile: number;
  elapsedTime: number;
  movesCount: number;
};
