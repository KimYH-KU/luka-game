import React from 'react';
import './Pattern2048Modal.css';

interface Pattern2048ModalProps {
  isOpen: boolean;
  type: 'win' | 'gameOver';
  score: number;
  bestScore: number;
  targetTile: number;
  movesCount: number;
  elapsedTime: string;
  onNewGame: () => void;
  onContinue?: () => void;
}

const Pattern2048Modal: React.FC<Pattern2048ModalProps> = ({
  isOpen,
  type,
  score,
  bestScore,
  targetTile,
  movesCount,
  elapsedTime,
  onNewGame,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="pattern-modal-overlay">
      <div className="pattern-modal">
        <div className={`pattern-modal-header ${type}`}>
          <h2>{type === 'win' ? '🎉 축하합니다!' : '😢 게임 오버'}</h2>
        </div>

        <div className="pattern-modal-content">
          {type === 'win' ? (
            <div className="win-message">
              <p>
                <strong>{targetTile} 타일</strong>을 성공적으로 만드셨습니다!
              </p>
              <p>특별한 패턴 보드에서의 도전을 완료했어요!</p>
            </div>
          ) : (
            <div className="game-over-message">
              <p>더 이상 움직일 수 없습니다.</p>
              <p>새로운 패턴으로 다시 도전해보세요!</p>
            </div>
          )}

          <div className="final-stats">
            <div className="final-stat">
              <span className="stat-label">최종 점수</span>
              <span className="stat-value">{score.toLocaleString()}</span>
            </div>

            <div className="final-stat">
              <span className="stat-label">최고 점수</span>
              <span className="stat-value">{bestScore.toLocaleString()}</span>
            </div>

            <div className="final-stat">
              <span className="stat-label">총 움직임</span>
              <span className="stat-value">{movesCount}</span>
            </div>

            <div className="final-stat">
              <span className="stat-label">플레이 시간</span>
              <span className="stat-value">{elapsedTime}</span>
            </div>
          </div>
        </div>

        <div className="pattern-modal-actions">
          <button className="modal-button new-game" onClick={onNewGame}>
            새 게임 시작
          </button>

          {type === 'win' && onContinue && (
            <button className="modal-button continue" onClick={onContinue}>
              계속하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pattern2048Modal;
