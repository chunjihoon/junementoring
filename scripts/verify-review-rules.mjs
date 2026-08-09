import { initializeApp } from 'firebase/app';
import {
  collection,
  connectFirestoreEmulator,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  terminate,
  where,
} from 'firebase/firestore';

const app = initializeApp({ projectId: 'codingwithjune-d9f4f' }, 'review-rules-test');
const db = getFirestore(app);
const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080').split(':');
connectFirestoreEmulator(db, host, Number(port));

const submissionId = 'review-emulator-test-000000000001';
await setDoc(doc(db, 'reviews', submissionId), {
  submissionId,
  displayName: '규칙 테스트',
  course: 'web',
  before: '수업 전 내용',
  helpful: '도움이 된 내용',
  change: '달라진 내용',
  recommend: '추천 대상',
  published: true,
  createdAt: serverTimestamp(),
  source: 'review-page',
});

const snapshot = await getDocs(query(collection(db, 'reviews'), where('published', '==', true)));
if (snapshot.size !== 1 || snapshot.docs[0].id !== submissionId) {
  throw new Error(`리뷰 조회 검증 실패: ${snapshot.size}건`);
}

async function expectDenied(name, operation) {
  try {
    await operation();
    throw new Error(`${name}: 거부되어야 하는 요청이 허용됨`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('거부되어야')) throw error;
  }
}

await expectDenied('비공개 리뷰', () => setDoc(doc(db, 'reviews', 'review-emulator-test-000000000002'), {
  submissionId: 'review-emulator-test-000000000002',
  displayName: '비공개 테스트',
  course: 'web',
  before: '수업 전 내용',
  helpful: '도움이 된 내용',
  change: '달라진 내용',
  recommend: '추천 대상',
  published: false,
}));

await expectDenied('필수 답변 누락 리뷰', () => setDoc(doc(db, 'reviews', 'review-emulator-test-000000000003'), {
  submissionId: 'review-emulator-test-000000000003',
  displayName: '누락 테스트',
  course: 'web',
  before: '수업 전 내용',
  helpful: '도움이 된 내용',
  change: '달라진 내용',
  published: true,
}));

const consultationId = 'consultation-emulator-test-00000001';
await setDoc(doc(db, 'consultations', consultationId), {
  submissionId: consultationId,
  type: 'paid',
  name: '상담 규칙 테스트',
  email: 'test@example.com',
  contact: 'test-contact',
  direction: 'web',
  experience: '개발 경험',
  idea: '서비스 아이디어',
  blocker: '현재 어려움',
  availability: '평일 저녁',
  createdAt: serverTimestamp(),
  source: 'landing-page',
});

console.log('PASS: 리뷰 생성·조회와 결제방식 없는 상담 신청 저장 성공, 잘못된 리뷰 거부 성공');
await terminate(db);
