import React from 'react';
import { PatternGameState, PatternGameStats } from '../types/pattern2048';
import { NonogramPuzzle } from '../types/nonogram';
import NonogramGame from './NonogramGame';
import Pattern2048Board from './Pattern2048Board';
import Pattern2048Header from './Pattern2048Header';
import Pattern2048Modal from './Pattern2048Modal';
import './Pattern2048Game.css';

interface Pattern2048GameProps {
  gameState: PatternGameState;
  gameStats: PatternGameStats;
  makeMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  undoMove: () => void;
  startNewGame: () => void;
  startPattern2048: (pattern: boolean[][]) => void;
  changePuzzle: (puzzle: NonogramPuzzle) => void;
  continueGame: () => void;
  // 네모네모로직 게임 props
  nonogramGameState: any;
  nonogramHandleCellClick: (
    row: number,
    col: number,
    clickType: 'left' | 'right'
  ) => void;
  nonogramStartNewGame: () => void;
  nonogramUseHint: () => void;
  nonogramClearGrid: () => void;
  nonogramGameStats: any;
}

const Pattern2048Game: React.FC<Pattern2048GameProps> = ({
  gameState,
  gameStats,
  makeMove,
  undoMove,
  startNewGame,
  startPattern2048,
  changePuzzle,
  continueGame,
  nonogramGameState,
  nonogramHandleCellClick,
  nonogramStartNewGame,
  nonogramUseHint,
  nonogramClearGrid,
  nonogramGameStats,
}) => {
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (gameState.phase !== 'game2048') return;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        makeMove('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        makeMove('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        makeMove('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        makeMove('right');
        break;
    }
  };

  // 새 게임 시작 (네모네모로직도 함께 초기화)
  const handleNewGame = () => {
    startNewGame(); // 패턴 2048 게임 초기화
    nonogramStartNewGame(); // 네모네모로직 게임 초기화
  };

  // 네모네모로직이 완료되면 자동으로 2048 게임 시작
  React.useEffect(() => {
    if (nonogramGameState.isCompleted && gameState.phase === 'nonogram') {
      setTimeout(() => {
        startPattern2048(gameState.selectedPuzzle.solution);
      }, 1000); // 1초 후 자동 전환
    }
  }, [
    nonogramGameState.isCompleted,
    gameState.phase,
    startPattern2048,
    gameState.selectedPuzzle.solution,
  ]);

  return (
    <div className="pattern-2048-game" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="pattern-header">
        <h1>패턴 보드 2048</h1>
        <div className="phase-indicator">
          {gameState.phase === 'nonogram' ? (
            <span className="phase-badge nonogram">1단계: 패턴 만들기</span>
          ) : (
            <span className="phase-badge game2048">2단계: 128 달성하기</span>
          )}
        </div>
      </div>

      {gameState.phase === 'nonogram' ? (
        <div className="nonogram-phase">
          <div className="phase-description">
            <p>네모네모로직을 풀어서 2048 게임의 보드 모양을 만드세요!</p>
            <p>완성된 패턴이 게임 보드가 됩니다.</p>
          </div>

          <NonogramGame
            gameState={nonogramGameState}
            handleCellClick={nonogramHandleCellClick}
            startNewGame={nonogramStartNewGame}
            useHint={nonogramUseHint}
            clearGrid={nonogramClearGrid}
            gameStats={nonogramGameStats}
            selectedPuzzle={gameState.selectedPuzzle}
            setSelectedPuzzle={changePuzzle}
          />
        </div>
      ) : (
        <div className="game2048-phase">
          <div className="phase-description">
            <p>특별한 모양의 보드에서 128 타일을 만드세요!</p>
            <p>패턴 밖의 칸은 사용할 수 없습니다.</p>
          </div>

          <Pattern2048Header
            score={gameState.score}
            bestScore={gameState.bestScore}
            targetTile={gameStats.targetTile}
            movesCount={gameStats.movesCount}
            elapsedTime={formatTime(gameStats.elapsedTime)}
            onNewGame={handleNewGame}
            onUndo={undoMove}
            canUndo={gameState.canUndo}
          />

          <div className="game-content">
            <Pattern2048Board
              board={gameState.board}
              boardShape={gameState.boardShape}
            />
          </div>

          <Pattern2048Modal
            isOpen={gameState.isGameOver || gameState.isWin}
            type={gameState.isWin ? 'win' : 'gameOver'}
            score={gameState.score}
            bestScore={gameState.bestScore}
            targetTile={gameStats.targetTile}
            movesCount={gameStats.movesCount}
            elapsedTime={formatTime(gameStats.elapsedTime)}
            onNewGame={handleNewGame}
            onContinue={gameState.isWin ? continueGame : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default Pattern2048Game;
