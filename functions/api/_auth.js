const encoder=new TextEncoder();
const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const unb64=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
async function hmac(secret,data){const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64(await crypto.subtle.sign('HMAC',key,encoder.encode(data)))}
export async function session(request,env){if(!env.SESSION_SECRET)return false;const cookie=request.headers.get('Cookie')||'';const token=cookie.match(/(?:^|;\s*)at_session=([^;]+)/)?.[1];if(!token)return false;const [expires,sig]=token.split('.');if(!expires||!sig||!/^\d+$/.test(expires)||Number(expires)<Date.now())return false;return sig===await hmac(env.SESSION_SECRET,expires)}
export async function makeSession(env){const expires=String(Date.now()+8*60*60*1000);return expires+'.'+await hmac(env.SESSION_SECRET,expires)}
export function safeOrigin(request){const origin=request.headers.get('Origin');return origin===new URL(request.url).origin}
export function response(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}})}
export function ready(env){return !!(env.ADMIN_USER&&env.ADMIN_PASSWORD&&env.SESSION_SECRET&&env.GITHUB_TOKEN)}
