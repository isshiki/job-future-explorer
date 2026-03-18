'use strict';

const DATA_URL = 'data/ai_analysis.json';

const CATEGORY_LABEL = {
  all:     '全て',
  growing: '伸びる',
  at_risk: '危機',
  middle:  '中間',
};

// カラードット（CSSクラスで制御）
const CATEGORY_DOT = {
  growing: '<span class="dot dot-growing"></span>',
  at_risk: '<span class="dot dot-at_risk"></span>',
  middle:  '<span class="dot dot-middle"></span>',
};

let allData = [];
let filteredData = [];
let sortKey = null;
let sortDir = 1; // 1=asc, -1=desc

// ── DOM refs ──────────────────────────────────────────────────────────────────
const searchEl     = document.getElementById('search');
const tbody        = document.getElementById('tbody');
const noResults    = document.getElementById('no-results');
const countEl      = document.getElementById('count');
const csvBtn       = document.getElementById('csv-btn');
const filterBtns   = document.querySelectorAll('.filter-tabs button');
const sortableThs  = document.querySelectorAll('thead th.sortable');

// ── Fetch data ────────────────────────────────────────────────────────────────
fetch(DATA_URL)
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(data => {
    allData = data;
    render();
  })
  .catch(err => {
    tbody.innerHTML = `<tr><td colspan="4" style="padding:2rem;text-align:center;color:#dc3545;">
      データの読み込みに失敗しました。<br><small>${err}</small></td></tr>`;
  });

// ── Filter & sort state ───────────────────────────────────────────────────────
let activeCategory = 'all';

function getFiltered() {
  const q = searchEl.value.trim().toLowerCase();
  return allData.filter(d => {
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    const matchQ   = !q
      || d.name_ja.toLowerCase().includes(q)
      || d.name_en.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
}

function getSorted(data) {
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string') return av.localeCompare(bv, 'ja') * sortDir;
    return (av - bv) * sortDir;
  });
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  filteredData = getSorted(getFiltered());

  countEl.textContent = `${filteredData.length} 件 / 全 ${allData.length} 件`;

  if (filteredData.length === 0) {
    tbody.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  tbody.innerHTML = filteredData.map(d => {
    const blsCls = d.bls_growth > 0 ? 'bls-positive' : d.bls_growth < 0 ? 'bls-negative' : 'bls-zero';
    const blsTxt = d.bls_growth > 0 ? `+${d.bls_growth}%` : `${d.bls_growth}%`;
    const aiPct  = d.ai_score * 10;
    const aiCls  = d.ai_score >= 8 ? 'high' : d.ai_score >= 5 ? 'mid' : 'low';
    const dot    = CATEGORY_DOT[d.category];
    const label  = CATEGORY_LABEL[d.category];

    const nameJa = d.bls_url
      ? `<a href="${esc(d.bls_url)}" target="_blank" rel="noopener" class="occ-link">${esc(d.name_ja)}</a>`
      : esc(d.name_ja);

    return `<tr class="${d.category}">
      <td class="name-cell">
        <span class="name-ja">${dot}${nameJa}</span>
        <span class="name-en">${esc(d.name_en)}</span>
      </td>
      <td class="${blsCls}">${blsTxt}</td>
      <td>
        <div class="ai-wrap">
          <span>${d.ai_score}/10</span>
          <div class="ai-bar-bg"><div class="ai-bar-fill ${aiCls}" style="width:${aiPct}%"></div></div>
        </div>
      </td>
      <td><span class="badge badge-${d.category}">${label}</span></td>
    </tr>`;
  }).join('');
}

function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Events ────────────────────────────────────────────────────────────────────
searchEl.addEventListener('input', render);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activeCategory = btn.dataset.cat;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

sortableThs.forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (sortKey === key) {
      sortDir *= -1;
    } else {
      sortKey = key;
      sortDir = key === 'name_ja' ? 1 : -1; // 数値系は大きい順をデフォルト
    }
    sortableThs.forEach(t => t.classList.remove('asc', 'desc'));
    th.classList.add(sortDir === 1 ? 'asc' : 'desc');
    render();
  });
});

// ── CSV download ──────────────────────────────────────────────────────────────
csvBtn.addEventListener('click', () => {
  const header = ['職業名（日本語）', '英語原名', 'BLS成長率(%)', 'AI影響度', '分類'];
  const rows = filteredData.map(d => [
    d.name_ja,
    d.name_en,
    d.bls_growth,
    d.ai_score,
    CATEGORY_LABEL[d.category],
  ]);

  const bom = '\uFEFF'; // Excel UTF-8 BOM
  const csv = bom + [header, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'ai_job_analysis.csv';
  a.click();
  URL.revokeObjectURL(url);
});
