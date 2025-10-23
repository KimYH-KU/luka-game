import React, { useState } from 'react';
import { AIAnalysis } from '../types/game';
import './AIPanel.css';

interface AIPanelProps {
  analysis: AIAnalysis | null;
  onAIMove: () => void;
  isGameActive: boolean;
}

const AIPanel: React.FC<AIPanelProps> = ({
  analysis,
  onAIMove,
  isGameActive,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
            AI가 대신 움직이기
          </button>
        </div>

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
