import React from 'react';
import './GameModal.css';

interface GameModalProps {
  isOpen: boolean;
  type: 'win' | 'gameOver';
  score: number;
  bestScore: number;
  onNewGame: () => void;
  onContinue?: () => void;
}

const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  type,
  score,
  bestScore,
  onNewGame,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={`modal-header ${type}`}>
          <h2>{type === 'win' ? '🎉 축하합니다!' : '😢 게임 오버'}</h2>
        </div>

        <div className="modal-body">
          {type === 'win' ? (
            <div className="win-message">
              <p>2048 타일을 만드셨네요!</p>
              <p>계속해서 더 높은 점수에 도전해보세요!</p>
            </div>
          ) : (
            <div className="game-over-message">
              <p>더 이상 움직일 수 없습니다.</p>
              <p>다시 도전해보세요!</p>
            </div>
          )}

          <div className="final-scores">
            <div className="final-score">
              <span className="score-label">최종 점수</span>
              <span className="score-value">{score.toLocaleString()}</span>
            </div>

            {score === bestScore && score > 0 && (
              <div className="new-record">✨ 새로운 최고 기록! ✨</div>
            )}

            <div className="best-score">
              <span className="score-label">최고 점수</span>
              <span className="score-value">{bestScore.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          {type === 'win' && onContinue && (
            <button className="continue-button" onClick={onContinue}>
              계속하기
            </button>
          )}
          <button className="new-game-button" onClick={onNewGame}>
            새 게임
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
