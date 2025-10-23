// 게임 상수들
export const GRID_SIZE = 4;
export const WIN_TILE = 128;
export const NEW_TILE_PROBABILITY = 0.9; // 90% 확률로 2, 10% 확률로 4

export const TILE_COLORS: { [key: number]: string } = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
  4096: '#3c3a32',
  8192: '#3c3a32',
};

export const TILE_TEXT_COLORS: { [key: number]: string } = {
  2: '#776e65',
  4: '#776e65',
  8: '#f9f6f2',
  16: '#f9f6f2',
  32: '#f9f6f2',
  64: '#f9f6f2',
  128: '#f9f6f2',
  256: '#f9f6f2',
  512: '#f9f6f2',
  1024: '#f9f6f2',
  2048: '#f9f6f2',
  4096: '#f9f6f2',
  8192: '#f9f6f2',
};

// AI 관련 상수
export const AI_WEIGHTS = {
  EMPTY_CELLS: 2.7,
  SMOOTHNESS: 0.1,
  MONOTONICITY: 1.0,
  MAX_TILE: 1.0,
};

export const AI_SEARCH_DEPTH = 4;
