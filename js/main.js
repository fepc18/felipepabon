/* ============================================================
   main.js — Language toggle & post rendering
   ============================================================ */

let currentLang = localStorage.getItem('fp-lang') || 'es';

/* ── Language ──────────────────────────────────────────────── */
function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('fp-lang', lang);

  /* toggle button label */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.textContent = lang === 'es' ? 'EN' : 'ES';
  });

  /* swap all i18n text nodes */
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
  });

  /* show/hide full article language blocks */
  document.querySelectorAll('.lang-block').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll(`.lang-${lang}`).forEach(el => {
    el.style.display = '';
  });

  /* re-render post lists */
  const activeChip = document.querySelector('.filter-chip.active');
  const activeFilter = activeChip ? activeChip.dataset.filter : 'all';
  renderPosts(activeFilter);
}

function toggleLang() {
  applyLang(currentLang === 'es' ? 'en' : 'es');
}

/* ── Rendering ─────────────────────────────────────────────── */
function renderPosts(filter) {
  const filtered = filter === 'all'
    ? POSTS
    : POSTS.filter(p => p.tags.some(t => t === filter));

  /* homepage grid — up to 4 cards */
  const grid = document.getElementById('posts-preview');
  if (grid) {
    grid.innerHTML = filtered.slice(0, 4).map(cardHTML).join('');
  }

  /* blog page list — all posts */
  const list = document.getElementById('posts-full');
  if (list) {
    list.innerHTML = filtered.length
      ? filtered.map(rowHTML).join('')
      : `<p style="color:var(--text-3);padding:2rem 0">
           ${currentLang === 'es' ? 'No hay artículos en esta categoría.' : 'No posts in this category.'}
         </p>`;
  }
}

function cardHTML(post) {
  const title  = currentLang === 'es' ? post.titleEs : post.titleEn;
  const href   = post.href || '#';
  const target = post.external ? 'target="_blank" rel="noopener noreferrer"' : '';
  const tags   = post.tags.map(t => `<span class="card-tag">${t}</span>`).join('');
  const source = post.external
    ? `<span class="card-source">Medium ↗</span>`
    : `<span style="color:var(--text-3);font-family:var(--mono);font-size:0.7rem">${currentLang === 'es' ? 'próximamente' : 'coming soon'}</span>`;

  return `
    <a class="post-card" href="${href}" ${target}>
      <div class="card-tags">${tags}</div>
      <div class="card-title">${title}</div>
      <div class="card-meta">
        <span>${post.date}</span>
        ${source}
      </div>
    </a>`;
}

function rowHTML(post) {
  const title  = currentLang === 'es' ? post.titleEs : post.titleEn;
  const href   = post.href || '#';
  const target = post.external ? 'target="_blank" rel="noopener noreferrer"' : '';
  const tags   = post.tags.map(t => `<span class="row-tag">${t}</span>`).join('');
  const source = post.external
    ? `<span style="color:var(--green);font-family:var(--mono);font-size:0.7rem">Medium ↗</span>`
    : `<span style="color:var(--text-3);font-family:var(--mono);font-size:0.7rem">${currentLang === 'es' ? 'próximamente' : 'coming soon'}</span>`;

  return `
    <a class="post-row" href="${href}" ${target}>
      <div class="row-body">
        <div class="row-tags">${tags}</div>
        <div class="row-title">${title}</div>
        <div class="row-meta">
          <span>${post.date}</span>
          ${source}
        </div>
      </div>
      <span class="row-arrow">→</span>
    </a>`;
}

/* ── Filter chips (blog page) ──────────────────────────────── */
function filterPosts(filter, chipEl) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');
  renderPosts(filter);
}

/* ── Newsletter ────────────────────────────────────────────── */
function handleSubscribe(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value.trim();
  window.open(
    `https://felipepabon.substack.com/subscribe?email=${encodeURIComponent(email)}`,
    '_blank',
    'noopener,noreferrer'
  );
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applyLang(currentLang);
});
