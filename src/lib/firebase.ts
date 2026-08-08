import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getFirestore, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import type { ConsultationPayload, PublishedReview, ReviewPayload } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
const app = isConfigured ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;

export async function saveConsultation(payload: ConsultationPayload) {
  if (!db) return { skipped: true };
  const ref = await addDoc(collection(db, 'consultations'), {
    ...payload,
    createdAt: serverTimestamp(),
    source: 'landing-page',
  });
  return { skipped: false, id: ref.id };
}

export async function saveReview(payload: ReviewPayload) {
  if (!db) throw new Error('리뷰 저장을 위한 Firebase 설정이 필요합니다.');

  const { website: _website, ...review } = payload;
  await setDoc(doc(db, 'reviews', payload.submissionId), {
    ...review,
    published: true,
    createdAt: serverTimestamp(),
    source: 'review-page',
  });

  return { id: payload.submissionId };
}

export function subscribePublishedReviews(
  onReviews: (reviews: PublishedReview[]) => void,
  onError?: (error: Error) => void,
) {
  if (!db) {
    onReviews([]);
    return () => undefined;
  }

  const reviewsQuery = query(collection(db, 'reviews'), where('published', '==', true));
  return onSnapshot(
    reviewsQuery,
    (snapshot) => {
      const reviews = snapshot.docs.map((reviewDoc) => {
        const data = reviewDoc.data();
        return {
          id: reviewDoc.id,
          submissionId: data.submissionId,
          displayName: data.displayName,
          course: data.course,
          before: data.before,
          helpful: data.helpful,
          change: data.change,
          recommend: data.recommend,
          consentToPublish: data.consentToPublish,
          published: true as const,
          createdAt: data.createdAt?.toDate?.(),
        } satisfies PublishedReview;
      });

      reviews.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
      onReviews(reviews);
    },
    (error) => onError?.(error),
  );
}
