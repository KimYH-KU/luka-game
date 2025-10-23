import React from 'react';
import {
  NonogramGrid as GridType,
  CellState,
  NonogramPuzzle,
} from '../types/nonogram';
import './NonogramGrid.css';

interface NonogramGridProps {
  grid: GridType;
  puzzle: NonogramPuzzle;
  onCellClick: (row: number, col: number, clickType: 'left' | 'right') => void;
  showMistakes?: boolean;
}

const NonogramGrid: React.FC<NonogramGridProps> = ({
  grid,
  puzzle,
  onCellClick,
  showMistakes = false,
}) => {
  const { rowClues, colClues, solution } = puzzle;

  const handleCellClick = (
    row: number,
    col: number,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    const clickType = event.button === 2 ? 'right' : 'left';
    onCellClick(row, col, clickType);
  };

  const getCellClassName = (
    row: number,
    col: number,
    cellState: CellState
  ): string => {
    let className = 'nonogram-cell';

    switch (cellState) {
      case 'filled':
        className += ' filled';
        break;
      case 'marked':
        className += ' marked';
        break;
      default:
        className += ' empty';
    }

    // 실수 표시
    if (showMistakes && cellState !== 'empty') {
      const shouldBeFilled = solution[row][col];
      const isMistake =
        (cellState === 'filled' && !shouldBeFilled) ||
        (cellState === 'marked' && shouldBeFilled);

      if (isMistake) {
        className += ' mistake';
      }
    }

    return className;
  };

  return (
    <div className="nonogram-container">
      {/* 열 힌트 */}
      <div className="col-clues">
        {colClues.map((clue, colIndex) => (
          <div key={colIndex} className="col-clue">
            {clue.map((num, index) => (
              <div key={index} className="clue-number">
                {num === 0 ? '' : num}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 메인 그리드 영역 */}
      <div className="grid-area">
        {/* 행 힌트 */}
        <div className="row-clues">
          {rowClues.map((clue, rowIndex) => (
            <div key={rowIndex} className="row-clue">
              {clue.map((num, index) => (
                <span key={index} className="clue-number">
                  {num === 0 ? '' : num}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* 게임 그리드 */}
        <div
          className="nonogram-grid"
          style={{
            gridTemplateColumns: `repeat(${puzzle.size.width}, 1fr)`,
            gridTemplateRows: `repeat(${puzzle.size.height}, 1fr)`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cellState, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClassName(rowIndex, colIndex, cellState)}
                onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleCellClick(rowIndex, colIndex, e);
                }}
              >
                {cellState === 'marked' && '×'}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NonogramGrid;
