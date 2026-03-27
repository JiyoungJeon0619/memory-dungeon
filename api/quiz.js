export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { grade, subject, unit, desc } = await req.json();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `당신은 초등학교 ${grade}학년 ${subject} 교사입니다.
단원: ${unit}
내용: ${desc}

위 단원에서 초등 ${grade}학년 수준의 객관식 문제 1개를 만들어주세요.
반드시 아래 JSON만 응답하세요:
{"question":"질문","options":["보기1","보기2","보기3","보기4"],"answer":0,"explanation":"정답 해설 2-3문장"}
answer는 정답 인덱스(0~3). 쉬운 말로 작성하세요.`
      }]
    })
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}