import { GameBoard, Direction, AIAnalysis, AIHint } from '../types/game';
import { moveBoard, isGameOver, canMove } from './gameLogic';
import { GRID_SIZE, AI_WEIGHTS, AI_SEARCH_DEPTH } from './constants';

// 보드 평가 함수들
const countEmptyCells = (board: GameBoard): number => {
  let count = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === null) count++;
    }
  }
  return count;
};

const calculateSmoothness = (board: GameBoard): number => {
  let smoothness = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const current = board[row][col];
      if (current !== null) {
        // 오른쪽과 비교
        if (col < GRID_SIZE - 1) {
          const right = board[row][col + 1];
          if (right !== null) {
            smoothness -= Math.abs(Math.log2(current) - Math.log2(right));
          }
        }
        // 아래와 비교
        if (row < GRID_SIZE - 1) {
          const below = board[row + 1][col];
          if (below !== null) {
            smoothness -= Math.abs(Math.log2(current) - Math.log2(below));
          }
        }
      }
    }
  }
  return smoothness;
};

const calculateMonotonicity = (board: GameBoard): number => {
  let monotonicity = 0;

  // 행 단조성
  for (let row = 0; row < GRID_SIZE; row++) {
    let increasing = 0;
    let decreasing = 0;
    for (let col = 0; col < GRID_SIZE - 1; col++) {
      const current = board[row][col];
      const next = board[row][col + 1];
      if (current !== null && next !== null) {
        if (current < next) increasing += Math.log2(next) - Math.log2(current);
        else if (current > next)
          decreasing += Math.log2(current) - Math.log2(next);
      }
    }
    monotonicity += Math.max(increasing, decreasing);
  }

  // 열 단조성
  for (let col = 0; col < GRID_SIZE; col++) {
    let increasing = 0;
    let decreasing = 0;
    for (let row = 0; row < GRID_SIZE - 1; row++) {
      const current = board[row][col];
      const next = board[row + 1][col];
      if (current !== null && next !== null) {
        if (current < next) increasing += Math.log2(next) - Math.log2(current);
        else if (current > next)
          decreasing += Math.log2(current) - Math.log2(next);
      }
    }
    monotonicity += Math.max(increasing, decreasing);
  }

  return monotonicity;
};

const getMaxTile = (board: GameBoard): number => {
  let max = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = board[row][col];
      if (value !== null && value > max) {
        max = value;
      }
    }
  }
  return max;
};

// 보드 상태 평가
const evaluateBoard = (board: GameBoard): number => {
  const emptyCells = countEmptyCells(board);
  const smoothness = calculateSmoothness(board);
  const monotonicity = calculateMonotonicity(board);
  const maxTile = getMaxTile(board);

  return (
    AI_WEIGHTS.EMPTY_CELLS * emptyCells +
    AI_WEIGHTS.SMOOTHNESS * smoothness +
    AI_WEIGHTS.MONOTONICITY * monotonicity +
    AI_WEIGHTS.MAX_TILE * Math.log2(maxTile || 1)
  );
};

// 미니맥스 알고리즘 (간단 버전)
const minimax = (
  board: GameBoard,
  depth: number,
  isMaximizing: boolean
): number => {
  if (depth === 0 || isGameOver(board)) {
    return evaluateBoard(board);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    const directions: Direction[] = ['up', 'down', 'left', 'right'];

    for (const direction of directions) {
      if (canMove(board, direction)) {
        const result = moveBoard(board, direction);
        const eval_ = minimax(result.board, depth - 1, false);
        maxEval = Math.max(maxEval, eval_);
      }
    }

    return maxEval === -Infinity ? evaluateBoard(board) : maxEval;
  } else {
    // 컴퓨터 턴 (새 타일 추가) - 간단하게 평균값 반환
    return evaluateBoard(board);
  }
};

// AI가 최적의 수 찾기
export const findBestMove = (board: GameBoard): Direction => {
  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  let bestMove: Direction = 'up';
  let bestScore = -Infinity;

  for (const direction of directions) {
    if (canMove(board, direction)) {
      const result = moveBoard(board, direction);
      const score = minimax(result.board, AI_SEARCH_DEPTH - 1, false);

      if (score > bestScore) {
        bestScore = score;
        bestMove = direction;
      }
    }
  }

  return bestMove;
};

// AI 분석 및 힌트 제공
export const analyzeBoard = (board: GameBoard): AIAnalysis => {
  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  const hints: AIHint[] = [];

  for (const direction of directions) {
    if (canMove(board, direction)) {
      const result = moveBoard(board, direction);
      const confidence = evaluateBoard(result.board);

      hints.push({
        direction,
        confidence,
        reason: getReasonForMove(board, direction),
        expectedScore: result.score,
      });
    }
  }

  // 신뢰도 순으로 정렬
  hints.sort((a, b) => b.confidence - a.confidence);

  const emptyCells = countEmptyCells(board);
  const riskLevel =
    emptyCells <= 2 ? 'high' : emptyCells <= 5 ? 'medium' : 'low';

  return {
    bestMove: hints[0]?.direction || 'up',
    alternativeMoves: hints.slice(1),
    riskLevel,
    advice: generateAdvice(board, hints[0], riskLevel),
  };
};

// 이동 이유 설명
const getReasonForMove = (board: GameBoard, direction: Direction): string => {
  const result = moveBoard(board, direction);
  const emptyCells = countEmptyCells(result.board);
  const maxTile = getMaxTile(result.board);

  if (result.score > 0) {
    return `타일을 합쳐서 ${result.score}점을 얻을 수 있어요`;
  }

  if (emptyCells > countEmptyCells(board)) {
    return '더 많은 빈 공간을 만들 수 있어요';
  }

  if (maxTile >= 512) {
    return '큰 타일을 모서리로 이동시킬 수 있어요';
  }

  return '현재 상황에서 가장 안전한 선택이에요';
};

// AI 조언 생성
const generateAdvice = (
  board: GameBoard,
  bestHint: AIHint | undefined,
  riskLevel: string
): string => {
  if (!bestHint) return '더 이상 이동할 수 없어요!';

  const emptyCells = countEmptyCells(board);
  const maxTile = getMaxTile(board);

  if (riskLevel === 'high') {
    return '⚠️ 위험한 상황이에요! 신중하게 움직이세요.';
  }

  if (maxTile >= 1024) {
    return '🎉 거의 다 왔어요! 큰 타일을 모서리에 유지하세요.';
  }

  if (emptyCells <= 3) {
    return '💡 빈 공간이 부족해요. 타일을 합치는 데 집중하세요.';
  }

  return `✨ ${bestHint.reason}`;
};

// 플레이 스타일 분석
export const analyzePlayStyle = (moveHistory: Direction[]): string => {
  if (moveHistory.length < 10) return '';

  const recentMoves = moveHistory.slice(-20);
  const moveCount = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  };

  recentMoves.forEach((move) => moveCount[move]++);

  const mostUsed = Object.entries(moveCount).sort(
    ([, a], [, b]) => b - a
  )[0][0];

  switch (mostUsed) {
    case 'left':
    case 'right':
      return '수평 이동을 선호하는 스타일이네요! 세로 방향도 활용해보세요.';
    case 'up':
    case 'down':
      return '수직 이동을 선호하는 스타일이네요! 가로 방향도 활용해보세요.';
    default:
      return '균형잡힌 플레이 스타일이에요!';
  }
};
