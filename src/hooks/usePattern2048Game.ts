import { useState, useCallback, useEffect } from 'react';
import { PatternGameState, PatternBoardShape } from '../types/pattern2048';
import { NonogramPuzzle } from '../types/nonogram';
import {
  initializePatternBoard,
  movePatternBoard,
  addRandomTileToPattern,
  isPatternGameOver,
  isPatternWin,
  WIN_TILE_PATTERN,
} from '../utils/pattern2048Logic';

export const usePattern2048Game = (initialPuzzle: NonogramPuzzle) => {
  const [gameState, setGameState] = useState<PatternGameState>(() => ({
    phase: 'nonogram',
    board: initializePatternBoard(initialPuzzle.solution),
    boardShape: initialPuzzle.solution,
    score: 0,
    bestScore: parseInt(localStorage.getItem('pattern-2048-best-score') || '0'),
    isGameOver: false,
    isWin: false,
    canUndo: false,
    selectedPuzzle: initialPuzzle,
    moveHistory: [],
  }));

  const [startTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [movesCount, setMovesCount] = useState(0);

  // 실시간 시간 업데이트
  useEffect(() => {
    if (gameState.isGameOver || gameState.isWin) return;

    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameOver, gameState.isWin]);

  // 베스트 스코어 저장
  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      localStorage.setItem(
        'pattern-2048-best-score',
        gameState.score.toString()
      );
      setGameState((prev) => ({ ...prev, bestScore: gameState.score }));
    }
  }, [gameState.score, gameState.bestScore]);

  // 네모네모로직 완료 후 2048 게임 시작
  const startPattern2048 = useCallback(
    (completedPattern: PatternBoardShape) => {
      const initialBoard = initializePatternBoard(completedPattern);

      setGameState((prev) => ({
        ...prev,
        phase: 'game2048',
        board: initialBoard,
        boardShape: completedPattern,
        score: 0,
        isGameOver: false,
        isWin: false,
        canUndo: false,
        moveHistory: [],
      }));

      setMovesCount(0);
    },
    []
  );

  // 타일 이동
  const makeMove = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (
        gameState.phase !== 'game2048' ||
        gameState.isGameOver ||
        gameState.isWin
      )
        return;

      // 이동 전 상태 저장 (undo용)
      const previousState = {
        board: gameState.board.map((row) => row.map((tile) => ({ ...tile }))),
        score: gameState.score,
      };

      const result = movePatternBoard(
        gameState.board,
        gameState.boardShape,
        direction
      );

      if (!result.moved) return;

      // 새 타일 추가
      const newBoard = result.board;
      addRandomTileToPattern(newBoard, gameState.boardShape);

      const newScore = gameState.score + result.score;
      const newGameOver = isPatternGameOver(newBoard, gameState.boardShape);
      const newWin =
        !gameState.isWin && isPatternWin(newBoard, gameState.boardShape);

      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        score: newScore,
        bestScore: Math.max(prev.bestScore, newScore),
        isGameOver: newGameOver,
        isWin: newWin,
        canUndo: true,
        moveHistory: [...prev.moveHistory.slice(-9), previousState], // 최대 10개 기록
      }));

      setMovesCount((prev) => prev + 1);
    },
    [gameState]
  );

  // 실행 취소
  const undoMove = useCallback(() => {
    if (!gameState.canUndo || gameState.moveHistory.length === 0) return;

    const previousState =
      gameState.moveHistory[gameState.moveHistory.length - 1];

    setGameState((prev) => ({
      ...prev,
      board: previousState.board,
      score: previousState.score,
      isGameOver: false,
      isWin: false,
      canUndo: false,
      moveHistory: prev.moveHistory.slice(0, -1),
    }));

    setMovesCount((prev) => Math.max(0, prev - 1));
  }, [gameState.canUndo, gameState.moveHistory]);

  // 새 게임 시작 (네모네모로직부터)
  const startNewGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      phase: 'nonogram',
      board: initializePatternBoard(prev.selectedPuzzle.solution),
      boardShape: prev.selectedPuzzle.solution,
      score: 0,
      isGameOver: false,
      isWin: false,
      canUndo: false,
      moveHistory: [],
    }));

    setMovesCount(0);
  }, []);

  // 퍼즐 변경
  const changePuzzle = useCallback((newPuzzle: NonogramPuzzle) => {
    setGameState((prev) => ({
      ...prev,
      selectedPuzzle: newPuzzle,
      phase: 'nonogram',
      board: initializePatternBoard(newPuzzle.solution),
      boardShape: newPuzzle.solution,
      score: 0,
      isGameOver: false,
      isWin: false,
      canUndo: false,
      moveHistory: [],
    }));

    setMovesCount(0);
  }, []);

  // 2048 게임에서 승리 후 계속하기
  const continueGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isWin: false }));
  }, []);

  // 게임 통계
  const gameStats = {
    currentScore: gameState.score,
    bestScore: gameState.bestScore,
    targetTile: WIN_TILE_PATTERN,
    elapsedTime: currentTime - startTime,
    movesCount,
  };

  return {
    gameState,
    gameStats,
    makeMove,
    undoMove,
    startNewGame,
    startPattern2048,
    changePuzzle,
    continueGame,
  };
};
