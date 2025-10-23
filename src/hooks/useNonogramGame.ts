import { useState, useCallback, useEffect } from 'react';
import { NonogramGameState, NonogramPuzzle } from '../types/nonogram';
import {
  createEmptyGrid,
  isPuzzleCompleted,
  countMistakes,
  getHint,
} from '../utils/nonogramLogic';

export const useNonogramGame = (initialPuzzle: NonogramPuzzle) => {
  const [gameState, setGameState] = useState<NonogramGameState>(() => ({
    puzzle: initialPuzzle,
    grid: createEmptyGrid(initialPuzzle.size.width, initialPuzzle.size.height),
    isCompleted: false,
    mistakes: 0,
    startTime: Date.now(),
    hintsUsed: 0,
  }));

  const [currentTime, setCurrentTime] = useState(Date.now());

  // 실시간 시간 업데이트
  useEffect(() => {
    if (gameState.isCompleted) return;

    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isCompleted]);

  // 셀 클릭 처리
  const handleCellClick = useCallback(
    (row: number, col: number, clickType: 'left' | 'right') => {
      if (gameState.isCompleted) return;

      setGameState((prev) => {
        const newGrid = prev.grid.map((r) => [...r]);
        const currentState = newGrid[row][col];

        if (clickType === 'left') {
          // 왼쪽 클릭: 빈칸 → 칠함 → 빈칸
          switch (currentState) {
            case 'empty':
              newGrid[row][col] = 'filled';
              break;
            case 'filled':
              newGrid[row][col] = 'empty';
              break;
            case 'marked':
              newGrid[row][col] = 'filled';
              break;
          }
        } else {
          // 우클릭: 빈칸 → X표시 → 빈칸
          switch (currentState) {
            case 'empty':
              newGrid[row][col] = 'marked';
              break;
            case 'marked':
              newGrid[row][col] = 'empty';
              break;
            case 'filled':
              newGrid[row][col] = 'marked';
              break;
          }
        }

        const isCompleted = isPuzzleCompleted(newGrid, prev.puzzle);
        const mistakes = countMistakes(newGrid, prev.puzzle.solution);

        return {
          ...prev,
          grid: newGrid,
          isCompleted,
          mistakes,
          endTime: isCompleted ? Date.now() : prev.endTime,
        };
      });
    },
    [gameState.isCompleted]
  );

  // 새 게임 시작
  const startNewGame = useCallback(
    (puzzle?: NonogramPuzzle) => {
      const newPuzzle = puzzle || gameState.puzzle;
      setGameState({
        puzzle: newPuzzle,
        grid: createEmptyGrid(newPuzzle.size.width, newPuzzle.size.height),
        isCompleted: false,
        mistakes: 0,
        startTime: Date.now(),
        hintsUsed: 0,
      });
    },
    [gameState.puzzle]
  );

  // 힌트 사용
  const useHint = useCallback(() => {
    if (gameState.isCompleted) return;

    const hint = getHint(gameState.grid, gameState.puzzle);
    if (hint) {
      setGameState((prev) => {
        const newGrid = prev.grid.map((r) => [...r]);
        newGrid[hint.row][hint.col] = hint.action;

        const isCompleted = isPuzzleCompleted(newGrid, prev.puzzle);
        const mistakes = countMistakes(newGrid, prev.puzzle.solution);

        return {
          ...prev,
          grid: newGrid,
          isCompleted,
          mistakes,
          hintsUsed: prev.hintsUsed + 1,
          endTime: isCompleted ? Date.now() : prev.endTime,
        };
      });
    }
  }, [gameState]);

  // 그리드 초기화
  const clearGrid = useCallback(() => {
    if (gameState.isCompleted) return;

    setGameState((prev) => ({
      ...prev,
      grid: createEmptyGrid(prev.puzzle.size.width, prev.puzzle.size.height),
      mistakes: 0,
    }));
  }, [gameState.isCompleted]);

  // 게임 통계 계산
  const gameStats = {
    elapsedTime: gameState.endTime
      ? gameState.endTime - gameState.startTime
      : currentTime - gameState.startTime,
    accuracy:
      gameState.grid.flat().filter((cell) => cell !== 'empty').length > 0
        ? Math.max(0, 100 - gameState.mistakes * 10)
        : 100,
    completion: gameState.isCompleted
      ? 100
      : (gameState.grid.flat().filter((cell) => cell !== 'empty').length /
          (gameState.puzzle.size.width * gameState.puzzle.size.height)) *
        100,
  };

  return {
    gameState,
    handleCellClick,
    startNewGame,
    useHint,
    clearGrid,
    gameStats,
  };
};
