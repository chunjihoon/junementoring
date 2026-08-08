const FORM_ENDPOINT = 'https://formsubmit.co/ajax/guatemala3081@gmail.com';

type FormSubmitPayload = Record<string, string>;

export async function sendFormEmail(subject: string, payload: FormSubmitPayload) {
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      _url: window.location.href,
      ...payload,
    }),
  });

  const result = await response.json().catch(() => null) as { success?: boolean | string; message?: string } | null;
  if (!response.ok || result?.success === false || result?.success === 'false') {
    throw new Error(result?.message || '알림 메일을 보내지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
}
