/* ============================================================
 * counsel.new.js — 개인 상담 도메인 로직
 * 원본: counsel.html (1227줄) 의 기능을 100% 보존.
 * 규칙:
 *   - fetch / susicFetch / localStorage.token 직접 호출 금지 → window.api() 경유
 *   - 구 알림 라이브러리 금지 → window.showToast / window.openModal / 로딩 오버레이
 *   - 하드코딩 컬러 금지 (CSS 측 토큰 사용)
 *   - 기능 diff 0: 21 함수 / 14 API 모두 이식
 * ============================================================ */

(function () {
  'use strict';

  // ───────── 상수 ─────────
  const MAX_PRACTICAL_EVENTS = 7;
  // jsPDF API 는 RGB 숫자만 받음 (CSS 토큰 불가). 원본 PDF 룩 보존용 고정값.
  const PDF_COLORS = {
    accentLine: [74, 107, 175],
    title: [44, 62, 80],
    cardBorder: [224, 224, 224],
    cardFill: [255, 255, 255],
    bodyText: [127, 140, 141],
    footerText: [149, 165, 166],
  };

  // ───────── 상태 ─────────
  let students = [];
  let colleges = [];
  let studentMap = {};
  let collegeGroups = {};
  let directorPhone = '';
  let studentCombo = null;

  // ───────── 로딩 오버레이 ─────────
  function showLoading(text) {
    const el = document.getElementById('loadingOverlay');
    if (!el) return;
    document.getElementById('loadingText').textContent = text || '로딩중…';
    el.hidden = false;
  }
  function hideLoading() {
    const el = document.getElementById('loadingOverlay');
    if (el) el.hidden = true;
  }

  // ───────── Modal helpers ─────────
  function openScoreModal(titleText) {
    document.getElementById('modalTitle').textContent = titleText || '';
    window.openModal('scoreTableModal');
  }

  // ───────── 초기 로드 ─────────
  async function loadData() {
    showLoading('데이터 로딩중…');
    try {
      const [profileData, studentJson, collegeJson] = await Promise.all([
        window.api('/profile'),
        window.api('_student_list'),
        window.api('_college_list'),
      ]);

      if (profileData && profileData.success && profileData.user) {
        const user = profileData.user;
        document.getElementById('mainTitle').textContent =
          `2026맥스체대입시 ${user.branch} 교육원 수시상담`;
        directorPhone = user.phone || '000-0000-0000';
      } else {
        document.getElementById('mainTitle').textContent = '26맥스체대입시 수시상담';
      }

      students = (studentJson && studentJson.students) || [];
      studentMap = {};
      students.forEach(s => { studentMap[s.학생ID] = s; });
      colleges = (collegeJson && collegeJson.colleges) || [];

      groupColleges();
      renderStudentSelect();
      addCollegeRow();
    } catch (err) {
      console.error('초기 데이터 로딩 실패:', err);
      window.showToast('데이터를 불러오는 데 실패했습니다', 'error');
    } finally {
      hideLoading();
    }
  }

  // ───────── 대학 그룹핑 ─────────
  function groupColleges() {
    collegeGroups = {};
    colleges.forEach(c => {
      if (!collegeGroups[c.대학명]) collegeGroups[c.대학명] = {};
      if (!collegeGroups[c.대학명][c.학과명]) collegeGroups[c.대학명][c.학과명] = [];
      if (!collegeGroups[c.대학명][c.학과명].includes(c.전형명)) {
        collegeGroups[c.대학명][c.학과명].push(c.전형명);
      }
    });
  }

  // ───────── 학생 콤보 렌더 (공용 createCombobox) ─────────
  function renderStudentSelect() {
    students.sort((a, b) => a.이름.localeCompare(b.이름));
    const host = document.getElementById('studentCombo');
    if (!host) return;

    const options = [
      { value: '', label: '학생을 선택하세요' },
      ...students.map(s => ({
        value: String(s.학생ID),
        label: `${s.이름} (${s.성별})`,
        meta: s.성별,
      })),
    ];

    if (studentCombo) {
      studentCombo.setOptions(options);
    } else {
      studentCombo = window.createCombobox(host, {
        options,
        placeholder: '학생 선택',
        searchable: true,
        searchPlaceholder: '이름으로 검색',
        onChange: function (v) {
          if (v) loadCounselData(v);
        },
      });
    }
  }

  function getSelectedStudentId() {
    return studentCombo ? studentCombo.value : '';
  }

  // ───────── 행 카운터 ─────────
  function reNumberRows() {
    document.querySelectorAll('#collegeTbody .row-counter').forEach((counter, i) => {
      counter.textContent = `${i + 1}.`;
    });
  }

  // ───────── 대학 행 추가 ─────────
  function addCollegeRow() {
    const tbody = document.getElementById('collegeTbody');
    const idx = tbody.querySelectorAll('.row-group').length + 1;
    const group = document.createElement('tbody');
    group.classList.add('row-group');

    const header = document.createElement('tr');
    header.classList.add('college-group-header');
    header.innerHTML =
      `<th><span class="row-counter">${idx}.</span> 대학명` +
      `<button type="button" class="score-table-btn" data-action="score">배점표</button>` +
      `<button type="button" class="details-btn" data-action="details">간단요강</button></th>` +
      `<th>학과명</th><th>전형명</th><th>등급</th><th>내신점수</th><th>실기총점</th>` +
      `<th>합산점수</th><th>26맥스컷</th><th>26지점컷</th><th></th>`;
    group.appendChild(header);

    const infoRow = document.createElement('tr');
    infoRow.innerHTML =
      `<td><div class="sel-college"></div></td>` +
      `<td><div class="sel-major"></div></td>` +
      `<td><div class="sel-type"></div></td>` +
      `<td><input type="text" class="input-grade"></td>` +
      `<td><input type="text" class="input-score"></td>` +
      `<td><input type="text" class="input-total-score" readonly></td>` +
      `<td><input type="text" class="input-score 합산점수" readonly></td>` +
      `<td><input type="text" class="input-score max-cut" readonly></td>` +
      `<td><input type="text" class="input-score branch-cut" readonly></td>` +
      `<td><button type="button" class="del-btn" data-action="del">삭제</button></td>`;
    group.appendChild(infoRow);

    const practicalRow = document.createElement('tr');
    practicalRow.innerHTML = `<td colspan="10"><div class="practical-row practical-fields"></div></td>`;
    group.appendChild(practicalRow);

    tbody.appendChild(group);
    reNumberRows();

    // ───── 3단계 콤보 생성 (대학명=검색 가능, 학과=검색, 전형=no-search) ─────
    const sortedCollegeNames = Object.keys(collegeGroups).sort((a, b) => a.localeCompare(b));
    const colCombo = window.createCombobox(group.querySelector('.sel-college'), {
      options: sortedCollegeNames.map(c => ({ value: c, label: c })),
      placeholder: '대학명 선택',
      searchable: true,
      searchPlaceholder: '대학명 검색',
      onChange: () => onCollegeNameChange(group),
    });
    const majorCombo = window.createCombobox(group.querySelector('.sel-major'), {
      options: [],
      placeholder: '대학 먼저',
      searchable: true,
      searchPlaceholder: '학과 검색',
      disabled: true,
      onChange: () => onMajorChange(group),
    });
    const typeCombo = window.createCombobox(group.querySelector('.sel-type'), {
      options: [],
      placeholder: '학과 먼저',
      searchable: false,
      disabled: true,
      onChange: () => onTypeChange(group),
    });
    group._colCombo = colCombo;
    group._majorCombo = majorCombo;
    group._typeCombo = typeCombo;

    group.querySelectorAll('.input-grade, .input-score').forEach(inp => {
      inp.addEventListener('change', () => onInputEdit(inp));
    });
    header.querySelector('[data-action="score"]').addEventListener('click', e => openScoreTablePopup(e.currentTarget));
    header.querySelector('[data-action="details"]').addEventListener('click', e => showCollegeDetailsModal(e.currentTarget));
    infoRow.querySelector('[data-action="del"]').addEventListener('click', () => {
      group.remove();
      reNumberRows();
    });

    return group;
  }

  // ───────── 3단계 콤보 연쇄 (인자는 tbody.row-group) ─────────
  function onCollegeNameChange(group) {
    const colValue = group._colCombo.value;
    group._majorCombo.setOptions([]);
    group._majorCombo.setValue('');
    group._majorCombo.disable();
    group._typeCombo.setOptions([]);
    group._typeCombo.setValue('');
    group._typeCombo.disable();
    group.querySelector('.practical-fields').innerHTML = '';
    group.querySelector('.input-total-score').value = '';
    group.querySelector('.합산점수').value = '';
    if (colValue) {
      const majors = Object.keys(collegeGroups[colValue] || {})
        .map(m => ({ value: m, label: m }));
      group._majorCombo.setOptions(majors);
      group._majorCombo.enable();
    }
  }

  function onMajorChange(group) {
    const colValue = group._colCombo.value;
    const majorValue = group._majorCombo.value;
    group._typeCombo.setOptions([]);
    group._typeCombo.setValue('');
    group._typeCombo.disable();
    group.querySelector('.practical-fields').innerHTML = '';
    group.querySelector('.input-total-score').value = '';
    group.querySelector('.합산점수').value = '';
    if (colValue && majorValue) {
      const types = (collegeGroups[colValue][majorValue] || [])
        .map(t => ({ value: t, label: t }));
      group._typeCombo.setOptions(types);
      group._typeCombo.enable();
    }
  }

  async function onTypeChange(group) {
    const colValue = group._colCombo.value;
    const majorValue = group._majorCombo.value;
    const typeValue = group._typeCombo.value;
    const practicalContainer = group.querySelector('.practical-fields');
    if (!colValue || !majorValue || !typeValue) {
      practicalContainer.innerHTML = ''; return;
    }
    const collegeID = getCollegeID(colValue, majorValue, typeValue);
    const matched = colleges.find(c => c.대학ID === collegeID);
    group.querySelector('.max-cut').value = matched?.['26맥스예상컷'] || '';
    group.querySelector('.branch-cut').value = matched?.['지점예상컷'] || '';
    const practical_id = matched?.실기ID;
    const student_id = getSelectedStudentId();
    const student = studentMap[student_id];

    if (!student) {
      practicalContainer.innerHTML =
        '<span class="practical-hint is-error">학생을 먼저 선택하세요.</span>';
      return;
    }

    if (!practical_id) {
      practicalContainer.innerHTML =
        '<span class="practical-hint is-muted">실기 종목이 없습니다.</span>';
    } else {
      try {
        const json = await window.api(
          `_events_by_practical_id?practical_id=${encodeURIComponent(practical_id)}&gender=${encodeURIComponent(student.성별)}`
        );
        const events = [...new Set((json.events || []).map(e => e.종목명))];
        practicalContainer.innerHTML = events.map(e => `
          <div class="practical-group">
            <span class="practical-label">${window.escapeHtml(e)}</span>
            <div class="practical-input-container">
              <input type="text" class="input-sm input-record" placeholder="기록">
              <input type="text" class="input-sm input-score-only" placeholder="점수" readonly>
            </div>
          </div>`).join('');
        practicalContainer.querySelectorAll('.input-record').forEach(inp => {
          inp.addEventListener('input', () => onRecordInputChange(inp));
        });
      } catch (e) {
        console.error('실기 종목 로드 실패', e);
        window.showToast('실기 종목 로드 실패', 'error');
      }
    }

    if (collegeID && student_id) {
      try {
        const json2 = await window.api(
          `_student_grade?student_id=${encodeURIComponent(student_id)}`
        );
        if (json2.success && Array.isArray(json2.grades)) {
          const g = json2.grades.find(row => row.대학ID === collegeID);
          if (g) {
            group.querySelector('.input-grade').value = g.등급 ?? '';
            group.querySelector('.input-score').value = g.내신점수 ?? '';
          }
        }
      } catch (e) {
        console.warn('학생 성적 로드 실패', e);
      }
    }
    await updateAllScores(group);
  }

  // ───────── 기록 입력 → 즉시 계산 ─────────
  function onRecordInputChange(input) {
    updateAllScores(input.closest('tbody.row-group'));
  }

  function onInputEdit(input) {
    const tbody = input.closest('tbody');
    const student_id = getSelectedStudentId();
    const collegeID = getCollegeIDByTbody(tbody);
    if (student_id && collegeID &&
        (input.classList.contains('input-grade') || input.classList.contains('input-score'))) {
      window.api('_student_grade_update', {
        method: 'POST',
        body: JSON.stringify({
          student_id,
          college_id: collegeID,
          등급: tbody.querySelector('.input-grade').value,
          내신점수: tbody.querySelector('.input-score').value,
        }),
      }).catch(err => console.warn('성적 업데이트 실패', err));
    }
    updateAllScores(tbody);
  }

  // ───────── 점수 계산 ─────────
  async function updateAllScores(tbody) {
    const student = studentMap[getSelectedStudentId()];
    const collegeID = getCollegeIDByTbody(tbody);
    if (!student || !collegeID) return;

    const 내신점수 = tbody.querySelector('.input-score').value || 0;
    const practicalGroups = tbody.querySelectorAll('.practical-group');
    const inputs = Array.from(practicalGroups).map(group => ({
      종목명: group.querySelector('.practical-label').textContent.split('(')[0].trim(),
      기록: group.querySelector('.input-record').value.trim() || null,
    }));

    let data;
    try {
      data = await window.api('/calculate-final-score', {
        method: 'POST',
        body: JSON.stringify({ 대학ID: collegeID, gender: student.성별, inputs, 내신점수 }),
      });
    } catch (e) {
      console.warn('점수 계산 실패', e);
      return;
    }
    if (!data || !data.success) return;

    practicalGroups.forEach(group => {
      const label = group.querySelector('.practical-label');
      const eventName = label.textContent.split('(')[0].trim();
      const score = data.종목별점수[eventName];
      const gam = data.종목별감수[eventName];

      group.querySelector('.input-score-only').value = score ?? '';

      label.querySelectorAll('.gam-span').forEach(sp => sp.remove());
      if (gam > 0) {
        const gamSpan = document.createElement('span');
        gamSpan.className = 'gam-span';
        gamSpan.textContent = `(${gam}감)`;
        label.appendChild(gamSpan);
      }
    });

    const totalInput = tbody.querySelector('.input-total-score');
    const totalCell = totalInput.parentElement;
    totalCell.querySelectorAll('.total-gam-span').forEach(sp => sp.remove());
    totalInput.value = data.실기총점 ?? '';
    if (data.총감수 > 0) {
      const span = document.createElement('span');
      span.className = 'total-gam-span';
      span.textContent = `(총 ${data.총감수}감)`;
      totalCell.appendChild(span);
    }
    tbody.querySelector('.합산점수').value = data.합산점수 ?? '';
  }

  // ───────── 상담 저장 ─────────
  async function saveCounsel(e) {
    if (e) e.preventDefault();
    const msgEl = document.getElementById('msg');
    msgEl.textContent = '저장 중...';
    const student_id = getSelectedStudentId();
    if (!student_id) {
      msgEl.textContent = '';
      window.showToast('먼저 학생을 선택하세요', 'warn');
      return;
    }

    const collegesArr = [];
    document.querySelectorAll('#collegeTbody .row-group').forEach(tbody => {
      const 대학ID = getCollegeIDByTbody(tbody);
      if (!대학ID) return;
      const practicalGroups = tbody.querySelectorAll('.practical-group');
      const 기록 = [], 점수 = [];
      for (let i = 0; i < 7; i++) {
        const g = practicalGroups[i];
        기록.push(g?.querySelector('.input-record')?.value || null);
        점수.push(g?.querySelector('.input-score-only')?.value || null);
      }
      collegesArr.push({
        대학ID, 실기ID: getPracticalIDByCollegeID(대학ID),
        내신등급: tbody.querySelector('.input-grade')?.value || null,
        내신점수: tbody.querySelector('.input-score')?.value || null,
        기록1: 기록[0], 점수1: 점수[0], 기록2: 기록[1], 점수2: 점수[1],
        기록3: 기록[2], 점수3: 점수[2], 기록4: 기록[3], 점수4: 점수[3],
        기록5: 기록[4], 점수5: 점수[4], 기록6: 기록[5], 점수6: 점수[5],
        기록7: 기록[6], 점수7: 점수[6],
        실기총점: tbody.querySelector('.input-total-score')?.value || null,
        합산점수: tbody.querySelector('.합산점수')?.value || null,
      });
    });

    try {
      const [collegeRes, memoRes] = await Promise.all([
        window.api('_counsel_college_save_multi', {
          method: 'POST',
          body: JSON.stringify({ student_id, colleges: collegesArr }),
        }),
        window.api('_counsel_memo_save', {
          method: 'POST',
          body: JSON.stringify({
            student_id,
            memo: document.getElementById('counselMemo').value,
          }),
        }),
      ]);
      msgEl.textContent = '';
      if (collegeRes.success && memoRes.success) {
        const name = studentMap[student_id]?.이름 || '학생';
        window.showToast(`${name} 학생의 상담내용이 저장되었습니다`, 'success');
      } else {
        window.showToast('데이터 저장 중 문제가 발생했습니다', 'error');
      }
    } catch (err) {
      msgEl.textContent = '';
      console.error('상담 저장 실패:', err && err.message ? err.message : 'unknown');
      window.showToast('서버와 통신 중 오류가 발생했습니다', 'error');
    }
  }

  // ───────── 상담 불러오기 ─────────
  async function loadCounselData(student_id) {
    showLoading('학생 정보 로딩 중…');
    const tbodyContainer = document.getElementById('collegeTbody');
    const memoTextarea = document.getElementById('counselMemo');
    tbodyContainer.innerHTML = '';
    memoTextarea.value = '';
    try {
      const [collegeRes, memoRes] = await Promise.all([
        window.api(`_counsel_college_load?student_id=${encodeURIComponent(student_id)}`),
        window.api(`_counsel_memo_load?student_id=${encodeURIComponent(student_id)}`),
      ]);

      if (memoRes.success) memoTextarea.value = memoRes.memo || '';

      if (!collegeRes.success || !collegeRes.colleges || collegeRes.colleges.length === 0) {
        addCollegeRow();
        return;
      }

      for (const item of collegeRes.colleges) {
        const c = colleges.find(cc => cc.대학ID === item.대학ID);
        if (!c) continue;
        const group = addCollegeRow();
        await new Promise(r => setTimeout(r, 50));

        group._colCombo.setValue(c.대학명);
        onCollegeNameChange(group);

        group._majorCombo.setValue(c.학과명);
        onMajorChange(group);

        group._typeCombo.setValue(c.전형명);
        await onTypeChange(group);

        const practicalGroups = group.querySelectorAll('.practical-group');
        for (let i = 0; i < MAX_PRACTICAL_EVENTS; i++) {
          const rec = item[`기록${i + 1}`];
          if (practicalGroups[i]?.querySelector('.input-record') && rec) {
            practicalGroups[i].querySelector('.input-record').value = rec;
          }
        }
        const firstRecord = group.querySelector('.input-record');
        if (firstRecord?.value) await onRecordInputChange(firstRecord);
      }
    } catch (err) {
      console.error('상담 불러오기 실패:', err && err.message ? err.message : 'unknown');
      window.showToast('상담 정보를 불러오는 데 실패했습니다', 'error');
    } finally {
      hideLoading();
    }
  }

  // ───────── ID 보조 ─────────
  function getCollegeID(대학명, 학과명, 전형명) {
    const c = colleges.find(c => c.대학명 === 대학명 && c.학과명 === 학과명 && c.전형명 === 전형명);
    return c?.대학ID || null;
  }
  function getCollegeIDByTbody(tbody) {
    const c = tbody._colCombo ? tbody._colCombo.value : '';
    const m = tbody._majorCombo ? tbody._majorCombo.value : '';
    const t = tbody._typeCombo ? tbody._typeCombo.value : '';
    return c && m && t ? getCollegeID(c, m, t) : null;
  }
  function getPracticalIDByCollegeID(대학ID) {
    const c = colleges.find(c => c.대학ID === 대학ID);
    return c?.실기ID || null;
  }

  // ───────── 배점표 모달 ─────────
  async function openScoreTablePopup(btn) {
    const tbody = btn.closest('tbody.row-group');
    const collegeID = getCollegeIDByTbody(tbody);
    const matched = colleges.find(c => c.대학ID === collegeID);
    if (!matched || !matched.실기ID) {
      window.showToast('대학, 학과, 전형을 모두 선택해야 배점표를 볼 수 있습니다', 'warn');
      return;
    }
    const container = document.getElementById('modalTableContainer');
    container.innerHTML = '로딩 중...';
    openScoreModal(`${matched.대학명} - ${matched.학과명} (${matched.전형명}) 배점표`);

    try {
      const data = await window.api(`_get_score_table?실기ID=${encodeURIComponent(matched.실기ID)}`);
      if (data.success) {
        renderPopupScoreTable(data.events, container);
      } else {
        container.innerHTML = '배점표를 불러오는 데 실패했습니다.';
      }
    } catch (e) {
      container.innerHTML = '배점표 로드 중 오류 발생.';
    }
  }

  function renderPopupScoreTable(events, container) {
    let finalHTML = '<div class="score-table-wrap">';
    Object.keys(events).forEach(name => {
      const { 남, 여 } = events[name];
      const allScores = new Set([...남.map(i => i.배점), ...여.map(i => i.배점)]);
      const sortedScores = Array.from(allScores).sort((a, b) => Number(b) - Number(a));
      const map = {
        남: new Map(남.map(i => [i.배점, i.기록])),
        여: new Map(여.map(i => [i.배점, i.기록])),
      };
      let html = `<table><thead><tr><th colspan="3">${window.escapeHtml(name)}</th></tr>`
        + `<tr><th>배점</th><th>남</th><th>여</th></tr></thead><tbody>`;
      sortedScores.forEach(score => {
        html += `<tr><td>${window.escapeHtml(score)}</td>`
          + `<td>${window.escapeHtml(map.남.get(score) || '-')}</td>`
          + `<td>${window.escapeHtml(map.여.get(score) || '-')}</td></tr>`;
      });
      html += '</tbody></table>';
      finalHTML += html;
    });
    finalHTML += '</div>';
    container.innerHTML = finalHTML;
  }

  // ───────── 간단요강 모달 ─────────
  async function showCollegeDetailsModal(btn) {
    const tbody = btn.closest('tbody.row-group');
    const collegeID = getCollegeIDByTbody(tbody);
    if (!collegeID) {
      window.showToast('먼저 대학을 선택해주세요', 'warn');
      return;
    }

    try {
      const data = await window.api(`/university-details?college_id=${encodeURIComponent(collegeID)}`);
      if (!data.success) {
        window.showToast(data.message || '정보를 불러오지 못했습니다', 'error');
        return;
      }
      const details = data.details;
      const esc = window.escapeHtml;

      const hasFirstStage = details['1단계배수'] && String(details['1단계배수']).trim() !== '';
      const eligibility = [];
      if (details.일반고 === 'O') eligibility.push('일반고');
      if (details.특성화고 === 'O') eligibility.push('특성화고');
      if (details.체육고 === 'O') eligibility.push('체육고');
      if (details.검정고시 === 'O') eligibility.push('검정고시');

      let html = `<div class="modal-body-custom">
        <div class="detail-section">
          <h4><i class="ph-light ph-users"></i> 모집 정보</h4>
          <table>
            <thead><tr><th>모집정원</th><th>25학년도 정원</th><th>25학년도 경쟁률</th><th>25학년도 추가합격</th><th>교직이수</th></tr></thead>
            <tbody><tr>
              <td>${esc(details.정원 || '-')}</td>
              <td>${esc(details['25정원'] || '자료없음')}</td>
              <td>${esc(details['25경쟁률'] || '자료없음')}</td>
              <td>${esc(details['25추가합격'] || '자료없음')}</td>
              <td>${esc(details.교직이수 || '-')}</td>
            </tr></tbody>
          </table>
        </div>

        <div class="detail-section">
          <h4><i class="ph-light ph-clipboard-text"></i> 전형 방법</h4>
          <table><thead><tr>`;

      if (hasFirstStage) {
        html += `<th>1단계(배수)</th><th>학생부</th><th>기타</th><th>2단계 내신</th><th>2단계 실기</th><th>2단계 면접</th><th>2단계 기타</th>`;
      } else {
        html += `<th>내신</th><th>실기</th><th>면접</th><th>기타</th>`;
      }
      html += `</tr></thead><tbody><tr>`;

      if (hasFirstStage) {
        html += `
          <td>${esc(details['1단계배수'])}</td>
          <td>${esc(details['1단계학생부'] || '-')}%</td>
          <td>${esc(details['1단계기타'] || '-')}%</td>
          <td>${esc(details['2단계내신'] || '-')}%</td>
          <td>${esc(details['2단계실기'] || '-')}%</td>
          <td>${esc(details['2단계면접'] || '-')}%</td>
          <td>${esc(details['2단계기타'] || '-')}%</td>`;
      } else {
        html += `
          <td>${esc(details['2단계내신'] || '-')}%</td>
          <td>${esc(details['2단계실기'] || '-')}%</td>
          <td>${esc(details['2단계면접'] || '-')}%</td>
          <td>${esc(details['2단계기타'] || '-')}%</td>`;
      }
      html += `</tr></tbody></table></div>`;

      if (eligibility.length > 0) {
        html += `<div class="detail-section">
          <h4><i class="ph-light ph-check-circle"></i> 지원 가능 대상</h4>
          <p style="padding: 0 10px;">${esc(eligibility.join(', '))}</p>
        </div>`;
      }

      html += `<div class="detail-section">
        <h4><i class="ph-light ph-book"></i> 학생부 반영</h4>
        <table>
          <thead><tr><th>교과</th><th>출결</th><th>기타</th><th>일반선택</th><th>진로선택</th><th>N수생 반영</th></tr></thead>
          <tbody><tr>
            <td>${esc(details.내신교과 || '-')}%</td>
            <td>${esc(details.내신출결 || '-')}%</td>
            <td>${esc(details.내신기타 || '-')}%</td>
            <td>${esc(details.내신일반 || '-')}</td>
            <td>${esc(details.내신진로 || '-')}</td>
            <td>${esc(details.N학년비율 || '-')}</td>
          </tr></tbody>
        </table>
      </div>`;

      html += `<div class="detail-section">
        <h4><i class="ph-light ph-calendar"></i> 주요 일정</h4>
        <table><thead><tr>`;
      if (hasFirstStage) html += `<th>1단계 발표</th>`;
      html += `<th>실기고사</th><th>최종 발표</th></tr></thead><tbody><tr>`;
      if (hasFirstStage) html += `<td>${esc(details['1단계발표일'] || '-')}</td>`;
      html += `<td>${esc(details.실기일 || '-')}</td><td>${esc(details.합격자발표일 || '-')}</td></tr></tbody></table></div>`;

      html += `</div>`;

      document.getElementById('modalTableContainer').innerHTML = html;
      openScoreModal(`${details.대학명} - ${details.학과명} (${details.전형명})`);
    } catch (err) {
      window.showToast('정보를 불러오는 데 실패했습니다', 'error');
    }
  }

  // ───────── PDF 생성 (원본과 동일: jsPDF + NanumGothic + html2canvas) ─────────
  function toBase64(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () { resolve(reader.result); };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }
  function getImageDimensions(base64) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () { resolve({ width: this.naturalWidth, height: this.naturalHeight }); };
      img.onerror = reject;
      img.src = base64;
    });
  }

  async function downloadPDF() {
    const studentId = getSelectedStudentId();
    if (!studentId) {
      window.showToast('먼저 학생을 선택해주세요', 'warn');
      return;
    }
    showLoading('PDF 문서를 만들고 있어요');
    try {
      const student = studentMap[studentId];
      const branchName = document.getElementById('mainTitle').textContent.split(' ')[1] || 'OO';
      const formatPhoneNumber = phone =>
        String(phone || '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      const formattedPhone = formatPhoneNumber(directorPhone);

      const logoUrl = '25max.png';
      const logoBase64 = await toBase64(logoUrl);
      const logoOriginalSize = await getImageDimensions(logoBase64);
      const logoAspectRatio = logoOriginalSize.width / logoOriginalSize.height;

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const A4_WIDTH = 210, A4_HEIGHT = 297;

      doc.setFont('NanumGothic', 'normal');

      doc.setDrawColor(...PDF_COLORS.accentLine);
      doc.setLineWidth(1.5);
      doc.line(20, 20, A4_WIDTH - 20, 20);

      doc.setFontSize(28);
      doc.setTextColor(...PDF_COLORS.title);
      doc.text(`맥스체대입시 ${branchName} 교육원`, A4_WIDTH / 2, 50, { align: 'center' });

      doc.setFontSize(20);
      doc.text('2026학년도 수시 상담자료', A4_WIDTH / 2, 65, { align: 'center' });

      const logoWidth = A4_WIDTH * 1;
      const logoHeight = logoWidth / logoAspectRatio;
      const logoX = (A4_WIDTH - logoWidth) / 2;
      const logoY = 80;
      doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

      doc.setDrawColor(...PDF_COLORS.cardBorder);
      doc.setFillColor(...PDF_COLORS.cardFill);
      doc.roundedRect(40, A4_HEIGHT - 80, A4_WIDTH - 80, 60, 3, 3, 'FD');

      doc.setFontSize(16);
      doc.setTextColor(...PDF_COLORS.title);
      doc.text('상담 학생 정보', A4_WIDTH / 2, A4_HEIGHT - 65, { align: 'center' });

      doc.setFontSize(14);
      doc.setTextColor(...PDF_COLORS.bodyText);
      doc.text(`이    름 : ${student.이름}`, 50, A4_HEIGHT - 50);
      doc.text(`상담문의 : ${formattedPhone}`, 50, A4_HEIGHT - 35);

      doc.setDrawColor(...PDF_COLORS.accentLine);
      doc.setLineWidth(1);
      doc.line(20, A4_HEIGHT - 15, A4_WIDTH - 20, A4_HEIGHT - 15);

      doc.setFontSize(10);
      doc.setTextColor(...PDF_COLORS.footerText);
      doc.text('맥스체대입시 - 체대입시 진학의 메카', A4_WIDTH / 2, A4_HEIGHT - 10, { align: 'center' });

      doc.addPage();
      const element = document.getElementById('captureArea');
      element.classList.add('pdf-export-mode');
      const canvas = await html2canvas(element, {
        scale: 2, useCORS: true, logging: false, allowTaint: false,
      });
      element.classList.remove('pdf-export-mode');

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const MARGIN = 15;
      const availableWidth = A4_WIDTH - (2 * MARGIN);
      const availableHeight = A4_HEIGHT - (2 * MARGIN);
      const imgRatio = canvas.width / canvas.height;
      let pdfImgWidth = availableWidth, pdfImgHeight = pdfImgWidth / imgRatio;
      if (pdfImgHeight > availableHeight) {
        pdfImgHeight = availableHeight;
        pdfImgWidth = pdfImgHeight * imgRatio;
      }
      const xPos = (A4_WIDTH - pdfImgWidth) / 2;
      doc.addImage(imgData, 'JPEG', xPos, MARGIN, pdfImgWidth, pdfImgHeight);

      doc.save(`${student.이름}_상담요약.pdf`);
      window.showToast('PDF 생성 완료!', 'success');
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      window.showToast('PDF 생성 중 문제가 발생했습니다: ' + error.message, 'error');
    } finally {
      hideLoading();
    }
  }

  // ───────── 전역 이벤트 바인딩 ─────────
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('counselForm').addEventListener('submit', saveCounsel);
    document.getElementById('btnAddCollege').addEventListener('click', () => addCollegeRow());
    document.getElementById('btnSave').addEventListener('click', saveCounsel);
    document.getElementById('btnSaveBottom').addEventListener('click', saveCounsel);
    document.getElementById('btnPdf').addEventListener('click', downloadPDF);
    document.getElementById('modalCloseBtn').addEventListener('click', () => window.closeModal('scoreTableModal'));

    loadData();
  });
})();
