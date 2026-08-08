import { useEffect, useState } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { getPublishedReviews } from '../lib/firebase';
import type { PublishedReview, ReviewCourse } from '../types';

const courseLabels: Record<ReviewCourse, string> = {
  diagnosis: '프로젝트 진단',
  web: '웹서비스 과정',
  ios: 'iPhone 앱 과정',
  other: '프로젝트 멘토링',
};

export function ReviewSection() {
  const [reviews, setReviews] = useState<PublishedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let active = true;
    getPublishedReviews()
      .then((nextReviews) => {
        if (!active) return;
        setReviews(nextReviews);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadError(true);
        setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <section className="section muted-section review-showcase" id="reviews">
      <div className="section-heading">
        <span className="eyebrow">수강 후기</span>
        <h2>작은 결과라도 구체적으로 보여드립니다.</h2>
        <p>실제 프로젝트를 진행한 수강생이 직접 남긴 경험입니다.</p>
      </div>

      {loading ? (
        <div className="review-empty">후기를 불러오고 있습니다.</div>
      ) : loadError ? (
        <div className="review-empty">후기를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</div>
      ) : reviews.length === 0 ? (
        <div className="review-empty"><MessageSquareQuote size={28} /><span>공개된 수강 후기가 아직 없습니다.</span></div>
      ) : (
        <div className="published-review-list">
          {reviews.map((review) => (
            <article className="published-review-card" key={review.id}>
              <header>
                <span className="review-course">{courseLabels[review.course] ?? courseLabels.other}</span>
                <strong>{review.displayName}</strong>
              </header>
              <blockquote>“{review.helpful}”</blockquote>
              <div className="published-review-details">
                <div><span>수업 전</span><p>{review.before}</p></div>
                <div><span>달라진 점</span><p>{review.change}</p></div>
                <div><span>추천 대상</span><p>{review.recommend}</p></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
