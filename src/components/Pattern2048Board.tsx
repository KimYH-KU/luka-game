import React from 'react';
import { PatternBoard, PatternBoardShape } from '../types/pattern2048';
import { TILE_COLORS, TILE_TEXT_COLORS } from '../utils/constants';
import './Pattern2048Board.css';

interface Pattern2048BoardProps {
  board: PatternBoard;
  boardShape: PatternBoardShape;
}

const Pattern2048Board: React.FC<Pattern2048BoardProps> = ({
  board,
  boardShape,
}) => {
  const getTileClassName = (row: number, col: number): string => {
    const tile = board[row][col];
    let className = 'pattern-tile';

    if (!boardShape[row][col]) {
      className += ' disabled'; // 패턴 외부
    } else if (tile.value !== null) {
      className += ' has-value';
      if (tile.isNew) className += ' new-tile';
      if (tile.isMerged) className += ' merged-tile';
    }

    return className;
  };

  const getTileStyle = (row: number, col: number) => {
    const tile = board[row][col];

    if (!boardShape[row][col]) {
      return {
        backgroundColor: '#cdc1b4',
        opacity: 0.3,
      };
    }

    if (tile.value === null) {
      return {
        backgroundColor: 'rgba(238, 228, 218, 0.35)',
      };
    }

    return {
      backgroundColor: TILE_COLORS[tile.value] || '#3c3a32',
      color: TILE_TEXT_COLORS[tile.value] || '#f9f6f2',
    };
  };

  const getFontSize = (value: number): string => {
    if (value < 10) return '32px';
    if (value < 100) return '28px';
    if (value < 1000) return '24px';
    return '20px';
  };

  return (
    <div className="pattern-board-container">
      <div className="pattern-board">
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getTileClassName(rowIndex, colIndex)}
              style={{
                ...getTileStyle(rowIndex, colIndex),
                fontSize: tile.value ? getFontSize(tile.value) : '16px',
                gridColumn: colIndex + 1,
                gridRow: rowIndex + 1,
              }}
            >
              {boardShape[rowIndex][colIndex] && tile.value && tile.value}
            </div>
          ))
        )}
      </div>

      <div className="board-legend">
        <div className="legend-item">
          <div className="legend-color active"></div>
          <span>게임 가능한 칸</span>
        </div>
        <div className="legend-item">
          <div className="legend-color disabled"></div>
          <span>사용할 수 없는 칸</span>
        </div>
      </div>
    </div>
  );
};

export default Pattern2048Board;
