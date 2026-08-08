# AI 웹·앱 제작 멘토링 랜딩페이지

React + Vite + TypeScript로 만든 반응형 상세페이지입니다. 상담 신청과 후기는 Cloud Firestore에 저장되고, FormSubmit을 통해 이메일로 전송됩니다.

## 포함 기능

- 상세페이지 13개 섹션
- 15분 무료상담 / 유료 프로젝트 진단 모달
- 모바일·태블릿·PC 반응형 디자인
- Firebase Firestore 상담 저장
- FormSubmit 이메일 알림
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

FormSubmit은 웹 서버 주소에서 실행해야 하므로 `npm run dev` 또는 배포된 Firebase Hosting 주소에서 제출 흐름을 확인합니다.

## Firebase 설정

1. Firebase 프로젝트를 생성합니다.
2. Web App을 등록하고 `.env.local`에 `VITE_FIREBASE_*` 값을 입력합니다.
3. Cloud Firestore 데이터베이스를 생성합니다.
4. 포함된 `firestore.rules`를 배포합니다: `firebase deploy --only firestore:rules`

Firebase Web 설정이 없으면 페이지는 표시되지만 상담 및 후기 제출은 완료되지 않습니다.

## 이메일 알림 설정

별도의 API 키나 Cloud Functions가 필요하지 않습니다. 상담 또는 리뷰 폼을 처음 제출하면 `guatemala3081@gmail.com`으로 FormSubmit 활성화 메일이 발송됩니다. 메일의 활성화 링크를 한 번 클릭하면 이후 제출부터 알림 메일이 정상 수신됩니다. 활성화 전 제출도 최대 30일 동안 보관되며 활성화 후 전달됩니다.

Hosting과 Firestore Rules를 배포합니다.

```bash
firebase deploy --only hosting,firestore:rules
```

## 수강 후기

수강생에게 `https://배포도메인/review` 링크를 전달하면 됩니다. 후기 제출 시 FormSubmit 알림이 먼저 전송되고 Firestore의 `reviews` 컬렉션에 공개 상태로 저장됩니다. 저장이 완료되면 메인 페이지의 후기 섹션으로 이동합니다.

리뷰 기능을 사용하려면 Firebase Web 설정과 배포된 `firestore.rules`가 필요합니다.

## GitHub 자동 배포

기존 GitHub Actions는 Firebase Hosting을 자동 배포합니다. 저장소의 Settings > Secrets and variables > Actions에 여섯 개의 `VITE_FIREBASE_*` 값을 등록해야 GitHub 빌드에서도 Firestore 설정이 포함됩니다.

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
