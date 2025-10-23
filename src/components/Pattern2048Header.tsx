import React from 'react';
import './Pattern2048Header.css';

interface Pattern2048HeaderProps {
  score: number;
  bestScore: number;
  targetTile: number;
  movesCount: number;
  elapsedTime: string;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

const Pattern2048Header: React.FC<Pattern2048HeaderProps> = ({
  score,
  bestScore,
  targetTile,
  movesCount,
  elapsedTime,
  onNewGame,
  onUndo,
  canUndo,
}) => {
  return (
    <div className="pattern-header-container">
      <div className="pattern-game-info">
        <h2 className="pattern-game-title">패턴 보드 2048</h2>
        <p className="pattern-game-goal">
          목표: <strong>{targetTile} 타일</strong>을 만드세요!
        </p>
      </div>

      <div className="pattern-stats">
        <div className="stat-box score">
          <div className="stat-label">점수</div>
          <div className="stat-value">{score.toLocaleString()}</div>
        </div>

        <div className="stat-box best">
          <div className="stat-label">최고점수</div>
          <div className="stat-value">{bestScore.toLocaleString()}</div>
        </div>

        <div className="stat-box moves">
          <div className="stat-label">움직임</div>
          <div className="stat-value">{movesCount}</div>
        </div>

        <div className="stat-box time">
          <div className="stat-label">시간</div>
          <div className="stat-value">{elapsedTime}</div>
        </div>
      </div>

      <div className="pattern-controls">
        <button className="control-button new-game" onClick={onNewGame}>
          새 게임
        </button>

        <button
          className={`control-button undo ${!canUndo ? 'disabled' : ''}`}
          onClick={onUndo}
          disabled={!canUndo}
        >
          실행 취소
        </button>
      </div>
    </div>
  );
};

export default Pattern2048Header;
