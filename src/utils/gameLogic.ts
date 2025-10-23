import { GameBoard, Direction } from '../types/game';
import { GRID_SIZE, NEW_TILE_PROBABILITY, WIN_TILE } from './constants';

// 빈 보드 생성
export const createEmptyBoard = (): GameBoard => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
};

// 랜덤 위치에 새 타일 추가
export const addRandomTile = (board: GameBoard): GameBoard => {
  const emptyCells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === null) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) return board;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newValue = Math.random() < NEW_TILE_PROBABILITY ? 2 : 4;

  const newBoard = board.map((row) => [...row]);
  newBoard[randomCell.row][randomCell.col] = newValue;

  return newBoard;
};

// 초기 게임 보드 생성 (2개의 타일로 시작)
export const initializeBoard = (): GameBoard => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

// 보드 이동 및 합치기 로직
export const moveBoard = (
  board: GameBoard,
  direction: Direction
): { board: GameBoard; score: number; moved: boolean } => {
  let newBoard = board.map((row) => [...row]);
  let score = 0;
  let moved = false;

  const moveAndMergeRow = (
    row: (number | null)[]
  ): { row: (number | null)[]; score: number; moved: boolean } => {
    // null이 아닌 값들만 필터링
    const filteredRow = row.filter((cell) => cell !== null) as number[];
    const newRow: (number | null)[] = [];
    let rowScore = 0;
    let rowMoved = false;

    // 합치기 로직
    for (let i = 0; i < filteredRow.length; i++) {
      if (i < filteredRow.length - 1 && filteredRow[i] === filteredRow[i + 1]) {
        // 같은 값이면 합치기
        const mergedValue = filteredRow[i] * 2;
        newRow.push(mergedValue);
        rowScore += mergedValue;
        i++; // 다음 타일은 건너뛰기
      } else {
        newRow.push(filteredRow[i]);
      }
    }

    // 나머지 공간을 null로 채우기
    while (newRow.length < GRID_SIZE) {
      newRow.push(null);
    }

    // 이동했는지 확인
    for (let i = 0; i < GRID_SIZE; i++) {
      if (row[i] !== newRow[i]) {
        rowMoved = true;
        break;
      }
    }

    return { row: newRow, score: rowScore, moved: rowMoved };
  };

  switch (direction) {
    case 'left':
      for (let row = 0; row < GRID_SIZE; row++) {
        const result = moveAndMergeRow(newBoard[row]);
        newBoard[row] = result.row;
        score += result.score;
        if (result.moved) moved = true;
      }
      break;

    case 'right':
      for (let row = 0; row < GRID_SIZE; row++) {
        const reversedRow = [...newBoard[row]].reverse();
        const result = moveAndMergeRow(reversedRow);
        newBoard[row] = result.row.reverse();
        score += result.score;
        if (result.moved) moved = true;
      }
      break;

    case 'up':
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = newBoard.map((row) => row[col]);
        const result = moveAndMergeRow(column);
        for (let row = 0; row < GRID_SIZE; row++) {
          newBoard[row][col] = result.row[row];
        }
        score += result.score;
        if (result.moved) moved = true;
      }
      break;

    case 'down':
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = newBoard.map((row) => row[col]).reverse();
        const result = moveAndMergeRow(column);
        const reversedResult = result.row.reverse();
        for (let row = 0; row < GRID_SIZE; row++) {
          newBoard[row][col] = reversedResult[row];
        }
        score += result.score;
        if (result.moved) moved = true;
      }
      break;
  }

  return { board: newBoard, score, moved };
};

// 게임 오버 체크
export const isGameOver = (board: GameBoard): boolean => {
  // 빈 칸이 있으면 게임 계속 가능
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === null) return false;
    }
  }

  // 인접한 같은 값이 있으면 게임 계속 가능
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const current = board[row][col];
      // 오른쪽 체크
      if (col < GRID_SIZE - 1 && board[row][col + 1] === current) return false;
      // 아래쪽 체크
      if (row < GRID_SIZE - 1 && board[row + 1][col] === current) return false;
    }
  }

  return true;
};

// 승리 체크 (2048 타일 존재)
export const isWin = (board: GameBoard): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === WIN_TILE) return true;
    }
  }
  return false;
};

// 가능한 이동이 있는지 체크
export const canMove = (board: GameBoard, direction: Direction): boolean => {
  const result = moveBoard(board, direction);
  return result.moved;
};
