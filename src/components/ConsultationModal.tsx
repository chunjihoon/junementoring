import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, X } from 'lucide-react';
import { saveConsultation } from '../lib/firebase';
import { sendFormEmail } from '../lib/formSubmit';
import { createSubmissionId } from '../lib/submissionId';
import type { ConsultationPayload, ConsultationType } from '../types';

interface Props {
  open: boolean;
  defaultType: ConsultationType;
  onClose: () => void;
}

const initialForm = (type: ConsultationType): ConsultationPayload => ({
  submissionId: createSubmissionId(),
  type,
  name: '', email: '', contact: '', direction: 'unsure', experience: '', idea: '', blocker: '', availability: '', website: '',
});

export function ConsultationModal({ open, defaultType, onClose }: Props) {
  const [form, setForm] = useState(initialForm(defaultType));
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initialForm(defaultType));
      setStatus('idle');
      setError('');
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, defaultType]);

  if (!open) return null;

  const update = (key: keyof ConsultationPayload, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (form.website) return;
    setStatus('loading');
    setError('');
    try {
      await sendFormEmail(`[June Mentoring] ${form.name}님의 새 상담 신청`, {
        '신청 유형': form.type === 'free' ? '15분 무료 전화상담' : '유료 프로젝트 진단',
        '이름': form.name,
        email: form.email,
        '연락처': form.contact,
        '희망 방향': form.direction === 'web' ? '웹서비스' : form.direction === 'ios' ? 'iPhone 앱' : '미정',
        '개발 경험': form.experience,
        '만들고 싶은 서비스': form.idea,
        '현재 막힌 부분': form.blocker,
        '상담 가능 시간': form.availability,
        '접수 번호': form.submissionId,
      });
      await saveConsultation(form);
      setStatus('success');
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : '신청 중 오류가 발생했습니다.');
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="닫기"><X size={22} /></button>
        {status === 'success' ? (
          <div className="success-state">
            <CheckCircle2 size={52} />
            <h2>신청이 접수되었습니다.</h2>
            <p>입력하신 이메일 또는 연락처로 가능한 시간을 안내드리겠습니다.</p>
            <button className="button primary" onClick={onClose}>확인</button>
          </div>
        ) : (
          <>
            <span className="eyebrow">{form.type === 'free' ? '15분 무료 전화상담' : '유료 프로젝트 진단'}</span>
            <h2 id="modal-title">프로젝트 정보를 알려주세요.</h2>
            <p className="modal-intro">무료 상담은 과정 적합도와 예상 회차를 확인합니다. 구체적인 코드 분석과 실행 로드맵은 유료 진단에서 제공합니다.</p>
            <form onSubmit={submit} className="consultation-form">
              <input className="honeypot" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} aria-hidden="true" />
              <div className="form-grid two">
                <label>이름 또는 닉네임<input required value={form.name} onChange={(e) => update('name', e.target.value)} /></label>
                <label>이메일<input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
              </div>
              <label>연락 가능한 전화번호 또는 메신저<input required value={form.contact} onChange={(e) => update('contact', e.target.value)} /></label>
              <label>만들고 싶은 방향<select value={form.direction} onChange={(e) => update('direction', e.target.value)}><option value="unsure">아직 모르겠습니다</option><option value="web">웹서비스</option><option value="ios">iPhone 앱</option></select></label>
              <label>현재 개발 경험<textarea required rows={2} value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="예: 완전 초보 / React 강의 수강 / Swift 기초 학습" /></label>
              <label>만들고 싶은 서비스<textarea required rows={3} value={form.idea} onChange={(e) => update('idea', e.target.value)} /></label>
              <label>현재 가장 막힌 부분<textarea rows={2} value={form.blocker} onChange={(e) => update('blocker', e.target.value)} /></label>
              <label>상담 가능한 날짜와 시간대<textarea required rows={2} value={form.availability} onChange={(e) => update('availability', e.target.value)} placeholder="예: 평일 저녁 7시 이후, 토요일 오전" /></label>
              {status === 'error' && <p className="form-error">{error}</p>}
              <button className="button primary wide" disabled={status === 'loading'}>{status === 'loading' ? <><Loader2 className="spin" size={18} /> 전송 중</> : '신청 내용 보내기'}</button>
              <p className="form-privacy">제출한 정보는 상담 및 수업 안내 목적으로만 사용됩니다.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
