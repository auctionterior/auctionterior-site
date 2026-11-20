
import {makeSession,response,ready,safeOrigin} from './_auth.js';

export async function onRequestPost({request,env}) {
  if (!safeOrigin(request)) return response({error:'Origin mismatch'},403);

  if (!ready(env)) {
    return response({error:'관리자 서버 환경변수 설정이 필요합니다.'},503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return response({error:'잘못된 요청입니다.'},400);
  }

  const u = String(body.username || '');
  const p = String(body.password || '');

  if (u.length > 100 || p.length > 300) {
    return response({error:'로그인 실패'},401);
  }

  const digest = async s =>
    new Uint8Array(
      await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(s)
      )
    );

  const [a,b,c,d] = await Promise.all([
    digest(u),
    digest(env.ADMIN_USER),
    digest(p),
    digest(env.ADMIN_PASSWORD)
  ]);

  let userDiff = 0;
  let passwordDiff = 0;

  for (let i = 0; i < a.length; i++) {
    userDiff |= a[i] ^ b[i];
  }

  for (let i = 0; i < c.length; i++) {
    passwordDiff |= c[i] ^ d[i];
  }

  if (userDiff | passwordDiff) {
    return response({error:'아이디 또는 비밀번호가 올바르지 않습니다.'},401);
  }

  const token = await makeSession(env);

  return response(
    {ok:true},
    200,
    {
      'Set-Cookie':
        'at_session=' + token +
        '; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=28800'
    }
  );
}
