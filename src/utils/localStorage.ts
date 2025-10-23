// 로컬 스토리지 관리
const BEST_SCORE_KEY = '2048-best-score';
const GAME_STATE_KEY = '2048-game-state';

export const saveBestScore = (score: number): void => {
  localStorage.setItem(BEST_SCORE_KEY, score.toString());
};

export const getBestScore = (): number => {
  const saved = localStorage.getItem(BEST_SCORE_KEY);
  return saved ? parseInt(saved, 10) : 0;
};

export const saveGameState = (gameState: any): void => {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
};

export const getGameState = (): any | null => {
  const saved = localStorage.getItem(GAME_STATE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const clearGameState = (): void => {
  localStorage.removeItem(GAME_STATE_KEY);
};
