import React, { useState } from 'react';
import { AIAnalysis, GameBoard } from '../types/game';
import {
  getAIMoveFromGemini,
  getDetailedAnalysisFromGemini,
  isGeminiAvailable,
} from '../utils/geminiAI';
import './AIPanel.css';

interface AIPanelProps {
  analysis: AIAnalysis | null;
  onAIMove: () => void;
  isGameActive: boolean;
  board: GameBoard;
}

const AIPanel: React.FC<AIPanelProps> = ({
  analysis,
  onAIMove,
  isGameActive,
  board,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<string | null>(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);

  if (!analysis) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'high':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'left':
        return '←';
      case 'right':
        return '→';
      default:
        return '?';
    }
  };

  const getDirectionName = (direction: string) => {
    switch (direction) {
      case 'up':
        return '위';
      case 'down':
        return '아래';
      case 'left':
        return '왼쪽';
      case 'right':
        return '오른쪽';
      default:
        return '알 수 없음';
    }
  };

  // Gemini AI로 상세 분석 요청
  const handleGeminiAnalysis = async () => {
    setIsLoadingGemini(true);
    try {
      const detailedAnalysis = await getDetailedAnalysisFromGemini(board);
      setGeminiAnalysis(detailedAnalysis);
    } catch (error) {
      setGeminiAnalysis('⚠️ 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingGemini(false);
    }
  };

  // Gemini AI로 움직이기
  const handleGeminiMove = async () => {
    if (!isGameActive) return;

    setIsLoadingGemini(true);
    try {
      const result = await getAIMoveFromGemini(board);
      if (result.direction) {
        console.log('Gemini 추천:', result);
        alert(
          `🤖 Gemini 추천: ${getDirectionName(result.direction)}\n\n💡 이유: ${
            result.reasoning
          }\n\n📊 신뢰도: ${result.confidence}%`
        );
      } else {
        alert('Gemini AI가 수를 추천할 수 없습니다: ' + result.reasoning);
      }
    } catch (error) {
      alert('Gemini AI 오류가 발생했습니다.');
    } finally {
      setIsLoadingGemini(false);
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <h3>AI 도우미</h3>
        <button
          className={`ai-toggle ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      <div className={`ai-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="ai-suggestion">
          <div className="best-move">
            <span className="move-icon">
              {getDirectionIcon(analysis.bestMove)}
            </span>
            <span className="move-text">
              추천: <strong>{getDirectionName(analysis.bestMove)}</strong>
            </span>
          </div>

          <div className="risk-indicator">
            <span
              className="risk-level"
              style={{ color: getRiskColor(analysis.riskLevel) }}
            >
              위험도:{' '}
              {analysis.riskLevel === 'low'
                ? '낮음'
                : analysis.riskLevel === 'medium'
                ? '보통'
                : '높음'}
            </span>
          </div>
        </div>

        <div className="ai-advice">
          <p>{analysis.advice}</p>
        </div>

        <div className="ai-actions">
          <button
            className={`ai-move-button ${!isGameActive ? 'disabled' : ''}`}
            onClick={onAIMove}
            disabled={!isGameActive}
          >
            🤖 알고리즘 AI 움직이기
          </button>

          {isGeminiAvailable() && (
            <>
              <button
                className={`ai-move-button gemini-button ${
                  !isGameActive || isLoadingGemini ? 'disabled' : ''
                }`}
                onClick={handleGeminiMove}
                disabled={!isGameActive || isLoadingGemini}
                style={{
                  marginTop: '10px',
                  background:
                    'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
                }}
              >
                {isLoadingGemini ? '⏳ 분석 중...' : '✨ Gemini AI 추천받기'}
              </button>

              <button
                className={`ai-move-button analysis-button ${
                  isLoadingGemini ? 'disabled' : ''
                }`}
                onClick={handleGeminiAnalysis}
                disabled={isLoadingGemini}
                style={{
                  marginTop: '10px',
                  background:
                    'linear-gradient(135deg, #EA4335 0%, #FBBC04 100%)',
                }}
              >
                {isLoadingGemini ? '⏳ 분석 중...' : '📊 상세 분석 요청'}
              </button>
            </>
          )}
        </div>

        {geminiAnalysis && (
          <div
            className="gemini-analysis"
            style={{
              marginTop: '15px',
              padding: '15px',
              background: '#f0f8ff',
              borderRadius: '8px',
              borderLeft: '4px solid #4285F4',
              fontSize: '13px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
              ✨ Gemini 분석:
            </h4>
            <p style={{ margin: 0, color: '#555' }}>{geminiAnalysis}</p>
          </div>
        )}

        {analysis.alternativeMoves.length > 0 && (
          <div className="alternative-moves">
            <h4>다른 선택지:</h4>
            <div className="moves-list">
              {analysis.alternativeMoves.slice(0, 3).map((move, index) => (
                <div key={index} className="alternative-move">
                  <span className="alt-move-icon">
                    {getDirectionIcon(move.direction)}
                  </span>
                  <span className="alt-move-name">
                    {getDirectionName(move.direction)}
                  </span>
                  <span className="alt-move-reason">{move.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;
