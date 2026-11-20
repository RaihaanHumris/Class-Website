import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildPolaroidGroup, detectSoftwareWebGL } from './threeUtils';

// Pre-allocated math helpers outside render loop (zero GC)
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

export default function HeroMemoryCanvas({ photos = [] }) {
  const mountRef = useRef(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isSoftwareGl = detectSoftwareWebGL();
    if (isSoftwareGl) {
      return undefined;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050e29);
    scene.fog = new THREE.FogExp2(0x050e29, 0.042);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 9.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // 3-point warm/cool studio lighting
    const hemiLight = new THREE.HemisphereLight(0x90e0ef, 0x071436, 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00b4d8, 1.4);
    rimLight.position.set(-6, -3, -5);
    scene.add(rimLight);

    // 1. Instanced Golden & Sky-Blue Memory Fireflies
    const particleCount = 90;
    const particleGeo = new THREE.IcosahedronGeometry(0.045, 0);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.4,
      emissive: 0x00b4d8,
      emissiveIntensity: 0.65,
    });
    const particlesMesh = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    particlesMesh.frustumCulled = false;

    const particleSeeds = [];
    for (let i = 0; i < particleCount; i++) {
      const bx = (Math.random() - 0.5) * 20;
      const by = (Math.random() - 0.5) * 10;
      const bz = (Math.random() - 0.5) * 12 - 2;
      const scale = 0.6 + Math.random() * 1.1;
      const speed = 0.35 + Math.random() * 0.6;
      const phase = Math.random() * Math.PI * 2;
      particleSeeds.push({ bx, by, bz, scale, speed, phase });

      _dummy.position.set(bx, by, bz);
      _dummy.scale.setScalar(scale);
      _dummy.updateMatrix();
      particlesMesh.setMatrixAt(i, _dummy.matrix);

      if (i % 3 === 0) {
        _color.setHex(0xfbbf24);
      } else if (i % 3 === 1) {
        _color.setHex(0x38bdf8);
      } else {
        _color.setHex(0xcaf0f8);
      }
      particlesMesh.setColorAt(i, _color);
    }
    particlesMesh.instanceMatrix.needsUpdate = true;
    if (particlesMesh.instanceColor) particlesMesh.instanceColor.needsUpdate = true;
    particlesMesh.computeBoundingSphere();
    scene.add(particlesMesh);

    // 2. Orbital Memory Constellation Rings
    const ringGroup = new THREE.Group();
    const ringGeo1 = new THREE.TorusGeometry(4.4, 0.015, 10, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.25,
      metalness: 0.85,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.42;
    ring1.rotation.y = 0.18;
    ring1.position.set(2.3, -0.2, -1.6);
    ringGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(5.6, 0.012, 10, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI * 0.38;
    ring2.rotation.z = 0.25;
    ring2.position.set(2.3, -0.2, -2.0);
    ringGroup.add(ring2);
    scene.add(ringGroup);

    // 3. Composite 3D Polaroid Memory Frames
    const selectedPhotos = photos.slice(0, 6);
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    const frameEntries = [];
    const framesGroup = new THREE.Group();
    framesGroup.position.set(2.45, 0.05, 0);

    const layoutOffsets = [
      { x: -1.1, y: 1.05, z: 0.9, rx: 0.08, ry: -0.24, rz: 0.06 },
      { x: 1.55, y: 0.85, z: 0.1, rx: -0.05, ry: -0.45, rz: -0.08 },
      { x: 0.25, y: -0.65, z: 1.35, rx: 0.04, ry: -0.18, rz: -0.04 },
      { x: 2.35, y: -1.0, z: -0.8, rx: -0.08, ry: -0.35, rz: 0.09 },
      { x: -2.0, y: -1.15, z: -1.2, rx: 0.07, ry: 0.22, rz: -0.07 },
      { x: 0.7, y: 2.15, z: -1.6, rx: -0.1, ry: -0.15, rz: 0.04 },
    ];

    selectedPhotos.forEach((photo, idx) => {
      const group = buildPolaroidGroup(photo, maxAnisotropy);
      const pos = layoutOffsets[idx % layoutOffsets.length];
      group.position.set(pos.x, pos.y, pos.z);
      group.rotation.set(pos.rx, pos.ry, pos.rz);
      group.scale.setScalar(0.84);
      framesGroup.add(group);
      frameEntries.push({
        group,
        basePos: { ...pos },
        phase: idx * 1.15,
      });
    });
    scene.add(framesGroup);

    // Pointer parallax state
    const targetPointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetPointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetPointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    let frameId = 0;
    let disposed = false;
    let isVisible = true;
    const clock = new THREE.Clock();

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              isVisible = Boolean(entries[0]?.isIntersecting);
            },
            { threshold: 0.05 }
          )
        : null;
    if (observer) observer.observe(container);

    function tick() {
      if (disposed) return;
      if (!isVisible) {
        frameId = window.setTimeout(tick, 250);
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      currentPointer.x = THREE.MathUtils.damp(currentPointer.x, targetPointer.x, 3.5, delta);
      currentPointer.y = THREE.MathUtils.damp(currentPointer.y, targetPointer.y, 3.5, delta);

      camera.position.x = currentPointer.x * 0.55;
      camera.position.y = 0.35 - currentPointer.y * 0.35;
      camera.lookAt(0.7, 0, 0);

      if (!prefersReducedMotion) {
        for (let i = 0; i < frameEntries.length; i++) {
          const item = frameEntries[i];
          const t = elapsed * 0.55 + item.phase;
          item.group.position.y = item.basePos.y + Math.sin(t) * 0.18;
          item.group.rotation.y = item.basePos.ry + Math.sin(t * 0.6) * 0.09 + currentPointer.x * 0.08;
          item.group.rotation.x = item.basePos.rx + Math.cos(t * 0.5) * 0.04;
        }

        ring1.rotation.z = elapsed * 0.06;
        ring2.rotation.y = -elapsed * 0.05;

        for (let i = 0; i < particleSeeds.length; i++) {
          const p = particleSeeds[i];
          const t = elapsed * p.speed + p.phase;
          _dummy.position.set(
            p.bx + Math.sin(t * 0.6) * 0.35,
            p.by + Math.cos(t * 0.8) * 0.35,
            p.bz + Math.sin(t * 0.4) * 0.25
          );
          _dummy.scale.setScalar(p.scale * (0.85 + Math.sin(t * 2) * 0.2));
          _dummy.updateMatrix();
          particlesMesh.setMatrixAt(i, _dummy.matrix);
        }
        particlesMesh.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (prefersReducedMotion) {
        return;
      }

      frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      if (observer) observer.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);

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
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [photos]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050e29]">
      <div ref={mountRef} className="w-full h-full" />
      {contextLost && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#03045E] via-[#071436] to-[#0077B6]" />
      )}
    </div>
  );
}
