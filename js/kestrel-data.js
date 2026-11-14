// Ground-Truth Engineering, Platform, Manufacturing & R&D Architecture Ledger for Kestrel Aerospace

export const SITE_ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
export const withBase = (p) => `${SITE_ROOT}${p}`;
export const routeHref = (r) => (r === '/' ? (SITE_ROOT ? `${SITE_ROOT}/` : '/') : `${SITE_ROOT}${r}`);

export const PLATFORMS = {
  s1: {
    id: 's1',
    code: 'KST-S1 // DIV-01',
    route: '/platforms/s1',
    accent: '#0055FF',
    heroImg: withBase('/renders/s1_survey_studio.webp'),
    detailImg: withBase('/renders/manufacturing_exploded_airframe.webp'),
    glbKey: 's1',
    name: {
      tr: 'Kestrel S1',
      en: 'Kestrel S1',
    },
    domain: {
      tr: 'Jeodezi, Koridor Denetimi & Aktif 3B LiDAR Haritalama',
      en: 'Geospatial Corridor Inspection & Active 3D LiDAR Mapping',
    },
    commercialBar: {
      tr: ['Kestrel S1', 'Uçuşa Hazır Konfigürasyon', '1024×32 Aktif LiDAR + Çift Kamera', '≤ 2.9 mm Kalibrasyon Hassasiyeti'],
      en: ['Kestrel S1', 'Ready-to-Fly Survey Configuration', '1024×32 Active LiDAR + Dual RGB', '≤ 2.9 mm Verified Elevation Accuracy'],
    },
    summary: {
      tr: '11.0 m ortak karbon-prepreg gövde üzerinde saniyede 327.680 lazer dönüşü üreten 32-kanallı aktif LiDAR, 123.2° geniş açılı nadir RGB renklendirme kamerası ve H.264 düşük gecikmeli ileri seyrüsefer akışını birleştiren uzun menzilli otonom haritalama platformu.',
      en: 'Long-endurance autonomous mapping aircraft pairing a 32-channel active LiDAR (327,680 pts/s), 123.2° wide-swath nadir RGB colorization camera, and low-latency H.264 forward telemetry on the common 11.0 m carbon-prepreg airframe.',
    },
    miniSpecs: [
      { k: { tr: 'KANAT AÇIKLIĞI', en: 'WINGSPAN' }, v: '11,006 mm' },
      { k: { tr: 'AKTİF LiDAR', en: 'ACTIVE LiDAR' }, v: '327.7k pts/s' },
      { k: { tr: 'İRTİFA HATASI', en: 'Z-ACCURACY' }, v: '≤ 2.9 mm' },
      { k: { tr: 'MENZİL / SÜRE', en: 'RANGE / ENDUR.' }, v: '250 m / 4.2 sa' },
    ],
    specTabs: {
      airframe: {
        title: { tr: 'Gövde & İtki', en: 'Airframe & Propulsion' },
        rows: [
          [{ tr: 'Kanat Açıklığı × Gövde Boyu', en: 'Wingspan × Length' }, '11,006 mm × 5,765 mm (Yükseklik: 2,286 mm)'],
          [{ tr: 'Yapısal Malzeme', en: 'Primary Structure' }, { tr: 'Otoklav Kürlemeli 3K Twill CFRP Prepreg + 7075-T6 Kaburga', en: 'Autoclave-Cured 3K Twill CFRP Prepreg + 7075-T6 Ribs' }],
          [{ tr: 'İtki Mimarisi', en: 'Propulsion Architecture' }, { tr: '4× Dağıtık Elektrikli Çekici Motor (±1.75 m ve ±3.65 m istasyonlar)', en: '4× Distributed Electric Tractor Motors (±1.75 m & ±3.65 m stations)' }],
          [{ tr: 'Pervane & Toplam İtki', en: 'Propeller & Peak Thrust' }, { tr: '5-Palli 800 mm Karbon Pervane · 4 × 120 N (480 N Toplam)', en: '5-Blade 800 mm Carbon Rotors · 4 × 120 N (480 N Total)' }],
          [{ tr: 'Kontrol Yüzeyleri (6 Adet)', en: 'Control Surfaces (6×)' }, { tr: 'Aileron ±30° · Flap -40°..0° · Elevatör ±30° · Rudder ±30°', en: 'Ailerons ±30° · Flaps -40°..0° · Elevator ±30° · Rudder ±30°' }],
        ],
      },
      payload: {
        title: { tr: 'LiDAR & Optik', en: 'LiDAR & Optics' },
        rows: [
          [{ tr: 'Aktif 3B Haritalama LiDAR', en: 'Active 3D Mapping LiDAR' }, '1024 × 32 Kanal @ 10 Hz (32,768 ışın/tarama · 327,680 nokta/sn)'],
          [{ tr: 'Tarama Açısı & Menzil', en: 'Field of View & Range' }, '120° Yatay (±60°) × 18° Dikey · 0.10 m – 250.0 m (σ = 2 cm)'],
          [{ tr: 'Nadir RGB Haritalama Kamerası', en: 'Nadir RGB Mapping Camera' }, '123.2° HFOV · Gerçek Zamanlı RGB Nokta Bulutu Renklendirme'],
          [{ tr: 'İleri Seyrüsefer Kamerası', en: 'Forward Navigation Camera' }, '68.8° HFOV · H.264 RTP Düşük Gecikmeli Akış (UDP :5600)'],
          [{ tr: 'Çıktı Formatları', en: 'Deliverable Formats' }, '3M-Voksel 10 cm .PLY / .NPZ Renkli Nokta Bulutu + MKV Telemetri Arşivi'],
        ],
      },
      autonomy: {
        title: { tr: 'Otonomi & İkiz', en: 'Autonomy & Twin' },
        rows: [
          [{ tr: 'Uçuş Kontrol Donanımı', en: 'Flight Control Hardware' }, 'Kestrel FC-400 (Çift Lockstep STM32H753 + NVIDIA Orin NX 16GB)'],
          [{ tr: 'Otopilot & Görev Planlama', en: 'Autopilot & Mission Suite' }, 'PX4 SITL/HIL + UAV Station Masaüstü C2 & QGroundControl MAVLink'],
          [{ tr: 'Çift-Çözücülü Dijital İkiz', en: 'Dual-Solver Digital Twin' }, 'Gazebo Harmonic (gz-sim8) + NVIDIA Isaac Sim 6.1 (PhysX 240 Hz & RTX)'],
          [{ tr: 'Doğrulanmış Saha Testi', en: 'Validated Survey Benchmark' }, '1,066 Tarama · 32,925,741 LiDAR Dönüşü · 0 Paket Kaybı · ≤ 2.9 mm Z-Hata'],
        ],
      },
    },
  },

  b2: {
    id: 'b2',
    code: 'KST-B2 // DIV-02',
    route: '/platforms/b2',
    accent: '#1A8748',
    heroImg: withBase('/renders/b2_agro_field_hero.webp'),
    detailImg: withBase('/renders/b2_agro_nose_tank_macro.webp'),
    glbKey: 'b2',
    name: {
      tr: 'Kestrel B2',
      en: 'Kestrel B2',
    },
    domain: {
      tr: 'Otonom Ağır-Yük Tarım, Döner Atomizer & AI Lazer Fitopatoloji',
      en: 'Autonomous Heavy-Lift Crop Protection & AI Laser Phytopathology',
    },
    commercialBar: {
      tr: ['Kestrel B2', '300 L (80 Gal) Kapasite', '20 m AgDRIFT Şerit · 105 ha/saat', '$1.15 / ha Doğrudan Enerji Maliyeti'],
      en: ['Kestrel B2', '300 L (80 Gal) Hopper', '20 m AgDRIFT Swath · 105 ha/hr', '$1.15 / ha Direct Energy Operating Cost'],
    },
    summary: {
      tr: '635 kg azami kalkış ağırlığına sahip tam elektrikli ağır tarım uçağı. 300 L konformal karın tankı, uçuşta damlacık çapını (105–380 µm VMD) dinamik ayarlayan 8× elektrikli döner atomizer, kimyasalsız hastalık imhası için 4× 320 W AI lazer tareti ve 5 dakikada değişen 90 kWh batarya filosunu tek gövdede toplar.',
      en: '635 kg MTOW all-electric agricultural workhorse integrating a 300 L conformal tank, 8× electric rotary atomizers with in-flight VMD droplet control (105–380 µm), 4× 320 W AI laser ablation pods, and a <5-minute 90 kWh hot-swap battery fleet.',
    },
    miniSpecs: [
      { k: { tr: 'SIVI TANK / MTOW', en: 'HOPPER / MTOW' }, v: '300 L / 635 kg' },
      { k: { tr: 'ŞERİT & KAPASİTE', en: 'SWATH & RATE' }, v: '20 m · 105 ha/sa' },
      { k: { tr: 'ATOMİZER + LAZER', en: 'ATOMIZER + LASER' }, v: '8× VMD + 4× 320W' },
      { k: { tr: 'BATARYA FİLOSU', en: 'BATTERY FLEET' }, v: '90 kWh (5 Set)' },
    ],
    specTabs: {
      spray: {
        title: { tr: 'Püskürtme & Lazer', en: 'Spray & AI Laser' },
        rows: [
          [{ tr: 'Sıvı Tank & Kuru Gübre', en: 'Liquid Hopper & Spreader' }, { tr: '300 L (80 US Gal) Konformal CFRP Tank + 25 kg Döner Gübre + 180 Biyo-Kapsül', en: '300 L (80 US Gal) Conformal CFRP Tank + 25 kg Granular Spreader + 180 Bio-Capsules' }],
          [{ tr: 'Kanat Altı Boom & Şerit', en: 'Boom Span & Effective Swath' }, { tr: '9,360 mm 316L Paslanmaz Çelik Boom · 20.0 m EPA AgDRIFT® (%96.0 Tutunma)', en: '9,360 mm 316L Stainless Boom · 20.0 m EPA AgDRIFT® Swath (96.0% Deposition)' }],
          [{ tr: '8× Elektrikli Döner Atomizer', en: '8× Electric Rotary Atomizers' }, '2,500 – 14,000 RPM · Dinamik VMD Damlacık Kontrolü: 105 µm – 380 µm'],
          [{ tr: '4-Bölge Bağımsız Kesit', en: '4-Section Boom Control' }, 'B1 / B2 / B3 / B4 Bağımsız Valf + 16× TeeJet Hidrolik Meme (0.65 – 6.0 bar)'],
          [{ tr: '4× AI Fitopatoloji Lazer Podu', en: '4× AI Laser Ablation Pods' }, '4 × 320 W Darbeli Optik Lazer (150 J eşik · ±180° 2-eksen taret · ≥ 7.5 m AGL kilit)'],
        ],
      },
      perception: {
        title: { tr: 'Algılama & Gece Uçuşu', en: 'Perception & Night Ops' },
        rows: [
          [{ tr: 'Burun Engel Algılama Paketi', en: 'Conformal Nose Perception' }, '200 m Katı-Hal 3B GPU LiDAR (90×10 ışın) + İleri mmWave Tel/Ağaç Radarı'],
          [{ tr: 'Otonom Gece İlaçlama Modu', en: 'Autonomous Night Spray' }, { tr: 'Çift 160 m Burun LED Projektör + 250 m Kırsal Pist Aydınlatma · ΔT = 3.2°C Düşük Sürüklenme', en: 'Dual 160 m Cheek LED Floodlights + 250 m Rural Strip Lighting · ΔT = 3.2°C Low Drift' }],
          [{ tr: 'Multispektral & Termal Gimbal', en: 'Multispectral & LWIR Gimbal' }, '5-Bant NDVI / NDRE + Termal CWSI Su Stresi Kamerası (LoRaWAN Pivot Sulama Tetiklemeli)'],
          [{ tr: 'Kısa Pist (STOL) Performansı', en: 'Rural Strip STOL Capability' }, '250 m Sıkıştırılmış Toprak Pistten < 180 m Kalkış Koşusu · RTK FIXED (1.2 cm)'],
        ],
      },
      power: {
        title: { tr: 'Batarya & Ekonomi', en: 'Battery & Economics' },
        rows: [
          [{ tr: 'Uçuş Güç Aktarma Organı', en: 'Electric Drivetrain' }, '60 kW Birleşik 4-Motor Çekici Sistem · 335 kg Boş / 635 kg Azami Kalkış Ağırlığı'],
          [{ tr: 'Hot-Swap Batarya Ekosistemi', en: 'Hot-Swap Battery Fleet' }, '90 kWh Toplam (5 Set × 18 kWh Üçlü Kaset) + 4-Yuvalı AC Saha Şarj Arabası'],
          [{ tr: 'Görev Süresi & Yerde Dönüş', en: 'Endurance & Turnaround' }, '35 dk Aktif İlaçlama + 10 dk Yedek · < 5 dk Batarya Değişimi & Kapalı Devre Dolum'],
          [{ tr: 'Saha Kapasitesi & Maliyet', en: 'Work Rate & Direct Cost' }, '105 ha/saat (10 L/ha dozda) · 72 ha/saat (20 L/ha dozda) · $1.15 / ha Enerji'],
        ],
      },
    },
  },

  a2: {
    id: 'a2',
    code: 'KST-A2 // DIV-03',
    route: '/platforms/a2',
    accent: '#FF4400',
    heroImg: withBase('/renders/a2_combat_sortie_hero.webp'),
    hangarImg: withBase('/renders/a2_defense_stealth_hangar.webp'),
    detailImg: withBase('/renders/a2_defense_pylon_closeup.webp'),
    glbKey: 'a2',
    name: {
      tr: 'Kestrel A2',
      en: 'Kestrel A2',
    },
    domain: {
      tr: 'Düşük Görünürlüklü C4ISR SİHA, Elektronik Harp & Sürü Taarruz',
      en: 'Low-Observable C4ISR UCAV, Electronic Warfare & Swarm Carrier',
    },
    commercialBar: {
      tr: ['Kestrel A2', 'NATO FS 36118 Düşük İz (RAM)', '300 m X-Band AESA + STANAG 1688', '4× Önleyici İHA + 2× MAM-L Pilon'],
      en: ['Kestrel A2', 'NATO FS 36118 Low-Observable', '300 m X-Band AESA + STANAG 1688', '4× Interceptor Drones + 2× MAM-L Pylons'],
    },
    summary: {
      tr: 'Yüksek tehditli hava sahaları için geliştirilen çok rollü taktik SİHA ve hava-fırlatmalı sürü taşıyıcı. Konformal X-Band AESA burun radarı, Ku-Band BLOS SATCOM, DRFM aktif radar köreltici, STANAG 1688 lazer işaretleme tareti, 4 adet otonom önleyici drone ve 2 adet yarı-aktif lazer güdümlü mühimmat taşır.',
      en: 'Multi-role tactical UCAV and air-launched swarm carrier built for contested airspace. Integrates a conformal X-Band AESA nose radar, Ku-Band BLOS SATCOM, DRFM active radar jammer, STANAG 1688 laser designator, 4 autonomous interceptor drones, and 2 SALH guided munitions.',
    },
    miniSpecs: [
      { k: { tr: 'BURUN RADARI', en: 'NOSE RADAR' }, v: 'X-Band AESA' },
      { k: { tr: 'SİLAH İSTASYONU', en: 'HARDPOINTS' }, v: '6× MIL-STD-1760' },
      { k: { tr: 'ÖNLEYİCİ SÜRÜ', en: 'SWARM PAYLOAD' }, v: '4× 52 m/s (14G)' },
      { k: { tr: 'HASSAS TAARRUZ', en: 'PRECISION STRIKE' }, v: '2× MAM-L SALH' },
    ],
    specTabs: {
      sensors: {
        title: { tr: 'AESA Radar & EO/IR', en: 'AESA Radar & EO/IR' },
        rows: [
          [{ tr: 'Konformal Burun Radarı', en: 'Conformal Nose Radar' }, 'X-Band AESA (SAR_GMTI Yer/Deniz · AIR_TO_AIR Hava · STANDBY · EMCON) + Titanyum Pitot-AOA'],
          [{ tr: 'Pasif Kızılötesi & Füze İkaz', en: 'Passive IRST & MAWS' }, 'Burun Üstü Safir IRST Kubbesi + Sancak/İskele UV-MAWS Füze Yaklaşma Sensörleri'],
          [{ tr: '3-Kademeli EO/IR/SALH Taret', en: '3-Stage EO/IR/SALH Gimbal' }, 'EO-RGB / FLIR-IRON / WHOT / NVG-GREEN · 3,000 m LRF + STANAG 1688 Lazer İşaretleme'],
          [{ tr: 'Ufuk Ötesi Komuta & Ağ', en: 'BLOS C2 & Tactical Network' }, 'Sırt Ku/Ka-Band SATCOM Radomu + Link-16 Taktik Veri Bağı + Sıfır-Emisyon EMCON Modu'],
        ],
      },
      weapons: {
        title: { tr: '6-Pilon Sürü & Mühimmat', en: '6-Pylon Swarm & Munitions' },
        rows: [
          [{ tr: 'İç/Orta İstasyonlar (P1–P4)', en: 'Inboard/Mid Stations (P1–P4)' }, '4× Otonom X-Kanat Önleyici İHA (Y = ±1.22 m, ±2.55 m · 0.85 kg · Safir Optik Arayıcı)'],
          [{ tr: 'Önleyici Güdüm & Çeviklik', en: 'Interceptor Guidance & Agility' }, '3B Gerçek Oransal Seyrüsefer (N = 4.6) · 52 m/s (187 km/sa) · 14.3 G Yanal İvme · SALVO Modu'],
          [{ tr: 'Dış İstasyonlar (M1–M2)', en: 'Outboard Stations (M1–M2)' }, '2× MAM-L Sınıfı Yarı-Aktif Lazer Güdümlü Mühimmat (Y = ±4.35 m · 22.0 kg · 937 mm)'],
          [{ tr: 'Mühimmat Terminal Vuruş', en: 'Munition Terminal Guidance' }, 'STANAG 1688 SALH Arayıcı · 3B PN (N = 5.0) · 95 m/s (342 km/sa) · 22.4 G · Otomatik SEAD'],
        ],
      },
      ew: {
        title: { tr: 'Elektronik Harp (EH)', en: 'Electronic Warfare (EW)' },
        rows: [
          [{ tr: 'Karın DRFM Taarruz Podu', en: 'Ventral DRFM Jammer Pod' }, 'Çift Yönlü Yüksek-Bant DRFM Aktif Radar Köreltici (SAM_LOCK -> JAMMED Bastırma)'],
          [{ tr: 'Kanat Ucu RWR / ESM', en: 'Wingtip RWR / ESM Pods' }, '360° Radar İkaz Alıcıları (Y = ±5.44 m) + 3× Karın ELINT Yön Bulucu İnterferometre Anteni'],
          [{ tr: 'ALE-47 Karşı-Tedbir Sistemi', en: 'ALE-47 Countermeasures' }, '30× Chaff + 30× Kızılötesi 3B Flare Kaseti (Manuel veya SAM Kilidinde Otomatik Atım)'],
          [{ tr: 'Emniyet Kilitleri (Master Arm)', en: 'Ordnance Safety Interlocks' }, 'Donanımsal Çift-Kademeli Master Arm + ≥ 18.0 m AGL İrtifa Emniyet Kilidi'],
        ],
      },
    },
  },
};

export const BLUEPRINTS = [
  {
    id: 'fc400',
    partNumber: 'KST-FC-400-REV-C',
    sheet: 'ISO A3 · THIRD ANGLE · 1:1',
    img: withBase('/blueprints/fc400_blueprint.png'),
    pdf: withBase('/blueprints/fc400_blueprint.pdf?download=1'),
    viewPdf: withBase('/blueprints/fc400_blueprint.pdf'),
    glbKey: 'fc400',
    title: {
      tr: 'FC-400 Üçlü Yedekli Uçuş Kontrol & AI Görev Bilgisayarı',
      en: 'FC-400 Triple-Redundant Flight Control & AI Mission Core',
    },
    material: 'ISOLA FR408HR 10-LAYER ENIG / AL 7075-T6 CNC',
    desc: {
      tr: '148 × 96 mm (kenar SMA konnektörlerle 157 mm zarf) 10-katmanlı kart üzerinde çift lockstep STM32H753 uçuş işlemcisi, kanatçıklı CNC soğutuculu NVIDIA Orin NX 16GB SOM, elastomer yalıtımlı üçlü IMU kubbesi ve çift DroneCAN / 1000BASE-T1 arayüzü.',
      en: '148 × 96 mm (157 mm envelope w/ edge SMA jacks) 10-layer assembly housing dual lockstep STM32H753 flight MCUs, CNC-finned NVIDIA Orin NX 16GB SOM heatsink, elastomer-isolated triple-IMU Faraday dome, and dual DroneCAN / 1000BASE-T1 ports.',
    },
  },
  {
    id: 'qlock',
    partNumber: 'KST-QL-060-REV-B',
    sheet: 'ISO A3 · THIRD ANGLE · REV B',
    img: withBase('/blueprints/qlock_blueprint.png'),
    pdf: withBase('/blueprints/qlock_blueprint.pdf?download=1'),
    viewPdf: withBase('/blueprints/qlock_blueprint.pdf'),
    glbKey: 'qlock',
    title: {
      tr: 'Q-Lock MP-60 Modüler Karbon Spar & Akıllı Pilon Kaplini',
      en: 'Q-Lock MP-60 Modular Wing-Spar & Smart Pylon Coupler',
    },
    material: 'TI-6AL-4V ELI (AMS 4928) · 5-AXIS CNC',
    desc: {
      tr: 'Ortak 11.0 m kanadın 8 dakikadan kısa sürede tarım boomu, AI lazer podu veya MIL-STD-1760 mühimmat pilonuna dönüşmesini sağlayan Ø12 mm H7 kam-kilitli ve 60A kör-eşleşmeli yapısal titanyum kaplin.',
      en: '5-axis machined titanium structural coupler with Ø12 mm H7 cam-lock pin and 60A blind-mate data/fluid pass-through enabling <8-minute conversion across survey, agricultural, and tactical wing stores.',
    },
  },
  {
    id: 'a2rad',
    partNumber: 'KST-A2-RAD-01',
    sheet: 'ISO A3 · THIRD ANGLE · RADOME ASSY',
    img: withBase('/blueprints/a2_radar_blueprint.png'),
    pdf: withBase('/blueprints/a2_radar_blueprint.pdf?download=1'),
    viewPdf: withBase('/blueprints/a2_radar_blueprint.pdf'),
    glbKey: 'a2',
    title: {
      tr: 'Konformal X-Band AESA Burun Radomu & Titanyum Pitot Montajı',
      en: 'Conformal X-Band AESA Nose Radome & Titanium Pitot Assembly',
    },
    material: 'QUARTZ CYANATE ESTER DIELECTRIC / TI-6AL-4V',
    desc: {
      tr: 'Gövde burun kesitine sıfır kademe (0.00 mm hava boşluğu) ile oturan düşük kayıplı kuvars-siyanat radom kabuğu, safir IRST yuvası, UV-MAWS pencereleri ve ısıtmalı titanyum Pitot-AOA probu.',
      en: 'Zero-step laminar nose assembly combining a low-loss quartz cyanate ester dielectric shell, dorsal sapphire IRST seat, dual UV-MAWS apertures, and heated Ti-6Al-4V Pitot-AOA boom.',
    },
  },
];

export const PATENTS = [
  {
    filingId: 'KST-ENG-01',
    status: { tr: 'CAD & PROTOTİP', en: 'CAD & PROTOTYPE' },
    division: 'COMMON AIRFRAME',
    title: {
      tr: 'Kör-Eşleşmeli Yapısal, Güç ve Akışkan Geçişli Modüler Kanat Pilon Kaplini (Q-Lock MP-60)',
      en: 'Blind-Mate Structural, High-Current & Fluid Pass-Through Modular Wing Pylon Coupler (Q-Lock MP-60)',
    },
    abstract: {
      tr: 'Tek bir karbon kutu-spar kanat mimarisinin yapısal söküm gerektirmeden yüksek basınçlı sıvı ilaçlama hatları (6 bar), 60A DC güç veri yolu ve MIL-STD-1760 mühimmat bırakma mekanizmaları arasında Ø12 mm H7 tek pimle kilitlenmesini sağlar.',
      en: 'Enables single-pin Ø12 mm H7 structural locking between a common carbon box-spar wing and interchangeable 6-bar liquid spray manifolds, 60A DC power buses, or MIL-STD-1760 ordnance racks without airframe re-rigging.',
    },
  },
  {
    filingId: 'KST-ENG-02',
    status: { tr: 'CAD & SDF DOĞRULANDI', en: 'CAD & SDF VERIFIED' },
    division: 'S1 / B2 / A2 NOSE',
    title: {
      tr: 'Sınır Tabaka Ayrılmasını Önleyen Konformal Burun LiDAR / mmWave / AESA Radom Arayüzü',
      en: 'Laminar-Preserving Conformal Nose Bulkhead for Swap-Ready LiDAR, mmWave & AESA Radomes',
    },
    abstract: {
      tr: 'X = +2.340 m burun çerçevesinde harici dikme veya aerodinamik sürüklenme yaratan çıkıntılar olmaksızın katı-hal LiDAR, tarımsal gece projektörü veya X-Band AESA radar modüllerini gövde konturuna teğet birleştirir.',
      en: 'Tangentially mates solid-state 3D LiDAR, nocturnal floodlights, or X-Band AESA radar assemblies at station X = +2.340 m with zero parasitic strut drag or laminar boundary-layer separation.',
    },
  },
  {
    filingId: 'KST-ENG-03',
    status: { tr: 'HIL DOĞRULANDI (9/9)', en: 'HIL VERIFIED (9/9)' },
    division: 'DIV-02 AGRO (B2)',
    title: {
      tr: 'Gerçek Zamanlı Rüzgar-Sürüklenme Kompanzasyonlu Döner Atomizer ve Eş-Eksenli Optik Lazer Ablasyon Sistemi',
      en: 'Wind-Compensated Variable-RPM Rotary Atomizer Paired with Co-Mounted Optical Phytopathology Laser',
    },
    abstract: {
      tr: 'Yan rüzgar ve bağıl nem telemetrisine göre atomizer devrini (2.500–14.000 RPM) milisaniyeler içinde modüle ederek damlacık VMD çapını 105–380 µm bandında tutar; dirençli yabancı otları ise 320 W darbeli lazerle kimyasalsız imha eder.',
      en: 'Modulates rotary atomizer speed (2,500–14,000 RPM) dynamically from crosswind and RH telemetry to hold 105–380 µm VMD while neutralizing herbicide-resistant weeds via 320 W pulsed optical turrets.',
    },
  },
  {
    filingId: 'KST-ENG-04',
    status: { tr: 'HIL DOĞRULANDI (8/8)', en: 'HIL VERIFIED (8/8)' },
    division: 'DIV-03 DEFENSE (A2)',
    title: {
      tr: 'Kanat Altı Çoklu Önleyici Mikro-İHA Salvo Bırakma ve Kooperatif 3B Oransal Seyrüsefer Güdümü',
      en: 'Underwing Multi-Interceptor Ripple Release & Cooperative 3D True Proportional Navigation',
    },
    abstract: {
      tr: 'Ana SİHA X-Band AESA radarı ile önleyici burun optik arayıcılarını birleştirerek 4 adet yüksek hızlı (52 m/s, 14.3 G) önleyici İHA’nın çoklu hava hedeflerine çakışmasız görev paylaşımıyla kilitlenmesini sağlar.',
      en: 'Fuses mothership X-Band AESA track files with onboard optical seekers across 4 air-launched 52 m/s (14.3 G) interceptors for deconflicted multi-target aerial engagement.',
    },
  },
  {
    filingId: 'KST-ENG-05',
    status: { tr: 'ÇİFT-MOTOR DOĞRULANDI', en: 'DUAL-SOLVER VERIFIED' },
    division: 'AVIONICS & TWIN',
    title: {
      tr: 'Çift-Çözücülü (Gazebo DART + Isaac PhysX/RTX) Deterministik Uçuş Kontrol Doğrulama Köprüsü',
      en: 'Dual-Solver Deterministic HIL Parity Bridge Across Gazebo Harmonic & NVIDIA Isaac Sim RTX',
    },
    abstract: {
      tr: 'Aynı uçuş kontrol yazılımının hem açık kaynaklı DART/Ogre2 hem de GPU hızlandırmalı PhysX/RTX ışın izleme ortamlarında özdeş aktüatör, sensör ve aerodinamik katsayılarla çapraz doğrulanmasını sağlar.',
      en: 'Cross-validates identical flight-control binaries against both DART/Ogre2 and GPU-raytraced PhysX/RTX physics engines with unified aerodynamic and sensor noise models.',
    },
  },
  {
    filingId: 'KST-ENG-06',
    status: { tr: 'HIL DOĞRULANDI', en: 'HIL VERIFIED' },
    division: 'DIV-02 AGRO (B2)',
    title: {
      tr: 'Hava Termal CWSI Haritalamasından LoRaWAN Merkez-Pivot Sulama Vanalarına Kapalı-Çevrim Otonom Tetikleme',
      en: 'Closed-Loop Aerial LWIR CWSI Crop-Stress Mapping to Autonomous LoRaWAN Center-Pivot Actuation',
    },
    abstract: {
      tr: 'Uçuş esnasında ölçülen yaprak-hava sıcaklık farkından (CWSI) parsel bazlı su stresini hesaplayarak yerdeki 74 m merkez-pivot sulama sistemini insan müdahalesi olmadan devreye alır.',
      en: 'Computes parcel-level Crop Water Stress Index in flight from stabilized LWIR imagery to trigger ground LoRaWAN center-pivot and drip valves autonomously.',
    },
  },
];

export const MANUFACTURING_STEPS = [
  {
    step: '01',
    code: 'CFRP-LAYUP',
    metric: '135°C · 6.0 bar',
    title: { tr: 'Otoklav Karbon-Prepreg Serim & Kürleme', en: 'Autoclave Carbon-Prepreg Layup & Cure' },
    desc: {
      tr: '11.006 mm yekpare ana kanat kabuğu ve gövde yarımları, CNC işlenmiş Invar/epoksi dişi kalıplarda 3K twill prepreg serilerek vakum altında 6.0 bar otoklav çevriminde kürlenir.',
      en: '11,006 mm monolithic wing skins and fuselage halves are laid up in female tooling with aerospace 3K twill prepreg and cured at 135°C / 6.0 bar autoclave pressure.',
    },
  },
  {
    step: '02',
    code: 'CNC-5AX',
    metric: '±0.015 mm ISO 2768-f',
    title: { tr: '5-Eksen CNC Ti-6Al-4V & 7075-T6 Yapısal İşleme', en: '5-Axis CNC Ti-6Al-4V & 7075-T6 Machining' },
    desc: {
      tr: 'Q-Lock MP-60 pilon kaplinleri, iniş takımı aksları, gimbal sönümleyici yatakları ve FC-400 EMI/soğutucu blokları havacılık sınıfı titanyum ve alüminyum kütüklerden işlenir.',
      en: 'Q-Lock MP-60 pylon couplers, landing gear axles, gimbal isolation mounts, and FC-400 EMI heatsink housings are 5-axis milled from billet Ti-6Al-4V and 7075-T6.',
    },
  },
  {
    step: '03',
    code: 'SMT-IPC3',
    metric: 'IPC-A-610 SINIF 3',
    title: { tr: 'FC-400 Otomatik SMT Dizgi & Konformal Kaplama', en: 'FC-400 Class-3 SMT Assembly & Conformal Coat' },
    desc: {
      tr: '10-katmanlı Isola FR408HR kartlar çift X-Ray BGA denetiminden geçirilir, IPC-CC-830B neme/ilaca dayanıklı kaplama uygulanır ve -40°C..+85°C termal şok testine tabi tutulur.',
      en: '10-layer FR408HR avionics boards undergo 3D X-ray BGA inspection, IPC-CC-830B agro-chemical/moisture conformal coating, and -40°C..+85°C thermal cycling.',
    },
  },
  {
    step: '04',
    code: 'HIL-CERT',
    metric: '17 / 17 OTONOM TEST',
    title: { tr: 'Ultrasonik NDT & Çift-Motorlu HIL Uçuş Kabulü', en: 'Ultrasonic NDT & Dual-Engine HIL Acceptance' },
    desc: {
      tr: 'Teslimat öncesi her hava aracı ultrasonik spar muayenesinden (AMS 2631), 6-yüzey aktüatör yük tezgahından ve Gazebo + Isaac Sim RTX kapalı-çevrim görev regresyonundan geçer.',
      en: 'Every serial airframe passes AMS 2631 ultrasonic spar inspection, 6-surface actuator load-rig calibration, and automated Gazebo + Isaac RTX closed-loop mission regression.',
    },
  },
];
