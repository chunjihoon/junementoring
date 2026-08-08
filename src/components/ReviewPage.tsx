import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Code2, Loader2, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { profile } from '../data/content';
import { saveReview } from '../lib/firebase';
import { sendFormEmail } from '../lib/formSubmit';
import { createSubmissionId } from '../lib/submissionId';
import type { ReviewPayload } from '../types';

const createInitialForm = (): ReviewPayload => ({
  submissionId: createSubmissionId(),
  displayName: '',
  course: 'web',
  before: '',
  helpful: '',
  change: '',
  recommend: '',
  consentToPublish: false,
  website: '',
});

const questions = [
  {
    key: 'before' as const,
    number: '01',
    title: '수업을 시작하기 전, 어떤 부분이 어렵거나 막막했나요?',
    guide: '프로젝트를 시작하거나 진행하면서 혼자 해결하기 어려웠던 상황을 들려주세요.',
    placeholder: '예: 코드는 만들 수 있었지만 오류가 반복되고, 어떤 순서로 기능을 완성해야 할지 막막했습니다.',
  },
  {
    key: 'helpful' as const,
    number: '02',
    title: '수업하면서 특히 도움이 됐던 부분이나 좋았던 점은 무엇인가요?',
    guide: '설명 방식, 코드 리뷰, 프로젝트 진행 과정 등 기억에 남는 부분을 적어주세요.',
    placeholder: '예: 오류를 바로 고치는 것에 그치지 않고 원인과 구조를 함께 설명해주신 점이 좋았습니다.',
  },
  {
    key: 'change' as const,
    number: '03',
    title: '수업 전과 비교해서 지금 달라진 점이나 직접 할 수 있게 된 것은 무엇인가요?',
    guide: '완성한 기능이나 새롭게 생긴 자신감처럼 구체적인 변화를 알려주세요.',
    placeholder: '예: 이제는 기능을 작은 단위로 나누고, 오류 메시지를 보면서 직접 수정 방향을 찾을 수 있습니다.',
  },
  {
    key: 'recommend' as const,
    number: '04',
    title: '어떤 분들에게 이 수업을 추천하고 싶나요?',
    guide: '비슷한 고민을 가진 분을 떠올리며 편하게 작성해주세요.',
    placeholder: '예: 프로젝트를 시작했지만 끝까지 완성하지 못해 막혀 있는 분께 추천하고 싶습니다.',
  },
];

export function ReviewPage() {
  const [form, setForm] = useState<ReviewPayload>(createInitialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const submittingRef = useRef(false);

  useEffect(() => {
    document.title = `수강 후기 작성 | ${profile.brand}`;
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.head.appendChild(document.createElement('meta'));
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
  }, []);

  const update = <Key extends keyof ReviewPayload>(key: Key, value: ReviewPayload[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (form.website || submittingRef.current) return;

    submittingRef.current = true;
    setStatus('loading');
    setError('');

    try {
      const courseLabels: Record<ReviewPayload['course'], string> = {
        diagnosis: '프로젝트 진단',
        web: '웹서비스 과정',
        ios: 'iPhone 앱 과정',
        other: '기타 과정',
      };
      await sendFormEmail(`[June Mentoring] ${form.displayName}님의 새 리뷰`, {
        '작성자': form.displayName,
        '수강 과정': courseLabels[form.course],
        '1. 수업 전 어려웠던 점': form.before,
        '2. 특히 도움이 됐던 부분': form.helpful,
        '3. 수업 후 달라진 점': form.change,
        '4. 추천하고 싶은 분': form.recommend,
        '접수 번호': form.submissionId,
      });
      await saveReview(form);
      setStatus('success');
      window.setTimeout(() => window.location.assign('/#reviews'), 1800);
    } catch (caught) {
      submittingRef.current = false;
      setStatus('error');
      setError(caught instanceof Error ? caught.message : '리뷰를 등록하지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  if (status === 'success') {
    return (
      <div className="review-page">
        <header className="review-header">
          <a className="brand" href="/"><span className="brand-mark"><Code2 size={18} /></span>{profile.brand}</a>
        </header>
        <main className="review-complete-main">
          <div className="review-complete-card" role="status">
            <CheckCircle2 size={56} />
            <h1>후기가 등록되었습니다.</h1>
            <p>소중한 경험을 들려주셔서 감사합니다.<br />잠시 후 메인 화면의 후기 섹션으로 이동합니다.</p>
            <Loader2 className="spin" size={20} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="review-page">
      <header className="review-header">
        <a className="brand" href="/"><span className="brand-mark"><Code2 size={18} /></span>{profile.brand}</a>
        <a className="review-back" href="/"><ArrowLeft size={17} /> 메인으로</a>
      </header>

      <main className="review-main">
        <aside className="review-intro">
          <span className="eyebrow"><MessageSquareQuote size={15} /> 수강 후기</span>
          <h1>함께한 경험을<br />들려주세요.</h1>
          <p>남겨주신 이야기는 같은 고민을 가진 분이 자신의 프로젝트를 시작하는 데 큰 도움이 됩니다.</p>
          <div className="review-trust">
            <span><Check size={16} /> 정해진 답 없이 편하게 작성해주세요.</span>
            <span><Check size={16} /> 작성한 내용은 메인 페이지에 공개됩니다.</span>
            <span><ShieldCheck size={16} /> 연락처 등 별도 개인정보는 받지 않습니다.</span>
          </div>
        </aside>

        <form className="review-form" onSubmit={submit}>
          <input className="honeypot" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} aria-hidden="true" />

          <div className="review-basic-fields">
            <label>
              이름
              <input required maxLength={80} value={form.displayName} onChange={(event) => update('displayName', event.target.value)} placeholder="예: 김OO, 주니, 익명" />
            </label>
            <label>
              수강 과정
              <select value={form.course} onChange={(event) => update('course', event.target.value as ReviewPayload['course'])}>
                <option value="web">웹서비스 MVP</option>
                <option value="ios">iPhone 앱 MVP</option>
                <option value="diagnosis">프로젝트 진단</option>
                <option value="other">기타 과정</option>
              </select>
            </label>
          </div>

          <div className="review-question-list">
            {questions.map((question) => (
              <label className="review-question" key={question.key}>
                <span className="review-question-number">{question.number}</span>
                <strong>{question.title}</strong>
                <small>{question.guide}</small>
                <textarea
                  required
                  maxLength={3000}
                  rows={5}
                  value={form[question.key]}
                  onChange={(event) => update(question.key, event.target.value)}
                  placeholder={question.placeholder}
                />
              </label>
            ))}
          </div>

          {status === 'error' && <p className="form-error" role="alert">{error}</p>}
          <button
            type="submit"
            className="button primary wide review-submit"
            disabled={status === 'loading'}
            aria-busy={status === 'loading'}
          >
            {status === 'loading' ? <><Loader2 className="spin" size={18} /> 전송 중...</> : <>후기 제출하기 <ArrowRight size={18} /></>}
          </button>
          <p className="form-privacy">제출과 동시에 후기가 공개되며, 등록 완료 후 메인 페이지로 이동합니다.</p>
        </form>
      </main>
    </div>
  );
}
