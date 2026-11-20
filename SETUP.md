# 옥션테리어하우징 v5 관리자 연결 안내

## 개요
- 기존 v4 디자인과 페이지를 유지했습니다.
- `admin.html`에서 주거/상업 프로젝트 등록, 수정, 삭제, 사진 여러 장 업로드가 가능합니다.
- 실제 게시에는 GitHub 저장소 + Cloudflare Pages 연결이 필요합니다. 두 서비스 무료 플랜의 제공 범위 내에서 월 호스팅 비용 없이 운영 가능합니다. 별도 도메인은 연간 비용이 있을 수 있습니다.
- 관리자 기능은 GitHub API에 직접 접근하는 방식이며 **별도 계정/비밀번호 로그인 화면은 아닙니다**. GitHub Fine-grained Personal Access Token이 인증 역할을 합니다.

## 최초 1회 설정
1. GitHub에서 **private 또는 public** 저장소를 만들고 ZIP 압축을 푼 모든 파일과 `data/projects.json`, `uploads/.gitkeep`를 저장소 루트에 올립니다. Cloudflare Pages Git 연동에서 저장소 접근 권한을 설정하세요.
2. Cloudflare Pages > Create project > Connect to Git에서 저장소 선택. 정적 사이트이므로 빌드 명령은 비우고 출력 폴더는 `/` 또는 `.`(플랫폼 UI 안내에 따름)로 지정합니다.
3. GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens에서 해당 저장소만 선택하고 Repository permissions > Contents = Read and write 로 설정. 토큰을 안전하게 보관하세요.
4. 배포된 주소의 `/admin.html`로 접속. 사용자명/저장소명/브랜치(대개 main)/토큰 입력 후 '연결 및 목록 불러오기'를 누릅니다.
5. 프로젝트 입력 및 사진 선택 후 저장하면 GitHub에 커밋되고 Cloudflare Pages가 다시 배포합니다. 배포 완료 후 공개 포트폴리오에 반영됩니다.

## 주의사항
- 파일을 로컬에서 더블클릭(`file://`)하면 `fetch`가 차단될 수 있으므로 공개 사이트 또는 로컬 서버에서 확인하세요.
- **토큰을 공유하거나 공개 저장소의 파일에 넣지 마세요.** 브라우저 세션 저장소에 임시 저장되므로 공용 기기 사용은 피하고 작업 후 토큰 지우기 및 브라우저 종료를 권장합니다.
- 사진은 원본 그대로 저장하므로 용량이 크면 업로드가 느리고 GitHub 저장소 용량이 커집니다. 업로드 전 이미지 리사이즈/압축 권장. 파일별 8MB 제한을 설정했습니다.
- 프로젝트 삭제 시 이미지 파일은 자동 삭제되지 않습니다. 저장소에서 수동 정리할 수 있습니다.
- 참고 이미지와 실제 시공 사진은 구분하여 표기합니다.
- GitHub 무료 사용량 및 Cloudflare Pages 무료 정책은 변동될 수 있습니다.
