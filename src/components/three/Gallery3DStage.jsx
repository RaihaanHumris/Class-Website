import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  RotateCcw,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { buildPolaroidGroup, detectSoftwareWebGL } from './threeUtils';

export default function Gallery3DStage({ photos = [], onSelectPhoto }) {
  const mountRef = useRef(null);
  const onSelectRef = useRef(onSelectPhoto);
  onSelectRef.current = onSelectPhoto;

  const [autoSpin, setAutoSpin] = useState(true);
  const autoSpinRef = useRef(true);
  autoSpinRef.current = autoSpin;

  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [hoveredTitle, setHoveredTitle] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const controlsApiRef = useRef(null);

  const showcasePhotos = photos.slice(0, 16);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || showcasePhotos.length === 0) return undefined;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 960;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x061230);
    scene.fog = new THREE.FogExp2(0x061230, 0.036);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 2.6, 13.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Environment reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0x90e0ef, 0x050e29, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4de, 2.2);
    keyLight.position.set(6, 9, 7);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00b4d8, 1.3);
    rimLight.position.set(-7, 2, -6);
    scene.add(rimLight);

    // Exhibition Stage Floor Ring & Contact Grounding
    const floorGeo = new THREE.CylinderGeometry(8.6, 9.0, 0.18, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0b1942,
      roughness: 0.65,
      metalness: 0.25,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -2.15;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const goldRingGeo = new THREE.TorusGeometry(6.4, 0.035, 16, 96);
    goldRingGeo.rotateX(Math.PI / 2);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.92,
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.position.y = -2.02;
    scene.add(goldRing);

    // Centerpiece Yearbook Pedestal Emblem
    const pedestalGeo = new THREE.CylinderGeometry(1.15, 1.45, 0.9, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f275c,
      roughness: 0.35,
      metalness: 0.6,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.6;
    scene.add(pedestal);

    const crystalGeo = new THREE.OctahedronGeometry(0.68, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0x0077b6,
      emissiveIntensity: 0.35,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = -0.35;
    scene.add(crystal);

    // Circular Gallery Ring of Composite 3D Polaroid Frames
    const ringContainer = new THREE.Group();
    const radius = Math.max(5.6, Math.min(7.8, showcasePhotos.length * 0.56));
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const clickableObjects = [];
    const frameGroups = [];

    showcasePhotos.forEach((photo, idx) => {
      const angle = (idx / showcasePhotos.length) * Math.PI * 2;
      const group = buildPolaroidGroup(photo, maxAnisotropy, 1);
      group.position.set(Math.sin(angle) * radius, 0.2, Math.cos(angle) * radius);
      group.lookAt(Math.sin(angle) * (radius + 10), 0.2, Math.cos(angle) * (radius + 10));
      group.userData = { photoIndex: idx, photo, baseY: 0.2 };
      ringContainer.add(group);
      frameGroups.push(group);

      group.traverse((child) => {
        if (child.isMesh && child.layers.mask & 2) {
          child.userData.photoIndex = idx;
          child.userData.photo = photo;
          clickableObjects.push(child);
        }
      });
    });
    scene.add(ringContainer);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 6.5;
    controls.maxDistance = 19;
    controls.minPolarAngle = Math.PI * 0.22;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.target.set(0, 0.1, 0);

    let targetRingRotation = 0;
    let currentRingRotation = 0;

    controlsApiRef.current = {
      resetCamera: () => {
        camera.position.set(0, 2.6, 13.5);
        controls.target.set(0, 0.1, 0);
        controls.update();
      },
      focusStep: (dir) => {
        setAutoSpin(false);
        autoSpinRef.current = false;
        const stepAngle = (Math.PI * 2) / showcasePhotos.length;
        targetRingRotation += dir * stepAngle;
        setActiveIndex((prev) => (prev - dir + showcasePhotos.length) % showcasePhotos.length);
      },
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycaster on Layer 1
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    const updatePointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Was dragging orbit controls
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableObjects, false);
      if (hits.length > 0) {
        const hitPhoto = hits[0].object.userData.photo;
        if (hitPhoto && onSelectRef.current) {
          onSelectRef.current(hitPhoto);
        }
      }
    };

    const onPointerMove = (e) => {
      const now = performance.now();
      if (now - lastHoverCheck < 50) return;
      lastHoverCheck = now;

      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableObjects, false);
      if (hits.length > 0) {
        canvas.style.cursor = 'pointer';
        setHoveredTitle(hits[0].object.userData.photo?.judul || '');
      } else {
        canvas.style.cursor = 'grab';
        setHoveredTitle('');
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

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

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        if (autoSpinRef.current) {
          targetRingRotation += delta * 0.14;
        }
        currentRingRotation = THREE.MathUtils.damp(
          currentRingRotation,
          targetRingRotation,
          5.5,
          delta
        );
        ringContainer.rotation.y = currentRingRotation;

        crystal.rotation.y = elapsed * 0.45;
        crystal.position.y = -0.35 + Math.sin(elapsed * 1.3) * 0.08;

        for (let i = 0; i < frameGroups.length; i++) {
          const g = frameGroups[i];
          g.position.y = g.userData.baseY + Math.sin(elapsed * 1.1 + i * 0.7) * 0.09;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      controls.dispose();

      scene.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => {
              if (m.map) m.map.dispose();
              m.dispose();
            });
          } else if (obj.material) {
            if (obj.material.map) obj.material.map.dispose();
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
  }, [showcasePhotos.length]);

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] rounded-2xl overflow-hidden bg-[#061230] border border-[#0077B6]/30 shadow-xl select-none">
      {/* Isolated WebGL Mount Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Minimal Top-Left Title Badge (No backdrop-filter over WebGL) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none bg-[#050e29]/90 border border-white/15 rounded-xl px-4 py-2.5 max-w-xs">
        <p className="text-[11px] font-mono text-[#90E0EF] tracking-wide">
          Panggung Kenangan 3D · {showcasePhotos.length} Bingkai
        </p>
        <p className="text-sm font-semibold text-white truncate mt-0.5">
          {hoveredTitle || 'Seret untuk memutar · Klik foto untuk memperbesar'}
        </p>
      </div>

      {/* Collapsible Bottom Control Dock (Zero Viewport Occlusion, No backdrop-filter) */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center transition-transform duration-200"
        style={{
          transform: dockCollapsed ? 'translate(-50%, calc(100% - 34px))' : 'translate(-50%, 0)',
          maxWidth: 'min(92vw, 680px)',
        }}
      >
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="px-3.5 py-1.5 rounded-t-xl bg-[#050e29]/95 border border-b-0 border-white/15 text-[11px] font-semibold text-[#CAF0F8] hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Tampilkan Kontrol</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Sembunyikan Kontrol</span>
            </>
          )}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#050e29]/95 border border-white/15 shadow-2xl">
          <button
            type="button"
            onClick={() => controlsApiRef.current?.focusStep(-1)}
            className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoSpin((s) => !s)}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              autoSpin
                ? 'bg-[#0077B6] text-white'
                : 'bg-white/10 hover:bg-white/20 text-[#CAF0F8]'
            }`}
          >
            {autoSpin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoSpin ? 'Jeda Putaran' : 'Putar Otomatis'}</span>
          </button>

          <button
            type="button"
            onClick={() => controlsApiRef.current?.focusStep(1)}
            className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => controlsApiRef.current?.resetCamera()}
            className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#90E0EF] text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Reset posisi kamera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <span className="text-[11px] font-mono text-white/60 px-2 tabular-nums">
            {activeIndex + 1}/{showcasePhotos.length}
          </span>
        </div>
      </div>
    </div>
  );
}
