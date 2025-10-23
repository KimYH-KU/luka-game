import {
  PatternBoard,
  PatternTile,
  PatternBoardShape,
} from '../types/pattern2048';

export const PATTERN_BOARD_SIZE = 5;
export const WIN_TILE_PATTERN = 128;

// 패턴 모양에 따른 빈 보드 생성
export const createPatternBoard = (shape: PatternBoardShape): PatternBoard => {
  return Array(PATTERN_BOARD_SIZE)
    .fill(null)
    .map((_, row) =>
      Array(PATTERN_BOARD_SIZE)
        .fill(null)
        .map((_, col) => ({
          value: shape[row][col] ? null : null, // 모든 칸을 null로 초기화
          isNew: false,
          isMerged: false,
        }))
    );
};

// 패턴 보드 초기화 (2개 타일로 시작)
export const initializePatternBoard = (
  shape: PatternBoardShape
): PatternBoard => {
  const board = createPatternBoard(shape);
  addRandomTileToPattern(board, shape);
  addRandomTileToPattern(board, shape);
  return board;
};

// 패턴 모양 내의 빈 칸들 찾기
export const getEmptyCellsInPattern = (
  board: PatternBoard,
  shape: PatternBoardShape
): { row: number; col: number }[] => {
  const emptyCells = [];
  for (let row = 0; row < PATTERN_BOARD_SIZE; row++) {
    for (let col = 0; col < PATTERN_BOARD_SIZE; col++) {
      // 패턴 내부이고 빈 칸인 경우
      if (shape[row][col] && board[row][col].value === null) {
        emptyCells.push({ row, col });
      }
    }
  }
  return emptyCells;
};

// 패턴 내에 랜덤 타일 추가
export const addRandomTileToPattern = (
  board: PatternBoard,
  shape: PatternBoardShape
): boolean => {
  const emptyCells = getEmptyCellsInPattern(board, shape);

  if (emptyCells.length === 0) return false;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newValue = Math.random() < 0.9 ? 2 : 4;

  board[randomCell.row][randomCell.col] = {
    value: newValue,
    isNew: true,
    isMerged: false,
  };

  return true;
};

// 패턴 보드에서 타일 이동
export const movePatternBoard = (
  board: PatternBoard,
  shape: PatternBoardShape,
  direction: 'up' | 'down' | 'left' | 'right'
): { board: PatternBoard; score: number; moved: boolean } => {
  const newBoard = board.map((row) =>
    row.map((tile) => ({
      ...tile,
      isNew: false,
      isMerged: false,
    }))
  );

  let score = 0;
  let moved = false;

  const moveAndMergeInPattern = (
    tiles: PatternTile[],
    positions: { row: number; col: number }[]
  ): { tiles: PatternTile[]; score: number; moved: boolean } => {
    // 패턴 내부의 타일들만 필터링
    const validTiles = tiles.filter(
      (_, index) => shape[positions[index].row][positions[index].col]
    );
    const validPositions = positions.filter((pos) => shape[pos.row][pos.col]);

    // null이 아닌 타일들만 추출
    const nonEmptyTiles = validTiles.filter((tile) => tile.value !== null);
    const newTiles: PatternTile[] = [];
    let lineScore = 0;
    let lineMoved = false;

    // 합치기 로직
    for (let i = 0; i < nonEmptyTiles.length; i++) {
      if (
        i < nonEmptyTiles.length - 1 &&
        nonEmptyTiles[i].value === nonEmptyTiles[i + 1].value
      ) {
        // 같은 값이면 합치기
        const mergedValue = nonEmptyTiles[i].value! * 2;
        newTiles.push({
          value: mergedValue,
          isNew: false,
          isMerged: true,
        });
        lineScore += mergedValue;
        i++; // 다음 타일은 건너뛰기
      } else {
        newTiles.push({ ...nonEmptyTiles[i] });
      }
    }

    // 나머지 공간을 빈 타일로 채우기
    while (newTiles.length < validPositions.length) {
      newTiles.push({
        value: null,
        isNew: false,
        isMerged: false,
      });
    }

    // 이동했는지 확인
    for (let i = 0; i < validTiles.length; i++) {
      if (validTiles[i].value !== newTiles[i].value) {
        lineMoved = true;
        break;
      }
    }

    return { tiles: newTiles, score: lineScore, moved: lineMoved };
  };

  switch (direction) {
    case 'left':
      for (let row = 0; row < PATTERN_BOARD_SIZE; row++) {
        const rowTiles = newBoard[row];
        const rowPositions = Array.from(
          { length: PATTERN_BOARD_SIZE },
          (_, col) => ({ row, col })
        );
        const result = moveAndMergeInPattern(rowTiles, rowPositions);

        // 결과를 패턴 내 위치에만 적용
        let tileIndex = 0;
        for (let col = 0; col < PATTERN_BOARD_SIZE; col++) {
          if (shape[row][col]) {
            newBoard[row][col] = result.tiles[tileIndex];
            tileIndex++;
          }
        }

        score += result.score;
        if (result.moved) moved = true;
      }
      break;

    case 'right':
      for (let row = 0; row < PATTERN_BOARD_SIZE; row++) {
        const rowTiles = [...newBoard[row]].reverse();
        const rowPositions = Array.from(
          { length: PATTERN_BOARD_SIZE },
          (_, col) => ({
            row,
            col: PATTERN_BOARD_SIZE - 1 - col,
          })
        );
        const result = moveAndMergeInPattern(rowTiles, rowPositions);

        let tileIndex = 0;
        for (let col = PATTERN_BOARD_SIZE - 1; col >= 0; col--) {
          if (shape[row][col]) {
            newBoard[row][col] = result.tiles[tileIndex];
            tileIndex++;
          }
        }

        score += result.score;
        if (result.moved) moved = true;
      }
      break;

    case 'up':
      for (let col = 0; col < PATTERN_BOARD_SIZE; col++) {
        const colTiles = newBoard.map((row) => row[col]);
        const colPositions = Array.from(
          { length: PATTERN_BOARD_SIZE },
          (_, row) => ({ row, col })
        );
        const result = moveAndMergeInPattern(colTiles, colPositions);

        let tileIndex = 0;
        for (let row = 0; row < PATTERN_BOARD_SIZE; row++) {
          if (shape[row][col]) {
            newBoard[row][col] = result.tiles[tileIndex];
            tileIndex++;
          }
        }

        score += result.score;
        if (result.moved) moved = true;
      }
      break;

    case 'down':
      for (let col = 0; col < PATTERN_BOARD_SIZE; col++) {
        const colTiles = newBoard.map((row) => row[col]).reverse();
        const colPositions = Array.from(
          { length: PATTERN_BOARD_SIZE },
          (_, row) => ({
            row: PATTERN_BOARD_SIZE - 1 - row,
            col,
          })
        );
        const result = moveAndMergeInPattern(colTiles, colPositions);

        let tileIndex = 0;
        for (let row = PATTERN_BOARD_SIZE - 1; row >= 0; row--) {
          if (shape[row][col]) {
            newBoard[row][col] = result.tiles[tileIndex];
            tileIndex++;
          }
        }

        score += result.score;
        if (result.moved) moved = true;
      }
      break;
  }

  return { board: newBoard, score, moved };
};

// 패턴 보드에서 게임 오버 체크
export const isPatternGameOver = (
  board: PatternBoard,
  shape: PatternBoardShape
): boolean => {
  // 빈 칸이 있으면 게임 계속 가능
  const emptyCells = getEmptyCellsInPattern(board, shape);
  if (emptyCells.length > 0) return false;

  // 인접한 같은 값이 있으면 게임 계속 가능
  for (let row = 0; row < PATTERN_BOARD_SIZE; row++) {
    for (let col = 0; col < PATTERN_BOARD_SIZE; col++) {
      if (!shape[row][col]) continue; // 패턴 외부는 무시

      const current = board[row][col].value;
      if (current === null) continue;

      // 오른쪽 체크 (패턴 내부인 경우만)
      if (
        col < PATTERN_BOARD_SIZE - 1 &&
        shape[row][col + 1] &&
        board[row][col + 1].value === current
      ) {
        return false;
      }

      // 아래쪽 체크 (패턴 내부인 경우만)
      if (
        row < PATTERN_BOARD_SIZE - 1 &&
        shape[row + 1][col] &&
        board[row + 1][col].value === current
      ) {
        return false;
      }
    }
  }

  return true;
};

// 패턴 보드에서 승리 체크 (128 타일 존재)
export const isPatternWin = (
  board: PatternBoard,
  shape: PatternBoardShape
): boolean => {
  for (let row = 0; row < PATTERN_BOARD_SIZE; row++) {
    for (let col = 0; col < PATTERN_BOARD_SIZE; col++) {
      if (shape[row][col] && board[row][col].value === WIN_TILE_PATTERN) {
        return true;
      }
    }
  }
  return false;
};
