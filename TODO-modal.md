# Project Modal — Implementation Instructions for Next Chat

## STATUS: NOT STARTED — Ready to implement

---

## APPROACH (fully researched, do NOT re-read JSON files)

### Data flow
1. `init()` fetches BOTH `cv_data/projects.json` AND `cv_data/assets.json` in parallel
2. Build lookup map from assets: `assetsByProject[projId] = [ {type, path, caption}, ... ]`
   - Filter: only assets where `asset.project_fids.includes(proj.id)` AND `asset.project_fids.length > 0`
   - Asset `type` is either `"image"` or `"video"` (string from JSON)
3. Each project card gets `onclick` → `openProjectModal(proj, assetsByProject[proj.id])`
4. YouTube gallery items come from `proj.links` object (separate from assets.json)

### Gallery item structure
```js
// From assets.json:
{ type: 'image', src: asset.path, caption: asset.caption }
{ type: 'video', src: asset.path, caption: asset.caption }
// From proj.links (YouTube):
{ type: 'youtube', src: toYouTubeEmbed(url), caption: label }
```

### YouTube embed helper
```js
function toYouTubeEmbed(url) {
  const match = url.match(/(?:youtu\.be\/|[?&]v=|shorts\/)([^?&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
}
```

### YouTube links to include from proj.links
Keys: demo, youtube, youtube_demo1, youtube_demo2, perception, rl_manipulation,
      university_feature, jamuna_tv
Labels match buildProjectLinks() in script.js

---

## FILES TO EDIT

### 1. script.js

#### A. Change `init()` to fetch both JSONs
```js
async function init() {
  initNavbar(); initNavHighlight(); initFadeIn();
  renderSkills(); renderCerts();
  try {
    const [projRes, astRes] = await Promise.all([
      fetch('cv_data/projects.json'),
      fetch('cv_data/assets.json')
    ]);
    const projects = await projRes.json();
    const assets   = await astRes.json();

    // Build lookup
    const assetsByProject = {};
    assets.forEach(a => {
      if (!a.project_fids || a.project_fids.length === 0) return;
      a.project_fids.forEach(pid => {
        if (!assetsByProject[pid]) assetsByProject[pid] = [];
        assetsByProject[pid].push(a);
      });
    });

    renderProjects(projects, assetsByProject);
    initFilters(projects, assetsByProject);
  } catch(err) { /* existing error block */ }
}
```

#### B. Pass assetsByProject to renderProjects + initFilters
- `renderProjects(projects, assetsByProject)` — pass through to `buildProjectCard`
- `buildProjectCard(proj, assetsByProject)` — add `onclick` to card div:
  ```js
  // Change card div opening tag to:
  `<div class="project-card" data-tags='...'
        onclick="openProjectModal(${JSON.stringify(proj).replace(/'/g,"&#39;")}, event)"
        style="cursor:pointer">`
  ```
  Actually safer: use a global store
  ```js
  // At top of script.js, add:
  const PROJECT_STORE = {}; // id -> {proj, assets}
  // In renderProjects, before building HTML:
  projects.forEach(p => PROJECT_STORE[p.id] = { proj: p, assets: assetsByProject[p.id] || [] });
  // Card onclick:
  onclick="openProjectModal('${proj.id}')"
  ```

#### C. Add modal functions (after closeLightbox section)
```js
/* ── PROJECT MODAL ── */
function toYouTubeEmbed(url) {
  const match = url.match(/(?:youtu\.be\/|[?&]v=|shorts\/)([^?&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
}

function buildModalGallery(proj, assets) {
  const items = [];
  // 1. Assets from assets.json
  (assets || []).forEach(a => {
    items.push({ type: a.type, src: a.path, caption: a.caption || '' });
  });
  // 2. YouTube from proj.links
  const l = proj.links || {};
  const ytMap = {
    demo: 'Demo', youtube: 'Video', youtube_demo1: 'Demo 1',
    youtube_demo2: 'Demo 2', perception: 'Pipeline', rl_manipulation: 'RL Demo',
    university_feature: 'Feature', jamuna_tv: 'TV Feature'
  };
  Object.entries(ytMap).forEach(([key, label]) => {
    if (l[key]) {
      const embed = toYouTubeEmbed(l[key]);
      if (embed) items.push({ type: 'youtube', src: embed, caption: label });
    }
  });
  return items;
}

let _modalGallery = [];
let _activeIdx = 0;

function openProjectModal(projId) {
  const { proj, assets } = PROJECT_STORE[projId] || {};
  if (!proj) return;

  _modalGallery = buildModalGallery(proj, assets);
  _activeIdx = 0;

  // Populate LEFT panel
  document.querySelector('.pm-meta').textContent =
    [proj.employer, proj.period].filter(Boolean).join(' · ');
  document.querySelector('.pm-title').textContent = proj.title;
  document.querySelector('.pm-role').textContent = proj.my_role || '';
  document.querySelector('.pm-status').textContent = proj.status || '';
  document.querySelector('.pm-desc').textContent = proj.description || '';

  // Tags
  const tags = (proj.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  document.querySelector('.pm-tags').innerHTML = tags;

  // Tech stack
  const tech = (proj.tech_stack || []).map(t => `<span class="tag">${t}</span>`).join('');
  document.querySelector('.pm-tech').innerHTML = tech ? `<div class="pm-section-label">Stack</div>${tech}` : '';

  // External links (non-YouTube)
  const l = proj.links || {};
  const extLinks = [];
  if (l.playstore) extLinks.push(`<a href="${l.playstore}" target="_blank" rel="noopener" class="pm-extlink"><i class="fa-brands fa-google-play"></i> Play Store</a>`);
  if (l.news)      extLinks.push(`<a href="${l.news}" target="_blank" rel="noopener" class="pm-extlink"><i class="fa-solid fa-newspaper"></i> News</a>`);
  if (l.silentium) extLinks.push(`<a href="${l.silentium}" target="_blank" rel="noopener" class="pm-extlink"><i class="fa-solid fa-globe"></i> About</a>`);
  if (l.organiser) extLinks.push(`<a href="${l.organiser}" target="_blank" rel="noopener" class="pm-extlink"><i class="fa-solid fa-globe"></i> Organiser</a>`);
  if (l.australia_awards) extLinks.push(`<a href="${l.australia_awards}" target="_blank" rel="noopener" class="pm-extlink"><i class="fa-solid fa-globe"></i> Feature Story</a>`);
  document.querySelector('.pm-links').innerHTML = extLinks.join('');

  // Build thumbnail strip
  renderModalThumbs();
  // Show first item
  setModalViewer(0);

  // Show modal
  const modal = document.getElementById('proj-modal');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function renderModalThumbs() {
  const strip = document.querySelector('.pm-thumbs');
  if (!_modalGallery.length) { strip.innerHTML = ''; return; }

  strip.innerHTML = _modalGallery.map((item, i) => {
    if (item.type === 'youtube') {
      return `<div class="pm-thumb pm-thumb-yt ${i===0?'active':''}" onclick="setModalViewer(${i})">
        <i class="fa-brands fa-youtube"></i>
        <span>${item.caption}</span>
      </div>`;
    }
    if (item.type === 'video') {
      return `<div class="pm-thumb pm-thumb-vid ${i===0?'active':''}" onclick="setModalViewer(${i})">
        <i class="fa-solid fa-play"></i>
        <span>${item.caption || 'Video'}</span>
      </div>`;
    }
    // image
    return `<img class="pm-thumb ${i===0?'active':''}" src="${item.src}"
               alt="${item.caption}" loading="lazy" onclick="setModalViewer(${i})">`;
  }).join('');
}

function setModalViewer(idx) {
  _activeIdx = idx;
  const item = _modalGallery[idx];
  const viewer = document.querySelector('.pm-viewer');

  // Update active thumb
  document.querySelectorAll('.pm-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });

  if (!item) { viewer.innerHTML = ''; return; }

  if (item.type === 'image') {
    viewer.innerHTML = `<img src="${item.src}" alt="${item.caption}">`;
  } else if (item.type === 'video') {
    viewer.innerHTML = `<video controls>
      <source src="${item.src}" type="video/mp4">
    </video>`;
  } else if (item.type === 'youtube') {
    viewer.innerHTML = `<iframe src="${item.src}" allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
    </iframe>`;
  }
}

function closeProjectModal() {
  const modal = document.getElementById('proj-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Stop video/iframe on close
  const viewer = document.querySelector('.pm-viewer');
  if (viewer) viewer.innerHTML = '';
}
```

#### D. Wire Escape key (add to existing keydown listener)
```js
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeLightbox(); closeProjectModal(); }
});
```

---

### 2. index.html — Add modal HTML before `</body>`
```html
<!-- PROJECT MODAL -->
<div id="proj-modal" class="proj-modal" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="pm-backdrop" onclick="closeProjectModal()"></div>
  <div class="pm-panel">
    <button class="pm-close" onclick="closeProjectModal()" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="pm-inner">
      <div class="pm-left">
        <div class="pm-meta"></div>
        <h2 class="pm-title"></h2>
        <div class="pm-role"></div>
        <div class="pm-status"></div>
        <p class="pm-desc"></p>
        <div class="pm-tech"></div>
        <div class="pm-tags"></div>
        <div class="pm-links"></div>
      </div>
      <div class="pm-right">
        <div class="pm-thumbs"></div>
        <div class="pm-viewer"></div>
      </div>
    </div>
  </div>
</div>
```

---

### 3. style.css — Add modal styles (before media queries section)
```css
/* ── Project Modal ── */
.proj-modal {
  position: fixed; inset: 0; z-index: 1100;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
}
.proj-modal.active { opacity: 1; pointer-events: all; }
.pm-backdrop {
  position: absolute; inset: 0; background: rgba(0,0,0,0.75);
}
.pm-panel {
  position: relative; z-index: 1; background: #fff;
  width: 92vw; max-width: 1140px; height: 86vh;
  display: flex; flex-direction: column; overflow: hidden;
}
.pm-close {
  position: absolute; top: 16px; right: 16px; z-index: 2;
  background: none; border: none; cursor: pointer;
  font-size: 20px; color: var(--text-secondary);
  filter: none !important; transition: color 0.2s;
}
.pm-close:hover { color: var(--text); }
.pm-close i { filter: none !important; }
.pm-inner {
  display: flex; height: 100%; overflow: hidden;
}
/* LEFT */
.pm-left {
  flex: 0 0 36%; padding: 48px 36px; overflow-y: auto;
  border-right: 1px solid var(--border);
}
.pm-meta {
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-light); margin-bottom: 12px;
}
.pm-title {
  font-family: 'Raleway', sans-serif; font-weight: 100;
  font-size: 28px; line-height: 1.1; margin-bottom: 10px; color: var(--text);
}
.pm-role {
  font-size: 13px; color: var(--accent); margin-bottom: 6px; font-weight: 500;
}
.pm-status {
  font-size: 12px; color: var(--text-light); margin-bottom: 20px;
}
.pm-desc {
  font-size: 14px; line-height: 1.7; color: var(--text-secondary);
  margin-bottom: 20px;
}
.pm-section-label {
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-light); margin-bottom: 8px; margin-top: 16px;
}
.pm-tech { margin-bottom: 16px; }
.pm-tech .tag, .pm-tags .tag { margin: 2px; }
.pm-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.pm-extlink {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; padding: 6px 12px; border: 1px solid var(--border);
  color: var(--text-secondary); transition: all 0.2s; filter: none !important;
}
.pm-extlink:hover { border-color: var(--accent); color: var(--accent); }
.pm-extlink i { filter: none !important; font-size: 11px; }
/* RIGHT */
.pm-right {
  flex: 1; display: flex; flex-direction: column; padding: 20px;
  gap: 12px; overflow: hidden; background: var(--surface);
}
/* Thumb strip */
.pm-thumbs {
  display: flex; gap: 8px; overflow-x: auto; flex-shrink: 0;
  padding-bottom: 4px;
}
.pm-thumbs::-webkit-scrollbar { height: 3px; }
.pm-thumbs::-webkit-scrollbar-track { background: var(--border); }
.pm-thumbs::-webkit-scrollbar-thumb { background: var(--accent); }
img.pm-thumb {
  width: 88px; height: 60px; object-fit: cover; flex-shrink: 0;
  cursor: pointer; filter: grayscale(1); border: 2px solid transparent;
  transition: border-color 0.2s, opacity 0.2s; opacity: 0.6;
}
img.pm-thumb:hover { opacity: 0.9; }
img.pm-thumb.active { border-color: var(--accent); opacity: 1; filter: grayscale(0.3); }
.pm-thumb-yt, .pm-thumb-vid {
  width: 88px; height: 60px; flex-shrink: 0; cursor: pointer;
  background: #111; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 4px;
  border: 2px solid transparent; transition: border-color 0.2s; opacity: 0.7;
}
.pm-thumb-yt:hover, .pm-thumb-vid:hover { opacity: 1; }
.pm-thumb-yt.active, .pm-thumb-vid.active { border-color: var(--accent); opacity: 1; }
.pm-thumb-yt i, .pm-thumb-vid i {
  color: #fff; font-size: 18px; filter: none !important;
}
.pm-thumb-yt span, .pm-thumb-vid span {
  color: rgba(255,255,255,0.7); font-size: 9px; text-align: center;
  padding: 0 4px; line-height: 1.2;
}
.pm-thumb-yt i { color: #ff4444; }
/* Main viewer */
.pm-viewer {
  flex: 1; background: #000; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.pm-viewer img {
  max-width: 100%; max-height: 100%; object-fit: contain; filter: grayscale(1);
}
.pm-viewer video {
  max-width: 100%; max-height: 100%; object-fit: contain;
}
.pm-viewer iframe {
  width: 100%; height: 100%; border: none;
}
/* Mobile */
@media (max-width: 767px) {
  .pm-panel { width: 100vw; height: 100vh; max-width: none; }
  .pm-inner { flex-direction: column; }
  .pm-left { flex: none; max-height: 45vh; border-right: none;
    border-bottom: 1px solid var(--border); padding: 24px 20px; }
  .pm-right { flex: 1; padding: 12px; }
  img.pm-thumb, .pm-thumb-yt, .pm-thumb-vid { width: 68px; height: 48px; }
}
```

---

## IMPLEMENTATION ORDER
1. Edit `script.js`:
   - Add `PROJECT_STORE = {}` at top
   - Modify `init()` to fetch both JSONs, build `assetsByProject`, store in `PROJECT_STORE`
   - Modify `renderProjects()` and `buildProjectCard()` to accept + store assetsByProject
   - Add all modal functions after lightbox section
   - Update Escape key handler
2. Edit `index.html`: add modal HTML before `</body>` (before existing lightbox div)
3. Edit `style.css`: add modal CSS before the first `@media` query

## TEST CASES
- Click DART card → should show 5+ images/video + 5 YouTube embeds in gallery
- Click KSRM card → should show 10+ images + 1 YouTube
- Click Lunasphere card → should show 1 image + 1 video (p-2.mp4)
- Click a card with no assets → modal shows text only, empty gallery area
- Mobile: modal should stack vertically and fill screen
- Escape key closes modal and stops video/iframe
