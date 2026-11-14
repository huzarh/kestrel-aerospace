// Precision SVG Orthographic Schematics & Scientific Benchmark Plots (Zero AI-Slop Icons)

export function renderOrthographicTriView(variant = 'all', lang = 'tr') {
  const t = (tr, en) => (lang === 'en' ? en : tr);
  const isB2 = variant === 'b2' || variant === 'all';
  const isA2 = variant === 'a2' || variant === 'all';

  return `
  <svg viewBox="0 0 920 340" width="100%" role="img" aria-label="Kestrel 11.006m Common Airframe Orthographic Planview" style="font-family: 'IBM Plex Mono', monospace;">
    <defs>
      <pattern id="orthoGrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-opacity="0.08" stroke-width="0.7"/>
      </pattern>
    </defs>
    <rect x="0" y="0" width="920" height="340" fill="url(#orthoGrid)" />

    <!-- Dimension Callout: 11,006 mm Wingspan -->
    <g stroke="currentColor" stroke-opacity="0.55" stroke-width="1">
      <line x1="70" y1="34" x2="570" y2="34"/>
      <line x1="70" y1="26" x2="70" y2="95"/>
      <line x1="570" y1="26" x2="570" y2="95"/>
      <polygon points="70,34 78,31 78,37" fill="currentColor"/>
      <polygon points="570,34 562,31 562,37" fill="currentColor"/>
    </g>
    <text x="320" y="26" text-anchor="middle" fill="currentColor" font-size="11" letter-spacing="1.2">11,006 MM ${t('ORTAK KARBON KANAT AÇIKLIĞI', 'COMMON CFRP WINGSPAN')}</text>

    <!-- TOP PLANFORM VIEW (Left) -->
    <g transform="translate(320, 165)">
      <!-- Centerlines -->
      <line x1="0" y1="-115" x2="0" y2="145" stroke="currentColor" stroke-opacity="0.32" stroke-dasharray="6 4" stroke-width="0.9"/>
      <line x1="-265" y1="-22" x2="265" y2="-22" stroke="currentColor" stroke-opacity="0.32" stroke-dasharray="6 4" stroke-width="0.9"/>

      <!-- Main High-Aspect Wing -->
      <polygon points="-250,-28 -90,-42 90,-42 250,-28 250,-6 90,-10 -90,-10 -250,-6" fill="currentColor" fill-opacity="0.07" stroke="currentColor" stroke-width="1.5"/>

      <!-- Control Surfaces (Flaps + Ailerons) -->
      <rect x="-235" y="-12" width="92" height="6" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="1"/>
      <rect x="143" y="-12" width="92" height="6" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="1"/>
      <rect x="-126" y="-15" width="80" height="6" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="1"/>
      <rect x="46" y="-15" width="80" height="6" fill="none" stroke="currentColor" stroke-opacity="0.7" stroke-width="1"/>

      <!-- Fuselage Pod & Tail Boom -->
      <path d="M 0,-106 C 14,-96 18,-62 16,-10 L 7,96 L -7,96 L -16,-10 C -18,-62 -14,-96 0,-106 Z" fill="currentColor" fill-opacity="0.10" stroke="currentColor" stroke-width="1.6"/>

      <!-- T-Tail Horizontal Stabilizer -->
      <polygon points="-56,88 56,88 50,104 -50,104" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.4"/>

      <!-- 4 Tractor Motor Nacelles & Prop Disks -->
      ${[-166, -80, 80, 166].map((mx) => `
        <rect x="${mx - 5.5}" y="-56" width="11" height="31" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.2"/>
        <line x1="${mx - 18}" y1="-58" x2="${mx + 18}" y2="-58" stroke="currentColor" stroke-width="1.6"/>
      `).join('')}

      <!-- B2 Full-Span Spray Boom & 8 Rotary Atomizers -->
      ${isB2 ? `
        <line x1="-214" y1="2" x2="214" y2="2" stroke="#1A8748" stroke-width="2"/>
        ${[-196, -146, -96, -46, 46, 96, 146, 196].map((ax) => `<circle cx="${ax}" cy="2" r="3.4" fill="#1A8748"/>`).join('')}
      ` : ''}

      <!-- A2 Outboard MAM-L & Interceptor Stations + Pitot -->
      ${isA2 ? `
        <line x1="0" y1="-106" x2="0" y2="-122" stroke="#FF4400" stroke-width="1.8"/>
        ${[-198, 198].map((wx) => `<rect x="${wx - 3}" y="-36" width="6" height="42" fill="none" stroke="#FF4400" stroke-width="1.4"/>`).join('')}
        ${[-116, -55, 55, 116].map((dx) => `<circle cx="${dx}" cy="-24" r="5" fill="none" stroke="#FF4400" stroke-width="1.2"/>`).join('')}
      ` : ''}
    </g>

    <!-- Length Dimension -->
    <g stroke="currentColor" stroke-opacity="0.5" stroke-width="1">
      <line x1="600" y1="59" x2="600" y2="269"/>
      <line x1="582" y1="59" x2="608" y2="59"/>
      <line x1="582" y1="269" x2="608" y2="269"/>
    </g>
    <text x="614" y="168" fill="currentColor" font-size="10.5" letter-spacing="1">5,765–6,033 MM</text>

    <!-- SIDE PROFILE + MODULAR PAYLOAD CALLOUTS (Right) -->
    <g transform="translate(765, 130)">
      <text x="0" y="-86" text-anchor="middle" fill="currentColor" font-size="10.5" letter-spacing="1.1">${t('MODÜLER ARAYÜZ İSTASYONLARI', 'MODULAR INTERFACE STATIONS')}</text>
      <!-- Side Fuselage & T-Tail Profile -->
      <path d="M -118,8 C -98,-12 -52,-16 14,-12 L 106,-4 L 122,-46 L 136,-46 L 128,4 L 10,6 C -48,12 -96,14 -118,8 Z" fill="currentColor" fill-opacity="0.09" stroke="currentColor" stroke-width="1.5"/>
      <!-- Wing Chord Section -->
      <ellipse cx="-18" cy="-14" rx="28" ry="4.5" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2"/>
      <!-- Tricycle Landing Gear -->
      <line x1="-82" y1="10" x2="-86" y2="34" stroke="currentColor" stroke-width="1.3"/>
      <circle cx="-86" cy="37" r="7" fill="none" stroke="currentColor" stroke-width="1.4"/>
      <line x1="-8" y1="8" x2="4" y2="34" stroke="currentColor" stroke-width="1.3"/>
      <circle cx="4" cy="37" r="8" fill="none" stroke="currentColor" stroke-width="1.4"/>

      <!-- Station Callouts -->
      <circle cx="-118" cy="7" r="3.5" fill="#0055FF"/>
      <line x1="-118" y1="7" x2="-118" y2="72" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="3 2"/>
      <text x="-118" y="86" text-anchor="middle" fill="currentColor" font-size="9.5">STA X+2.34m</text>
      <text x="-118" y="99" text-anchor="middle" fill="currentColor" fill-opacity="0.68" font-size="9">${t('LiDAR / AESA BURUN', 'NOSE RADOME')}</text>

      <circle cx="-42" cy="12" r="3.5" fill="#1A8748"/>
      <line x1="-42" y1="12" x2="-42" y2="118" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="3 2"/>
      <text x="-42" y="132" text-anchor="middle" fill="currentColor" font-size="9.5">STA X+0.64m</text>
      <text x="-42" y="145" text-anchor="middle" fill="currentColor" fill-opacity="0.68" font-size="9">${t('300L TANK / EH POD', '300L / EW BAY')}</text>

      <circle cx="28" cy="-14" r="3.5" fill="#FF4400"/>
      <line x1="28" y1="-14" x2="68" y2="72" stroke="currentColor" stroke-opacity="0.45" stroke-dasharray="3 2"/>
      <text x="68" y="86" text-anchor="middle" fill="currentColor" font-size="9.5">Q-LOCK MP-60</text>
      <text x="68" y="99" text-anchor="middle" fill="currentColor" fill-opacity="0.68" font-size="9">${t('6× AKILLI PİLON', '6× SMART PYLON')}</text>
    </g>

    <text x="24" y="324" fill="currentColor" fill-opacity="0.55" font-size="9.5" letter-spacing="1">DWG // KST-000-COMMON-GA · SCALE 1:50 · UNITS: MM · PROJECTION: ISO THIRD ANGLE</text>
  </svg>`;
}

export function renderAtomizerVmdChart(lang = 'tr') {
  const t = (tr, en) => (lang === 'en' ? en : tr);
  // Real curve: RPM 2500..14000 -> VMD 380..105 um
  const pts = [
    [70, 56],   // 2,500 RPM -> 380 um
    [145, 92],  // 4,500 RPM -> 310 um
    [230, 134], // 7,000 RPM -> 235 um
    [305, 162], // 9,200 RPM -> 185 um (Nominal)
    [390, 188], // 11,500 RPM -> 140 um
    [470, 208], // 14,000 RPM -> 105 um
  ];
  const poly = pts.map((p) => p.join(',')).join(' ');

  return `
  <svg viewBox="0 0 520 265" width="100%" style="font-family: 'IBM Plex Mono', monospace;">
    <rect x="55" y="28" width="435" height="195" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.25"/>
    <!-- Optimal 150-250 um Bio-Efficacy Band -->
    <rect x="55" y="125" width="435" height="56" fill="#1A8748" fill-opacity="0.13"/>
    <text x="482" y="119" text-anchor="end" fill="#1A8748" font-size="9.5">${t('OPTİMAL TUTUNMA BANDI (150–250 µm · %96 AgDRIFT)', 'OPTIMAL DEPOSITION BAND (150–250 µm · 96% AgDRIFT)')}</text>

    ${[68, 108, 148, 188].map((gy) => `<line x1="55" y1="${gy}" x2="490" y2="${gy}" stroke="currentColor" stroke-opacity="0.12" stroke-dasharray="4 4"/>`).join('')}

    <polyline points="${poly}" fill="none" stroke="currentColor" stroke-width="2.2"/>
    ${pts.map(([px, py], idx) => `
      <circle cx="${px}" cy="${py}" r="${idx === 3 ? 5 : 3.2}" fill="${idx === 3 ? '#1A8748' : 'currentColor'}"/>
    `).join('')}

    <!-- Nominal operating callout -->
    <line x1="305" y1="162" x2="305" y2="223" stroke="#1A8748" stroke-dasharray="3 2"/>
    <text x="314" y="156" fill="currentColor" font-size="9.5">9,200 RPM -&gt; 185 µm</text>

    <!-- Y-axis labels -->
    <text x="48" y="59" text-anchor="end" fill="currentColor" fill-opacity="0.65" font-size="9.5">380µm</text>
    <text x="48" y="136" text-anchor="end" fill="currentColor" fill-opacity="0.65" font-size="9.5">235µm</text>
    <text x="48" y="211" text-anchor="end" fill="currentColor" fill-opacity="0.65" font-size="9.5">105µm</text>

    <!-- X-axis labels -->
    <text x="70" y="242" text-anchor="middle" fill="currentColor" fill-opacity="0.65" font-size="9.5">2.5k</text>
    <text x="230" y="242" text-anchor="middle" fill="currentColor" fill-opacity="0.65" font-size="9.5">7.0k</text>
    <text x="305" y="242" text-anchor="middle" fill="#1A8748" font-size="9.5">9.2k</text>
    <text x="470" y="242" text-anchor="middle" fill="currentColor" fill-opacity="0.65" font-size="9.5">14.0k RPM</text>
    <text x="55" y="18" fill="currentColor" font-size="10" letter-spacing="0.8">${t('ŞEKİL 02A // ATOMİZER DEVRİ (RPM) vs DAMLACIK VMD SPEKTRUMU', 'FIG 02A // ROTARY ATOMIZER RPM vs DROPLET VMD SPECTRUM')}</text>
  </svg>`;
}

export function renderLidarCalibrationChart(lang = 'tr') {
  const t = (tr, en) => (lang === 'en' ? en : tr);
  const bars = [
    { label: '2.000 m', measured: '1.998 m', err: '1.8 mm', h: 38 },
    { label: '5.000 m', measured: '5.002 m', err: '2.1 mm', h: 74 },
    { label: '10.000 m', measured: '9.997 m', err: '2.6 mm', h: 112 },
    { label: '15.000 m', measured: '15.003 m', err: '2.9 mm', h: 148 },
  ];

  return `
  <svg viewBox="0 0 520 265" width="100%" style="font-family: 'IBM Plex Mono', monospace;">
    <rect x="55" y="28" width="435" height="195" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.25"/>
    ${[68, 118, 168].map((gy) => `<line x1="55" y1="${gy}" x2="490" y2="${gy}" stroke="currentColor" stroke-opacity="0.12" stroke-dasharray="4 4"/>`).join('')}

    ${bars.map((b, idx) => {
      const bx = 96 + idx * 98;
      const by = 223 - b.h;
      return `
        <rect x="${bx}" y="${by}" width="54" height="${b.h}" fill="#0055FF" fill-opacity="0.22" stroke="#0055FF" stroke-width="1.5"/>
        <text x="${bx + 27}" y="${by - 8}" text-anchor="middle" fill="currentColor" font-size="9.5">Δ=${b.err}</text>
        <text x="${bx + 27}" y="242" text-anchor="middle" fill="currentColor" fill-opacity="0.72" font-size="9.5">${b.label}</text>
      `;
    }).join('')}

    <text x="55" y="18" fill="currentColor" font-size="10" letter-spacing="0.8">${t('ŞEKİL 02B // S1 LiDAR + ISAAC RTX KALİBRASYON DOĞRULUĞU (≤ 2.9 MM)', 'FIG 02B // S1 LiDAR + ISAAC RTX ELEVATION CALIBRATION (≤ 2.9 MM)')}</text>
    <text x="68" y="48" text-anchor="start" fill="#0055FF" font-size="9.5">32,925,741 PTS · 0 DROPS</text>
  </svg>`;
}
