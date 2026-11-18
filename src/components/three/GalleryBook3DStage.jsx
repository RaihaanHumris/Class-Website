import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  LayoutGrid,
  Box,
  RotateCcw,
} from 'lucide-react';
import { detectSoftwareWebGL, createPolaroidCardTexture } from './threeUtils';

export default function GalleryBook3DStage({ photos = [], onSelectPhoto }) {
  const mountRef = useRef(null);
  const onSelectRef = useRef(onSelectPhoto);
  onSelectRef.current = onSelectPhoto;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [viewMode, setViewMode] = useState('book'); // 'book' | 'grid'
  const bookApiRef = useRef(null);

  const albumPhotos = photos.length > 0 ? photos : [];

  useEffect(() => {
    if (viewMode !== 'book') return undefined;
    const container = mountRef.current;
    if (!container || albumPhotos.length === 0) return undefined;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || 960;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x061230);
    scene.fog = new THREE.FogExp2(0x061230, 0.028);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 8.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Studio lighting & environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0x90e0ef, 0x050e29, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4de, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    // 3D Leather Yearbook Cover & Pages Group
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);

    // Leather Cover Base
    const coverGeo = new THREE.BoxGeometry(7.2, 4.8, 0.22);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x0b1d4a,
      roughness: 0.55,
      metalness: 0.15,
    });
    const coverMesh = new THREE.Mesh(coverGeo, coverMat);
    coverMesh.position.y = -0.15;
    coverMesh.castShadow = true;
    coverMesh.receiveShadow = true;
    bookGroup.add(coverMesh);

    // Gold foil border trim on cover
    const borderGeo = new THREE.BoxGeometry(6.8, 4.4, 0.02);
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.9,
    });
    const borderMesh = new THREE.Mesh(borderGeo, borderMat);
    borderMesh.position.set(0, -0.15, 0.12);
    bookGroup.add(borderMesh);

    // Left Page (Static) & Right Page (Turning / Active)
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const leftPageGeo = new THREE.PlaneGeometry(3.1, 4.2);
    const leftPageMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f3,
      roughness: 0.8,
    });
    const leftPageMesh = new THREE.Mesh(leftPageGeo, leftPageMat);
    leftPageMesh.position.set(-1.65, 0, 0.13);
    bookGroup.add(leftPageMesh);

    const rightPageGeo = new THREE.PlaneGeometry(3.1, 4.2);
    const rightPageMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f3,
      roughness: 0.8,
    });
    const rightPageMesh = new THREE.Mesh(rightPageGeo, rightPageMat);
    rightPageMesh.position.set(1.65, 0, 0.13);
    bookGroup.add(rightPageMesh);

    // Render textures for left and right pages
    let activePageIndex = 0;

    const updateBookPages = (idx) => {
      activePageIndex = idx;
      const leftPhoto = albumPhotos[(idx - 1 + albumPhotos.length) % albumPhotos.length];
      const rightPhoto = albumPhotos[idx];

      // Left page texture
      const leftImg = new Image();
      leftImg.crossOrigin = 'anonymous';
      leftImg.onload = () => {
        const tex = createPolaroidCardTexture(leftPhoto, leftImg, maxAnisotropy);
        if (leftPageMesh.material.map) leftPageMesh.material.map.dispose();
        leftPageMesh.material.map = tex;
        leftPageMesh.material.needsUpdate = true;
      };
      leftImg.src = leftPhoto?.src || '';

      // Right page texture
      const rightImg = new Image();
      rightImg.crossOrigin = 'anonymous';
      rightImg.onload = () => {
        const tex = createPolaroidCardTexture(rightPhoto, rightImg, maxAnisotropy);
        if (rightPageMesh.material.map) rightPageMesh.material.map.dispose();
        rightPageMesh.material.map = tex;
        rightPageMesh.material.needsUpdate = true;
      };
      rightImg.src = rightPhoto?.src || '';
    };

    updateBookPages(0);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 5;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.52;
    controls.target.set(0, 0, 0);

    bookApiRef.current = {
      turnPage: (dir) => {
        setIsFlipping(true);
        const next = (activePageIndex + dir + albumPhotos.length) % albumPhotos.length;
        setCurrentIndex(next);
        updateBookPages(next);
        setTimeout(() => setIsFlipping(false), 350);
      },
    };

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

    function tick() {
      if (disposed) return;
      const elapsed = clock.getElapsedTime();

      // Gentle floating animation of the 3D book
      bookGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;
      bookGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.05;

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
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
  }, [viewMode, albumPhotos]);

  return (
    <div className="space-y-6">
      {/* Mode Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('book')}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              viewMode === 'book'
                ? 'bg-[#03045E] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Animasi Buku 3D</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#03045E] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid Album Lengkap</span>
          </button>
        </div>

        {viewMode === 'book' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => bookApiRef.current?.turnPage(-1)}
              className="min-h-[40px] px-4 py-2 rounded-lg bg-[#03045E] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#0077B6] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
            <span className="font-mono text-xs font-bold text-[#03045E] tabular-nums">
              Halaman {currentIndex + 1} / {albumPhotos.length}
            </span>
            <button
              type="button"
              onClick={() => bookApiRef.current?.turnPage(1)}
              className="min-h-[40px] px-4 py-2 rounded-lg bg-[#03045E] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#0077B6] cursor-pointer"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3D Book Stage */}
      {viewMode === 'book' ? (
        <div className="relative w-full h-[520px] sm:h-[600px] rounded-2xl overflow-hidden bg-[#061230] border border-[#0077B6]/30 shadow-2xl">
          <div ref={mountRef} className="w-full h-full" />
          <div className="absolute top-4 left-4 pointer-events-none bg-[#050e29]/90 border border-white/15 rounded-xl px-4 py-2.5 max-w-sm">
            <p className="text-[11px] font-mono text-[#90E0EF]">Buku Tahunan Interaktif 3D</p>
            <p className="text-sm font-semibold text-white truncate mt-0.5">
              {albumPhotos[currentIndex]?.judul || 'Kenangan XII PPLG 3'}
            </p>
          </div>
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
