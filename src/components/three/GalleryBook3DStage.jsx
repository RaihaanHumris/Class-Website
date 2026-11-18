import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  LayoutGrid,
  RotateCcw,
  Maximize2,
} from 'lucide-react';
import { detectSoftwareWebGL } from './threeUtils';
import {
  createWoodTableTexture,
  createLeatherCoverTexture,
  createPageEdgeTexture,
  createContactShadowTexture,
  createCurvedPageGeometry,
  createBrassCornerMesh,
  createPushpinGroup,
  createWoodenPenGroup,
  createDeskCorkMemoGroup,
  renderAlbumPageSide,
  pageUvToLocalPosition,
} from './bookAlbum3D';

// Pre-allocated math helpers outside render loop (zero GC)
const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();

const CAMERA_PRESETS = {
  desk: {
    pos: [0.2, 6.1, 5.75],
    target: [0.2, 0.25, 0.05],
  },
  reading: {
    pos: [-0.25, 6.95, 0.11],
    target: [-0.25, 0.32, 0.05],
  },
};

function getResponsiveDeskPos(width, height) {
  const aspect = Math.max(0.45, (width || 960) / (height || 580));
  if (aspect >= 1.15) return CAMERA_PRESETS.desk.pos;
  // Pull camera back on portrait mobile viewports so the entire open 3D book fits cleanly
  const scaleFactor = Math.min(1.55, Math.max(1.0, 1.12 / Math.max(0.62, aspect)));
  return [0.0, 6.1 * scaleFactor, 5.75 * scaleFactor];
}

export default function GalleryBook3DStage({ photos = [], onSelectPhoto }) {
  const mountRef = useRef(null);
  const onSelectRef = useRef(onSelectPhoto);
  onSelectRef.current = onSelectPhoto;

  const [currentSpread, setCurrentSpread] = useState(0);
  const [viewMode, setViewMode] = useState('book'); // 'book' | 'grid'
  const [hoveredHint, setHoveredHint] = useState(null); // { type: 'photo' | 'next' | 'prev', photo?: object }
  const [zoomedPhoto, setZoomedPhoto] = useState(null);
  const [isOverhead, setIsOverhead] = useState(false);
  const zoomedPhotoRef = useRef(null);
  zoomedPhotoRef.current = zoomedPhoto;
  const isOverheadRef = useRef(false);
  isOverheadRef.current = isOverhead;
  const [contextLost, setContextLost] = useState(false);

  const bookApiRef = useRef(null);
  const albumPhotos = useMemo(() => (photos.length > 0 ? photos : []), [photos]);

  // Bagi foto menjadi spread (masing-masing 4 foto: 2 halaman kiri + 2 halaman kanan)
  const spreads = useMemo(() => {
    if (albumPhotos.length === 0) return [];
    const result = [];
    for (let i = 0; i < albumPhotos.length; i += 4) {
      const chunk = albumPhotos.slice(i, i + 4);
      result.push({
        left: chunk.slice(0, 2),
        right: chunk.slice(2, 4),
      });
    }
    return result;
  }, [albumPhotos]);

  const totalSpreads = Math.max(1, spreads.length);

  useEffect(() => {
    setCurrentSpread(0);
  }, [albumPhotos]);

  useEffect(() => {
    if (viewMode !== 'book') return undefined;
    const container = mountRef.current;
    if (!container || spreads.length === 0) return undefined;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 960;
    const height = container.clientHeight || 580;

    // 1. Scene dengan atmosfer ruang kerja kayu hangat
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a120d);
    scene.fog = new THREE.FogExp2(0x1a120d, 0.032);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(...getResponsiveDeskPos(width, height));

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // 2. Environment map & 3-Point Studio Lighting (Warm Key + Cool/Warm Hemi + Rim)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0xffe9cc, 0x2b190e, 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 1.48);
    keyLight.position.set(4.5, 9.5, 5.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -8.5;
    keyLight.shadow.camera.right = 8.5;
    keyLight.shadow.camera.top = 7.5;
    keyLight.shadow.camera.bottom = -7.5;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x90e0ef, 0.58);
    rimLight.position.set(-7, 4.5, -6);
    scene.add(rimLight);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 3. MEJA KAYU (permukaan atas berada tepat di y = 0)
    const tableGroup = new THREE.Group();
    scene.add(tableGroup);

    const woodTex = createWoodTableTexture(maxAnisotropy);
    const woodMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.58,
      metalness: 0.04,
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x3b2212,
      roughness: 0.65,
      metalness: 0.05,
    });

    // Daun meja utama (top surface strictly at y = 0)
    const tableTopGeo = new THREE.BoxGeometry(18.5, 0.38, 12.2);
    const tableTopMesh = new THREE.Mesh(tableTopGeo, woodMat);
    tableTopMesh.position.set(0, -0.19, 0);
    tableTopMesh.receiveShadow = true;
    tableGroup.add(tableTopMesh);

    // Lis bevel pinggiran meja kayu
    const apronGeo = new THREE.BoxGeometry(17.9, 0.28, 11.6);
    const apronMesh = new THREE.Mesh(apronGeo, darkWoodMat);
    apronMesh.position.set(0, -0.52, 0);
    tableGroup.add(apronMesh);

    // 4 Kaki meja kayu kokoh di bawah
    const legGeo = new THREE.BoxGeometry(0.55, 3.6, 0.55);
    [
      [-8.1, -2.35, -5.0],
      [8.1, -2.35, -5.0],
      [-8.1, -2.35, 5.0],
      [8.1, -2.35, 5.0],
    ].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, darkWoodMat);
      leg.position.set(lx, ly, lz);
      tableGroup.add(leg);
    });

    // Tekstur bayangan kontak agar buku & properti membumi kuat di atas meja kayu
    const contactShadowTex = createContactShadowTexture();
    const bookShadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8.5, 5.8),
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.58,
      })
    );
    bookShadowPlane.rotation.x = -Math.PI / 2;
    bookShadowPlane.position.set(0, 0.004, 0.06);
    scene.add(bookShadowPlane);

    // 4. BUKU ALBUM KULIT TERBUKA DI ATAS MEJA KAYU (Referensi 1 + Referensi 2)
    const bookGroup = new THREE.Group();
    bookGroup.position.set(-0.25, 0, 0.05);
    scene.add(bookGroup);

    const leatherTex = createLeatherCoverTexture(maxAnisotropy);
    const leatherMat = new THREE.MeshStandardMaterial({
      map: leatherTex,
      roughness: 0.62,
      metalness: 0.08,
    });
    const spineLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x5c361c,
      roughness: 0.55,
      metalness: 0.1,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xe6b84c,
      roughness: 0.22,
      metalness: 0.92,
    });
    const pageEdgeTex = createPageEdgeTexture(maxAnisotropy);
    const pageEdgeMat = new THREE.MeshStandardMaterial({
      map: pageEdgeTex,
      roughness: 0.85,
      metalness: 0.02,
    });

    const coverW = 3.55;
    const coverH = 4.68;
    const coverThick = 0.095;

    // Sampul kulit kiri
    const leftCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverW, coverThick, coverH),
      leatherMat
    );
    leftCover.position.set(-coverW / 2 - 0.12, coverThick / 2 + 0.015, 0);
    leftCover.rotation.z = -0.014;
    leftCover.castShadow = true;
    leftCover.receiveShadow = true;
    leftCover.layers.enable(1);
    bookGroup.add(leftCover);

    // Sampul kulit kanan
    const rightCover = new THREE.Mesh(
      new THREE.BoxGeometry(coverW, coverThick, coverH),
      leatherMat
    );
    rightCover.position.set(coverW / 2 + 0.12, coverThick / 2 + 0.015, 0);
    rightCover.rotation.z = 0.014;
    rightCover.castShadow = true;
    rightCover.receiveShadow = true;
    rightCover.layers.enable(1);
    bookGroup.add(rightCover);

    // Tulang buku bulat (spine bulge di tengah bawah seperti Referensi 1)
    const spineGeo = new THREE.CylinderGeometry(0.22, 0.22, coverH + 0.06, 20);
    spineGeo.rotateX(Math.PI / 2);
    const spineMesh = new THREE.Mesh(spineGeo, spineLeatherMat);
    spineMesh.position.set(0, 0.12, 0);
    spineMesh.scale.set(1.1, 0.55, 1);
    spineMesh.castShadow = true;
    spineMesh.receiveShadow = true;
    bookGroup.add(spineMesh);

    // Cincin dekorasi emas di ujung atas & bawah tulang buku
    [-coverH / 2 + 0.16, coverH / 2 - 0.16].forEach((sz) => {
      const bandGeo = new THREE.CylinderGeometry(0.225, 0.225, 0.07, 20);
      bandGeo.rotateX(Math.PI / 2);
      const band = new THREE.Mesh(bandGeo, brassMat);
      band.position.set(0, 0.125, sz);
      band.scale.set(1.12, 0.56, 1);
      bookGroup.add(band);
    });

    // 4 Pelindung sudut kuningan di keempat sudut luar sampul kulit (Referensi 1)
    const outerX = coverW + 0.14;
    const outerZ = coverH / 2 + 0.02;
    const cornerConfigs = [
      { x: -outerX, z: -outerZ, ry: -Math.PI / 2 }, // Kiri-Atas
      { x: outerX, z: -outerZ, ry: Math.PI },       // Kanan-Atas
      { x: outerX, z: outerZ, ry: Math.PI / 2 },    // Kanan-Bawah
      { x: -outerX, z: outerZ, ry: 0 },             // Kiri-Bawah
    ];
    cornerConfigs.forEach(({ x, z, ry }) => {
      const corner = createBrassCornerMesh(brassMat);
      corner.position.set(x, 0.015, z);
      corner.rotation.y = ry;
      bookGroup.add(corner);
    });

    // Tumpukan tebal blok kertas halaman kiri & kanan
    const pageW = 3.24;
    const pageH = 4.36;
    const stackH = 0.23;

    const leftStack = new THREE.Mesh(
      new THREE.BoxGeometry(pageW, stackH, pageH),
      pageEdgeMat
    );
    leftStack.position.set(-pageW / 2 - 0.04, 0.095 + stackH / 2, 0);
    leftStack.castShadow = true;
    leftStack.receiveShadow = true;
    bookGroup.add(leftStack);

    const rightStack = new THREE.Mesh(
      new THREE.BoxGeometry(pageW, stackH, pageH),
      pageEdgeMat
    );
    rightStack.position.set(pageW / 2 + 0.04, 0.095 + stackH / 2, 0);
    rightStack.castShadow = true;
    rightStack.receiveShadow = true;
    bookGroup.add(rightStack);

    // Permukaan halaman melengkung kiri & kanan (matte paper agar tinta & garis sangat jelas)
    const leftPageGeo = createCurvedPageGeometry(pageW, pageH, 'left', 28, 8);
    const leftPageMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.96,
      metalness: 0.0,
      envMapIntensity: 0.3,
    });
    const leftPageMesh = new THREE.Mesh(leftPageGeo, leftPageMat);
    leftPageMesh.position.set(-0.02, 0.328, 0);
    leftPageMesh.receiveShadow = true;
    leftPageMesh.layers.enable(1);
    bookGroup.add(leftPageMesh);

    const rightPageGeo = createCurvedPageGeometry(pageW, pageH, 'right', 28, 8);
    const rightPageMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.96,
      metalness: 0.0,
      envMapIntensity: 0.3,
    });
    const rightPageMesh = new THREE.Mesh(rightPageGeo, rightPageMat);
    rightPageMesh.position.set(0.02, 0.328, 0);
    rightPageMesh.receiveShadow = true;
    rightPageMesh.layers.enable(1);
    bookGroup.add(rightPageMesh);

    // Grup pushpin 3D warna-warni di atas halaman buku
    const pagePinsGroup = new THREE.Group();
    pagePinsGroup.position.set(0, 0.328, 0);
    bookGroup.add(pagePinsGroup);

    // Lembar halaman animasi balik halaman 3D (turning sheet)
    const turningSheetPivot = new THREE.Group();
    turningSheetPivot.position.set(0, 0.338, 0);
    turningSheetPivot.visible = false;
    bookGroup.add(turningSheetPivot);

    const turningSheetGeo = createCurvedPageGeometry(pageW, pageH, 'right', 24, 6);
    const turningSheetMat = new THREE.MeshStandardMaterial({
      color: 0xf4ecda,
      roughness: 0.82,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    const turningSheetMesh = new THREE.Mesh(turningSheetGeo, turningSheetMat);
    turningSheetMesh.castShadow = true;
    turningSheetPivot.add(turningSheetMesh);

    // 5. PROPERTI MEJA KAYU (Papan gabus memo + Polaroid + Pushpin dari Referensi 2, dan Pena Kayu)
    const loadedImages = new Map();
    const deskMemo = createDeskCorkMemoGroup(albumPhotos, loadedImages, maxAnisotropy);
    deskMemo.group.position.set(5.15, 0, 0.38);
    deskMemo.group.rotation.y = -0.18;
    scene.add(deskMemo.group);

    const memoShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 4.0),
      new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.45,
      })
    );
    memoShadow.rotation.x = -Math.PI / 2;
    memoShadow.rotation.z = -0.18;
    memoShadow.position.set(5.15, 0.004, 0.38);
    scene.add(memoShadow);

    const woodenPen = createWoodenPenGroup();
    woodenPen.position.set(-4.85, 0, 1.35);
    woodenPen.rotation.y = 0.46;
    scene.add(woodenPen);

    // 6. State & Caching Gambar Asli + Render Spread
    let activeSpreadIdx = 0;
    let currentHitSlots = { left: [], right: [] };
    let pendingZoomPhotoId = null;

    const rebuildPagePins = (leftAnchors, rightAnchors) => {
      while (pagePinsGroup.children.length > 0) {
        const child = pagePinsGroup.children[0];
        pagePinsGroup.remove(child);
        child.traverse((obj) => {
          if (obj.isMesh) {
            obj.geometry?.dispose();
            obj.material?.dispose();
          }
        });
      }

      const addPinsForSide = (anchors, side, xOffset) => {
        anchors.forEach(({ u, v, colorHex }) => {
          const pin = createPushpinGroup(colorHex);
          const pos = pageUvToLocalPosition(u, v, side, pageW, pageH);
          pin.position.set(pos.x + xOffset, pos.y - 0.02, pos.z);
          pin.scale.setScalar(0.85);
          pagePinsGroup.add(pin);
        });
      };

      addPinsForSide(leftAnchors, 'left', -0.02);
      addPinsForSide(rightAnchors, 'right', 0.02);
    };

    const findSlotByPhotoId = (photoId) => {
      for (const side of ['left', 'right']) {
        const match = (currentHitSlots[side] || []).find((s) => s.photo?.id === photoId);
        if (match) return { side, slot: match };
      }
      return null;
    };

    const renderSpreadTextures = (spreadIdx, updatePins = true) => {
      const spread = spreads[spreadIdx] || { left: [], right: [] };
      const leftPageNum = spreadIdx * 2 + 1;
      const rightPageNum = spreadIdx * 2 + 2;
      const totalPages = spreads.length * 2;

      const leftRes = renderAlbumPageSide({
        side: 'left',
        pagePhotos: spread.left,
        pageNumber: leftPageNum,
        totalPages,
        loadedImages,
        maxAnisotropy,
      });
      if (leftPageMesh.material.map) leftPageMesh.material.map.dispose();
      leftPageMesh.material.map = leftRes.texture;
      leftPageMesh.material.needsUpdate = true;

      const rightRes = renderAlbumPageSide({
        side: 'right',
        pagePhotos: spread.right,
        pageNumber: rightPageNum,
        totalPages,
        loadedImages,
        maxAnisotropy,
      });
      if (rightPageMesh.material.map) rightPageMesh.material.map.dispose();
      rightPageMesh.material.map = rightRes.texture;
      rightPageMesh.material.needsUpdate = true;

      currentHitSlots = {
        left: leftRes.hitSlots,
        right: rightRes.hitSlots,
      };

      if (updatePins) {
        rebuildPagePins(leftRes.pinAnchors, rightRes.pinAnchors);
      }

      if (pendingZoomPhotoId !== null) {
        const target = findSlotByPhotoId(pendingZoomPhotoId);
        if (target) {
          pendingZoomPhotoId = null;
          zoomToSlot(target.slot, target.side);
        }
      }

      requestRender();
    };

    // Muat semua gambar foto secara asynchronous & refresh tekstur saat siap
    let disposed = false;
    albumPhotos.forEach((p) => {
      if (!p?.src || loadedImages.has(p.src)) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (disposed) return;
        loadedImages.set(p.src, img);
        renderSpreadTextures(activeSpreadIdx, false);
        deskMemo.refreshOverlay();
        requestRender();
      };
      img.src = p.src;
    });

    // 7. OrbitControls & On-Demand Render Loop (Software WebGL Paced)
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 1.4;
    controls.maxDistance = 16.0;
    controls.minPolarAngle = 0.005;
    controls.maxPolarAngle = Math.PI * 0.45;
    controls.target.set(...CAMERA_PRESETS.desk.target);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;

    // Camera transition state
    let camTransitioning = false;
    _camTargetPos.set(...getResponsiveDeskPos(width, height));
    _camTargetLook.set(...CAMERA_PRESETS.desk.target);

    // Page flip state
    let flipState = {
      active: false,
      dir: 1,
      progress: 0,
      targetSpread: 0,
      swapped: false,
    };

    const clock = new THREE.Clock();

    controls.addEventListener('start', () => {
      camTransitioning = false;
    });
    controls.addEventListener('change', () => {
      requestRender();
    });

    function afterDraw(cb) {
      const gl = renderer.getContext();
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const delta = Math.min(clock.getDelta(), 0.08);
        let needsFollowUp = false;

        // Smooth camera preset damping
        if (camTransitioning) {
          camera.position.x = THREE.MathUtils.damp(camera.position.x, _camTargetPos.x, 6.5, delta);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _camTargetPos.y, 6.5, delta);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _camTargetPos.z, 6.5, delta);

          controls.target.x = THREE.MathUtils.damp(controls.target.x, _camTargetLook.x, 6.5, delta);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, _camTargetLook.y, 6.5, delta);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, _camTargetLook.z, 6.5, delta);

          const distPos = camera.position.distanceTo(_camTargetPos);
          const distLook = controls.target.distanceTo(_camTargetLook);
          if (distPos < 0.015 && distLook < 0.015) {
            camera.position.copy(_camTargetPos);
            controls.target.copy(_camTargetLook);
            camTransitioning = false;
          } else {
            needsFollowUp = true;
          }
        }

        // Smooth 3D page flip animation
        if (flipState.active) {
          if (prefersReducedMotion) {
            flipState.progress = 1;
          } else {
            flipState.progress = Math.min(1, flipState.progress + delta * 1.65);
          }

          const eased = 0.5 - 0.5 * Math.cos(flipState.progress * Math.PI);
          const angle = flipState.dir > 0 ? eased * Math.PI : (1 - eased) * Math.PI;
          turningSheetPivot.visible = true;
          turningSheetPivot.rotation.z = angle;
          turningSheetMesh.scale.y = Math.cos(angle);
          turningSheetPivot.position.y = 0.345 + Math.sin(eased * Math.PI) * 0.08;

          // Kecilkan pushpins sejenak di tengah balik halaman agar tidak berpotongan
          const pinScale = Math.abs(eased - 0.5) * 2;
          pagePinsGroup.scale.y = Math.max(0.15, pinScale);

          if (!flipState.swapped && flipState.progress >= 0.5) {
            flipState.swapped = true;
            activeSpreadIdx = flipState.targetSpread;
            renderSpreadTextures(activeSpreadIdx, true);
          }

          if (flipState.progress >= 1) {
            flipState.active = false;
            turningSheetPivot.visible = false;
            pagePinsGroup.scale.y = 1;
          } else {
            needsFollowUp = true;
          }
        }

        const dampingChanged = controls.update();
        if (dampingChanged && controls.enableDamping) {
          needsFollowUp = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsFollowUp) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    // 8. Raycasting: klik sisi kanan/kiri buku untuk balik halaman, klik foto untuk zoom dari atas
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverTime = 0;

    function zoomOverheadTo(wx, wy, wz, distanceY) {
      _camTargetLook.set(wx, wy, wz);
      _camTargetPos.set(wx, wy + distanceY, wz + 0.06);
      setIsOverhead(true);
      if (prefersReducedMotion) {
        camera.position.copy(_camTargetPos);
        controls.target.copy(_camTargetLook);
        controls.update();
        requestRender();
        return;
      }
      camTransitioning = true;
      clock.getDelta();
      requestRender();
    }

    function goOverheadBook() {
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 580;
      const aspect = Math.max(0.55, w / h);
      const tanHalfFov = Math.tan((42 * Math.PI) / 360);
      const distV = (5.05 / 2) / tanHalfFov;
      const distH = (7.75 / 2) / (tanHalfFov * aspect);
      const overheadDist = Math.min(13.8, Math.max(distV, distH));
      setZoomedPhoto(null);
      zoomOverheadTo(bookGroup.position.x, 0.32, bookGroup.position.z, overheadDist);
    }

    function zoomToSlot(slot, side) {
      const localPt = pageUvToLocalPosition(slot.focusU, slot.focusV, side, pageW, pageH);
      const wx = bookGroup.position.x + localPt.x + (side === 'left' ? -0.02 : 0.02);
      const wy = bookGroup.position.y + 0.328 + localPt.y;
      const wz = bookGroup.position.z + localPt.z;
      const aspect = (container.clientWidth || 960) / (container.clientHeight || 580);
      const zoomDist = Math.max(2.25, Math.min(3.8, 2.75 / Math.max(Math.min(aspect, 1.35), 0.72)));
      setZoomedPhoto(slot.photo);
      zoomOverheadTo(wx, wy, wz, zoomDist);
    }

    function applyPreset(presetKey) {
      if (presetKey === 'reading') {
        goOverheadBook();
        return;
      }
      const preset = CAMERA_PRESETS[presetKey];
      if (!preset) return;
      if (presetKey === 'desk') {
        setZoomedPhoto(null);
        setIsOverhead(false);
        const w = container.clientWidth || 960;
        const h = container.clientHeight || 580;
        _camTargetPos.set(...getResponsiveDeskPos(w, h));
        _camTargetLook.set(...preset.target);
      } else {
        _camTargetPos.set(...preset.pos);
        _camTargetLook.set(...preset.target);
      }
      if (prefersReducedMotion) {
        camera.position.copy(_camTargetPos);
        controls.target.copy(_camTargetLook);
        controls.update();
        requestRender();
        return;
      }
      camTransitioning = true;
      clock.getDelta();
      requestRender();
    }

    function turnPage(dir, keepZoomPending = false, explicitTargetSpread = null) {
      if (spreads.length <= 1) {
        if (!keepZoomPending) goOverheadBook();
        return;
      }
      const baseSpread = flipState.active ? flipState.targetSpread : activeSpreadIdx;
      const nextSpread = explicitTargetSpread !== null
        ? explicitTargetSpread
        : (baseSpread + dir + spreads.length) % spreads.length;
      setCurrentSpread(nextSpread);

      if (!keepZoomPending) {
        pendingZoomPhotoId = null;
        goOverheadBook();
      }

      if (prefersReducedMotion || isSoftwareGl) {
        activeSpreadIdx = nextSpread;
        renderSpreadTextures(activeSpreadIdx, true);
        return;
      }

      flipState = {
        active: true,
        dir,
        progress: 0,
        targetSpread: nextSpread,
        swapped: false,
      };
      clock.getDelta();
      requestRender();
    }

    function stepPhoto(dir) {
      const total = albumPhotos.length;
      if (total === 0) return;

      const currentSpreadRef = flipState.active ? flipState.targetSpread : activeSpreadIdx;
      let targetIdx;
      if (zoomedPhotoRef.current) {
        const curIdx = albumPhotos.findIndex((p) => p.id === zoomedPhotoRef.current.id);
        const baseIdx = curIdx !== -1 ? curIdx : currentSpreadRef * 4;
        targetIdx = (baseIdx + dir + total) % total;
      } else {
        const spreadStart = currentSpreadRef * 4;
        const spreadEnd = Math.min(total - 1, spreadStart + 3);
        targetIdx = dir > 0 ? spreadStart : spreadEnd;
      }

      const targetPhoto = albumPhotos[targetIdx];
      if (!targetPhoto) return;
      const targetSpread = Math.floor(targetIdx / 4);

      if (!flipState.active && targetSpread === activeSpreadIdx) {
        const found = findSlotByPhotoId(targetPhoto.id);
        if (found) {
          zoomToSlot(found.slot, found.side);
        }
        return;
      }

      // Berpindah ke halaman sebelah lalu otomatis zoom ke foto target
      pendingZoomPhotoId = targetPhoto.id;
      goOverheadBook();
      setZoomedPhoto(targetPhoto);
      const flipDir = dir > 0 ? 1 : -1;
      turnPage(flipDir, true, targetSpread);
    }

    // Render spread awal setelah helper zoom siap
    renderSpreadTextures(0, true);

    const findBookHitAtPointer = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(
        [leftPageMesh, rightPageMesh, leftCover, rightCover],
        false
      );
      if (intersects.length === 0) return null;

      const hit = intersects[0];
      const isRight = hit.object === rightPageMesh || hit.object === rightCover;
      const side = isRight ? 'right' : 'left';
      const isPageSurface = hit.object === leftPageMesh || hit.object === rightPageMesh;

      if (isPageSurface && hit.uv) {
        const slots = currentHitSlots[side] || [];
        for (let i = 0; i < slots.length; i++) {
          const s = slots[i];
          if (
            hit.uv.x >= s.uMin &&
            hit.uv.x <= s.uMax &&
            hit.uv.y >= s.vMin &&
            hit.uv.y <= s.vMax
          ) {
            return { side, slot: s };
          }
        }
      }
      return { side, slot: null };
    };

    const onPointerDown = (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return; // Sedang menggeser orbit kamera

      const hit = findBookHitAtPointer(e.clientX, e.clientY);
      if (!hit) {
        // Klik meja di luar buku saat sedang tampak atas / zoom -> kembali ke sudut meja awal
        if (isOverheadRef.current || zoomedPhotoRef.current) {
          applyPreset('desk');
        }
        return;
      }

      if (hit.slot) {
        // Jika foto yang sama diklik lagi saat sudah di-zoom -> buka Lightbox layar penuh
        if (zoomedPhotoRef.current?.id === hit.slot.photo.id) {
          if (onSelectRef.current) onSelectRef.current(hit.slot.photo);
          return;
        }
        // Klik foto -> langsung zoom in dari atas ke foto + kartu catatannya
        zoomToSlot(hit.slot, hit.side);
        return;
      }

      // Klik buku -> kamera langsung tepat di atas buku; jika sudah di atas atau klik kanan/kiri, balik halaman
      if (!isOverheadRef.current) {
        goOverheadBook();
      } else if (hit.side === 'right') {
        turnPage(1, false);
      } else {
        turnPage(-1, false);
      }
    };

    const onPointerMove = (e) => {
      const now = performance.now();
      if (now - lastHoverTime < 50) return;
      lastHoverTime = now;

      const hit = findBookHitAtPointer(e.clientX, e.clientY);
      if (!hit) {
        canvas.style.cursor = 'grab';
        setHoveredHint((prev) => (prev === null ? prev : null));
        return;
      }

      if (hit.slot) {
        canvas.style.cursor = 'zoom-in';
        const nextHint = { type: 'photo', photo: hit.slot.photo };
        setHoveredHint((prev) =>
          prev?.type === 'photo' && prev?.photo?.id === nextHint.photo.id ? prev : nextHint
        );
      } else if (hit.side === 'right') {
        canvas.style.cursor = 'pointer';
        setHoveredHint((prev) => (prev?.type === 'next' ? prev : { type: 'next' }));
      } else {
        canvas.style.cursor = 'pointer';
        setHoveredHint((prev) => (prev?.type === 'prev' ? prev : { type: 'prev' }));
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);

    const onContextLost = (e) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
      requestRender();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    // Expose imperative API untuk tombol Sebelumnya / Selanjutnya & Kembali
    bookApiRef.current = {
      stepPhoto: (dir) => stepPhoto(dir),
      resetDesk: () => applyPreset('desk'),
    };

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();

      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => {
              m.map?.dispose();
              m.dispose();
            });
          } else if (obj.material) {
            obj.material.map?.dispose();
            obj.material.dispose();
          }
        }
      });
      envTexture.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [viewMode, spreads, albumPhotos]);

  const activeSpreadData = spreads[currentSpread] || { left: [], right: [] };
  const spreadPhotos = [...activeSpreadData.left, ...activeSpreadData.right];
  const zoomedPhotoIdx = zoomedPhoto
    ? albumPhotos.findIndex((p) => p.id === zoomedPhoto.id)
    : -1;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200">
        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode('book')}
            className={`min-h-[42px] px-3 sm:px-4 py-2 rounded-xl sm:rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'book'
                ? 'bg-[#03045E] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Album 3D</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`min-h-[42px] px-3 sm:px-4 py-2 rounded-xl sm:rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'grid'
                ? 'bg-[#03045E] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span>Grid Lengkap</span>
          </button>
        </div>

        {viewMode === 'book' && (
          <div className="flex items-center justify-between sm:justify-end gap-2 text-[11px] sm:text-xs text-slate-600 px-1 sm:px-0">
            <span className="font-mono tabular-nums font-semibold text-[#03045E] shrink-0">
              Lembar {currentSpread + 1} / {totalSpreads}
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="truncate">Ketuk buku untuk balik halaman · Ketuk foto untuk zoom</span>
          </div>
        )}
      </div>

      {/* 3D Book Stage — Ergonomic Mobile & Desktop Overlays */}
      {viewMode === 'book' ? (
        <div className="relative w-full h-[460px] sm:h-[640px] rounded-2xl overflow-hidden bg-[#1a120d] border border-amber-900/30 shadow-2xl">
          <div ref={mountRef} className="w-full h-full" />

          {contextLost && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a120d] text-amber-100 text-sm">
              Memulihkan tampilan 3D Album Kenangan...
            </div>
          )}

          {/* Top Bar Minimal: Info Foto + Tombol Layar Penuh / Kembali */}
          <div className="absolute top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-3 z-10 flex items-start justify-between gap-2 pointer-events-none">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-auto max-w-full">
              <div className="bg-[#18100b]/92 backdrop-blur-sm border border-amber-500/25 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 max-w-[calc(100vw-48px)] sm:max-w-sm">
                <p className="text-[10px] sm:text-[11px] font-mono text-amber-300 truncate">
                  {zoomedPhoto
                    ? `Foto ${zoomedPhotoIdx + 1} / ${albumPhotos.length} · Ketuk lagi untuk Layar Penuh`
                    : hoveredHint?.type === 'photo'
                    ? 'Ketuk foto untuk zoom dari atas'
                    : isOverhead
                    ? 'Ketuk kanan/kiri: balik · Ketuk foto: zoom'
                    : 'Ketuk buku: lihat atas · Ketuk foto: zoom'}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white truncate mt-0.5">
                  {zoomedPhoto
                    ? zoomedPhoto.judul
                    : hoveredHint?.photo
                    ? hoveredHint.photo.judul
                    : spreadPhotos[0]?.judul || 'Kenangan XII PPLG 3'}
                </p>
              </div>

              {(isOverhead || zoomedPhoto) && (
                <div className="flex items-center gap-1.5">
                  {zoomedPhoto && (
                    <button
                      type="button"
                      onClick={() => onSelectPhoto && onSelectPhoto(zoomedPhoto)}
                      className="min-h-[36px] sm:min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#18100b] text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-lg"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => bookApiRef.current?.resetDesk()}
                    className="min-h-[36px] sm:min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#18100b]/95 border border-amber-500/30 hover:bg-black text-amber-100 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-lg"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Meja</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Otomatis ke Foto Sebelumnya / Selanjutnya (Bottom Thumb Zone di Mobile, Top Right di Desktop) */}
          {albumPhotos.length > 1 && (
            <div className="absolute bottom-2.5 inset-x-2.5 sm:inset-x-auto sm:bottom-auto sm:top-3 sm:right-3 z-10 pointer-events-auto flex items-center justify-between sm:justify-start gap-1.5 bg-[#18100b]/94 backdrop-blur-sm border border-amber-500/25 rounded-xl p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => bookApiRef.current?.stepPhoto(-1)}
                className="min-h-[38px] sm:min-h-[36px] px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
              <span className="px-2 font-mono text-xs font-semibold text-amber-100 tabular-nums whitespace-nowrap">
                {zoomedPhotoIdx !== -1 ? `${zoomedPhotoIdx + 1} / ${albumPhotos.length}` : `${albumPhotos.length} Foto`}
              </span>
              <button
                type="button"
                onClick={() => bookApiRef.current?.stepPhoto(1)}
                className="min-h-[38px] sm:min-h-[36px] px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Grid Album Lengkap */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albumPhotos.map((foto, idx) => (
            <article
              key={foto.id || idx}
              onClick={() => onSelectPhoto && onSelectPhoto(foto)}
              className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden cursor-pointer hover:border-[#0077B6]/50 transition-all flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <img
                  src={foto.thumb}
                  alt={foto.judul}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-[#0077B6]">{foto.kategori}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px]">{foto.tanggal}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#03045E] line-clamp-1 group-hover:text-[#0077B6]">
                    {foto.judul}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {foto.deskripsi}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
