import { PLATFORMS, BLUEPRINTS, PATENTS, MANUFACTURING_STEPS, SITE_ROOT, withBase, routeHref } from './kestrel-data.js';
import { mountCadViewer } from './viewer3d.js';
import { renderOrthographicTriView, renderAtomizerVmdChart, renderLidarCalibrationChart } from './diagrams.js';

let currentLang = localStorage.getItem('kestrel_lang') || 'tr';
let activeDisposers = [];

const trEn = (obj) => {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[currentLang] || obj.tr || '';
};

const t = (tr, en) => (currentLang === 'en' ? en : tr);

function normalizeRoute(pathname) {
  let raw = pathname || '/';
  if (SITE_ROOT && raw.startsWith(SITE_ROOT)) {
    raw = raw.slice(SITE_ROOT.length) || '/';
  }
  const clean = raw.replace(/\/+$/, '') || '/';
  const valid = new Set([
    '/',
    '/platforms/s1',
    '/platforms/b2',
    '/platforms/a2',
    '/avionics',
    '/manufacturing',
    '/research',
    '/configure',
  ]);
  return valid.has(clean) ? clean : '/';
}

function navigate(route, push = true) {
  const target = normalizeRoute(route);
  const fullHref = routeHref(target);
  if (push && window.location.pathname !== fullHref) {
    window.history.pushState({}, '', fullHref);
  }
  renderApp(target);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderHeader(route) {
  const header = document.getElementById('site-header');
  header.innerHTML = `
    <div class="header-inner">
      <a href="${routeHref('/')}" class="brand-cell" data-nav="/">
        <svg class="brand-mark" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="1.5" y="1.5" width="25" height="25" stroke-opacity="0.45"/>
          <path d="M4 17 L14 7 L24 17 M14 7 L14 23 M8 20 L20 20" />
        </svg>
        <span class="brand-wordmark">Kestrel</span>
        <span class="brand-sub">AEROSPACE PRIME</span>
      </a>

      <nav class="nav-links" id="nav-links">
        <a href="${routeHref('/platforms/s1')}" class="nav-item ${route === '/platforms/s1' ? 'active' : ''}" data-nav="/platforms/s1">
          <span class="idx">01</span><span>${t('S1 Haritalama', 'S1 Survey')}</span>
        </a>
        <a href="${routeHref('/platforms/b2')}" class="nav-item ${route === '/platforms/b2' ? 'active' : ''}" data-nav="/platforms/b2">
          <span class="idx">02</span><span>${t('B2 Tarım', 'B2 Agriculture')}</span>
        </a>
        <a href="${routeHref('/platforms/a2')}" class="nav-item ${route === '/platforms/a2' ? 'active' : ''}" data-nav="/platforms/a2">
          <span class="idx">03</span><span>${t('A2 Savunma', 'A2 Defense')}</span>
        </a>
        <a href="${routeHref('/avionics')}" class="nav-item ${route === '/avionics' ? 'active' : ''}" data-nav="/avionics">
          <span class="idx">04</span><span>${t('Aviyonik & İkiz', 'Avionics & Twin')}</span>
        </a>
        <a href="${routeHref('/manufacturing')}" class="nav-item ${route === '/manufacturing' ? 'active' : ''}" data-nav="/manufacturing">
          <span class="idx">05</span><span>${t('Üretim & CAD', 'Manufacturing')}</span>
        </a>
        <a href="${routeHref('/research')}" class="nav-item ${route === '/research' ? 'active' : ''}" data-nav="/research">
          <span class="idx">06</span><span>${t('Bilim & Ar-Ge', 'Science & R&D')}</span>
        </a>
      </nav>

      <div class="header-actions">
        <button type="button" class="lang-toggle" id="lang-btn" aria-label="Switch Language">
          <span class="${currentLang === 'tr' ? 'active-lang' : ''}">TR</span>
          <span>/</span>
          <span class="${currentLang === 'en' ? 'active-lang' : ''}">EN</span>
        </button>
        <a href="${routeHref('/configure')}" class="header-cta" data-nav="/configure">
          <span>${t('FİLO YAPILANDIR', 'CONFIGURE FLEET')}</span>
          <span>-&gt;</span>
        </a>
        <button type="button" class="mobile-menu-btn" id="mobile-menu-btn">MENU</button>
      </div>
    </div>
  `;

  document.getElementById('lang-btn').addEventListener('click', () => {
    currentLang = currentLang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('kestrel_lang', currentLang);
    document.documentElement.lang = currentLang;
    renderApp(normalizeRoute(window.location.pathname));
  });

  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('mobile-open');
  });
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  footer.innerHTML = `
    <div class="rail" style="border-color: var(--hairline-dark);">
      <div class="footer-grid">
        <div class="footer-cell">
          <div class="eyebrow" style="color: var(--signal-volt);">KESTREL AEROSPACE // SOVEREIGN AUTONOMOUS SYSTEMS</div>
          <p class="prose" style="margin-top: 0.85rem; color: var(--ink-secondary-dark); font-size: 0.92rem;">
            ${t(
              '11.006 mm otoklav karbon-prepreg ortak hava aracı mimarisi üzerinde sivil jeodezi, ağır-yük otonom tarım ve düşük görünürlüklü savunma görevlerini birleştiren dikey entegre havacılık teknoloji şirketi.',
              'Vertically integrated autonomous aviation prime unifying civil geospatial mapping, heavy-lift precision agriculture, and low-observable defense C4ISR on a single 11,006 mm carbon-prepreg airframe.'
            )}
          </p>
        </div>
        <div class="footer-cell">
          <div class="eyebrow">${t('HAVA PLATFORMLARI', 'AIRCRAFT PLATFORMS')}</div>
          <ul class="footer-links">
            <li><a href="${routeHref('/platforms/s1')}" data-nav="/platforms/s1">Kestrel S1 — ${t('Aktif LiDAR & Haritalama', 'Active LiDAR & Survey')}</a></li>
            <li><a href="${routeHref('/platforms/b2')}" data-nav="/platforms/b2">Kestrel B2 — ${t('300L Tarım & AI Lazer', '300L Agro & AI Laser')}</a></li>
            <li><a href="${routeHref('/platforms/a2')}" data-nav="/platforms/a2">Kestrel A2 — ${t('Taktik SİHA & Sürü', 'Tactical UCAV & Swarm')}</a></li>
          </ul>
        </div>
        <div class="footer-cell">
          <div class="eyebrow">${t('MÜHENDİSLİK & ÜRETİM', 'ENGINEERING & PRODUCTION')}</div>
          <ul class="footer-links">
            <li><a href="${routeHref('/avionics')}" data-nav="/avionics">FC-400 ${t('Uçuş Bilgisayarı & Dijital İkiz', 'Flight Core & Digital Twin')}</a></li>
            <li><a href="${routeHref('/manufacturing')}" data-nav="/manufacturing">Q-Lock MP-60 &amp; ${t('ISO A3 Teknik Resimler', 'ISO A3 Shop Drawings')}</a></li>
            <li><a href="${routeHref('/research')}" data-nav="/research">${t('Bilimsel Doğrulama & 6× Ar-Ge Dosyası', 'Scientific Validation & 6× R&D Disclosures')}</a></li>
          </ul>
        </div>
        <div class="footer-cell">
          <div class="eyebrow">${t('OPERASYON & TEDARİK', 'OPERATIONS & PROCUREMENT')}</div>
          <ul class="footer-links">
            <li><a href="${routeHref('/configure')}" data-nav="/configure">${t('Filo Yapılandırıcı & Teklif', 'Fleet Configurator & RFQ')}</a></li>
            <li><a href="${withBase('/blueprints/fc400_blueprint.pdf')}" target="_blank">KST-FC-400-REV-C (PDF)</a></li>
            <li><a href="${withBase('/blueprints/qlock_blueprint.pdf')}" target="_blank">KST-QL-060-REV-B (PDF)</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 KESTREL AEROSPACE INDUSTRIES · ALL DIMENSIONS IN MILLIMETERS · ISO 2768-F</span>
        <span>DUAL-SOLVER VERIFIED: GAZEBO HARMONIC + NVIDIA ISAAC SIM 6.1 RTX</span>
      </div>
    </div>
  `;
}

/* ==========================================================================
   PAGE 1: CORPORATE FLAGSHIP HOME (/)
   ========================================================================== */
function renderHomePage(root) {
  const heroModes = {
    all: {
      img: withBase('/renders/hero_trinity_hangar.webp'),
      tag: 'HANGAR FORMATION // S1 + B2 + A2',
      coord: 'SPAN 11,006 MM · 4× ELECTRIC TRACTOR · Q-LOCK MODULAR ARCHITECTURE',
    },
    s1: {
      img: withBase('/renders/s1_survey_studio.webp'),
      tag: 'DIV-01 // KESTREL S1 GEOSPATIAL',
      coord: '1024×32 ACTIVE LiDAR · 327,680 PTS/S · ≤ 2.9 MM Z-CALIBRATION',
    },
    b2: {
      img: withBase('/renders/b2_agro_field_hero.webp'),
      tag: 'DIV-02 // KESTREL B2 AUTONOMOUS AG',
      coord: '300 L HOPPER · 20 M SWATH · 8× ROTARY VMD + 4× 320W AI LASER',
    },
    a2: {
      img: withBase('/renders/a2_combat_sortie_hero.webp'),
      tag: 'SORTIE // KESTREL A2 AIR-LAUNCH COMBAT',
      coord: 'ALT 4,200 M · P1 INTERCEPTOR + M1 MAM-L SEPARATION · X-BAND AESA TRACK',
    },
  };

  root.innerHTML = `
    <!-- CHAPTER 01: DARK HANGAR HERO -->
    <section class="chapter" data-theme="dark">
      <div class="rail">
        <div class="hero-grid">
          <div class="hero-copy-cell">
            <div style="display:flex; flex-direction:column; gap:1.35rem;">
              <div class="eyebrow" style="color: var(--signal-volt);">
                [ 00 // ${t('DİKEY ENTEGRE OTONOM HAVACILIK PLATFORMU', 'VERTICALLY INTEGRATED AUTONOMOUS AVIATION PRIME')} ]
              </div>
              <h1 class="h-hero">
                ${t(
                  'Tek Ortak Karbon Gövde. Üç Egemen Görev Doktrini.',
                  'One Modular Airframe. Three Sovereign Mission Domains.'
                )}
              </h1>
              <p class="prose">
                ${t(
                  'Kestrel Aerospace; 11.006 mm otoklav karbon-prepreg kanat mimarisini, kendi tasarımı FC-400 üçlü yedekli uçuş bilgisayarını ve Q-Lock MP-60 hızlı pilon kaplinini kullanarak tek bir seri üretim hattından sivil LiDAR haritalama (S1), 300 L otonom tarım (B2) ve düşük görünürlüklü sürü SİHA (A2) sistemleri çıkarır.',
                  'Kestrel Aerospace unifies a 11,006 mm autoclave carbon-prepreg airframe, proprietary FC-400 triple-redundant flight avionics, and Q-Lock MP-60 blind-mate titanium pylons to field civil LiDAR survey (S1), 300 L autonomous crop protection (B2), and low-observable C4ISR swarm platforms (A2) from one production line.'
                )}
              </p>
            </div>

            <div style="display:flex; flex-direction:column; gap:1.25rem;">
              <div class="btn-row">
                <a href="${routeHref('/configure')}" class="btn btn-volt" data-nav="/configure">${t('FİLO YAPILANDIR', 'CONFIGURE FLEET')} -&gt;</a>
                <a href="${routeHref('/manufacturing')}" class="btn btn-outline" data-nav="/manufacturing">${t('ÜRETİM & ISO TEKNİK RESİMLER', 'PRODUCTION & ISO BLUEPRINTS')}</a>
              </div>
              <div class="eyebrow-tag">
                ${t('GERÇEK GÖREVLER · DOĞRULANMIŞ FİZİK İKİZİ · ÜRETİM CAD GEOMETRİSİ', 'REAL PAYLOADS · DETERMINISTIC HIL VERIFIED · PRODUCTION CAD GEOMETRY')}
              </div>
            </div>
          </div>

          <div class="hero-media-cell">
            <div class="hero-render-wrap">
              <img id="hero-main-img" src="${heroModes.all.img}" alt="Kestrel Aerospace Fleet Formation" />
              <div class="hero-hud-overlay">
                <div class="hud-bar">
                  <span><i class="status-dot"></i><span id="hero-hud-tag">${heroModes.all.tag}</span></span>
                  <span>CYCLES OPTIX // CAD-TRUE GEOMETRY</span>
                </div>
                <div class="hud-bar">
                  <span id="hero-hud-coord">${heroModes.all.coord}</span>
                  <span>REV 2026.11</span>
                </div>
              </div>
            </div>
            <div class="hero-switcher-bar">
              <button type="button" class="hero-switch-btn active" data-hero="all">
                <strong>${t('Üçlü Filo', 'Tri-Fleet')}</strong>
                <span>S1 · B2 · A2</span>
              </button>
              <button type="button" class="hero-switch-btn" data-hero="s1">
                <strong>Kestrel S1</strong>
                <span>${t('3B LiDAR & Harita', '3D LiDAR Survey')}</span>
              </button>
              <button type="button" class="hero-switch-btn" data-hero="b2">
                <strong>Kestrel B2</strong>
                <span>${t('300L Tarım & Lazer', '300L Ag & Laser')}</span>
              </button>
              <button type="button" class="hero-switch-btn" data-hero="a2">
                <strong>Kestrel A2</strong>
                <span>${t('Hava Taarruz & Sürü', 'Combat Sortie & Swarm')}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4-CELL HARD METRIC LEDGER -->
        <div class="cells-4 fiducial-row" style="border-top: 1px solid var(--hairline);">
          <div class="metric-cell">
            <span class="metric-label">${t('ORTAK GÖVDE AÇIKLIĞI', 'COMMON WINGSPAN')}</span>
            <div class="metric-val">11,006<span class="unit">mm</span></div>
            <span class="metric-sub">${t('4× Çekici Motor · < 8 dk Rol Değişimi', '4× Tractor Propulsors · < 8 min Role Swap')}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">${t('AZAMİ TARIMSAL KAPASİTE (B2)', 'AGRO PAYLOAD & RATE (B2)')}</span>
            <div class="metric-val">300<span class="unit">L</span> / 105<span class="unit">ha/s</span></div>
            <span class="metric-sub">${t('20 m Şerit · 8× Döner Atomizer + 4× Lazer', '20 m Swath · 8× Rotary VMD + 4× Laser')}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">${t('TAKTİK SÜRÜ & TAARRUZ (A2)', 'TACTICAL SWARM & STRIKE (A2)')}</span>
            <div class="metric-val">6<span class="unit">Pilon</span> / 300<span class="unit">m</span></div>
            <span class="metric-sub">${t('X-Band AESA · 4× Önleyici + 2× MAM-L', 'X-Band AESA · 4× Interceptors + 2× MAM-L')}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">${t('JEODEZİK DOĞRULUK & HIL', 'SURVEY PRECISION & HIL')}</span>
            <div class="metric-val">&le; 2.9<span class="unit">mm</span></div>
            <span class="metric-sub">${t('32.9M LiDAR Noktası · Gazebo + Isaac RTX', '32.9M LiDAR Returns · Gazebo + Isaac RTX')}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CHAPTER 02: LIGHT ARCHIVAL BONE — COMMON AIRFRAME + LIVE 3D CAD VIEWPORT -->
    <section class="chapter" data-theme="light">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 01 // ${t('ORTAK GÖVDE MİMARİSİ & CANLI 3B CAD İNCELEME', 'COMMON AIRFRAME ARCHITECTURE & LIVE 3D CAD INSPECTION')} ]</span>
          <span class="eyebrow-tag">PN // KST-QL-060-REV-B</span>
        </div>

        <div class="split-4-8 fiducial-row">
          <div class="cell-lg" style="display:flex; flex-direction:column; justify-content:space-between; gap:2rem;">
            <div style="display:flex; flex-direction:column; gap:1.15rem;">
              <h2 class="h-chapter">
                ${t(
                  'Üç Farklı Sektör, Tek Sertifikalı Karbon Üretim Omurgası.',
                  'Three Distinct Markets. One Certified Carbon Spine.'
                )}
              </h2>
              <p class="prose">
                ${t(
                  'Geleneksel İHA üreticileri her görev için sıfırdan gövde tasarlar ve düşük adetli üretim maliyetine hapsolur. Kestrel; aerodinamik yüzeyi, 4 motorlu elektrikli itki grubunu ve FC-400 uçuş bilgisayarını %100 ortak tutar.',
                  'Legacy manufacturers design bespoke airframes per vertical, trapping them in low-volume tooling overhead. Kestrel standardizes 100% of the primary structure, quad-tractor drivetrain, and FC-400 avionics core.'
                )}
              </p>
              <p class="prose">
                ${t(
                  'Burun çerçevesi (X = +2.34 m), karın modül yuvası ve kanat altı Q-Lock MP-60 kör-eşleşmeli titanyum kaplinler sayesinde aynı gövde dakikalar içinde göreve özel sensör ve yüklerle donatılır.',
                  'Swap-ready nose bulkheads (X = +2.34 m), conformal ventral bays, and Q-Lock MP-60 titanium smart couplers adapt each airframe to survey, agronomy, or defense payloads in minutes.'
                )}
              </p>
            </div>

            <div style="border-top: 1px solid var(--hairline); padding-top: 1.25rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div>
                <div class="metric-label">${t('BİRİM BOM MALİYET DÜŞÜŞÜ', 'UNIT BOM REDUCTION')}</div>
                <div class="metric-val" style="font-size:1.85rem;">-42<span class="unit">%</span></div>
              </div>
              <div>
                <div class="metric-label">${t('ORTAK YEDEK PARÇA ORANI', 'COMMON SPARES RATIO')}</div>
                <div class="metric-val" style="font-size:1.85rem;">84<span class="unit">%</span></div>
              </div>
            </div>
          </div>

          <div class="cell" style="padding:0;">
            <div id="home-cad-viewer"></div>
          </div>
        </div>

        <div class="cell-surface" style="border-top: 1px solid var(--hairline);">
          ${renderOrthographicTriView('all', currentLang)}
        </div>
      </div>
    </section>

    <!-- CHAPTER 03: DARK HANGAR — THREE SOVEREIGN DIVISIONS -->
    <section class="chapter" data-theme="dark">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 02 // ${t('ÜÇ OPERASYONEL DİVİZYON', 'THREE OPERATIONAL DIVISIONS')} ]</span>
          <span class="eyebrow-tag">${t('SİVİL · TARIMSAL · SAVUNMA', 'GEOSPATIAL · AGRICULTURE · DEFENSE')}</span>
        </div>

        ${['s1', 'b2', 'a2'].map((key) => {
          const p = PLATFORMS[key];
          return `
            <div class="division-row fiducial-row" data-div="${key}">
              <div class="division-info">
                <div style="display:flex; flex-direction:column; gap:1rem;">
                  <span class="division-badge">${p.code}</span>
                  <h3 class="h-chapter">${trEn(p.name)} — ${trEn(p.domain)}</h3>
                  <p class="prose">${trEn(p.summary)}</p>
                </div>
                <div class="btn-row">
                  <a href="${routeHref(p.route)}" class="btn" data-nav="${p.route}">${trEn(p.name)} ${t('TEKNİK DOSYASI', 'SPECIFICATIONS')} -&gt;</a>
                  <a href="${routeHref('/configure')}" class="btn btn-outline" data-nav="/configure">${t('TEKLİF AL', 'REQUEST BRIEFING')}</a>
                </div>
              </div>
              <div class="division-visual">
                <img class="division-render" src="${p.heroImg}" alt="${trEn(p.name)}" loading="lazy" />
                <div class="mini-spec-strip">
                  ${p.miniSpecs.map((ms) => `
                    <div class="mini-spec">
                      <span class="k">${trEn(ms.k)}</span>
                      <span class="v tnum">${ms.v}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- CHAPTER 04: LIGHT ARCHIVAL PAPER — PROPRIETARY FC-400 AVIONICS & DIGITAL TWIN -->
    <section class="chapter" data-theme="light">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 03 // ${t('ÖZGÜN AVİYONİK DONANIMI & ÇİFT-ÇÖZÜCÜLÜ DİJİTAL İKİZ', 'PROPRIETARY AVIONICS HARDWARE & DUAL-SOLVER DIGITAL TWIN')} ]</span>
          <span class="eyebrow-tag">PN // KST-FC-400-REV-C</span>
        </div>

        <div class="split-5-7 fiducial-row">
          <div class="cell-lg" style="display:flex; flex-direction:column; justify-content:space-between; gap:1.75rem;">
            <div style="display:flex; flex-direction:column; gap:1rem;">
              <div class="eyebrow">KESTREL FC-400 FLIGHT &amp; AI MISSION CORE</div>
              <h2 class="h-chapter">
                ${t(
                  'Dışa Bağımlı Otopilot Yok. Tamamen Kendi Tasarımımız Aviyonik Çekirdek.',
                  'Zero Off-the-Shelf Black Boxes. In-House Flight & AI Silicon Carrier.'
                )}
              </h2>
              <p class="prose">
                ${t(
                  '10-katmanlı Isola FR408HR kart üzerinde çalışan çift lockstep STM32H753 gerçek zamanlı uçuş kontrolcüsü, sarsıntı sönümlemeli üçlü IMU kubbesi ve 100 TOPS NVIDIA Orin NX görev işlemcisi; LiDAR SLAM, AI lazer fitopatoloji ve 3B PN sürü güdümünü milisaniye altı gecikmeyle yürütür.',
                  'Built on a 10-layer Isola FR408HR substrate pairing dual lockstep STM32H753 deterministic flight MCUs, an elastomer-isolated triple-IMU Faraday dome, and a 100 TOPS NVIDIA Orin NX module for onboard LiDAR SLAM, AI laser targeting, and swarm guidance.'
                )}
              </p>
            </div>
            <div class="btn-row">
              <a href="${routeHref('/avionics')}" class="btn" data-nav="/avionics">${t('FC-400 & DİJİTAL İKİZ MİMARİSİ', 'FC-400 & DIGITAL TWIN STACK')} -&gt;</a>
              <a href="${withBase('/blueprints/fc400_blueprint.pdf')}" target="_blank" class="btn btn-outline">${t('ISO A3 TEKNİK RESİM (PDF)', 'ISO A3 SHOP DRAWING (PDF)')}</a>
            </div>
          </div>
          <div class="cell" style="padding:0; background:#0A0C10; display:flex; align-items:center;">
            <img src="${withBase('/renders/hardware_fc400_macro.webp')}" alt="Kestrel FC-400 Flight Control PCB Macro" style="width:100%; aspect-ratio:16/9; object-fit:cover;" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- CHAPTER 05: DARK HANGAR — COMPOSITE MANUFACTURING & R&D ARCHITECTURE -->
    <section class="chapter" data-theme="dark">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 04 // ${t('OTOKLAV KOMPOZİT ÜRETİM & ÖZGÜN AR-GE DOSYALARI', 'AUTOCLAVE COMPOSITE PRODUCTION & R&D DISCLOSURES')} ]</span>
          <span class="eyebrow-tag">6× ORIGINAL R&amp;D DISCLOSURES</span>
        </div>

        <div class="split-5-7 fiducial-row">
          <div class="cell" style="padding:0; background:#080A0D; display:flex; align-items:center;">
            <img src="${withBase('/renders/manufacturing_exploded_airframe.webp')}" alt="Exploded Autoclave Carbon Airframe" style="width:100%; aspect-ratio:16/9; object-fit:contain;" loading="lazy" />
          </div>
          <div class="cell-lg" style="display:flex; flex-direction:column; justify-content:space-between; gap:1.75rem;">
            <div style="display:flex; flex-direction:column; gap:1rem;">
              <h2 class="h-chapter">
                ${t(
                  'CAD Çekirdeğinden Otoklav Kalıbına ve HIL Kabul Tezgahına Tam İzlenebilirlik.',
                  'Full Traceability from Parametric CAD Kernel to Autoclave Tooling & HIL Acceptance.'
                )}
              </h2>
              <p class="prose">
                ${t(
                  'Her Kestrel hava aracı; ISO 2768-f toleranslı 5-eksen titanyum pilon kaplinleri, ultrasonik NDT muayenesi ve teslimat öncesi 17 aşamalı otonom uçuş testiyle (Gazebo Harmonic + NVIDIA Isaac Sim 6.1) doğrulanarak hangardan çıkar.',
                  'Every serial Kestrel aircraft ships with ISO 2768-f 5-axis titanium couplers, ultrasonic spar NDT certification, and 17-stage deterministic HIL regression logs across Gazebo Harmonic and NVIDIA Isaac Sim 6.1.'
                )}
              </p>
            </div>
            <div class="cells-2" style="border:1px solid var(--hairline);">
              <div class="cell-surface">
                <div class="metric-label">KST-ENG-01 // STRUCTURES</div>
                <div style="font-weight:500; margin-top:0.3rem;">Q-Lock MP-60 ${t('Kör-Eşleşmeli Akıllı Pilon', 'Blind-Mate Smart Pylon')}</div>
              </div>
              <div class="cell-surface">
                <div class="metric-label">KST-ENG-03 // PRECISION AG</div>
                <div style="font-weight:500; margin-top:0.3rem;">${t('Dinamik-VMD + 320W Lazer Hibrit Boom', 'Dynamic-VMD + 320W Laser Boom')}</div>
              </div>
            </div>
            <div class="btn-row">
              <a href="${routeHref('/manufacturing')}" class="btn btn-volt" data-nav="/manufacturing">${t('ÜRETİM HATTI & HIL TEZGAHI', 'MANUFACTURING & HIL RIG')} -&gt;</a>
              <a href="${routeHref('/research')}" class="btn btn-outline" data-nav="/research">${t('AR-GE & BİLİMSEL VERİLER', 'R&D & SCIENTIFIC DATA')}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Bind Hero Variant Switcher
  root.querySelectorAll('[data-hero]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = heroModes[btn.dataset.hero] || heroModes.all;
      root.querySelectorAll('[data-hero]').forEach((b) => b.classList.toggle('active', b === btn));
      document.getElementById('hero-main-img').src = mode.img;
      document.getElementById('hero-hud-tag').textContent = mode.tag;
      document.getElementById('hero-hud-coord').textContent = mode.coord;
    });
  });

  // Mount Live Three.js 3D CAD Viewport
  const disposeViewer = mountCadViewer(document.getElementById('home-cad-viewer'), {
    initialModel: 'a2',
    allowedModels: ['s1', 'b2', 'a2', 'fc400', 'qlock'],
    lang: currentLang,
  });
  activeDisposers.push(disposeViewer);
}

/* ==========================================================================
   PAGES 2–4: PLATFORM DEEP-DIVES (/platforms/s1, /platforms/b2, /platforms/a2)
   ========================================================================== */
function renderPlatformPage(root, key) {
  const p = PLATFORMS[key];
  const barItems = trEn(p.commercialBar);
  const tabKeys = Object.keys(p.specTabs);
  const heroTheme = key === 'a2' ? 'dark' : 'dark';

  root.innerHTML = `
    <section class="chapter" data-theme="${heroTheme}" data-div="${key}">
      <div class="rail">
        <!-- Pyka Pelican-2 style Commercial Readiness Sub-Bar -->
        <div class="commercial-strip">
          <div class="pipes">
            ${barItems.map((item, idx) => `
              <span>${idx === 0 ? `<strong style="color:var(--signal-volt);">${item}</strong>` : item}</span>
              ${idx < barItems.length - 1 ? '<span class="pipe-sep">│</span>' : ''}
            `).join('')}
          </div>
          <a href="${routeHref('/configure')}" class="eyebrow" style="color:var(--ink-primary); text-decoration:none;" data-nav="/configure">[ ${t('FİLO TEKLİFİ AL', 'REQUEST FLEET QUOTE')} -&gt; ]</a>
        </div>

        <div class="hero-grid">
          <div class="hero-copy-cell">
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
              <span class="division-badge">${p.code}</span>
              <h1 class="h-hero">${trEn(p.name)}</h1>
              <div class="h-sub" style="color:var(--ink-secondary);">${trEn(p.domain)}</div>
              <p class="prose">${trEn(p.summary)}</p>
            </div>
            <div class="btn-row">
              <a href="${routeHref('/configure')}" class="btn btn-volt" data-nav="/configure">${trEn(p.name)} ${t('SİPARİŞ / YAPILANDIR', 'CONFIGURE ORDER')} -&gt;</a>
              <a href="${routeHref('/manufacturing')}" class="btn btn-outline" data-nav="/manufacturing">${t('ORTAK GÖVDE DETAYI', 'COMMON AIRFRAME')}</a>
            </div>
          </div>
          <div class="hero-media-cell">
            <div class="hero-render-wrap">
              <img src="${p.heroImg}" alt="${trEn(p.name)}" />
            </div>
            <div class="mini-spec-strip">
              ${p.miniSpecs.map((ms) => `
                <div class="mini-spec">
                  <span class="k">${trEn(ms.k)}</span>
                  <span class="v tnum">${ms.v}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MACRO HARDWARE + LIVE 3D MODEL CHAPTER -->
    <section class="chapter" data-theme="${key === 'a2' ? 'dark' : 'light'}" data-div="${key}">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 01 // ${t('ALT SİSTEM YAKIN ÇEKİM & 3B ETKİLEŞİMLİ CAD', 'SUBSYSTEM MACRO & INTERACTIVE 3D CAD')} ]</span>
          <span class="eyebrow-tag">MODEL // ${p.code}</span>
        </div>
        <div class="cells-2 fiducial-row">
          <div class="cell" style="padding:0; background:#090A0C; display:flex; flex-direction:column;">
            <img src="${p.detailImg}" alt="${trEn(p.name)} Subsystem Detail" style="width:100%; aspect-ratio:16/9; object-fit:cover; border-bottom:1px solid var(--hairline);" />
            <div style="padding:1.5rem;">
              <div class="eyebrow" style="color:var(--signal-volt); margin-bottom:0.4rem;">CYCLES OPTIX // MACRO HARDWARE</div>
              <p class="prose" style="color:var(--ink-secondary-dark); font-size:0.94rem;">
                ${key === 'b2'
                  ? t('Konformal 200 m katı-hal LiDAR + mmWave tel algılama radomu, dumanlı seviye göstergeli 300 L karın tankı, 316L paslanmaz çelik boom ve 2-eksen 320 W optik lazer tareti.', 'Conformal 200 m solid-state LiDAR + mmWave wire-detection nose pod, 300 L sight-glass belly hopper, 316L stainless boom, and 2-axis 320 W optical laser ball turret.')
                  : key === 'a2'
                  ? t('MIL-STD-1760 kanat altı pilonlarında taşıyıcıya kilitli 4× karbon X-kanat otonom önleyici drone (safir FPV arayıcı) ve 2× MAM-L yarı-aktif lazer güdümlü mühimmat.', 'MIL-STD-1760 underwing stations carrying 4× carbon X-wing autonomous interceptor drones (sapphire FPV seekers) and 2× MAM-L semi-active laser-guided munitions.')
                  : t('Otoklav 3K karbon-prepreg ortak kanat kutu-sparı, 4× çekici motor naseli ve 32-kanallı aktif haritalama LiDAR / çift RGB gimbal modülü.', 'Autoclave 3K carbon-prepreg monolithic wing spar, 4× tractor nacelles, and 32-channel active mapping LiDAR / dual RGB gimbal assembly.')}
              </p>
            </div>
          </div>
          <div class="cell" style="padding:0;">
            <div id="plat-cad-viewer"></div>
          </div>
        </div>
      </div>
    </section>

    ${key === 'b2' ? renderB2AgroCalculatorSection() : ''}
    ${key === 'a2' ? renderA2LoadoutMatrixSection(p) : ''}
    ${key === 's1' ? renderS1GsdMatrixSection() : ''}

    <!-- TABBED ENGINEERING SPECIFICATION SHEET -->
    <section class="chapter" data-theme="light">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 03 // ${t('DOĞRULANMIŞ TEKNİK ŞARTNAME MATRİSİ', 'VERIFIED TECHNICAL SPECIFICATION MATRIX')} ]</span>
          <span class="eyebrow-tag">ISO / STANAG / EPA AgDRIFT</span>
        </div>
        <div class="spec-tabs" id="spec-tabs">
          ${tabKeys.map((tk, idx) => `
            <button type="button" class="spec-tab-btn ${idx === 0 ? 'active' : ''}" data-spectab="${tk}">
              0${idx + 1} // ${trEn(p.specTabs[tk].title)}
            </button>
          `).join('')}
        </div>
        <div class="cell" style="padding:0;" id="spec-table-mount"></div>
      </div>
    </section>
  `;

  const renderSpecTab = (tk) => {
    const tab = p.specTabs[tk];
    document.getElementById('spec-table-mount').innerHTML = `
      <table class="spec-table">
        <tbody>
          ${tab.rows.map(([label, val]) => `
            <tr>
              <th>${trEn(label)}</th>
              <td class="val tnum">${trEn(val)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };
  renderSpecTab(tabKeys[0]);

  root.querySelectorAll('[data-spectab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('[data-spectab]').forEach((b) => b.classList.toggle('active', b === btn));
      renderSpecTab(btn.dataset.spectab);
    });
  });

  if (key === 'b2') bindB2Calculator(root);

  const disposeViewer = mountCadViewer(document.getElementById('plat-cad-viewer'), {
    initialModel: p.glbKey,
    allowedModels: [p.glbKey, 'fc400', 'qlock'],
    lang: currentLang,
  });
  activeDisposers.push(disposeViewer);
}

function renderB2AgroCalculatorSection() {
  return `
    <section class="chapter" data-theme="dark" data-div="b2">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 02 // ${t('OTONOM TARIM EKONOMİSİ & SAHA VERİMLİLİK HESAPLAYICISI', 'AUTONOMOUS FARM ECONOMICS & WORK-RATE CALCULATOR')} ]</span>
          <span class="eyebrow-tag">PYKA-CLASS 300L · NIGHT + AI LASER</span>
        </div>
        <div class="split-5-7 fiducial-row">
          <div class="cell-lg">
            <h3 class="h-sub" style="margin-bottom:1.25rem;">${t('Saha Parametrelerini Girin', 'Configure Farm Parameters')}</h3>
            <div class="calc-control">
              <label><span>${t('TOPLAM TARLA ALANI', 'TOTAL FARM AREA')}</span><strong id="b2-area-lbl">1,200 ha</strong></label>
              <input type="range" id="b2-area" min="200" max="5000" step="100" value="1200" />
            </div>
            <div class="calc-control">
              <label><span>${t('UYGULAMA DOZU (L/HA)', 'APPLICATION RATE (L/HA)')}</span><strong id="b2-dose-lbl">12 L/ha</strong></label>
              <input type="range" id="b2-dose" min="8" max="30" step="2" value="12" />
            </div>
            <label class="option-check">
              <input type="checkbox" id="b2-night" checked />
              <span><strong>${t('Gece İlaçlama Vardiyası Aktif', 'Enable Nocturnal Spray Window')}</strong> — ${t('160 m LED + ΔT=3.2°C düşük rüzgar penceresi ile günlük operasyon süresini 2 katına çıkarır.', 'Doubles daily productive spray hours in low-wind inversion conditions.')}</span>
            </label>
            <label class="option-check">
              <input type="checkbox" id="b2-laser" checked />
              <span><strong>${t('4× 320W AI Lazer Nokta Ablasyon', '4× 320W AI Laser Spot Ablation')}</strong> — ${t('Herbisit/fungisit sarfiyatını optik meristem imhasıyla %38 azaltır.', 'Cuts chemical volume by 38% via real-time optical weed/pathogen ablation.')}</span>
            </label>
          </div>
          <div class="cells-2">
            <div class="metric-cell">
              <span class="metric-label">${t('ETKİN SAHA KAPASİTESİ', 'EFFECTIVE WORK RATE')}</span>
              <div class="metric-val" id="b2-out-rate">98<span class="unit">ha/sa</span></div>
              <span class="metric-sub">${t('20 m şerit + < 5 dk Hot-Swap dahil', 'Includes 20 m swath + < 5 min hot-swap')}</span>
            </div>
            <div class="metric-cell">
              <span class="metric-label">${t('OPERASYON TAMAMLAMA SÜRESİ', 'TOTAL MISSION HOURS')}</span>
              <div class="metric-val" id="b2-out-hours">12.2<span class="unit">saat</span></div>
              <span class="metric-sub" id="b2-out-days">1.1 vardiya günü</span>
            </div>
            <div class="metric-cell">
              <span class="metric-label">${t('KİMYASAL TASARRUFU (AI LAZER)', 'CHEMICAL SAVED (AI LASER)')}</span>
              <div class="metric-val" id="b2-out-chem" style="color:var(--signal-volt);">5,472<span class="unit">L</span></div>
              <span class="metric-sub">${t('Sezonluk herbisit/fungisit azalımı', 'Per-application volume reduction')}</span>
            </div>
            <div class="metric-cell">
              <span class="metric-label">${t('DOĞRUDAN ENERJİ MALİYETİ', 'DIRECT ENERGY COST')}</span>
              <div class="metric-val" id="b2-out-cost">$1,380</div>
              <span class="metric-sub">${t('Türbinli uçaklara kıyasla %84 tasarruf', '84% lower than turbine crop-dusters')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function bindB2Calculator(root) {
  const areaEl = root.querySelector('#b2-area');
  const doseEl = root.querySelector('#b2-dose');
  const nightEl = root.querySelector('#b2-night');
  const laserEl = root.querySelector('#b2-laser');
  const update = () => {
    const area = Number(areaEl.value);
    const dose = Number(doseEl.value);
    const night = nightEl.checked;
    const laser = laserEl.checked;
    root.querySelector('#b2-area-lbl').textContent = `${area.toLocaleString('en-US')} ha`;
    root.querySelector('#b2-dose-lbl').textContent = `${dose} L/ha`;

    const rate = Math.round(105 - (dose - 10) * 1.65);
    const hours = area / Math.max(45, rate);
    const dailyWindow = night ? 14 : 7;
    const days = hours / dailyWindow;
    const chemSaved = laser ? Math.round(area * dose * 0.38) : 0;
    const energyCost = Math.round(area * 1.15);

    root.querySelector('#b2-out-rate').innerHTML = `${rate}<span class="unit">${t('ha/sa', 'ha/hr')}</span>`;
    root.querySelector('#b2-out-hours').innerHTML = `${hours.toFixed(1)}<span class="unit">${t('saat', 'hrs')}</span>`;
    root.querySelector('#b2-out-days').textContent = `${days.toFixed(1)} ${t(night ? 'gün (Gece+Gündüz)' : 'gün (Yalnız Gündüz)', night ? 'days (Day+Night)' : 'days (Day Only)')}`;
    root.querySelector('#b2-out-chem').innerHTML = `${chemSaved.toLocaleString('en-US')}<span class="unit">L</span>`;
    root.querySelector('#b2-out-cost').textContent = `$${energyCost.toLocaleString('en-US')}`;
  };
  [areaEl, doseEl, nightEl, laserEl].forEach((el) => el.addEventListener('input', update));
  update();
}

function renderA2LoadoutMatrixSection(p) {
  const stations = [
    ['M2 · Y +4.35 m', 'MAM-L #2 (SALH)', '22.0 kg · STANAG 1688 · 95 m/s · 22.4 G'],
    ['P4 · Y +2.55 m', t('Önleyici İHA #4', 'Interceptor UAV #4'), t('0.85 kg · 3B PN (N=4.6) · 52 m/s · Safir Arayıcı', '0.85 kg · 3D PN (N=4.6) · 52 m/s · Sapphire Seeker')],
    ['P3 · Y +1.22 m', t('Önleyici İHA #3', 'Interceptor UAV #3'), t('0.85 kg · 3B PN (N=4.6) · Eskort / Salvo', '0.85 kg · 3D PN (N=4.6) · Escort / Salvo')],
    [t('GÖVDE MERKEZ', 'CENTERLINE'), 'AESA + EH + EO/IR', '300 m X-Band · DRFM · 30 Chaff / 30 Flare'],
    ['P2 · Y -1.22 m', t('Önleyici İHA #2', 'Interceptor UAV #2'), t('0.85 kg · 3B PN (N=4.6) · Eskort / Salvo', '0.85 kg · 3D PN (N=4.6) · Escort / Salvo')],
    ['P1 · Y -2.55 m', t('Önleyici İHA #1', 'Interceptor UAV #1'), t('0.85 kg · 3B PN (N=4.6) · 52 m/s · Safir Arayıcı', '0.85 kg · 3D PN (N=4.6) · 52 m/s · Sapphire Seeker')],
    ['M1 · Y -4.35 m', 'MAM-L #1 (SALH)', '22.0 kg · STANAG 1688 · 95 m/s · SEAD Anti-Radar'],
  ];
  return `
    <section class="chapter" data-theme="dark" data-div="a2">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 02 // ${t('TAKTİK HANGAR HAZIRLIK & 6-İSTASYONLU SİLAH/SÜRÜ YÖNETİMİ (SMS)', 'TACTICAL HANGAR READINESS & 6-STATION WEAPONS/SWARM SMS')} ]</span>
          <span class="eyebrow-tag">MIL-STD-1760 // MASTER ARM &ge; 18M AGL</span>
        </div>
        <div class="split-5-7 fiducial-row">
          <div class="cell" style="padding:0; background:#090B0E; display:flex; flex-direction:column;">
            <img src="${p.hangarImg}" alt="${trEn(p.name)} Stealth Hangar Pre-Flight" style="width:100%; aspect-ratio:16/9; object-fit:cover; border-bottom:1px solid var(--hairline);" loading="lazy" />
            <div style="padding:1.4rem;">
              <div class="eyebrow" style="color:var(--signal-volt); margin-bottom:0.4rem;">FS 36118 RAM // HANGAR PRE-FLIGHT</div>
              <p class="prose" style="color:var(--ink-secondary-dark); font-size:0.9rem;">
                ${t(
                  'Düşük görünürlüklü RAM kaplama, konformal X-Bant AESA burun radomu, Ti-6Al-4V Pitot-AOA probu, sırt Ku-Bant BLOS SATCOM kubbesi ve karın altı DRFM + ALE-47 karşı tedbir podu.',
                  'Low-observable FS 36118 RAM finish, conformal X-Band AESA nose radome, Ti-6Al-4V Pitot-AOA boom, dorsal Ku-Band BLOS SATCOM dome, and ventral DRFM + ALE-47 dispenser pod.'
                )}
              </p>
            </div>
          </div>
          <div class="cell" style="padding:0;">
            <table class="spec-table">
              <tbody>
                ${stations.map(([st, weapon, spec]) => `
                  <tr>
                    <th style="color:var(--signal-volt);">${st}</th>
                    <td class="val">${weapon} — <span style="color:var(--ink-secondary-dark); font-weight:400;">${spec}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderS1GsdMatrixSection() {
  return `
    <section class="chapter" data-theme="dark" data-div="s1">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 02 // ${t('UÇUŞ İRTİFASI vs NOKTA YOĞUNLUĞU & ŞERİT GENİŞLİĞİ', 'ALTITUDE vs POINT DENSITY & SWATH PERFORMANCE')} ]</span>
          <span class="eyebrow-tag">327,680 PTS/S @ 10 HZ</span>
        </div>
        <div class="cells-4 fiducial-row">
          <div class="metric-cell">
            <span class="metric-label">40 M AGL (KORİDOR)</span>
            <div class="metric-val">195<span class="unit">pts/m²</span></div>
            <span class="metric-sub">${t('Şerit: 138 m · Enerji Nakil Hattı', '138 m Swath · Powerline Inspection')}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">80 M AGL (KENTSEL İKİZ)</span>
            <div class="metric-val">96<span class="unit">pts/m²</span></div>
            <span class="metric-sub">${t('Şerit: 277 m · 3B Şehir Modeli', '277 m Swath · 3D Urban Digital Twin')}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">120 M AGL (HAVZA)</span>
            <div class="metric-val">64<span class="unit">pts/m²</span></div>
            <span class="metric-sub">${t('Şerit: 415 m · Topografik DEM', '415 m Swath · Regional DEM')}</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">KALİBRASYON SAPMASI</span>
            <div class="metric-val">&le; 2.9<span class="unit">mm</span></div>
            <span class="metric-sub">${t('2/5/10/15 m Blok Doğrulaması', '2/5/10/15 m Reference Targets')}</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ==========================================================================
   PAGE 5: AVIONICS & DIGITAL TWIN (/avionics)
   ========================================================================== */
function renderAvionicsPage(root) {
  root.innerHTML = `
    <section class="chapter" data-theme="dark">
      <div class="rail">
        <div class="hero-grid">
          <div class="hero-copy-cell">
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
              <div class="eyebrow" style="color:var(--signal-volt);">[ 04 // KESTREL FC-400 &amp; DETERMINISTIC DIGITAL TWIN ]</div>
              <h1 class="h-hero">${t('Özgün Uçuş Kontrol Kartı ve Çift-Fizik Dijital İkiz.', 'Proprietary Flight Core & Dual-Solver Digital Twin.')}</h1>
              <p class="prose">
                ${t(
                  'Kestrel FC-400 uçuş bilgisayarı; görev-kritik kontrol yüzeylerini süren çift çekirdekli STM32H753 güvenlik katmanını, gerçek zamanlı LiDAR/kamera/radar füzyonu yürüten NVIDIA Orin NX yapay zeka modülüyle tek bir EMI zırhlı kartta birleştirir.',
                  'The Kestrel FC-400 flight computer integrates a dual-lockstep STM32H753 safety-critical actuation plane with an NVIDIA Orin NX edge AI compute module on one EMI-shielded 10-layer carrier.'
                )}
              </p>
            </div>
            <div class="btn-row">
              <a href="${withBase('/blueprints/fc400_blueprint.pdf')}" target="_blank" class="btn btn-volt">${t('FC-400 TEKNİK RESİM İNDİR (PDF)', 'DOWNLOAD FC-400 BLUEPRINT (PDF)')}</a>
              <a href="${routeHref('/manufacturing')}" class="btn btn-outline" data-nav="/manufacturing">${t('SMT & HIL TEST SÜRECİ', 'SMT & HIL QUALIFICATION')}</a>
            </div>
          </div>
          <div class="hero-media-cell">
            <div class="hero-render-wrap">
              <img src="${withBase('/renders/hardware_fc400_macro.webp')}" alt="Kestrel FC-400 Avionics PCB" />
            </div>
          </div>
        </div>

        <div class="cells-4 fiducial-row" style="border-top:1px solid var(--hairline);">
          <div class="metric-cell">
            <span class="metric-label">KART BOYUTU &amp; KATMAN</span>
            <div class="metric-val">148×96<span class="unit">mm</span></div>
            <span class="metric-sub">10-Katman Isola FR408HR · ENIG Altın</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">YAPAY ZEKA HESAPLAMA</span>
            <div class="metric-val">100<span class="unit">TOPS</span></div>
            <span class="metric-sub">NVIDIA Orin NX 16GB · CNC Soğutucu</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">ATALETSEL YEDEKLİLİK</span>
            <div class="metric-val">3×<span class="unit">IMU</span></div>
            <span class="metric-sub">Elastomer Yalıtımlı Faraday Kubbesi</span>
          </div>
          <div class="metric-cell">
            <span class="metric-label">HIL DOĞRULAMA</span>
            <div class="metric-val">240<span class="unit">Hz</span></div>
            <span class="metric-sub">Gazebo Harmonic + Isaac Sim 6.1 RTX</span>
          </div>
        </div>
      </div>
    </section>

    <section class="chapter" data-theme="light">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 01 // ${t('ETKİLEŞİMLİ 3B FC-400 KART İNCELEMESİ & YAZILIM YIĞINI', 'INTERACTIVE 3D FC-400 INSPECTION & AUTONOMY STACK')} ]</span>
          <span class="eyebrow-tag">PX4 + C++20 TRANSPORT + ISAAC RTX</span>
        </div>
        <div class="split-5-7 fiducial-row">
          <div class="cell-lg" style="display:flex; flex-direction:column; gap:1.25rem;">
            <h2 class="h-chapter">${t('Kodu Uçuş Öncesi İki Bağımsız Fizik Motorunda Kanıtlıyoruz.', 'Every Line of Flight Code Proved Across Two Independent Physics Solvers.')}</h2>
            <p class="prose">
              ${t(
                'Saha uçuşundan önce her otopilot sürümü; hem açık kaynaklı Gazebo Harmonic (DART/Ogre2) ortamında 8/8 askeri SİHA ve 9/9 tarım senaryosundan, hem de NVIDIA Isaac Sim 6.1 (PhysX 240 Hz + RTX ışın izlemeli kamera/LiDAR) kalibrasyon testlerinden sıfır hatayla geçmek zorundadır.',
                'Prior to flight release, every firmware build must pass automated 8-stage defense UCAV and 9-stage precision-ag closed-loop regressions in Gazebo Harmonic plus RTX raytraced sensor parity checks in NVIDIA Isaac Sim 6.1.'
              )}
            </p>
            <table class="spec-table" style="border-top:1px solid var(--hairline);">
              <tbody>
                <tr><th>Uçuş Kontrol Döngüsü</th><td class="val">250 Hz IMU · Çift STM32H753 Lockstep · DroneCAN</td></tr>
                <tr><th>Yer Kontrol Yazılımları</th><td class="val">UAV Station (S1) · PlaneView Agro (B2) · C4ISR Taktik Konsol (A2)</td></tr>
                <tr><th>Veri Bağları</th><td class="val">1000BASE-T1 · 900MHz Crossfire · Link-16 · Ku-Band BLOS SATCOM</td></tr>
              </tbody>
            </table>
          </div>
          <div class="cell" style="padding:0;">
            <div id="avionics-cad-viewer"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="chapter" data-theme="dark">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 02 // ${t('CANLI DONANIM-DÖNGÜDE (HIL) TEST TEZGÂHI — FC-400 & Q-LOCK TELEMETRİ', 'LIVE HARDWARE-IN-THE-LOOP (HIL) BENCH — FC-400 & Q-LOCK TELEMETRY')} ]</span>
          <span class="eyebrow-tag">0.42 MS DETERMINISTIC BUS</span>
        </div>
        <div class="cell-lg" id="avionics-hil-mount" style="min-height: 420px;">
          <div class="eyebrow">${t('HIL TELEMETRİ TEZGÂHI YÜKLENİYOR...', 'INITIALIZING HIL TELEMETRY BENCH...')}</div>
        </div>
      </div>
    </section>
  `;

  const disposeViewer = mountCadViewer(document.getElementById('avionics-cad-viewer'), {
    initialModel: 'fc400',
    allowedModels: ['fc400', 'qlock', 'a2'],
    lang: currentLang,
  });
  activeDisposers.push(disposeViewer);

  import(withBase('/assets/hil_rig_anatomy.js'))
    .then((mod) => {
      const mountEl = document.getElementById('avionics-hil-mount');
      if (mountEl && typeof mod.mountHilRigAnatomy === 'function') {
        const rig = mod.mountHilRigAnatomy(mountEl, { theme: 'dark', lang: currentLang });
        if (typeof rig === 'function') {
          activeDisposers.push(rig);
        } else if (rig && typeof rig.destroy === 'function') {
          activeDisposers.push(() => rig.destroy());
        }
      }
    })
    .catch(() => {});
}

/* ==========================================================================
   PAGE 6: MANUFACTURING, ANATOMY HIL RIG & ISO BLUEPRINTS (/manufacturing)
   ========================================================================== */
function renderManufacturingPage(root) {
  root.innerHTML = `
    <section class="chapter" data-theme="dark">
      <div class="rail">
        <div class="hero-grid">
          <div class="hero-copy-cell">
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
              <div class="eyebrow" style="color:var(--signal-volt);">[ 05 // ${t('SERİ KOMPOZİT ÜRETİM & KALİTE GÜVENCE', 'COMPOSITE PRODUCTION LINE & QUALITY ASSURANCE')} ]</div>
              <h1 class="h-hero">${t('Otoklav Karbon Kalıplardan 5-Eksen Titanyum İşlemeye.', 'From Autoclave Carbon Tooling to 5-Axis Titanium.')}</h1>
              <p class="prose">
                ${t(
                  'Kestrel üretim hattı; yekpare karbon-prepreg kanat kabuklarını, 5-eksen CNC işlenmiş Ti-6Al-4V Q-Lock pilon kaplinlerini ve IPC Sınıf-3 aviyonik dizgi hattını tek çatı altında birleştirir.',
                  'Kestrel vertically integrates monolithic carbon-prepreg wing curing, 5-axis CNC Ti-6Al-4V Q-Lock coupler machining, and IPC Class-3 avionics assembly.'
                )}
              </p>
            </div>
            <div class="btn-row">
              <a href="#iso-blueprints" class="btn btn-volt">${t('ISO A3 TEKNİK RESİMLERİ İNCELE', 'VIEW ISO A3 SHOP DRAWINGS')}</a>
              <a href="${routeHref('/configure')}" class="btn btn-outline" data-nav="/configure">${t('ÜRETİM KAPASİTESİ & TESLİMAT', 'PRODUCTION LEAD TIMES')}</a>
            </div>
          </div>
          <div class="hero-media-cell">
            <div class="hero-render-wrap">
              <img src="${withBase('/renders/manufacturing_exploded_airframe.webp')}" alt="Exploded Kestrel Carbon Airframe" />
            </div>
          </div>
        </div>

        <div class="cells-4 fiducial-row" style="border-top:1px solid var(--hairline);">
          ${MANUFACTURING_STEPS.map((s) => `
            <div class="cell-surface">
              <div class="eyebrow" style="color:var(--signal-volt);">${s.step} // ${s.code}</div>
              <div class="h-sub" style="margin:0.55rem 0;">${trEn(s.title)}</div>
              <div class="mono" style="font-size:0.78rem; color:var(--ink-primary-dark); margin-bottom:0.55rem;">${s.metric}</div>
              <p class="prose" style="font-size:0.88rem;">${trEn(s.desc)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- INTERACTIVE ISOMETRIC ANATOMY HIL TEST BENCH -->
    <section class="chapter" data-theme="light">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 01 // ${t('CANLI İZOMETRİK KABUL TEZGAHI — Q-LOCK PİLON & AKTÜATÖR HIL DİNAMOMETRESİ', 'LIVE ISOMETRIC ACCEPTANCE RIG — Q-LOCK PYLON & ACTUATOR HIL DYNAMOMETER')} ]</span>
          <span class="eyebrow-tag">INTERACTIVE ANATOMY PLATE</span>
        </div>
        <div class="cell-lg" id="hil-anatomy-mount" style="min-height: 420px;">
          <div class="eyebrow">${t('İZOMETRİK TEST TEZGAHI YÜKLENİYOR...', 'INITIALIZING ISOMETRIC HIL BENCH...')}</div>
        </div>
      </div>
    </section>

    <!-- KERNEL-PROJECTED ISO A3 ENGINEERING BLUEPRINTS -->
    <section class="chapter" data-theme="light" id="iso-blueprints">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 02 // ${t('GERÇEK CAD ÇEKİRDEĞİNDEN ÜRETİLMİŞ ISO A3 İMALAT TEKNİK RESİMLERİ', 'KERNEL-PROJECTED ISO A3 ORTHOGRAPHIC MANUFACTURING DRAWINGS')} ]</span>
          <span class="eyebrow-tag">THIRD ANGLE // ISO 2768</span>
        </div>
        <div class="cells-3 fiducial-row">
          ${BLUEPRINTS.map((bp) => `
            <div class="blueprint-card">
              <div>
                <div class="blueprint-frame">
                  <img src="${bp.img}" alt="${trEn(bp.title)}" loading="lazy" />
                </div>
                <div class="blueprint-meta">
                  <div class="eyebrow">${bp.partNumber} · ${bp.sheet}</div>
                  <h3 class="h-sub">${trEn(bp.title)}</h3>
                  <div class="mono" style="font-size:0.74rem; color:var(--ink-muted);">${bp.material}</div>
                  <p class="prose" style="font-size:0.9rem;">${trEn(bp.desc)}</p>
                </div>
              </div>
              <div style="padding: 0 1.25rem 1.35rem;" class="btn-row">
                <a href="${bp.pdf}" download class="btn">${t('PDF İNDİR', 'DOWNLOAD PDF')}</a>
                <a href="${bp.viewPdf}" target="_blank" class="btn btn-outline">${t('TAM EKRAN AÇ', 'OPEN SHEET')}</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Dynamically import & mount the Anatomy Isometric HIL Test Bench module
  import(withBase('/assets/hil_rig_anatomy.js'))
    .then((mod) => {
      const mountEl = document.getElementById('hil-anatomy-mount');
      if (mountEl && typeof mod.mountHilRigAnatomy === 'function') {
        const rig = mod.mountHilRigAnatomy(mountEl, { theme: 'light', lang: currentLang });
        if (typeof rig === 'function') {
          activeDisposers.push(rig);
        } else if (rig && typeof rig.destroy === 'function') {
          activeDisposers.push(() => rig.destroy());
        }
      }
    })
    .catch(() => {
      const mountEl = document.getElementById('hil-anatomy-mount');
      if (mountEl) mountEl.innerHTML = renderOrthographicTriView('all', currentLang);
    });
}

/* ==========================================================================
   PAGE 7: SCIENTIFIC VALIDATION & ORIGINAL R&D ARCHITECTURE (/research)
   ========================================================================== */
function renderResearchPage(root) {
  root.innerHTML = `
    <section class="chapter" data-theme="dark">
      <div class="rail">
        <div class="cell-lg" style="padding-block: clamp(3rem, 5vw, 4.5rem);">
          <div class="eyebrow" style="color:var(--signal-volt); margin-bottom:1rem;">[ 06 // ${t('BİLİMSEL DOĞRULAMA & ÖZGÜN AR-GE MİMARİSİ', 'SCIENTIFIC VALIDATION & ORIGINAL R&D ARCHITECTURE')} ]</div>
          <h1 class="h-hero" style="max-width: 22ch;">${t('Ölçülmüş Fiziksel Veriler ve 6× Özgün Mühendislik Dosyası.', 'Empirical Flight Physics & 6× Original R&D Disclosures.')}</h1>
          <p class="prose" style="margin-top:1.2rem;">
            ${t(
              'Kestrel mühendislik iddiaları pazarlama tahminlerine değil; EPA AgDRIFT® damlacık dağılım modellerine, milimetre altı RTX LiDAR kalibrasyon bloklarına ve doğrulanmış CAD/SDF/HIL alt sistem mimarilerine dayanır.',
              'Every Kestrel performance claim is anchored in EPA AgDRIFT® deposition physics, millimeter-grade RTX LiDAR block calibrations, and verified CAD/SDF/HIL mechanical and avionics architectures.'
            )}
          </p>
        </div>

        <div class="cells-2 fiducial-row" style="border-top:1px solid var(--hairline);">
          <div class="cell-surface">
            ${renderAtomizerVmdChart(currentLang)}
          </div>
          <div class="cell-surface">
            ${renderLidarCalibrationChart(currentLang)}
          </div>
        </div>
      </div>
    </section>

    <section class="chapter" data-theme="light">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 01 // ${t('ÖZGÜN MÜHENDİSLİK & ALT SİSTEM AR-GE KAYIT DEFTERİ', 'ORIGINAL SUBSYSTEM ENGINEERING & R&D DISCLOSURE LEDGER')} ]</span>
          <span class="eyebrow-tag">KST-ENG // VERIFIED ARCHITECTURE</span>
        </div>
        <div>
          ${PATENTS.map((pat) => `
            <div class="patent-row">
              <div>
                <div class="mono" style="font-weight:600; font-size:0.86rem;">${pat.filingId}</div>
                <div class="eyebrow" style="margin-top:0.35rem;">${pat.division}</div>
              </div>
              <div>
                <h3 class="h-sub" style="margin-bottom:0.45rem;">${trEn(pat.title)}</h3>
                <p class="prose" style="font-size:0.93rem;">${trEn(pat.abstract)}</p>
              </div>
              <div style="display:flex; align-items:flex-start; justify-content:flex-end;">
                <span class="status-pill">${trEn(pat.status)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

/* ==========================================================================
   PAGE 8: FLEET CONFIGURATOR & TECHNICAL INQUIRY (/configure)
   ========================================================================== */
function renderConfigurePage(root) {
  root.innerHTML = `
    <section class="chapter" data-theme="light">
      <div class="rail">
        <div class="section-header-bar">
          <span class="eyebrow">[ 07 // ${t('KURUMSAL FİLO YAPILANDIRICI & TEKNİK BRİFİNG TALEBİ', 'FLEET CONFIGURATOR & TECHNICAL BRIEFING INTAKE')} ]</span>
          <span class="eyebrow-tag">DIRECT ENGINEERING SALES</span>
        </div>

        <div class="split-5-7 fiducial-row">
          <div class="cell-lg" style="display:flex; flex-direction:column; justify-content:space-between; gap:2rem;">
            <div>
              <h1 class="h-chapter">${t('Görev Profilinize Göre Kestrel Filonuzu Yapılandırın.', 'Configure Your Kestrel Fleet by Mission Profile.')}</h1>
              <p class="prose" style="margin-top:1rem;">
                ${t(
                  'Seçtiğiniz platform, uçak adedi ve yer destek paketine göre tahmini saha kapasitesini inceleyin; mühendislik ekibimiz doğrudan uçuş simülasyonu ve teslimat takvimiyle dönüş yapsın.',
                  'Select your primary platform division, aircraft count, and ground support kit to generate an immediate operational capacity summary and submit an engineering RFQ.'
                )}
              </p>
            </div>

            <div id="cfg-summary-box" class="cell-surface" style="border:1px solid var(--hairline-strong);"></div>
          </div>

          <div class="cell-lg">
            <form id="rfq-form">
              <div class="cells-2" style="margin-bottom:1.25rem; border:1px solid var(--hairline);">
                <div class="cell">
                  <div class="form-field" style="margin:0;">
                    <label for="cfg-div">${t('PLATFORM DİVİZYONU', 'PLATFORM DIVISION')}</label>
                    <select id="cfg-div" class="form-input">
                      <option value="B2">Kestrel B2 — 300L Otonom Tarım &amp; AI Lazer</option>
                      <option value="A2">Kestrel A2 — Taktik SİHA &amp; Sürü (Savunma/Kamu)</option>
                      <option value="S1">Kestrel S1 — Aktif 3B LiDAR &amp; Jeodezi</option>
                      <option value="MIXED">Karma Filo (Ortak Gövde + Çoklu Modül)</option>
                    </select>
                  </div>
                </div>
                <div class="cell">
                  <div class="form-field" style="margin:0;">
                    <label for="cfg-qty">${t('HAVA ARACI ADEDİ', 'AIRCRAFT QUANTITY')}: <strong id="cfg-qty-val">2</strong></label>
                    <input type="range" id="cfg-qty" min="1" max="16" value="2" style="margin-top:0.65rem; width:100%;" />
                  </div>
                </div>
              </div>

              <div class="form-field">
                <label>${t('YER DESTEK & YAZILIM OPSİYONLARI', 'GROUND SUPPORT & DIGITAL TWIN OPTIONS')}</label>
                <label class="option-check">
                  <input type="checkbox" name="opt" value="90kWh-HotSwap-Cart" checked />
                  <span>90 kWh 5-Set Batarya Filosu + 4-Yuvalı AC Saha Şarj Arabası</span>
                </label>
                <label class="option-check">
                  <input type="checkbox" name="opt" value="Q-Lock-MultiRole-Kit" checked />
                  <span>Q-Lock MP-60 Hızlı Rol Dönüşüm Seti (Yedek Burun &amp; Pilon Takımı)</span>
                </label>
                <label class="option-check">
                  <input type="checkbox" name="opt" value="Dual-Engine-Digital-Twin" />
                  <span>Kurumsal Dijital İkiz &amp; HIL Simülasyon Lisansı (Gazebo + Isaac RTX)</span>
                </label>
              </div>

              <div class="cells-2" style="border:1px solid var(--hairline); margin-bottom:1.1rem;">
                <div class="cell" style="padding:1rem;">
                  <div class="form-field" style="margin:0;">
                    <label for="cfg-org">${t('KURUM / ŞİRKET ADI', 'ORGANIZATION')}</label>
                    <input id="cfg-org" class="form-input" required placeholder="${t('Örn: Anadolu Tarım / Savunma A.Ş.', 'e.g. Meridian Geospatial Corp.')}" />
                  </div>
                </div>
                <div class="cell" style="padding:1rem;">
                  <div class="form-field" style="margin:0;">
                    <label for="cfg-email">${t('KURUMSAL E-POSTA', 'CORPORATE EMAIL')}</label>
                    <input id="cfg-email" type="email" class="form-input" required placeholder="muhendislik@kurum.com" />
                  </div>
                </div>
              </div>

              <div class="form-field">
                <label for="cfg-region">${t('OPERASYON BÖLGESİ & PİST KOŞULU', 'OPERATIONAL REGION & RUNWAY ENVIRONMENT')}</label>
                <input id="cfg-region" class="form-input" placeholder="${t('Örn: Çukurova 250m toprak pist / Yüksek irtifa koridor', 'e.g. 250m unpaved farm strip / Contested maritime ISR')}" />
              </div>

              <div class="form-field">
                <label for="cfg-notes">${t('GÖREV GEREKSİNİMLERİ', 'MISSION REQUIREMENTS')}</label>
                <textarea id="cfg-notes" rows="3" class="form-input" placeholder="${t('Hedef hektar, sensör entegrasyonu veya teslimat takvimi...', 'Target acreage, sensor payload requirements, or timeline...')}"></textarea>
              </div>

              <button type="submit" class="btn" style="width:100%; justify-content:center; padding:1rem;">
                ${t('TEKNİK YAPILANDIRMAYI GÖNDER', 'SUBMIT FLEET CONFIGURATION')} -&gt;
              </button>
              <div id="rfq-status" class="mono" style="margin-top:0.9rem; font-size:0.82rem;"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;

  const divEl = root.querySelector('#cfg-div');
  const qtyEl = root.querySelector('#cfg-qty');
  const qtyVal = root.querySelector('#cfg-qty-val');
  const summaryBox = root.querySelector('#cfg-summary-box');

  const updateSummary = () => {
    const div = divEl.value;
    const qty = Number(qtyEl.value);
    qtyVal.textContent = String(qty);
    const capLine = div === 'B2'
      ? `${qty * 105} ha/saat (${qty * 300} L toplam anlık sıvı yükü)`
      : div === 'A2'
      ? `${qty * 4}× Önleyici Drone + ${qty * 2}× MAM-L Pilon Kapasitesi`
      : div === 'S1'
      ? `${(qty * 327.7).toFixed(1)}k LiDAR nokta/sn eşzamanlı tarama`
      : `${qty}× Ortak Karbon Gövde + Q-Lock Çoklu Görev Paketi`;

    summaryBox.innerHTML = `
      <div class="eyebrow" style="margin-bottom:0.6rem;">CANLI FİLO ÖZETİ // ${div} × ${qty}</div>
      <div class="metric-val" style="font-size:1.55rem; margin-bottom:0.5rem;">${capLine}</div>
      <div class="prose" style="font-size:0.88rem;">
        ${t('Ortak yedek parça uyumu: %84 · Tahmini üretim teslimatı: 8–12 hafta · FC-400 HIL sertifikası dahil.', 'Common spares compatibility: 84% · Estimated production lead: 8–12 weeks · FC-400 HIL certificate included.')}
      </div>
    `;
  };

  divEl.addEventListener('change', updateSummary);
  qtyEl.addEventListener('input', updateSummary);
  updateSummary();

  root.querySelector('#rfq-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const statusEl = root.querySelector('#rfq-status');
    statusEl.textContent = t('KAYDEDİLİYOR...', 'TRANSMITTING...');
    const options = Array.from(root.querySelectorAll('input[name="opt"]:checked')).map((c) => c.value);
    const payload = {
      division: divEl.value,
      quantity: Number(qtyEl.value),
      organization: root.querySelector('#cfg-org').value,
      email: root.querySelector('#cfg-email').value,
      region: root.querySelector('#cfg-region').value,
      options,
      notes: root.querySelector('#cfg-notes').value,
    };
    const fallbackStaticLog = () => {
      const refId = `KST-RFQ-${Date.now().toString(36).toUpperCase()}`;
      try {
        const ledger = JSON.parse(localStorage.getItem('kestrel_rfq_ledger') || '[]');
        ledger.push({ refId, createdAt: new Date().toISOString(), ...payload });
        localStorage.setItem('kestrel_rfq_ledger', JSON.stringify(ledger));
      } catch (_err) {}
      statusEl.style.color = '#1A8748';
      statusEl.textContent = `${t('TALEP KAYDEDİLDİ · REFERANS KODU', 'INQUIRY LOGGED · REF ID')}: ${refId}`;
    };
    try {
      const resp = await fetch(withBase('/api/inquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        fallbackStaticLog();
        return;
      }
      const data = await resp.json();
      if (data.ok) {
        statusEl.style.color = '#1A8748';
        statusEl.textContent = `${t('TALEP KAYDEDİLDİ · REFERANS KODU', 'INQUIRY LOGGED · REF ID')}: ${data.refId}`;
      } else {
        fallbackStaticLog();
      }
    } catch (_e) {
      fallbackStaticLog();
    }
  });
}

/* ==========================================================================
   ROUTER & LIFECYCLE
   ========================================================================== */
function renderApp(route) {
  activeDisposers.forEach((fn) => {
    try { fn(); } catch (_e) {}
  });
  activeDisposers = [];

  renderHeader(route);
  const root = document.getElementById('app-root');
  if (route === '/') renderHomePage(root);
  else if (route === '/platforms/s1') renderPlatformPage(root, 's1');
  else if (route === '/platforms/b2') renderPlatformPage(root, 'b2');
  else if (route === '/platforms/a2') renderPlatformPage(root, 'a2');
  else if (route === '/avionics') renderAvionicsPage(root);
  else if (route === '/manufacturing') renderManufacturingPage(root);
  else if (route === '/research') renderResearchPage(root);
  else if (route === '/configure') renderConfigurePage(root);
  renderFooter();
}

document.addEventListener('click', (ev) => {
  const link = ev.target.closest('[data-nav]');
  if (!link) return;
  if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
  ev.preventDefault();
  navigate(link.getAttribute('data-nav'), true);
});

window.addEventListener('popstate', () => {
  renderApp(normalizeRoute(window.location.pathname));
});

renderApp(normalizeRoute(window.location.pathname));
