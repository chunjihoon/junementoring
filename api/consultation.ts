import { Resend } from 'resend';

type Payload = {
  type?: string; name?: string; email?: string; contact?: string; direction?: string;
  experience?: string; idea?: string; blocker?: string; availability?: string; payment?: string; website?: string;
};

const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]!));

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    if (body.website) return Response.json({ ok: true });
    if (!body.name || !body.email || !body.idea || !body.availability) {
      return Response.json({ error: '필수 입력값이 누락되었습니다.' }, { status: 400 });
    }
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONSULTATION_TO_EMAIL;
    const from = process.env.CONSULTATION_FROM_EMAIL;
    if (!apiKey || !to || !from) {
      return Response.json({ error: '이메일 환경변수가 설정되지 않았습니다.' }, { status: 503 });
    }
    const resend = new Resend(apiKey);
    const rows: [string,string|undefined][] = [
      ['신청 유형', body.type === 'paid' ? '유료 프로젝트 진단' : '15분 무료상담'], ['이름', body.name], ['이메일', body.email], ['연락처', body.contact],
      ['방향', body.direction], ['개발 경험', body.experience], ['서비스 아이디어', body.idea], ['막힌 부분', body.blocker], ['가능 시간', body.availability], ['결제 방식', body.payment],
    ];
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: body.email,
      subject: `[멘토링 상담] ${body.name}님의 ${body.type === 'paid' ? '유료 진단' : '무료상담'} 신청`,
      html: `<h2>새 상담 신청</h2><table style="border-collapse:collapse;width:100%">${rows.map(([k,v])=>`<tr><th style="text-align:left;vertical-align:top;padding:10px;border:1px solid #ddd;width:140px">${escapeHtml(k)}</th><td style="padding:10px;border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(v||'-')}</td></tr>`).join('')}</table>`,
    });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: '요청을 처리하지 못했습니다.' }, { status: 500 });
  }
}
