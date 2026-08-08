# AI 웹·앱 제작 멘토링 랜딩페이지

React + Vite + TypeScript로 만든 반응형 상세페이지입니다. 상담 신청은 선택적으로 Cloud Firestore에 저장되고, Vercel Function과 Resend를 통해 이메일로 전송됩니다.

## 포함 기능

- 상세페이지 13개 섹션
- 15분 무료상담 / 유료 프로젝트 진단 모달
- 모바일·태블릿·PC 반응형 디자인
- Firebase Firestore 상담 저장
- Vercel Function + Resend 이메일 알림
- 별도 수강 후기 작성 페이지 (`/review`)
- 후기 즉시 공개 및 등록 알림 이메일
- 입력값 검증, 봇 방지용 honeypot
- 기본 SEO 메타태그
- 개인정보처리방침 초안

## 로컬 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

이메일 전송 API는 Vercel Functions 환경에서 동작합니다. 로컬 Vite 개발 서버만 실행할 경우 Firestore 저장은 가능하지만 `/api/consultation`은 별도 Vercel 로컬 환경이 필요합니다.

```bash
npm i -g vercel
vercel dev
```

## Firebase 설정

1. Firebase 프로젝트를 생성합니다.
2. Web App을 등록하고 `.env.local`에 `VITE_FIREBASE_*` 값을 입력합니다.
3. Cloud Firestore 데이터베이스를 생성합니다.
4. 포함된 `firestore.rules`를 Firebase Console의 Rules에 적용합니다.

Firebase가 설정되지 않아도 페이지는 실행됩니다. 이 경우 상담 폼은 이메일 API만 사용합니다.

## Resend 및 Vercel 설정

1. Resend에서 API Key를 생성합니다.
2. 발신 도메인을 인증합니다.
3. Vercel Project Settings > Environment Variables에 다음 값을 등록합니다.
   - `RESEND_API_KEY`
   - `CONSULTATION_TO_EMAIL`
   - `CONSULTATION_FROM_EMAIL`
   - `REVIEW_TO_EMAIL` (기본값: `guatemala3081@gmail.com`)
   - `REVIEW_FROM_EMAIL`
4. GitHub 저장소를 Vercel에 연결하거나 프로젝트 폴더에서 `vercel`을 실행합니다.

## 수강 후기

수강생에게 `https://배포도메인/review` 링크를 전달하면 됩니다. 후기 제출 시 Resend 알림이 먼저 전송되고 Firestore의 `reviews` 컬렉션에 공개 상태로 저장됩니다. 저장이 완료되면 메인 페이지의 후기 섹션으로 이동합니다.

리뷰 기능을 사용하려면 Firebase Web 설정, 배포된 `firestore.rules`, `RESEND_API_KEY`와 인증된 발신 도메인의 `REVIEW_FROM_EMAIL`이 필요합니다. 일반 Vite 개발 서버에서는 `/api/review`가 실행되지 않으므로 전체 제출 흐름은 `vercel dev` 또는 Vercel Preview 배포에서 확인합니다.

## 배포 전 반드시 교체할 내용

- `src/data/content.ts`: 가격, 경력 문구, 상품 범위
- `src/App.tsx`: 프로필 사진 영역, 실제 수강생 후기, 이메일 링크
- `public/privacy.html`: 운영자 이메일과 실제 정책
- `index.html`: 도메인에 맞는 OG 이미지 및 canonical URL

## 빌드 확인

```bash
npm run build
```

## 지원 범위 문구 주의

현재 문구는 App Store 최초 제출 후 30일 내 최대 2회의 보완 지원으로 제한했습니다. 최종 승인 보장이나 무기한 지원으로 변경하지 않는 것을 권장합니다.
