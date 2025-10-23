import { useState, useCallback, useEffect } from 'react';
import { Direction, GameState } from '../types/game';
import {
  initializeBoard,
  moveBoard,
  addRandomTile,
  isGameOver,
  isWin,
} from '../utils/gameLogic';
import {
  saveBestScore,
  getBestScore,
  saveGameState,
} from '../utils/localStorage';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: initializeBoard(),
    score: 0,
    bestScore: getBestScore(),
    isGameOver: false,
    isWin: false,
    canUndo: false,
  }));

  const [previousState, setPreviousState] = useState<GameState | null>(null);
  const [moveHistory, setMoveHistory] = useState<Direction[]>([]);

  // 게임 상태 저장
  useEffect(() => {
    saveGameState(gameState);
    if (gameState.score > gameState.bestScore) {
      saveBestScore(gameState.score);
      setGameState((prev) => ({ ...prev, bestScore: gameState.score }));
    }
  }, [gameState]);

  // 이동 처리
  const makeMove = useCallback(
    (direction: Direction) => {
      if (gameState.isGameOver || gameState.isWin) return;

      const result = moveBoard(gameState.board, direction);

      if (!result.moved) return; // 이동이 없으면 아무것도 하지 않음

      // 이전 상태 저장 (되돌리기용)
      setPreviousState(gameState);

      // 새 타일 추가
      const boardWithNewTile = addRandomTile(result.board);

      const newScore = gameState.score + result.score;
      const newGameOver = isGameOver(boardWithNewTile);
      const newWin = !gameState.isWin && isWin(boardWithNewTile);

      setGameState({
        board: boardWithNewTile,
        score: newScore,
        bestScore: Math.max(gameState.bestScore, newScore),
        isGameOver: newGameOver,
        isWin: newWin,
        canUndo: true,
      });

      // 이동 기록 추가
      setMoveHistory((prev) => [...prev, direction]);
    },
    [gameState]
  );

  // 새 게임 시작
  const startNewGame = useCallback(() => {
    setGameState({
      board: initializeBoard(),
      score: 0,
      bestScore: getBestScore(),
      isGameOver: false,
      isWin: false,
      canUndo: false,
    });
    setPreviousState(null);
    setMoveHistory([]);
  }, []);

  // 되돌리기
  const undoMove = useCallback(() => {
    if (previousState && gameState.canUndo) {
      setGameState({ ...previousState, canUndo: false });
      setPreviousState(null);
      setMoveHistory((prev) => prev.slice(0, -1));
    }
  }, [previousState, gameState.canUndo]);

  // 게임 계속하기 (승리 후)
  const continueGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isWin: false }));
  }, []);

  return {
    gameState,
    makeMove,
    startNewGame,
    undoMove,
    continueGame,
    moveHistory,
  };
};
