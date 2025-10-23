import React from 'react';
import { TILE_COLORS, TILE_TEXT_COLORS } from '../utils/constants';
import './Tile.css';

interface TileProps {
  value: number | null;
  position: { row: number; col: number };
}

const Tile: React.FC<TileProps> = ({ value, position }) => {
  if (value === null) return null;

  const tileStyle = {
    backgroundColor: TILE_COLORS[value] || '#3c3a32',
    color: TILE_TEXT_COLORS[value] || '#f9f6f2',
    gridColumn: position.col + 1, // CSS Grid는 1부터 시작
    gridRow: position.row + 1, // CSS Grid는 1부터 시작
  };

  const getFontSize = (value: number): string => {
    if (value < 100) return '55px';
    if (value < 1000) return '45px';
    if (value < 10000) return '35px';
    return '30px';
  };

  return (
    <div
      className="tile"
      style={{
        ...tileStyle,
        fontSize: getFontSize(value),
      }}
    >
      {value}
    </div>
  );
};

export default Tile;
