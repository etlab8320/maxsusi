/* ============================================================
 * index.new.js — iframe 쉘 (원본 377줄 기능 보존)
 * 원본: index.html — 사이드바 + <iframe> 구조, 사이드바 클릭 시 iframe src 변경.
 *
 * 보존 사항:
 *  - iframe 쉘 구조 (자식 페이지는 부모 localStorage.token 을 공유하여 인증)
 *  - 연도 전환: POST /switch-year + setSusiYear + iframe 재로드
 *  - 프로필 확인: /profile 실패 시 로그아웃
 *  - 로그아웃 처리는 공용 sidebar 의 data-action="logout" + bootstrap.js 가 담당
 *
 * 공용 sidebar 는 bootstrap.js 가 주입 — 그 이후에 nav-item 클릭 이벤트를 가로채서
 * iframe 으로 라우팅한다 (브라우저 네비게이션 방지).
 * ============================================================ */

(function () {
  'use strict';

  var FRAME_ID = 'contentFrame';

  // .new.html 산출물로 매핑 (공용 sidebar 의 원본 경로를 신규 경로로 치환)
  var NEW_MAP = {
    'dashboard.html': 'dashboard.new.html',
    'live.html': 'live.new.html',
    'branch_summary.html': 'branch_summary.new.html',
    'explore.html': 'explore.new.html',
    'student.html': 'student.new.html',
    'college-grade.html': 'college-grade.new.html',
    'counsel.html': 'counsel.new.html',
    'counsel_group.html': 'counsel_group.new.html',
    'final_confirm.html': 'final_confirm.new.html',
    '26mobile.html': '26mobile.new.html',
    'announcement_manager.html': 'announcement_manager.new.html',
    'admin.html': 'admin.new.html',
    'cut_manager.html': 'cut_manager.new.html',
  };

  // 허용된 iframe 대상 목록 (defense-in-depth: 화이트리스트 엄격)
  var ALLOWED_FRAMES = new Set(Object.values(NEW_MAP).concat([
    // 추가 허용 (한글 파일명 .new 3종)
    '실기기준.new.html', '실기배점수정.new.html', '지점관리.new.html', '특수식작업용.new.html',
  ]));

  function resolveHref(rawHref) {
    if (!rawHref) return null;
    try {
      var u = new URL(rawHref, location.href);
      // 다른 origin 차단
      if (u.origin !== location.origin) return null;
      var file = u.pathname.split('/').pop() || 'dashboard.new.html';
      // 이미 .new.html 이면 화이트리스트 확인 후 통과
      var candidate = /\.new\.html$/.test(file) ? file : (NEW_MAP[file] || null);
      if (!candidate) return null;                          // NEW_MAP 없는 원본은 거부
      if (!ALLOWED_FRAMES.has(candidate)) return null;       // 화이트리스트 외 거부
      return candidate + (u.search || '');
    } catch (_) {
      return null;
    }
  }

  function hookSidebarNav() {
    var host = document.getElementById('sidebar-slot');
    if (!host) return;

    // bootstrap.js 가 sidebar.html 을 fetch-inject 한 후에야 nav 요소가 존재.
    // MutationObserver 로 nav-item 등장 감지 후 바인딩.
    var bound = false;
    function tryBind() {
      if (bound) return;
      var navItems = host.querySelectorAll('.nav-item[href]');
      if (!navItems.length) return;
      bound = true;

      var frame = document.getElementById(FRAME_ID);

      navItems.forEach(function (a) {
        a.addEventListener('click', function (e) {
          var href = a.getAttribute('href');
          if (!href || href === '#' || /^(https?:|mailto:|tel:)/i.test(href)) return;

          e.preventDefault();
          var target = resolveHref(href);
          if (!frame || !target) return;
          frame.src = target;

          // active 토글 (공용 bootstrap 은 body.dataset.page 기준이므로 수동 처리)
          navItems.forEach(function (n) { n.classList.remove('active'); });
          a.classList.add('active');
        });
      });

      // 최초 active — dashboard
      var defaultActive = host.querySelector('[data-page="dashboard"]');
      if (defaultActive) defaultActive.classList.add('active');
    }

    tryBind();
    if (!bound) {
      var mo = new MutationObserver(function () { tryBind(); if (bound) mo.disconnect(); });
      mo.observe(host, { childList: true, subtree: true });
      // 안전 장치: 2초 후에도 미바인딩이면 재시도 중단
      setTimeout(function () { mo.disconnect(); }, 2000);
    }
  }

  async function verifyProfile() {
    try {
      var data = await window.api('/profile');
      if (!data || !data.success) {
        window.clearToken();
        location.href = 'login.html';
      }
    } catch (e) {
      console.error('[verifyProfile]', e);
      // api.js 내부에서 401 은 handleAuthError 자동 처리
    }
  }

  /* ---- 연도 전환: bootstrap.js 가 생성하는 연도 콤보 onChange 훅을 교체 ---- */
  async function switchSusiYear(year) {
    if (!year) return;
    try {
      // /switch-year 는 새 토큰 반환 (X-Susi-Year 컨텍스트 포함) —
      // 공용 api() 는 post 만 요구하므로 그대로 사용 가능.
      var json = await window.api('/switch-year', {
        method: 'POST',
        body: JSON.stringify({ year: String(year) }),
      });
      if (json && json.success) {
        if (json.token) window.setToken(json.token);
        window.setSusiYear(String(year));
        window.showToast('20' + year + '학년도로 전환되었습니다', 'success');
        // iframe 재로드 (자식 페이지는 부모 localStorage 토큰을 공유)
        var frame = document.getElementById(FRAME_ID);
        if (frame && frame.contentWindow) {
          try { frame.contentWindow.location.reload(); }
          catch (_) { frame.src = frame.src; }
        }
      } else {
        window.showToast('연도 전환 실패: ' + ((json && json.message) || '알 수 없는 오류'), 'error');
      }
    } catch (e) {
      console.error('[switchSusiYear]', e);
      window.showToast('연도 전환 실패: ' + (e && e.message ? e.message : ''), 'error');
    }
  }

  // 공용 bootstrap 이 sidebar 의 연도 콤보 onChange 안에서
  // location.reload() 를 호출하도록 설계되어 있음.
  // 쉘(index)에서는 "부모 리로드"가 아니라 "iframe 리로드 + 서버 연도 동기화"가 필요하므로
  // 콤보가 주입된 직후 이벤트를 재바인딩한다.
  function hookYearCombo() {
    var host = document.getElementById('sidebar-slot');
    if (!host) return;
    var bound = false;
    function tryBind() {
      if (bound) return;
      var combo = host.querySelector('#sidebarYearCombo');
      if (!combo) return;
      // 공용 combobox 는 내부 select/버튼으로 값을 변경.
      // select 변화와 버튼 클릭 둘 다 훅.
      var sel = combo.querySelector('select');
      if (sel) {
        bound = true;
        sel.addEventListener('change', function () {
          switchSusiYear(sel.value);
        });
      }
      // 옵션 버튼 방식 (combo-option)
      var opts = combo.querySelectorAll('[data-value]');
      if (opts && opts.length) {
        bound = true;
        opts.forEach(function (el) {
          el.addEventListener('click', function () {
            var v = el.getAttribute('data-value');
            if (v) switchSusiYear(v);
          });
        });
      }
    }
    tryBind();
    if (!bound) {
      var mo = new MutationObserver(function () { tryBind(); if (bound) mo.disconnect(); });
      mo.observe(host, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 2000);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var token = window.getToken();
    if (!token) {
      location.href = 'login.html';
      return;
    }
    verifyProfile();
    hookSidebarNav();
    hookYearCombo();
  });
})();
