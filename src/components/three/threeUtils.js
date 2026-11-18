import * as THREE from 'three';

/**
 * Deteksi software WebGL (SwiftShader, llvmpipe, dll.) dari renderer string GPU
 * agar biaya rendering (pixelRatio, shadows, frame pacing) disesuaikan secara aman.
 */
export function detectSoftwareWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

/**
 * Membuat Geometri Bingkai Polaroid Bevel (ExtrudeGeometry)
 */
export function createBeveledFrameGeometry(width, height, depth = 0.06, radius = 0.08) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.018,
    bevelThickness: 0.018,
  });
  geo.center();
  return geo;
}

/**
 * Membuat tekstur kanvas Polaroid prosedural (dengan fallback elegan sebelum gambar selesai dimuat)
 */
export function createPolaroidCardTexture(photo, imgEl = null, maxAnisotropy = 4) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Latar kertas arsip hangat
  ctx.fillStyle = '#FAF8F3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bingkai halus kertas
  ctx.strokeStyle = '#E5DFD3';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  const pad = 28;
  const imgW = canvas.width - pad * 2;
  const imgH = 420;

  if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
    // Crop cover center
    const srcRatio = imgEl.naturalWidth / imgEl.naturalHeight;
    const dstRatio = imgW / imgH;
    let sx = 0;
    let sy = 0;
    let sw = imgEl.naturalWidth;
    let sh = imgEl.naturalHeight;

    if (srcRatio > dstRatio) {
      sw = imgEl.naturalHeight * dstRatio;
      sx = (imgEl.naturalWidth - sw) / 2;
    } else {
      sh = imgEl.naturalWidth / dstRatio;
      sy = (imgEl.naturalHeight - sh) / 2;
    }
    ctx.drawImage(imgEl, sx, sy, sw, sh, pad, pad, imgW, imgH);
  } else {
    // Gradien placeholder elegan bernuansa samudra
    const grad = ctx.createLinearGradient(pad, pad, pad + imgW, pad + imgH);
    grad.addColorStop(0, '#03045E');
    grad.addColorStop(0.55, '#0077B6');
    grad.addColorStop(1, '#00B4D8');
    ctx.fillStyle = grad;
    ctx.fillRect(pad, pad, imgW, imgH);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('XII PPLG 3 · MAKN ENDE', canvas.width / 2, pad + imgH / 2);
  }

  // Garis tipis bawah foto
  ctx.strokeStyle = 'rgba(3,4,94,0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(pad, pad, imgW, imgH);

  // Teks judul & tanggal di area bawah Polaroid
  ctx.fillStyle = '#03045E';
  ctx.font = '700 23px Georgia, serif';
  ctx.textAlign = 'left';
  const rawTitle = photo?.judul || 'Kenangan XII PPLG 3';
  const title = rawTitle.length > 32 ? rawTitle.slice(0, 30) + '…' : rawTitle;
  ctx.fillText(title, pad, pad + imgH + 54);

  ctx.fillStyle = '#64748B';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  const meta = `${photo?.kategori || 'Kenangan'}  ·  ${photo?.tanggal || '2025/2026'}`;
  ctx.fillText(meta, pad, pad + imgH + 92);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Buat komposit 3D Polaroid Frame Group (4 bagian: backing archival, matte inner, photo face, gold corner pin)
 */
export function buildPolaroidGroup(photo, maxAnisotropy = 4, layer = 0) {
  const group = new THREE.Group();

  // 1. Primary silhouette: Archival paper backing with beveled edges
  const backingGeo = createBeveledFrameGeometry(2.2, 2.58, 0.06, 0.06);
  const backingMat = new THREE.MeshStandardMaterial({
    color: 0xf7f3ea,
    roughness: 0.72,
    metalness: 0.04,
  });
  const backingMesh = new THREE.Mesh(backingGeo, backingMat);
  backingMesh.castShadow = true;
  backingMesh.receiveShadow = true;
  group.add(backingMesh);

  // 2. Secondary detail: Dark navy backplate trim
  const trimGeo = new THREE.BoxGeometry(2.08, 2.46, 0.02);
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x0b1f4d,
    roughness: 0.42,
    metalness: 0.25,
  });
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  trimMesh.position.z = -0.045;
  group.add(trimMesh);

  // 3. Photo face plane (with procedural Polaroid CanvasTexture)
  const cardTexture = createPolaroidCardTexture(photo, null, maxAnisotropy);
  const faceGeo = new THREE.PlaneGeometry(2.06, 2.42);
  const faceMat = new THREE.MeshStandardMaterial({
    map: cardTexture,
    roughness: 0.38,
    metalness: 0.05,
  });
  const faceMesh = new THREE.Mesh(faceGeo, faceMat);
  faceMesh.position.z = 0.052;
  faceMesh.userData = { photo, isClickableFrame: true };
  if (layer > 0) {
    faceMesh.layers.set(layer);
    backingMesh.layers.set(layer);
  }
  group.add(faceMesh);

  // 4. Accent detail: Brushed gold memory clip pin at top-center
  const pinGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.07, 16);
  pinGeo.rotateX(Math.PI / 2);
  const pinMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.18,
    metalness: 0.92,
  });
  const pinMesh = new THREE.Mesh(pinGeo, pinMat);
  pinMesh.position.set(0, 1.19, 0.06);
  group.add(pinMesh);

  // Muat foto asli secara asynchronous lalu perbarui tekstur Polaroid
  if (photo?.src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const updatedTex = createPolaroidCardTexture(photo, img, maxAnisotropy);
      if (faceMesh.material) {
        const oldMap = faceMesh.material.map;
        faceMesh.material.map = updatedTex;
        faceMesh.material.needsUpdate = true;
        if (oldMap) oldMap.dispose();
      } else {
        updatedTex.dispose();
      }
    };
    img.src = photo.src;
  }

  return group;
}
