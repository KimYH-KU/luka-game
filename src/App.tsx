import React, { useState, useCallback, useEffect } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { useNonogramGame } from './hooks/useNonogramGame';
import { usePattern2048Game } from './hooks/usePattern2048Game';
import { useKeyboard } from './hooks/useKeyboard';
import { analyzeBoard, findBestMove, analyzePlayStyle } from './utils/aiLogic';
import { samplePuzzles } from './utils/nonogramLogic';
import { AIAnalysis } from './types/game';

import GameHeader from './components/GameHeader';
import GameBoard from './components/GameBoard';
import AIPanel from './components/AIPanel';
import GameModal from './components/GameModal';
import NonogramGame from './components/NonogramGame';
import Pattern2048Game from './components/Pattern2048Game';

import './App.css';

type AppMode = '2048' | 'nonogram' | 'pattern2048';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('2048');

  // 2048 게임 상태
  const {
    gameState,
    makeMove,
    startNewGame,
    undoMove,
    continueGame,
    moveHistory,
  } = useGameLogic();

  // 네모네모로직 게임 상태
  const [selectedPuzzle, setSelectedPuzzle] = useState(samplePuzzles[0]);
  const nonogramGameLogic = useNonogramGame(selectedPuzzle);

  // 패턴 2048 게임 상태
  const [patternPuzzle] = useState(samplePuzzles[0]);
  const patternGameLogic = usePattern2048Game(patternPuzzle);
  const patternNonogramLogic = useNonogramGame(patternPuzzle);

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [playStyleTip, setPlayStyleTip] = useState<string>('');

  // 키보드 입력 처리
  useKeyboard(makeMove);

  // AI 분석 업데이트
  useEffect(() => {
    if (!gameState.isGameOver && !gameState.isWin) {
      const analysis = analyzeBoard(gameState.board);
      setAiAnalysis(analysis);
    } else {
      setAiAnalysis(null);
    }
  }, [gameState.board, gameState.isGameOver, gameState.isWin]);

  // 플레이 스타일 분석
  useEffect(() => {
    const tip = analyzePlayStyle(moveHistory);
    setPlayStyleTip(tip);
  }, [moveHistory]);

  // AI가 대신 움직이기
  const handleAIMove = useCallback(() => {
    if (gameState.isGameOver || gameState.isWin) return;

    const bestMove = findBestMove(gameState.board);
    makeMove(bestMove);
  }, [gameState.board, gameState.isGameOver, gameState.isWin, makeMove]);

  // 새 게임 시작
  const handleNewGame = useCallback(() => {
    startNewGame();
    setPlayStyleTip('');
  }, [startNewGame]);

  const isGameActive = !gameState.isGameOver && !gameState.isWin;

  return (
    <div className="App">
      <div className="mode-selector">
        <button
          className={`mode-button ${currentMode === '2048' ? 'active' : ''}`}
          onClick={() => setCurrentMode('2048')}
        >
          2048 게임
        </button>
        <button
          className={`mode-button ${
            currentMode === 'nonogram' ? 'active' : ''
          }`}
          onClick={() => setCurrentMode('nonogram')}
        >
          네모네모로직
        </button>
        <button
          className={`mode-button ${
            currentMode === 'pattern2048' ? 'active' : ''
          }`}
          onClick={() => setCurrentMode('pattern2048')}
        >
          패턴 보드 2048
        </button>
      </div>

      {currentMode === '2048' ? (
        <div className="game-2048-container">
          <GameHeader
            score={gameState.score}
            bestScore={gameState.bestScore}
            onNewGame={handleNewGame}
            onUndo={undoMove}
            canUndo={gameState.canUndo}
          />

          <div className="game-2048-content">
            <div className="game-2048-main">
              <GameBoard board={gameState.board} />
            </div>

            <div className="game-2048-sidebar">
              <AIPanel
                analysis={aiAnalysis}
                onAIMove={handleAIMove}
                isGameActive={isGameActive}
                board={gameState.board}
              />
            </div>
          </div>

          {playStyleTip && (
            <div className="play-style-tip">💡 {playStyleTip}</div>
          )}

          <GameModal
            isOpen={gameState.isGameOver || gameState.isWin}
            type={gameState.isWin ? 'win' : 'gameOver'}
            score={gameState.score}
            bestScore={gameState.bestScore}
            onNewGame={handleNewGame}
            onContinue={gameState.isWin ? continueGame : undefined}
          />
        </div>
      ) : currentMode === 'nonogram' ? (
        <NonogramGame
          {...nonogramGameLogic}
          selectedPuzzle={selectedPuzzle}
          setSelectedPuzzle={setSelectedPuzzle}
        />
      ) : (
        <Pattern2048Game
          {...patternGameLogic}
          nonogramGameState={patternNonogramLogic.gameState}
          nonogramHandleCellClick={patternNonogramLogic.handleCellClick}
          nonogramStartNewGame={patternNonogramLogic.startNewGame}
          nonogramUseHint={patternNonogramLogic.useHint}
          nonogramClearGrid={patternNonogramLogic.clearGrid}
          nonogramGameStats={patternNonogramLogic.gameStats}
        />
      )}
    </div>
  );
}

export default App;
