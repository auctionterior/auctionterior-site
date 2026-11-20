import{session,response,ready,safeOrigin}from './_auth.js';
export async function onRequest({request,env}){
if(!ready(env))return response({error:'서버 설정이 필요합니다.'},503);
if(!await session(request,env))return response({error:'로그인이 필요합니다.'},401);
if(request.method!=='POST'||!safeOrigin(request))return response({error:'허용되지 않은 요청'},403);
let body;try{body=await request.json()}catch{return response({error:'잘못된 요청'},400)}
const {path,method='GET',content,sha}=body;
if(typeof path!=='string'||!(/^(data\/projects\.json|uploads\/[a-zA-Z0-9._-]+\.(jpg|png|webp))$/).test(path)||!['GET','PUT'].includes(method))return response({error:'허용되지 않은 경로'},400);
if(method==='PUT'&&(typeof content!=='string'||content.length>12*1024*1024||!(/^[A-Za-z0-9+/=]+$/).test(content)))return response({error:'파일 형식 또는 용량 오류'},400);
const owner=env.GITHUB_OWNER||'auctionterior',repo=env.GITHUB_REPO||'auctionterior-site',branch=env.GITHUB_BRANCH||'main';
const url='https://api.github.com/repos/'+encodeURIComponent(owner)+'/'+encodeURIComponent(repo)+'/contents/'+path+(method==='GET'?'?ref='+encodeURIComponent(branch):'');
const payload={message:'Update portfolio: '+path,content,branch};if(sha)payload.sha=sha;
const res=await fetch(url,{method,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+env.GITHUB_TOKEN,'X-GitHub-Api-Version':'2022-11-28','User-Agent':'auctionterior-admin','Content-Type':'application/json'},...(method==='PUT'?{body:JSON.stringify(payload)}:{})});
const result=await res.json().catch(()=>({}));return response(result,res.status);
}
