import {
  NonogramPuzzle,
  NonogramGrid,
  CellState,
  Clue,
} from '../types/nonogram';

// 빈 그리드 생성
export const createEmptyGrid = (
  width: number,
  height: number
): NonogramGrid => {
  return Array(height)
    .fill(null)
    .map(() => Array(width).fill('empty'));
};

// 패턴으로부터 힌트 생성
export const generateCluesFromPattern = (
  pattern: boolean[][]
): { rowClues: Clue[]; colClues: Clue[] } => {
  const height = pattern.length;
  const width = pattern[0].length;

  // 행 힌트 생성
  const rowClues: Clue[] = pattern.map((row) => {
    const clue: number[] = [];
    let count = 0;

    for (let i = 0; i < row.length; i++) {
      if (row[i]) {
        count++;
      } else {
        if (count > 0) {
          clue.push(count);
          count = 0;
        }
      }
    }
    if (count > 0) clue.push(count);

    return clue.length === 0 ? [0] : clue;
  });

  // 열 힌트 생성
  const colClues: Clue[] = [];
  for (let col = 0; col < width; col++) {
    const clue: number[] = [];
    let count = 0;

    for (let row = 0; row < height; row++) {
      if (pattern[row][col]) {
        count++;
      } else {
        if (count > 0) {
          clue.push(count);
          count = 0;
        }
      }
    }
    if (count > 0) clue.push(count);

    colClues.push(clue.length === 0 ? [0] : clue);
  }

  return { rowClues, colClues };
};

// 행이나 열이 힌트와 일치하는지 확인
export const isLineValid = (line: CellState[], clue: Clue): boolean => {
  // 빈 칸은 아직 확정되지 않은 것으로 간주
  const filledPattern = line.map((cell) => cell === 'filled');
  const groups = getConsecutiveGroups(filledPattern);

  // 아직 완성되지 않은 라인은 유효할 수 있음
  if (line.some((cell) => cell === 'empty')) {
    return (
      groups.length <= clue.length &&
      groups.every((group, i) => group <= (clue[i] || 0))
    );
  }

  // 완성된 라인은 정확히 일치해야 함
  return arraysEqual(groups, clue[0] === 0 ? [] : clue);
};

// 연속된 그룹의 크기들을 반환
const getConsecutiveGroups = (pattern: boolean[]): number[] => {
  const groups: number[] = [];
  let count = 0;

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i]) {
      count++;
    } else {
      if (count > 0) {
        groups.push(count);
        count = 0;
      }
    }
  }
  if (count > 0) groups.push(count);

  return groups;
};

// 배열 비교
const arraysEqual = (a: number[], b: number[]): boolean => {
  return a.length === b.length && a.every((val, i) => val === b[i]);
};

// 퍼즐이 완료되었는지 확인
export const isPuzzleCompleted = (
  grid: NonogramGrid,
  puzzle: NonogramPuzzle
): boolean => {
  const { rowClues, colClues } = puzzle;

  // 모든 셀이 채워져있는지 확인
  if (grid.some((row) => row.some((cell) => cell === 'empty'))) {
    return false;
  }

  // 각 행 검증
  for (let row = 0; row < grid.length; row++) {
    if (!isLineValid(grid[row], rowClues[row])) {
      return false;
    }
  }

  // 각 열 검증
  for (let col = 0; col < grid[0].length; col++) {
    const column = grid.map((row) => row[col]);
    if (!isLineValid(column, colClues[col])) {
      return false;
    }
  }

  return true;
};

// 실수 개수 계산
export const countMistakes = (
  grid: NonogramGrid,
  solution: boolean[][]
): number => {
  let mistakes = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cellState = grid[row][col];
      const shouldBeFilled = solution[row][col];

      if (cellState === 'filled' && !shouldBeFilled) {
        mistakes++;
      } else if (cellState === 'marked' && shouldBeFilled) {
        mistakes++;
      }
    }
  }

  return mistakes;
};

// 샘플 퍼즐들
export const samplePuzzles: NonogramPuzzle[] = [
  {
    id: 'heart_5x5',
    name: '하트',
    size: { width: 5, height: 5 },
    solution: [
      [false, true, false, true, false],
      [true, true, true, true, true],
      [true, true, true, true, true],
      [false, true, true, true, false],
      [false, false, true, false, false],
    ],
    rowClues: [[1, 1], [5], [5], [3], [1]],
    colClues: [[2], [4], [4], [4], [2]],
  },
  {
    id: 'smile_7x7',
    name: '웃는 얼굴',
    size: { width: 7, height: 7 },
    solution: [
      [false, true, true, true, true, true, false],
      [true, false, false, false, false, false, true],
      [true, false, true, false, true, false, true],
      [true, false, false, false, false, false, true],
      [true, false, true, true, true, false, true],
      [true, false, false, false, false, false, true],
      [false, true, true, true, true, true, false],
    ],
    rowClues: [[5], [1, 1], [1, 1, 1], [1, 1], [1, 3, 1], [1, 1], [5]],
    colClues: [[5], [1, 1], [1, 1, 1, 1], [1, 1, 1], [1, 1, 1, 1], [1, 1], [5]],
  },
];

// 자동 해결 힌트 (간단한 로직)
export const getHint = (
  grid: NonogramGrid,
  puzzle: NonogramPuzzle
): { row: number; col: number; action: CellState } | null => {
  const { solution } = puzzle;

  // 확실히 칠해야 하는 셀 찾기
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 'empty') {
        if (solution[row][col]) {
          return { row, col, action: 'filled' };
        } else {
          return { row, col, action: 'marked' };
        }
      }
    }
  }

  return null;
};
