import React, { useState } from 'react';
import { NonogramPuzzle, NonogramGameState } from '../types/nonogram';
import { samplePuzzles } from '../utils/nonogramLogic';
import NonogramGrid from './NonogramGrid';
import './NonogramGame.css';

interface NonogramGameProps {
  gameState: NonogramGameState;
  handleCellClick: (
    row: number,
    col: number,
    clickType: 'left' | 'right'
  ) => void;
  startNewGame: (puzzle?: NonogramPuzzle) => void;
  useHint: () => void;
  clearGrid: () => void;
  gameStats: {
    elapsedTime: number;
    accuracy: number;
    completion: number;
  };
  selectedPuzzle: NonogramPuzzle;
  setSelectedPuzzle: (puzzle: NonogramPuzzle) => void;
}

const NonogramGame: React.FC<NonogramGameProps> = ({
  gameState,
  handleCellClick,
  startNewGame,
  useHint,
  clearGrid,
  gameStats,
  selectedPuzzle,
  setSelectedPuzzle,
}) => {
  const [showMistakes, setShowMistakes] = useState(false);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePuzzleChange = (puzzle: NonogramPuzzle) => {
    setSelectedPuzzle(puzzle);
    startNewGame(puzzle);
  };

  return (
    <div className="nonogram-game">
      <div className="game-header">
        <h1>네모네모로직</h1>

        <div className="puzzle-selector">
          <label htmlFor="puzzle-select">퍼즐 선택:</label>
          <select
            id="puzzle-select"
            value={selectedPuzzle.id}
            onChange={(e) => {
              const puzzle = samplePuzzles.find((p) => p.id === e.target.value);
              if (puzzle) handlePuzzleChange(puzzle);
            }}
          >
            {samplePuzzles.map((puzzle) => (
              <option key={puzzle.id} value={puzzle.id}>
                {puzzle.name} ({puzzle.size.width}×{puzzle.size.height})
              </option>
            ))}
          </select>
        </div>

        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">시간:</span>
            <span className="stat-value">
              {formatTime(gameStats.elapsedTime)}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">실수:</span>
            <span className="stat-value">{gameState.mistakes}</span>
          </div>
          <div className="stat">
            <span className="stat-label">힌트 사용:</span>
            <span className="stat-value">{gameState.hintsUsed}</span>
          </div>
          <div className="stat">
            <span className="stat-label">진행도:</span>
            <span className="stat-value">
              {Math.round(gameStats.completion)}%
            </span>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="game-controls">
          <button
            className="control-button new-game"
            onClick={() => startNewGame()}
          >
            새 게임
          </button>

          <button
            className="control-button hint"
            onClick={useHint}
            disabled={gameState.isCompleted}
          >
            힌트
          </button>

          <button
            className="control-button clear"
            onClick={clearGrid}
            disabled={gameState.isCompleted}
          >
            초기화
          </button>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showMistakes}
              onChange={(e) => setShowMistakes(e.target.checked)}
            />
            실수 표시
          </label>
        </div>

        <div className="game-main-area">
          <NonogramGrid
            grid={gameState.grid}
            puzzle={gameState.puzzle}
            onCellClick={handleCellClick}
            showMistakes={showMistakes}
          />

          {gameState.isCompleted && (
            <div className="completion-message">
              <h2>🎉 퍼즐 완성!</h2>
              <p>완료 시간: {formatTime(gameStats.elapsedTime)}</p>
              <p>정확도: {Math.round(gameStats.accuracy)}%</p>
              <p>힌트 사용: {gameState.hintsUsed}회</p>
              <button
                className="control-button new-game"
                onClick={() => startNewGame()}
              >
                다시 도전
              </button>
            </div>
          )}
        </div>

        <div className="game-instructions">
          <h3>게임 방법</h3>
          <ul>
            <li>
              <strong>왼쪽 클릭:</strong> 셀을 칠하거나 지웁니다
            </li>
            <li>
              <strong>우클릭:</strong> X 표시로 "칠하면 안 되는" 셀을 표시합니다
            </li>
            <li>
              <strong>숫자 힌트:</strong> 각 행과 열에서 연속으로 칠해야 하는
              셀의 개수를 나타냅니다
            </li>
            <li>
              <strong>목표:</strong> 모든 힌트를 만족하는 패턴을 완성하세요!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NonogramGame;
