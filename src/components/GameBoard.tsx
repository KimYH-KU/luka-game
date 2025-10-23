import React from 'react';
import { GameBoard as GameBoardType } from '../types/game';
import Tile from './Tile';
import './GameBoard.css';

interface GameBoardProps {
  board: GameBoardType;
}

const GameBoard: React.FC<GameBoardProps> = ({ board }) => {
  return (
    <div className="game-board">
      <div className="grid-container">
        {/* 배경 그리드 */}
        {Array.from({ length: 16 }).map((_, index) => (
          <div key={index} className="grid-cell" />
        ))}

        {/* 타일들 */}
        <div className="tiles-container">
          {board.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                value={value}
                position={{ row: rowIndex, col: colIndex }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
