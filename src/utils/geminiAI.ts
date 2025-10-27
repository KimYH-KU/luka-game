import { GoogleGenerativeAI } from '@google/generative-ai';
import { GameBoard, Direction } from '../types/game';

// Gemini API 클라이언트 초기화
const getGeminiClient = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  // 디버깅 로그
  console.log('🔍 Gemini API 키 확인:');
  console.log('- 환경:', process.env.NODE_ENV);
  console.log('- API 키 존재:', !!apiKey);
  console.log('- API 키 길이:', apiKey?.length);
  console.log('- API 키 시작:', apiKey?.substring(0, 10) + '...');

  if (!apiKey) {
    console.warn('⚠️ Gemini API key not found. AI features will be disabled.');
    console.warn(
      '💡 .env 파일에 REACT_APP_GEMINI_API_KEY를 추가하고 앱을 재시작하세요!'
    );
    return null;
  }

  console.log('✅ Gemini 클라이언트 초기화 성공');
  return new GoogleGenerativeAI(apiKey);
};

// 보드를 텍스트로 변환
const boardToString = (board: GameBoard): string => {
  return board
    .map(
      (row, i) =>
        `Row ${i + 1}: [${row
          .map((cell) => (cell ? cell.toString().padStart(4) : '   .'))
          .join(' | ')}]`
    )
    .join('\n');
};

// Gemini에게 최적의 수 물어보기
export const getAIMoveFromGemini = async (
  board: GameBoard
): Promise<{
  direction: Direction | null;
  reasoning: string;
  confidence: number;
  error?: string;
}> => {
  const client = getGeminiClient();

  if (!client) {
    return {
      direction: null,
      reasoning: 'API 키가 설정되지 않았습니다.',
      confidence: 0,
      error: 'NO_API_KEY',
    };
  }

  try {
    const boardString = boardToString(board);

    // Gemini 1.5 Flash 모델 사용 (무료, 빠름)
    // 최신 API는 models/ 접두사 없이 사용
    const model = client.getGenerativeModel({
      model: 'gemini-flash-latest',
    });

    const prompt = `당신은 2048 게임의 전문가입니다. 다음 보드 상태를 분석하고 최적의 수를 추천해주세요.

현재 보드 상태:
${boardString}

다음 형식으로 정확히 답변해주세요:
DIRECTION: [up/down/left/right 중 하나]
CONFIDENCE: [0-100 사이의 숫자]
REASONING: [한 문장으로 이유 설명]

예시:
DIRECTION: left
CONFIDENCE: 85
REASONING: 큰 타일들을 왼쪽으로 모아서 합칠 수 있는 기회를 만들 수 있습니다.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    // 응답 파싱
    const directionMatch = responseText.match(
      /DIRECTION:\s*(up|down|left|right)/i
    );
    const confidenceMatch = responseText.match(/CONFIDENCE:\s*(\d+)/i);
    const reasoningMatch = responseText.match(/REASONING:\s*(.+)/i);

    const direction = directionMatch
      ? (directionMatch[1].toLowerCase() as Direction)
      : null;
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 50;
    const reasoning = reasoningMatch
      ? reasoningMatch[1].trim()
      : '최적의 수를 찾았습니다.';

    return {
      direction,
      reasoning,
      confidence,
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);

    return {
      direction: null,
      reasoning: 'AI 분석 중 오류가 발생했습니다.',
      confidence: 0,
      error: error.message,
    };
  }
};

// 보드 상태에 대한 상세 분석 요청
export const getDetailedAnalysisFromGemini = async (
  board: GameBoard
): Promise<string> => {
  const client = getGeminiClient();

  if (!client) {
    return '⚠️ Gemini API가 설정되지 않았습니다. .env 파일에 REACT_APP_GEMINI_API_KEY를 추가해주세요.';
  }

  try {
    const boardString = boardToString(board);

    const model = client.getGenerativeModel({
      model: 'gemini-flash-latest',
    });

    const prompt = `2048 게임 전문가로서 다음 보드를 분석하고 전략적 조언을 해주세요:

${boardString}

다음 내용을 포함해주세요:
1. 현재 보드의 강점과 약점
2. 주의해야 할 위험 요소
3. 앞으로의 전략 방향
4. 구체적인 다음 3수 추천

친근하고 이해하기 쉬운 한국어로 답변해주세요.`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return '⚠️ AI 분석 중 오류가 발생했습니다.';
  }
};

// API 사용 가능 여부 확인
export const isGeminiAvailable = (): boolean => {
  return !!process.env.REACT_APP_GEMINI_API_KEY;
};
