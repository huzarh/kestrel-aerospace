import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const SITE_ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');

const MODEL_CATALOG = {
  s1: {
    url: `${SITE_ROOT}/models/kestrel_s1.glb`,
    code: 'KST-S1-GEO',
    dims: '11,006 × 5,765 × 2,286 mm',
    labelTr: 'S1 Jeodezi & LiDAR',
    labelEn: 'S1 Survey & LiDAR',
  },
  b2: {
    url: `${SITE_ROOT}/models/kestrel_b2.glb`,
    code: 'KST-B2-AGRO',
    dims: '11,006 × 5,982 × 2,286 mm',
    labelTr: 'B2 Otonom Tarım',
    labelEn: 'B2 Autonomous Ag',
  },
  a2: {
    url: `${SITE_ROOT}/models/kestrel_a2.glb`,
    code: 'KST-A2-UCAV',
    dims: '11,006 × 6,033 × 2,286 mm',
    labelTr: 'A2 Taktik SİHA',
    labelEn: 'A2 Tactical UCAV',
  },
  fc400: {
    url: `${SITE_ROOT}/models/kestrel_fc400_pcb.glb`,
    code: 'KST-FC-400-REV-C',
    dims: '148.0 × 96.0 × 13.0 mm',
    labelTr: 'FC-400 Aviyonik Kart',
    labelEn: 'FC-400 Flight Core',
  },
  qlock: {
    url: `${SITE_ROOT}/models/qlock_wing_coupler.glb`,
    code: 'KST-QL-060-PAT',
    dims: '180.0 × 76.0 × 58.0 mm',
    labelTr: 'Q-Lock Pilon Kaplini',
    labelEn: 'Q-Lock Pylon Coupler',
  },
};

export function mountCadViewer(hostEl, { initialModel = 'a2', allowedModels = ['s1', 'b2', 'a2', 'fc400', 'qlock'], lang = 'tr' } = {}) {
  if (!hostEl) return () => {};
  hostEl.innerHTML = '';

  const t = (tr, en) => (lang === 'en' ? en : tr);

  const shell = document.createElement('div');
  shell.className = 'cad-viewer-shell';

  const toolbar = document.createElement('div');
  toolbar.className = 'cad-toolbar';

  const modelGroup = document.createElement('div');
  modelGroup.className = 'cad-btn-group';

  const modeGroup = document.createElement('div');
  modeGroup.className = 'cad-btn-group';

  toolbar.append(modelGroup, modeGroup);

  const stage = document.createElement('div');
  stage.className = 'cad-stage';

  const overlay = document.createElement('div');
  overlay.className = 'cad-telemetry-overlay';
  const leftReadout = document.createElement('div');
  leftReadout.className = 'cad-dim-pill tnum';
  const rightReadout = document.createElement('div');
  rightReadout.className = 'cad-dim-pill tnum';
  rightReadout.textContent = t('SOL TIK: DÖNDÜR · TEKERLEK: YAKINLAŞTIR', 'DRAG: ORBIT · SCROLL: ZOOM');
  overlay.append(leftReadout, rightReadout);
  stage.appendChild(overlay);

  shell.append(toolbar, stage);
  hostEl.appendChild(shell);

  const isAutomated = typeof navigator !== 'undefined' && Boolean(navigator.webdriver);
  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: isAutomated,
    });
  } catch (_err) {
    leftReadout.textContent = 'WEBGL UNAVAILABLE';
    return () => {};
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.06;
  stage.insertBefore(renderer.domElement, overlay);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0d11);

  // Build procedural aerospace studio softbox IBL so metallic RAM, Ti-6Al-4V & ENIG gold reflect naturally
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x161a22);
  const skyPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    new THREE.MeshBasicMaterial({ color: 0xdce6f5, side: THREE.DoubleSide })
  );
  skyPanel.position.set(0, 10, 0);
  skyPanel.rotation.x = Math.PI / 2;
  envScene.add(skyPanel);
  const warmSide = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff0db, side: THREE.DoubleSide })
  );
  warmSide.position.set(10, 3, 8);
  warmSide.lookAt(0, 0, 0);
  envScene.add(warmSide);
  const coolRim = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 10),
    new THREE.MeshBasicMaterial({ color: 0x6c92c8, side: THREE.DoubleSide })
  );
  coolRim.position.set(-10, 4, -8);
  coolRim.lookAt(0, 0, 0);
  envScene.add(coolRim);
  const envRT = pmrem.fromScene(envScene, 0.04);
  scene.environment = envRT.texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(38, 16 / 10, 0.02, 200);
  camera.position.set(5.2, 2.8, 5.4);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.85;
  controls.maxPolarAngle = Math.PI * 0.62;

  // Precision studio lighting
  const hemi = new THREE.HemisphereLight(0xdce6f5, 0x232936, 1.15);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfff7eb, 1.65);
  keyLight.position.set(7, 11, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x88b4ff, 1.15);
  rimLight.position.set(-8, 5, -7);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0xe4e8f0, 0.75);
  fillLight.position.set(-4, -3, 6);
  scene.add(fillLight);

  const grid = new THREE.GridHelper(14, 28, 0x2f3744, 0x181d25);
  scene.add(grid);

  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  let boxHelper = null;
  let wireframeOn = false;
  let envelopeOn = false;
  let activeKey = initialModel;
  let disposed = false;
  let inView = true;
  let loadToken = 0;

  const loader = new GLTFLoader();

  function applyWireframeState() {
    rootGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          m.wireframe = wireframeOn;
        });
      }
    });
    if (boxHelper) boxHelper.visible = envelopeOn;
  }

  function loadModel(key) {
    const spec = MODEL_CATALOG[key] || MODEL_CATALOG.a2;
    activeKey = key;
    const myToken = ++loadToken;

    Array.from(modelGroup.children).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.model === key);
    });

    leftReadout.textContent = `${spec.code} · ${t('YÜKLENİYOR...', 'LOADING CAD...')}`;

    loader.load(
      spec.url,
      (gltf) => {
        if (disposed || myToken !== loadToken) return;

        while (rootGroup.children.length) {
          rootGroup.remove(rootGroup.children[0]);
        }
        if (boxHelper) {
          scene.remove(boxHelper);
          boxHelper = null;
        }

        const model = gltf.scene;
        let triCount = 0;
        model.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.geometry) {
              const idx = obj.geometry.index;
              const pos = obj.geometry.attributes.position;
              triCount += idx ? Math.round(idx.count / 3) : (pos ? Math.round(pos.count / 3) : 0);
            }
            if (!obj.material) {
              obj.material = new THREE.MeshStandardMaterial({
                color: 0x7b838e,
                metalness: 0.65,
                roughness: 0.30,
              });
            }
          }
        });

        // Normalize scale & center cleanly above studio floor grid
        const rawBox = new THREE.Box3().setFromObject(model);
        const size = rawBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 1e-4);
        const isComponent = key === 'fc400' || key === 'qlock';
        const targetSpan = isComponent ? 5.2 : 7.0;
        const scale = targetSpan / maxDim;
        model.scale.setScalar(scale);

        const scaledBox = new THREE.Box3().setFromObject(model);
        const center = scaledBox.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= scaledBox.min.y - 0.02;

        rootGroup.add(model);

        const finalBox = new THREE.Box3().setFromObject(rootGroup);
        boxHelper = new THREE.Box3Helper(finalBox, 0xdff140);
        boxHelper.visible = envelopeOn;
        scene.add(boxHelper);

        const fCenter = finalBox.getCenter(new THREE.Vector3());
        controls.target.copy(fCenter);
        if (key === 'fc400') {
          camera.position.set(fCenter.x + 3.4, fCenter.y + 3.3, fCenter.z + 3.8);
        } else if (key === 'qlock') {
          camera.position.set(fCenter.x + 4.0, fCenter.y + 2.8, fCenter.z + 4.2);
        } else {
          camera.position.set(fCenter.x + 5.1, fCenter.y + 2.35, fCenter.z + 5.2);
        }
        controls.update();

        applyWireframeState();
        renderer.render(scene, camera);
        leftReadout.textContent = `${spec.code} │ ${spec.dims} │ ${triCount.toLocaleString('en-US')} TRIS`;
      },
      undefined,
      () => {
        if (!disposed && myToken === loadToken) {
          leftReadout.textContent = `${spec.code} │ ${spec.dims}`;
        }
      }
    );
  }

  allowedModels.forEach((mKey) => {
    const spec = MODEL_CATALOG[mKey];
    if (!spec) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cad-chip';
    btn.dataset.model = mKey;
    btn.textContent = lang === 'en' ? spec.labelEn : spec.labelTr;
    btn.addEventListener('click', () => loadModel(mKey));
    modelGroup.appendChild(btn);
  });

  const wireBtn = document.createElement('button');
  wireBtn.type = 'button';
  wireBtn.className = 'cad-chip';
  wireBtn.textContent = t('TEL KAFES', 'WIREFRAME');
  wireBtn.addEventListener('click', () => {
    wireframeOn = !wireframeOn;
    wireBtn.classList.toggle('active', wireframeOn);
    applyWireframeState();
    renderer.render(scene, camera);
  });

  const envBtn = document.createElement('button');
  envBtn.type = 'button';
  envBtn.className = 'cad-chip';
  envBtn.textContent = t('ZARF KUTUSU', 'ENVELOPE');
  envBtn.addEventListener('click', () => {
    envelopeOn = !envelopeOn;
    envBtn.classList.toggle('active', envelopeOn);
    applyWireframeState();
    renderer.render(scene, camera);
  });

  if (isAutomated) {
    controls.autoRotate = false;
  }

  const spinBtn = document.createElement('button');
  spinBtn.type = 'button';
  spinBtn.className = `cad-chip${controls.autoRotate ? ' active' : ''}`;
  spinBtn.textContent = t('OTO-DÖNÜŞ', 'AUTO-ORBIT');
  spinBtn.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    spinBtn.classList.toggle('active', controls.autoRotate);
    if (controls.autoRotate && !rafId) tick();
  });

  modeGroup.append(wireBtn, envBtn, spinBtn);

  function resize() {
    if (disposed) return;
    const w = Math.max(280, stage.clientWidth);
    const h = Math.max(320, stage.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    renderer.render(scene, camera);
  }

  controls.addEventListener('change', () => {
    if (!disposed && !rafId) renderer.render(scene, camera);
  });

  const ro = new ResizeObserver(resize);
  ro.observe(stage);

  let rafId = 0;
  function tick() {
    if (disposed || !inView || (isAutomated && !controls.autoRotate)) {
      rafId = 0;
      return;
    }
    rafId = requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
  }

  const io = new IntersectionObserver(
    (entries) => {
      const nowInView = entries.some((e) => e.isIntersecting);
      if (nowInView && !inView && !disposed && !rafId) {
        inView = true;
        if (!isAutomated || controls.autoRotate) tick();
        else renderer.render(scene, camera);
      } else {
        inView = nowInView;
      }
    },
    { threshold: 0.05 }
  );
  io.observe(stage);

  resize();
  loadModel(activeKey);
  if (!isAutomated) tick();

  return () => {
    disposed = true;
    if (rafId) cancelAnimationFrame(rafId);
    ro.disconnect();
    io.disconnect();
    controls.dispose();
    envRT.dispose();
    renderer.dispose();
    if (typeof renderer.forceContextLoss === 'function') {
      renderer.forceContextLoss();
    }
  };
}
