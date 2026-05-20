# Aphantasia Profile Test

자가보고 기반의 짧은 Aphantasia 테스트 웹사이트입니다.

## 기능

- 이름, 성별, MBTI 입력 후 테스트 시작
- 시각 심상 핵심 문항, 공간 지각 서브 문항, 안면 인식 서브 문항
- 브라우저 로컬 계산만 수행하며 이번 버전에서는 데이터 수집 없음
- 결과 리포트 이미지 다운로드
- 결과 리포트 PDF 다운로드
- Kakao JavaScript SDK 키가 있으면 카카오톡 공유, 없으면 Web Share/클립보드 fallback

## 개발

```bash
npm install
npm run dev
```

## 배포

```bash
npm run build
vercel deploy --prod
```

## 카카오 공유 설정

카카오톡 공유를 실제로 열려면 Kakao Developers에서 JavaScript 키와 도메인 등록이 필요합니다.

```bash
NEXT_PUBLIC_KAKAO_JS_KEY=...
```

키가 없으면 공유 버튼은 네이티브 공유 또는 링크 복사로 동작합니다.

## 근거와 한계

문항은 VVIQ 계열 시각 심상 평가, Aphantasia 연구, object/spatial imagery 구분, PI20 안면 인식 자기보고 연구를 참고해 새로 작성했습니다. 이 서비스는 의학적 또는 심리학적 진단 도구가 아닙니다.
