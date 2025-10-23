// 네모네모로직 게임 타입 정의

export type CellState = 'empty' | 'filled' | 'marked'; // 빈칸, 칠함, X표시

export type NonogramGrid = CellState[][];

export type Clue = number[]; // 각 행/열의 힌트 숫자들

export type NonogramPuzzle = {
  id: string;
  name: string;
  size: { width: number; height: number };
  solution: boolean[][]; // 정답 패턴 (true = 칠해야 함)
  rowClues: Clue[]; // 각 행의 힌트
  colClues: Clue[]; // 각 열의 힌트
};

export type NonogramGameState = {
  puzzle: NonogramPuzzle;
  grid: NonogramGrid;
  isCompleted: boolean;
  mistakes: number;
  startTime: number;
  endTime?: number;
  hintsUsed: number;
};

export type GameMode = 'normal' | 'timed' | 'lives'; // 일반, 시간제한, 목숨제한

// 하이브리드 게임을 위한 타입들
export type HybridGameMode = '2048' | 'nonogram' | 'fusion';

export type FusionEvent = {
  type: 'pattern_completed' | 'tile_merged' | 'bonus_achieved';
  data: any;
  timestamp: number;
};

export type HybridGameState = {
  mode: HybridGameMode;
  game2048State: any; // 기존 2048 상태 재사용
  nonogramState: NonogramGameState;
  fusionEvents: FusionEvent[];
  totalScore: number;
  comboMultiplier: number;
};
