import React from 'react';
import './GameHeader.css';

interface GameHeaderProps {
  score: number;
  bestScore: number;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  bestScore,
  onNewGame,
  onUndo,
  canUndo,
}) => {
  return (
    <div className="game-header">
      <div className="header-top">
        <h1 className="game-title">2048</h1>
        <div className="scores">
          <div className="score-box">
            <div className="score-label">점수</div>
            <div className="score-value">{score.toLocaleString()}</div>
          </div>
          <div className="score-box">
            <div className="score-label">최고점수</div>
            <div className="score-value">{bestScore.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <p className="game-description">
          <strong>HOW TO PLAY:</strong> 화살표 키나 WASD로 타일을 움직여서
          <strong> 2048 타일</strong>을 만드세요!
        </p>

        <div className="game-controls">
          <button
            className="control-button new-game-button"
            onClick={onNewGame}
          >
            새 게임
          </button>
          <button
            className={`control-button undo-button ${
              !canUndo ? 'disabled' : ''
            }`}
            onClick={onUndo}
            disabled={!canUndo}
          >
            되돌리기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
