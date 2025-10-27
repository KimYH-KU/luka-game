# 🎮 2048 AI Game - Gemini AI 통합

React + TypeScript로 만든 **3가지 게임이 통합된** 인터랙티브 게임 플랫폼입니다.

## ✨ 주요 기능

### 🎯 3가지 게임 모드

1. **2048 게임** - AI 도우미 기능 포함
2. **네모네모로직** - 퍼즐 게임
3. **패턴 보드 2048** - 두 게임의 하이브리드

### 🤖 AI 기능

- **알고리즘 AI**: 미니맥스 알고리즘 기반 (무료)
- **Gemini AI**: Google Gemini 1.5 Flash 모델 기반 (무료!)
  - 보드 상태 분석
  - 최적의 수 추천
  - 전략적 조언 제공
  - **완전 무료** (일일 1,500회 요청)

## 🚀 시작하기

### 설치

```bash
npm install
```

### Gemini AI 설정 (선택사항, 무료!)

1. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 API 키 발급
2. 프로젝트 루트에 `.env` 파일 생성
3. 다음 내용 추가:

```env
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## 🎮 게임 소개

### 1. 2048 게임

클래식 2048 게임에 AI 도우미 기능이 추가되었습니다.

**기능:**

- 4x4 그리드
- 키보드 조작 (화살표 키, WASD)
- 실행 취소 기능
- 실시간 AI 분석 및 추천
- Gemini AI 통합 (무료!)

### 2. 네모네모로직

숫자 힌트를 보고 그림을 완성하는 퍼즐 게임입니다.

### 3. 패턴 보드 2048

네모네모로직과 2048을 결합한 독특한 게임입니다.

Made with ❤️ using React + TypeScript + Google Gemini AI
