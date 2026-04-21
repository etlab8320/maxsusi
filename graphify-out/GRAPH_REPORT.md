# Graph Report - /Users/etlab/projects/26maxsusi  (2026-04-21)

## Corpus Check
- 43 files · ~20,880 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 560 nodes · 1086 edges · 34 communities detected
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_html2canvas 내부 함수|html2canvas 내부 함수]]
- [[_COMMUNITY_원본 페이지 · 관리자 API|원본 페이지 · 관리자 API]]
- [[_COMMUNITY_.new 페이지 자산 매트릭스|.new 페이지 자산 매트릭스]]
- [[_COMMUNITY_combobox 헬퍼 내부|combobox 헬퍼 내부]]
- [[_COMMUNITY_vendor 라이브러리 내부|vendor 라이브러리 내부]]
- [[_COMMUNITY_지점관리 도메인 로직|지점관리 도메인 로직]]
- [[_COMMUNITY_admin.new 도메인 로직|admin.new 도메인 로직]]
- [[_COMMUNITY_원본 HTML 페이지 셋|원본 HTML 페이지 셋]]
- [[_COMMUNITY_student.new 등록편집|student.new 등록/편집]]
- [[_COMMUNITY_collegeCalculator 계산|collegeCalculator 계산]]
- [[_COMMUNITY_susi-server-new 인증계산|susi-server-new 인증/계산]]
- [[_COMMUNITY_JWT 인증 핸들러|JWT 인증 핸들러]]
- [[_COMMUNITY_susi-server 원본|susi-server 원본]]
- [[_COMMUNITY_college-grade.new 매트릭스|college-grade.new 매트릭스]]
- [[_COMMUNITY_대학별 점수 규칙 (server.js)|대학별 점수 규칙 (server.js)]]
- [[_COMMUNITY_dashboard.new 공지일정|dashboard.new 공지/일정]]
- [[_COMMUNITY_register.new 가입 플로우|register.new 가입 플로우]]
- [[_COMMUNITY_특수 학교 계산|특수 학교 계산]]
- [[_COMMUNITY_bootstrap.js 전역 초기화|bootstrap.js 전역 초기화]]
- [[_COMMUNITY_drsports SMS 발송|drsports SMS 발송]]
- [[_COMMUNITY_collegeCalculate 변환|collegeCalculate 변환]]
- [[_COMMUNITY_login.new 인증|login.new 인증]]
- [[_COMMUNITY_실기 배점 테이블|실기 배점 테이블]]
- [[_COMMUNITY_collegeManage CRUD|collegeManage CRUD]]
- [[_COMMUNITY_계산 로직 공통|계산 로직 공통]]
- [[_COMMUNITY_26 계산 로직|26 계산 로직]]
- [[_COMMUNITY_27 계산 로직|27 계산 로직]]
- [[_COMMUNITY_debug 쿼리|debug 쿼리]]
- [[_COMMUNITY_api.js header 빌더|api.js header 빌더]]
- [[_COMMUNITY_toast.js 컨테이너|toast.js 컨테이너]]
- [[_COMMUNITY_counsel.new 도메인|counsel.new 도메인]]
- [[_COMMUNITY_counsel.new 드로어|counsel.new 드로어]]
- [[_COMMUNITY_counsel.new PDF|counsel.new PDF]]
- [[_COMMUNITY_sidebar.html 네비|sidebar.html 네비]]

## God Nodes (most connected - your core abstractions)
1. `m()` - 37 edges
2. `make_xlsx_lib()` - 25 edges
3. `index.html — 사이드바 + iframe 쉘` - 17 edges
4. `counsel.html — 개인별 상담 (PDF 출력)` - 16 edges
5. `loadCounselData()` - 13 edges
6. `a()` - 12 edges
7. `De()` - 12 edges
8. `final_confirm.html — 최종 수시수합` - 11 edges
9. `counsel_group.html — 그룹/대학별 상담` - 10 edges
10. `e()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `X-Susi-Year 헤더 기반 다중 연도 (26/27/28)` --conceptually_related_to--> `POST /switch-year`  [EXTRACTED]
  utils.js → index.html
- `escape()` --calls--> `escapeHtml()`  [INFERRED]
  dashboard.new.js → assets/js/combobox.js
- `esc()` --calls--> `escapeHtml()`  [INFERRED]
  student.new.js → assets/js/combobox.js
- `esc()` --calls--> `escapeHtml()`  [INFERRED]
  college-grade.new.js → assets/js/combobox.js
- `esc()` --calls--> `escapeHtml()`  [INFERRED]
  실기배점수정.new.js → assets/js/combobox.js

## Hyperedges (group relationships)
- **Auth flow (login/register/forgot-password)** — login_new_html, register_new_html, forgot_password_new_html [INFERRED 0.90]
- **Admin-only console pages** — admin_new_html, announcement_manager_new_html, silgi_score_new_html, silgi_base_new_html, branch_manager_new_html [INFERRED 0.85]
- **Counsel workspace + design docs** — counsel_new_html, design_ref_counsel_redesign, design_prompt_counsel_layout_txt [INFERRED 0.85]

## Communities

### Community 0 - "html2canvas 내부 함수"
Cohesion: 0.03
Nodes (40): A(), Ae(), an(), Be(), CA(), cn(), Cs(), dA() (+32 more)

### Community 1 - "원본 페이지 · 관리자 API"
Cohesion: 0.05
Nodes (75): admin.html — 원장 승인/관리 (admin only), announcement_manager.html — 공지사항 관리 (admin), POST /add-counseling-bulk, POST _admin_approve, POST _admin_delete, GET _admin_members, GET /announcement-dates, GET /announcements (+67 more)

### Community 2 - ".new 페이지 자산 매트릭스"
Cohesion: 0.09
Nodes (71): admin.new.html, announcement_manager.new.html, admin.new.css, admin.new.js, announcement_manager.new.css, announcement_manager.new.js, assets/js/api.js, assets/js/auth.js (+63 more)

### Community 3 - "combobox 헬퍼 내부"
Cohesion: 0.08
Nodes (46): close(), disable(), enable(), findOpt(), pick(), refresh(), renderLabel(), renderList() (+38 more)

### Community 4 - "vendor 라이브러리 내부"
Cohesion: 0.11
Nodes (47): open(), fe(), He(), ie(), mr(), ne(), se(), te() (+39 more)

### Community 5 - "지점관리 도메인 로직"
Cohesion: 0.17
Nodes (22): bindModal(), bootFromExistingToken(), collectChanges(), doSave(), fetchColleges(), generateExcel(), handleAdminAllDownload(), handleAdminDownload() (+14 more)

### Community 6 - "admin.new 도메인 로직"
Cohesion: 0.16
Nodes (12): doConfirm(), escape(), loadMembers(), logoutAndRedirect(), renderMembers(), confirmDelete(), escape(), formatDateTime() (+4 more)

### Community 7 - "원본 HTML 페이지 셋"
Cohesion: 0.11
Nodes (18): 26mobile.html, admin.html, announcement_manager.html, 지점관리.html, branch_summary.html, college-grade.html, counsel_group.html, counsel.html (+10 more)

### Community 8 - "student.new 등록/편집"
Cohesion: 0.24
Nodes (14): addRegRow(), bindStudentTableDelegation(), bindUndo(), confirmDelete(), delStudent(), esc(), getCurrentRegState(), handlePaste() (+6 more)

### Community 9 - "collegeCalculator 계산"
Cohesion: 0.21
Nodes (10): 과목구분(), applyKoreanHistoryScore(), calculateCollegeScore(), calculateDefaultTotalScore(), calculateKoreanHistoryScore(), calculateMixTotalScore(), calculateRankTotalScore(), calculateSuneungScore() (+2 more)

### Community 10 - "susi-server-new 인증/계산"
Cohesion: 0.18
Nodes (4): calculateScoreFromDB(), calculateScoreFromDBAsync(), makeSignature(), sendVerificationSMS()

### Community 11 - "JWT 인증 핸들러"
Cohesion: 0.18
Nodes (4): calculateScoreFromDB(), calculateScoreFromDBAsync(), makeSignature(), sendVerificationSMS()

### Community 12 - "susi-server 원본"
Cohesion: 0.18
Nodes (4): calculateScoreFromDB(), calculateScoreFromDBAsync(), makeSignature(), sendVerificationSMS()

### Community 13 - "college-grade.new 매트릭스"
Cohesion: 0.26
Nodes (9): bindCollegeSearch(), bindPagination(), bindTableDelegation(), esc(), loadAll(), renderTable(), setMsg(), updateGrade() (+1 more)

### Community 14 - "대학별 점수 규칙 (server.js)"
Cohesion: 0.2
Nodes (0): 

### Community 15 - "dashboard.new 공지/일정"
Cohesion: 0.5
Nodes (7): escape(), formatDate(), isDateInCurrentWeek(), loadAnnouncementDates(), loadBranchSchedule(), loadNotices(), reloadAll()

### Community 16 - "register.new 가입 플로우"
Cohesion: 0.5
Nodes (6): authFetch(), checkFormValidity(), checkPasswordMatch(), sendVerificationCode(), setFeedback(), verifyCode()

### Community 17 - "특수 학교 계산"
Cohesion: 0.52
Nodes (4): calculateSpecialSchool(), dbQuery(), getEnglishData(), getKoreanHistoryData()

### Community 18 - "bootstrap.js 전역 초기화"
Cohesion: 0.33
Nodes (2): applyThemeIcon(), ensureThemeToggle()

### Community 19 - "drsports SMS 발송"
Cohesion: 0.67
Nodes (2): makeSignature(), sendSMS()

### Community 20 - "collegeCalculate 변환"
Cohesion: 0.67
Nodes (2): dbQuery(), get백자표변환점수()

### Community 21 - "login.new 인증"
Cohesion: 0.5
Nodes (0): 

### Community 22 - "실기 배점 테이블"
Cohesion: 0.67
Nodes (0): 

### Community 23 - "collegeManage CRUD"
Cohesion: 0.67
Nodes (0): 

### Community 24 - "계산 로직 공통"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "26 계산 로직"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "27 계산 로직"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "debug 쿼리"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "api.js header 빌더"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "toast.js 컨테이너"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "counsel.new 도메인"
Cohesion: 1.0
Nodes (1): 원장 role (일반 가입 회원)

### Community 31 - "counsel.new 드로어"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "counsel.new PDF"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "sidebar.html 네비"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **36 isolated node(s):** `원장 role (일반 가입 회원)`, `POST /register`, `POST /check-userid`, `POST /send-verification-sms`, `POST /request-reset-sms` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `계산 로직 공통`** (2 nodes): `calculation-logic.js`, `calculateFinalScore()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `26 계산 로직`** (2 nodes): `calculation-logic-26.js`, `calculateFinalScore()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `27 계산 로직`** (2 nodes): `calculation-logic-27.js`, `calculateFinalScore()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `debug 쿼리`** (2 nodes): `collegedebug.js`, `dbQuery()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `api.js header 빌더`** (2 nodes): `buildHeaders()`, `api.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `toast.js 컨테이너`** (2 nodes): `toast.js`, `ensureContainer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `counsel.new 도메인`** (1 nodes): `원장 role (일반 가입 회원)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `counsel.new 드로어`** (1 nodes): `auth.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `counsel.new PDF`** (1 nodes): `utils.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `sidebar.html 네비`** (1 nodes): `NanumGothic-normal.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `open()` connect `vendor 라이브러리 내부` to `combobox 헬퍼 내부`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `escapeHtml()` connect `admin.new 도메인 로직` to `student.new 등록/편집`, `combobox 헬퍼 내부`, `college-grade.new 매트릭스`, `dashboard.new 공지/일정`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `m()` connect `vendor 라이브러리 내부` to `html2canvas 내부 함수`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `m()` (e.g. with `open()` and `Ae()`) actually correct?**
  _`m()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 24 inferred relationships involving `make_xlsx_lib()` (e.g. with `CA()` and `dA()`) actually correct?**
  _`make_xlsx_lib()` has 24 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `admin.new.html` (e.g. with `assets/sidebar.html` and `announcement_manager.new.html`) actually correct?**
  _`admin.new.html` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `원장 role (일반 가입 회원)`, `POST /register`, `POST /check-userid` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._