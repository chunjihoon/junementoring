import { Resend } from 'resend';

type ReviewPayload = {
  submissionId?: string;
  displayName?: string;
  course?: string;
  before?: string;
  helpful?: string;
  change?: string;
  recommend?: string;
  consentToPublish?: boolean;
  website?: string;
};

type ApiRequest = {
  method?: string;
  body?: ReviewPayload | string;
};

type ApiResponse = {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
};

const courseLabels: Record<string, string> = {
  diagnosis: '프로젝트 진단',
  web: '웹서비스 MVP',
  ios: 'iPhone 앱 MVP',
  other: '기타 과정',
};

const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#039;',
  '"': '&quot;',
}[char]!));

function isValid(body: ReviewPayload) {
  const answers = [body.before, body.helpful, body.change, body.recommend];
  return Boolean(
    body.submissionId && /^[a-zA-Z0-9-]{20,80}$/.test(body.submissionId)
    && body.displayName && body.displayName.length <= 80
    && body.course && courseLabels[body.course]
    && answers.every((answer) => typeof answer === 'string' && answer.trim().length > 0 && answer.length <= 3000)
    && body.consentToPublish === true,
  );
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  try {
    const body = (typeof request.body === 'string' ? JSON.parse(request.body) : request.body) as ReviewPayload;
    if (body.website) return response.status(200).json({ ok: true });
    if (!isValid(body)) return response.status(400).json({ error: '필수 입력값을 확인해주세요.' });

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.REVIEW_FROM_EMAIL || process.env.CONSULTATION_FROM_EMAIL;
    const to = process.env.REVIEW_TO_EMAIL || 'guatemala3081@gmail.com';
    if (!apiKey || !from) {
      return response.status(503).json({ error: '리뷰 알림 이메일 환경변수가 설정되지 않았습니다.' });
    }

    const resend = new Resend(apiKey);
    const rows: [string, string | undefined][] = [
      ['작성자', body.displayName],
      ['수강 과정', courseLabels[body.course!]],
      ['수업 전 어려웠던 점', body.before],
      ['특히 도움이 됐던 점', body.helpful],
      ['수업 후 달라진 점', body.change],
      ['추천하고 싶은 분', body.recommend],
    ];
    const { error } = await resend.emails.send(
      {
        from,
        to: [to],
        subject: `[멘토링 후기] ${body.displayName}님의 새 후기가 등록되었습니다`,
        html: `<h2>새 수강 후기가 등록되었습니다.</h2><table style="border-collapse:collapse;width:100%">${rows.map(([key, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:10px;border:1px solid #ddd;width:160px">${escapeHtml(key)}</th><td style="padding:10px;border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value || '-')}</td></tr>`).join('')}</table>`,
      },
      { idempotencyKey: `mentoring-review/${body.submissionId}` },
    );

    if (error) return response.status(500).json({ error: error.message });
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(500).json({ error: '리뷰 알림을 처리하지 못했습니다.' });
  }
}
