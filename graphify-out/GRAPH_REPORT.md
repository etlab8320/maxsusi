# Graph Report - /Users/etlab/projects/26maxsusi  (2026-04-20)

## Corpus Check
- 39 files · ~97,827 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 169 nodes · 232 edges · 19 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.96)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_상담 워크플로|상담 워크플로]]
- [[_COMMUNITY_학생·성적 관리|학생·성적 관리]]
- [[_COMMUNITY_상담 워크플로|상담 워크플로]]
- [[_COMMUNITY_인증·계정 (loginregisterprofile)|인증·계정 (login/register/profile)]]
- [[_COMMUNITY_인증·계정 (loginregisterprofile)|인증·계정 (login/register/profile)]]
- [[_COMMUNITY_인증·계정 (loginregisterprofile)|인증·계정 (login/register/profile)]]
- [[_COMMUNITY_관리자 도구 (admin·공지)|관리자 도구 (admin·공지)]]
- [[_COMMUNITY_인증·계정 (loginregisterprofile)|인증·계정 (login/register/profile)]]
- [[_COMMUNITY_점수 계산 로직|점수 계산 로직]]
- [[_COMMUNITY_점수 계산 로직|점수 계산 로직]]
- [[_COMMUNITY_학생·성적 관리|학생·성적 관리]]
- [[_COMMUNITY_대학·학과 정보·탐색|대학·학과 정보·탐색]]
- [[_COMMUNITY_학생·성적 관리|학생·성적 관리]]
- [[_COMMUNITY_대학·학과 정보·탐색|대학·학과 정보·탐색]]
- [[_COMMUNITY_최종 지원·실시간 순위|최종 지원·실시간 순위]]
- [[_COMMUNITY_최종 지원·실시간 순위|최종 지원·실시간 순위]]
- [[_COMMUNITY_최종 지원·실시간 순위|최종 지원·실시간 순위]]
- [[_COMMUNITY_대학·학과 정보·탐색|대학·학과 정보·탐색]]
- [[_COMMUNITY_역할·플로우 구조|역할·플로우 구조]]

## God Nodes (most connected - your core abstractions)
1. `index.html — 사이드바 + iframe 쉘` - 17 edges
2. `counsel.html — 개인별 상담 (PDF 출력)` - 16 edges
3. `final_confirm.html — 최종 수시수합` - 11 edges
4. `counsel_group.html — 그룹/대학별 상담` - 10 edges
5. `admin.html — 원장 승인/관리 (admin only)` - 9 edges
6. `explore.html — 대학 검색/필터 + 상담 추가` - 8 edges
7. `branch_summary.html — 대학별 최종수합(실기)` - 8 edges
8. `26mobile.html — 모바일 실기 기록 입력` - 8 edges
9. `GET /profile (Bearer)` - 8 edges
10. `login.html — 원장/관리자 로그인` - 7 edges

## Surprising Connections (you probably didn't know these)
- `POST /switch-year` --conceptually_related_to--> `X-Susi-Year 헤더 기반 다중 연도 (26/27/28)`  [EXTRACTED]
  index.html → utils.js
- `login.html — 원장/관리자 로그인` --navigates_to--> `index.html — 사이드바 + iframe 쉘`  [INFERRED]
  login.html → index.html
- `login → index (iframe shell) → dashboard` --references--> `index.html — 사이드바 + iframe 쉘`  [INFERRED]
  login.html → index.html
- `counsel.html — 개인별 상담 (PDF 출력)` --calls--> `POST _student_grade_update`  [EXTRACTED]
  counsel.html → college-grade.html
- `학생 등록 → 내신 입력 → 대학 검색 → 상담 → 최종수합` --references--> `final_confirm.html — 최종 수시수합`  [INFERRED]
  counsel.html → final_confirm.html

## Hyperedges (group relationships)
- **Pages requiring JWT /profile session check** —  [EXTRACTED 1.00]
- **Pages consuming _student_list (학생 명단)** —  [EXTRACTED 1.00]
- **Pages consuming _college_list** —  [EXTRACTED 1.00]
- **실기 배점/이벤트/계산 공용 스택** —  [EXTRACTED 1.00]
- **원장 워크플로우: 학생 등록 → 내신 → 대학검색 → 상담 → 최종수합 → 실기입력** —  [INFERRED 0.95]
- **관리자 워크플로우: 회원 승인 + 공지 관리** —  [EXTRACTED 1.00]
- **인증 플로우: 가입(SMS)→승인대기→로그인→비번재설정** —  [EXTRACTED 1.00]
- **X-Susi-Year 헤더 기반 연도 전환 (모든 호출)** —  [EXTRACTED 1.00]

## Communities

### Community 0 - "상담 워크플로"
Cohesion: 0.1
Nodes (36): GET /branch-assigned-colleges, GET /branch_summary_by_university, POST /calculate-final-score, GET _college_list, GET _counsel_by_college, POST _counsel_by_college_save, GET _counsel_candidates, GET _counsel_college_load (+28 more)

### Community 1 - "학생·성적 관리"
Cohesion: 0.21
Nodes (10): 과목구분(), applyKoreanHistoryScore(), calculateCollegeScore(), calculateDefaultTotalScore(), calculateKoreanHistoryScore(), calculateMixTotalScore(), calculateRankTotalScore(), calculateSuneungScore() (+2 more)

### Community 2 - "상담 워크플로"
Cohesion: 0.15
Nodes (14): POST /add-counseling-bulk, GET /counseled-students-for-college, GET /explore-universities, GET /filter-options/{regions,events}, POST _student_bulk_insert, POST _student_delete, GET _student_grade_map, POST _student_grade_update (+6 more)

### Community 3 - "인증·계정 (login/register/profile)"
Cohesion: 0.18
Nodes (4): calculateScoreFromDB(), calculateScoreFromDBAsync(), makeSignature(), sendVerificationSMS()

### Community 4 - "인증·계정 (login/register/profile)"
Cohesion: 0.18
Nodes (4): calculateScoreFromDB(), calculateScoreFromDBAsync(), makeSignature(), sendVerificationSMS()

### Community 5 - "인증·계정 (login/register/profile)"
Cohesion: 0.18
Nodes (4): calculateScoreFromDB(), calculateScoreFromDBAsync(), makeSignature(), sendVerificationSMS()

### Community 6 - "관리자 도구 (admin·공지)"
Cohesion: 0.21
Nodes (13): admin.html — 원장 승인/관리 (admin only), announcement_manager.html — 공지사항 관리 (admin), POST _admin_approve, POST _admin_delete, GET _admin_members, GET /announcement-dates, GET /announcements, POST /announcements/create (+5 more)

### Community 7 - "인증·계정 (login/register/profile)"
Cohesion: 0.2
Nodes (12): POST /check-userid, POST /login, POST /register, POST /request-reset-sms, POST /reset-password, POST /send-verification-sms, POST /verify-code, JWT 토큰 (localStorage.token, Bearer 헤더) (+4 more)

### Community 8 - "점수 계산 로직"
Cohesion: 0.2
Nodes (0): 

### Community 9 - "점수 계산 로직"
Cohesion: 0.52
Nodes (4): calculateSpecialSchool(), dbQuery(), getEnglishData(), getKoreanHistoryData()

### Community 10 - "학생·성적 관리"
Cohesion: 0.67
Nodes (2): makeSignature(), sendSMS()

### Community 11 - "대학·학과 정보·탐색"
Cohesion: 0.67
Nodes (2): dbQuery(), get백자표변환점수()

### Community 12 - "학생·성적 관리"
Cohesion: 0.67
Nodes (0): 

### Community 13 - "대학·학과 정보·탐색"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "최종 지원·실시간 순위"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "최종 지원·실시간 순위"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "최종 지원·실시간 순위"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "대학·학과 정보·탐색"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "역할·플로우 구조"
Cohesion: 1.0
Nodes (1): 원장 role (일반 가입 회원)

## Knowledge Gaps
- **35 isolated node(s):** `원장 role (일반 가입 회원)`, `POST /register`, `POST /check-userid`, `POST /send-verification-sms`, `POST /request-reset-sms` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `최종 지원·실시간 순위`** (2 nodes): `calculation-logic.js`, `calculateFinalScore()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `최종 지원·실시간 순위`** (2 nodes): `calculation-logic-26.js`, `calculateFinalScore()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `최종 지원·실시간 순위`** (2 nodes): `calculation-logic-27.js`, `calculateFinalScore()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `대학·학과 정보·탐색`** (2 nodes): `collegedebug.js`, `dbQuery()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `역할·플로우 구조`** (1 nodes): `원장 role (일반 가입 회원)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.html — 사이드바 + iframe 쉘` connect `상담 워크플로` to `상담 워크플로`, `관리자 도구 (admin·공지)`, `인증·계정 (login/register/profile)`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `counsel.html — 개인별 상담 (PDF 출력)` connect `상담 워크플로` to `상담 워크플로`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `explore.html — 대학 검색/필터 + 상담 추가` connect `상담 워크플로` to `상담 워크플로`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `index.html — 사이드바 + iframe 쉘` (e.g. with `login.html — 원장/관리자 로그인` and `login → index (iframe shell) → dashboard`) actually correct?**
  _`index.html — 사이드바 + iframe 쉘` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `원장 role (일반 가입 회원)`, `POST /register`, `POST /check-userid` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `상담 워크플로` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._