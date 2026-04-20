/* ============================================================ */
/* bootstrap.js — 테마 복원 + 사이드바 include + 토스트 컨테이너 + 글로벌 Esc */
/* 수시 전용: 로그아웃 → login.html */
/* ============================================================ */

try {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch (_) {}

try {
  var _ua = navigator.userAgent || '';
  if (/Windows|Win64|Win32|WOW64/i.test(_ua)) document.documentElement.classList.add('os-win');
  else if (/Macintosh|Mac OS X/i.test(_ua)) document.documentElement.classList.add('os-mac');
} catch (_) {}

(function () {
  'use strict';

  async function loadSidebar() {
    var host = document.getElementById('sidebar-slot');
    if (!host) return;
    try {
      var res = await fetch('/assets/sidebar.html', { cache: 'no-cache' });
      if (!res.ok) {
        res = await fetch('assets/sidebar.html', { cache: 'no-cache' });
      }
      if (!res.ok) throw new Error('sidebar fetch ' + res.status);
      host.innerHTML = await res.text();
    } catch (e) {
      console.warn('[loadSidebar]', e);
      return;
    }

    var page = document.body.dataset.page;
    if (page) {
      var active = host.querySelector('[data-page="' + page + '"]');
      if (active) active.classList.add('active');
    }

    var toggle = host.querySelector('#toggleSidebar');
    if (toggle) {
      toggle.addEventListener('click', function () {
        document.body.classList.toggle('sidebar-collapsed');
      });
    }

    var logoutBtn = host.querySelector('[data-action="logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        if (window.clearToken) window.clearToken();
        location.href = 'login.html';
      });
    }

    try {
      var info = (window.getCounselorFromToken && window.getCounselorFromToken()) || {};
      var displayName = info.name || info.userid || '';
      var isAdmin = info.userid === 'admin' || info.role === 'admin';

      if (!isAdmin) {
        var adminGroup = host.querySelector('[data-group="admin"]');
        if (adminGroup) adminGroup.style.display = 'none';
      }
      var nameEl = host.querySelector('#sidebarUserName');
      var branchEl = host.querySelector('#sidebarUserBranch');
      var avatarEl = host.querySelector('#sidebarAvatar');
      if (nameEl) nameEl.textContent = displayName || '—';
      if (branchEl) {
        var roleText = isAdmin ? '본원 관리자' : '원장';
        branchEl.textContent = [info.branch, roleText].filter(Boolean).join(' · ') || '—';
      }
      if (avatarEl) {
        var initials = '';
        if (displayName) {
          initials = /[가-힣]/.test(displayName) ? displayName.charAt(0) : displayName.slice(0, 2).toUpperCase();
        }
        avatarEl.textContent = initials || '?';
      }

      var yearBox = host.querySelector('#sidebarYearCombo');
      if (yearBox && typeof window.createCombobox === 'function') {
        window.createCombobox(yearBox, {
          searchable: false,
          value: window.SUSI_YEAR || '26',
          placeholder: '연도',
          options: [
            { value: '26', label: '26학년도' },
            { value: '27', label: '27학년도' },
            { value: '28', label: '28학년도' },
          ],
          onChange: function (v) {
            if (window.setSusiYear && window.setSusiYear(v)) {
              location.reload();
            }
          },
        });
      }
    } catch (e) { console.warn('[sidebar user inject]', e); }
  }

  function applyThemeIcon(icon, isDark) {
    if (!icon) return;
    icon.className = isDark ? 'ph-light ph-sun' : 'ph-light ph-moon';
  }

  function ensureThemeToggle() {
    var slot = document.querySelector('.topbar-actions');
    if (!slot) return;
    var btn = document.getElementById('themeToggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'icon-btn';
      btn.id = 'themeToggle';
      btn.setAttribute('title', '테마 전환');
      btn.setAttribute('aria-label', '테마 전환');
      var icon = document.createElement('i');
      icon.id = 'themeIcon';
      btn.appendChild(icon);
      slot.insertBefore(btn, slot.firstChild);
    }
    var icon = btn.querySelector('i');
    applyThemeIcon(icon, document.documentElement.classList.contains('dark'));
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', function () {
      var isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      applyThemeIcon(btn.querySelector('i'), isDark);
    });
  }

  function ensureWatermark() {
    if (document.querySelector('.watermark-bg')) return;
    document.documentElement.style.setProperty('--watermark-url', "url('/assets/img/max-logo.png')");
    var wm = document.createElement('div');
    wm.className = 'watermark-bg';
    wm.setAttribute('aria-hidden', 'true');
    document.body.appendChild(wm);
  }

  function ensureToastContainer() {
    if (document.getElementById('toastContainer')) return;
    var c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }

  function bindGlobalEsc() {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.modal-backdrop.show').forEach(function (m) {
        m.classList.remove('show');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
    await loadSidebar();
    ensureWatermark();
    ensureToastContainer();
    ensureThemeToggle();
    bindGlobalEsc();

    var title = document.body.dataset.title;
    if (title) {
      var curEl = document.querySelector('.page-path .current');
      if (curEl && !curEl.textContent.trim()) curEl.textContent = title;
      var tEl = document.querySelector('.topbar-title');
      if (tEl && !tEl.textContent.trim()) tEl.textContent = title;
    }
    var category = document.body.dataset.category;
    if (category) {
      var pathEl = document.querySelector('.page-path');
      if (pathEl) {
        var catSpan = pathEl.querySelector('span:first-child');
        if (catSpan && !catSpan.textContent.trim()) catSpan.textContent = category;
      }
    }
  });
})();
