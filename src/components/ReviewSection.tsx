import { useEffect, useState } from 'react';
import { ArrowRight, MessageSquareQuote, X } from 'lucide-react';
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
  const [selectedReview, setSelectedReview] = useState<PublishedReview | null>(null);

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

  useEffect(() => {
    if (!selectedReview) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedReview(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [selectedReview]);

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
              <blockquote><span>“{review.helpful}”</span></blockquote>
              <button className="review-detail-button" type="button" onClick={() => setSelectedReview(review)}>
                리뷰 자세히 보기 <ArrowRight size={17} />
              </button>
            </article>
          ))}
        </div>
      )}

      {selectedReview && (
        <div className="review-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedReview(null)}>
          <div className="review-detail-modal" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
            <button className="review-modal-close" type="button" onClick={() => setSelectedReview(null)} aria-label="리뷰 상세 닫기">
              <X size={22} />
            </button>
            <header>
              <span className="review-course">{courseLabels[selectedReview.course] ?? courseLabels.other}</span>
              <h2 id="review-modal-title">{selectedReview.displayName}님의 수강 후기</h2>
            </header>
            <div className="review-modal-answers">
              <article>
                <span>01</span>
                <h3>수업을 시작하기 전, 어떤 부분이 어렵거나 막막했나요?</h3>
                <p>{selectedReview.before}</p>
              </article>
              <article>
                <span>02</span>
                <h3>수업하면서 특히 도움이 됐던 부분이나 좋았던 점은 무엇인가요?</h3>
                <p>{selectedReview.helpful}</p>
              </article>
              <article>
                <span>03</span>
                <h3>수업 전과 비교해서 지금 달라진 점이나 직접 할 수 있게 된 것은 무엇인가요?</h3>
                <p>{selectedReview.change}</p>
              </article>
              <article>
                <span>04</span>
                <h3>어떤 분들에게 이 수업을 추천하고 싶나요?</h3>
                <p>{selectedReview.recommend}</p>
              </article>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
