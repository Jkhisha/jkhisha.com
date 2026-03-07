'use strict';

/* ─────────────────────────────────────────────
   THUMBNAIL MAP — project id → image path
───────────────────────────────────────────── */
const THUMBNAILS = {
  'PROJ-001': 'assets/projects/p1a.webp',
  'PROJ-002': 'assets/projects/p2a.webp',
  'PROJ-004': 'assets/projects/p4a.webp',
  'PROJ-005': 'assets/projects/p5a.webp',
  'PROJ-006': 'assets/projects/p6a.webp',
  'PROJ-007': 'assets/projects/p7a.webp',
  'PROJ-008': 'assets/projects/p8d.webp',
  'PROJ-009': 'assets/projects/p9a.webp',
  'PROJ-012': 'assets/images/p-3a.webp',
  'PROJ-013': null,
  'PROJ-014': 'assets/images/IMG_2805.webp',
  'PROJ-015': null,
  'PROJ-016': 'assets/images/Capture.webp',
  'PROJ-017': 'assets/images/20210617_194443.webp',
  'PROJ-018': 'assets/images/300-1.jpg',
  'PROJ-019': 'assets/images/IMG-20210927-WA0008.webp',
  'PROJ-020': 'assets/images/20190728_195826.webp',
  'PROJ-021': null,
  'PROJ-022': 'assets/images/20211206_154345.webp',
  'PROJ-023': null,
  'PROJ-024': null,
  'PROJ-025': null,
  'PROJ-026': 'assets/images/359788242_757146999546563_4467439161242641150_n.webp',
  'PROJ-027': null,
  'PROJ-028': null,
  'PROJ-029': 'assets/images/20210101_091443.webp',
  'PROJ-030': 'assets/images/_DSC0995.webp',
  'PROJ-031': 'assets/images/IMG_0648.webp',
  'PROJ-032': 'assets/images/IMG_0668.webp',
  'PROJ-033': 'assets/certificates/c1.webp',
};

/* ─────────────────────────────────────────────
   SKILLS DATA
───────────────────────────────────────────── */
const SKILLS = {
  'PLC / DCS / SCADA': [
    'Honeywell ControlEdge', 'Honeywell Experion PKS', 'ABB System 800xA',
    'Allen Bradley / Rockwell', 'Siemens S7-300/1200/1500', 'TIA Portal',
    'ABB Totalflow XFC/XRC', 'ABB NGC8206 Gas Chromatograph',
  ],
  'AI / Robotics': [
    'ROS1 & ROS2', 'MoveIt!', 'Gazebo', 'PyTorch', 'TensorFlow',
    'OpenCV', 'MediaPipe', 'YOLOv8x-WorldV2', 'Stable Baselines3 (PPO)',
    'OpenAI Whisper', 'Intel RealSense SDK',
  ],
  'Programming': [
    'Python', 'JavaScript', 'C++', 'C', 'C#', 'Java', 'MATLAB', 'SQL', 'PHP',
  ],
  'Web / Backend': [
    'Node.js', 'React', 'FastAPI', 'MongoDB', 'PostgreSQL', 'MySQL', 'Express.js',
  ],
  'Hardware / Protocols': [
    'Arduino', 'Raspberry Pi', 'PIC Microcontrollers', 'RealMan RM75 (7-DOF)',
    'HART', 'Modbus RTU/TCP', 'PROFIBUS DP', 'PROFINET', 'Proteus & PCB Design',
  ],
  'Design / Tools': [
    'Fusion 360', 'SolidWorks', 'Blender', 'Unity3D', 'AutoCAD',
    'Android Studio', 'Photoshop', 'Illustrator',
  ],
};

/* ─────────────────────────────────────────────
   CERTIFICATES DATA
───────────────────────────────────────────── */
const CERTS = [
  { path: 'assets/certificates/c1.webp',  caption: 'Robo Fight 2015' },
  { path: 'assets/certificates/c2.webp',  caption: 'ICCIT Project Showcase' },
  { path: 'assets/certificates/c3.webp',  caption: 'MATLAB Workshop' },
  { path: 'assets/certificates/c4.webp',  caption: 'Robotour & Programming Contest' },
  { path: 'assets/certificates/c5.webp',  caption: 'BUET Planetrix' },
  { path: 'assets/certificates/c6.webp',  caption: 'ICCIT 2015' },
  { path: 'assets/certificates/c7.webp',  caption: 'Linux Workshop' },
  { path: 'assets/certificates/c8.webp',  caption: 'Mechatronics Workshop (SSET)' },
  { path: 'assets/certificates/c9.webp',  caption: 'Electronic App Design Workshop' },
  { path: 'assets/certificates/c10.webp', caption: 'Power Energy Hackathon' },
];

/* ─────────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────────── */
const lightbox   = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-caption');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCap.textContent = caption || '';
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}
document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ─────────────────────────────────────────────
   NAVBAR — scroll behaviour + mobile menu
───────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.nav-hamburger');

  // Solid on scroll
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });
  // Close when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─────────────────────────────────────────────
   NAV LINK HIGHLIGHT — active on scroll
───────────────────────────────────────────── */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ─────────────────────────────────────────────
   FADE-IN SECTIONS
───────────────────────────────────────────── */
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────
   SKILLS RENDER
───────────────────────────────────────────── */
function renderSkills() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  grid.innerHTML = Object.entries(SKILLS).map(([category, items]) => `
    <div class="skill-group">
      <div class="skill-group-title">${category}</div>
      <div class="skill-tags">
        ${items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────────
   CERTS GALLERY RENDER
───────────────────────────────────────────── */
function renderCerts() {
  const gallery = document.getElementById('certs-gallery');
  if (!gallery) return;

  gallery.innerHTML = CERTS.map(cert => `
    <div class="cert-thumb" role="button" tabindex="0"
         onclick="openLightbox('${cert.path}', '${cert.caption}')"
         onkeydown="if(event.key==='Enter')openLightbox('${cert.path}','${cert.caption}')">
      <img src="${cert.path}" alt="${cert.caption}" loading="lazy">
      <div class="cert-thumb-overlay">
        <i class="fa-solid fa-expand"></i>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────────
   PROJECTS — render + filter
───────────────────────────────────────────── */
function getPeriodYear(period) {
  if (!period) return '';
  const match = period.match(/(\d{4})/g);
  if (!match) return '';
  return match[match.length - 1]; // last year found
}

function buildProjectLinks(proj) {
  const links = [];
  const l = proj.links || {};

  if (l.demo)              links.push({ href: l.demo,           icon: 'fa-brands fa-youtube', label: 'Demo' });
  if (l.youtube)           links.push({ href: l.youtube,        icon: 'fa-brands fa-youtube', label: 'Video' });
  if (l.youtube_demo1)     links.push({ href: l.youtube_demo1,  icon: 'fa-brands fa-youtube', label: 'Demo 1' });
  if (l.youtube_demo2)     links.push({ href: l.youtube_demo2,  icon: 'fa-brands fa-youtube', label: 'Demo 2' });
  if (l.perception)        links.push({ href: l.perception,     icon: 'fa-brands fa-youtube', label: 'Pipeline' });
  if (l.rl_manipulation)   links.push({ href: l.rl_manipulation,icon: 'fa-brands fa-youtube', label: 'RL Demo' });
  if (l.university_feature)links.push({ href: l.university_feature, icon: 'fa-brands fa-youtube', label: 'Feature' });
  if (l.jamuna_tv)         links.push({ href: l.jamuna_tv,      icon: 'fa-solid fa-tv',       label: 'TV' });
  if (l.australia_awards)  links.push({ href: l.australia_awards, icon: 'fa-solid fa-globe', label: 'Story' });
  if (l.playstore)         links.push({ href: l.playstore,      icon: 'fa-brands fa-google-play', label: 'Play Store' });
  if (l.news)              links.push({ href: l.news,           icon: 'fa-solid fa-newspaper', label: 'News' });
  if (l.silentium)         links.push({ href: l.silentium,      icon: 'fa-solid fa-globe',    label: 'About' });
  if (l.organiser)         links.push({ href: l.organiser,      icon: 'fa-solid fa-globe',    label: 'Organiser' });

  return links.slice(0, 3).map(lk => `
    <a href="${lk.href}" target="_blank" rel="noopener" class="project-link">
      <i class="${lk.icon}"></i>${lk.label}
    </a>
  `).join('');
}

function buildProjectCard(proj) {
  const thumb  = THUMBNAILS[proj.id];
  const year   = getPeriodYear(proj.period);
  const tags   = (proj.tags || []).slice(0, 5);
  const linksHTML = buildProjectLinks(proj);

  const thumbHTML = thumb
    ? `<div class="project-thumb">
        <img src="${thumb}" alt="${proj.title}" loading="lazy">
       </div>`
    : `<div class="project-thumb no-thumb">
        <div class="no-thumb-inner">
          <div class="no-thumb-label">${proj.tags && proj.tags[0] ? proj.tags[0] : 'Project'}</div>
          <div class="no-thumb-title">${proj.title}</div>
        </div>
       </div>`;

  const tagsHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
  const descShort = proj.description
    ? (proj.description.length > 200 ? proj.description.substring(0, 200) + '…' : proj.description)
    : '';

  return `
    <div class="project-card" data-tags='${JSON.stringify(proj.tags || [])}'>
      ${thumbHTML}
      <div class="project-info">
        ${year ? `<div class="project-year">${year}</div>` : ''}
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${descShort}</p>
        <div class="project-tags">${tagsHTML}</div>
        ${linksHTML ? `<div class="project-links">${linksHTML}</div>` : ''}
      </div>
    </div>
  `;
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  if (!projects || projects.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-light);padding:40px 0;">No projects to display.</p>';
    return;
  }

  grid.innerHTML = projects.map(buildProjectCard).join('');
}

function filterProjects(filter, allProjects) {
  if (filter === 'all') return allProjects;
  return allProjects.filter(p => (p.tags || []).includes(filter));
}

function initFilters(allProjects) {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      renderProjects(filterProjects(filter, allProjects));
    });
  });
}

/* ─────────────────────────────────────────────
   MAIN INIT
───────────────────────────────────────────── */
async function init() {
  initNavbar();
  initNavHighlight();
  initFadeIn();
  renderSkills();
  renderCerts();

  // Load projects from JSON
  try {
    const res = await fetch('cv_data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    renderProjects(projects);
    initFilters(projects);
  } catch (err) {
    const grid = document.getElementById('projects-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="projects-loading" style="color:var(--text-light)">
          <p>Projects unavailable offline — open via a local server or visit <a href="https://jkhisha.com" style="color:var(--accent)">jkhisha.com</a></p>
          <small>Run: <code>python -m http.server 8000</code> then open localhost:8000</small>
        </div>`;
    }
    console.warn('Could not load projects.json:', err.message);
  }
}

document.addEventListener('DOMContentLoaded', init);
