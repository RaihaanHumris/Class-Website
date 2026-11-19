import * as THREE from 'three';

/**
 * Menghitung tinggi lengkungan halaman buku terbuka pada koordinat X lokal halaman.
 * side = 'left' (-1) atau 'right' (+1), t in [0..1] dari tulang buku ke tepi luar.
 */
export function getPageArchY(t) {
  // Naik lembut dari lekukan tengah (spine gutter), melengkung di sepertiga awal, lalu landai ke tepi
  return Math.sin(t * Math.PI) * 0.19 + (1 - Math.cos(t * Math.PI * 0.5)) * 0.05;
}

/**
 * Mengubah koordinat UV kanvas halaman (u in [0..1], v in [0..1] dari bawah ke atas)
 * menjadi posisi lokal 3D di atas permukaan halaman yang melengkung.
 */
export function pageUvToLocalPosition(u, v, side, pageW, pageH) {
  const t = side === 'left' ? 1 - u : u;
  const localX = side === 'left' ? -(1 - u) * pageW : u * pageW;
  const localZ = (0.5 - v) * pageH;
  const localY = getPageArchY(t);
  return new THREE.Vector3(localX, localY, localZ);
}

/**
 * Tekstur papan kayu meja prosedural (warm walnut / jati dengan serat & celah papan)
 */
export function createWoodTableTexture(maxAnisotropy = 4) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Warna dasar kayu hangat
  ctx.fillStyle = '#5c3a21';
  ctx.fillRect(0, 0, 1024, 1024);

  const plankCount = 8;
  const plankH = 1024 / plankCount;
  const plankTones = [
    ['#6e472b', '#4d2e18'],
    ['#633e24', '#472a15'],
    ['#754c2e', '#52321b'],
    ['#5e3b22', '#432713'],
    ['#6b4428', '#4b2d17'],
    ['#724a2d', '#503019'],
    ['#613c23', '#452814'],
    ['#6c4529', '#4c2d18'],
  ];

  for (let p = 0; p < plankCount; p++) {
    const y0 = p * plankH;
    const [cTop, cBot] = plankTones[p % plankTones.length];
    const grad = ctx.createLinearGradient(0, y0, 0, y0 + plankH);
    grad.addColorStop(0, cTop);
    grad.addColorStop(0.5, cTop);
    grad.addColorStop(1, cBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, y0, 1024, plankH);

    // Serat kayu halus bergelombang horizontal
    const seed = (p + 1) * 17.3;
    for (let i = 0; i < 65; i++) {
      const baseY = y0 + ((i + 0.5) / 65) * plankH;
      const alpha = 0.05 + ((i * 7) % 10) * 0.012;
      ctx.strokeStyle = i % 3 === 0
        ? `rgba(255, 214, 170, ${alpha * 0.55})`
        : `rgba(32, 16, 6, ${alpha})`;
      ctx.lineWidth = 1 + (i % 3) * 0.6;
      ctx.beginPath();
      for (let x = 0; x <= 1024; x += 32) {
        const wave = Math.sin(x * 0.008 + seed + i * 0.35) * 4.5 +
          Math.cos(x * 0.021 + seed * 0.5) * 1.8;
        const py = Math.max(y0 + 2, Math.min(y0 + plankH - 2, baseY + wave));
        if (x === 0) ctx.moveTo(x, py);
        else ctx.lineTo(x, py);
      }
      ctx.stroke();
    }

    // Simpul kayu kecil (wood knot) di beberapa papan
    if (p % 2 === 1) {
      const kx = 180 + ((p * 237) % 660);
      const ky = y0 + plankH * (0.35 + ((p * 19) % 30) * 0.01);
      const knotGrad = ctx.createRadialGradient(kx, ky, 2, kx, ky, 26);
      knotGrad.addColorStop(0, 'rgba(30, 14, 5, 0.55)');
      knotGrad.addColorStop(0.5, 'rgba(48, 24, 10, 0.28)');
      knotGrad.addColorStop(1, 'rgba(48, 24, 10, 0)');
      ctx.fillStyle = knotGrad;
      ctx.beginPath();
      ctx.ellipse(kx, ky, 26, 12, 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    // Garis celah antar papan kayu + highlight bevel tipis
    ctx.fillStyle = 'rgba(22, 10, 3, 0.72)';
    ctx.fillRect(0, y0, 1024, 2.5);
    ctx.fillStyle = 'rgba(255, 224, 185, 0.08)';
    ctx.fillRect(0, y0 + 2.5, 1024, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.6, 1.4);
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Tekstur sampul kulit cokelat klasik dengan jahitan benang di tepi (Referensi 1)
 */
export function createLeatherCoverTexture(maxAnisotropy = 4) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  // Gradien kulit cokelat hangat
  const grad = ctx.createLinearGradient(0, 0, 512, 640);
  grad.addColorStop(0, '#7c4d2b');
  grad.addColorStop(0.5, '#6b4022');
  grad.addColorStop(1, '#583219');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 640);

  // Tekstur pori-pori kulit halus
  for (let i = 0; i < 3200; i++) {
    const x = (i * 73) % 512;
    const y = (i * 137 + Math.floor(i / 7) * 11) % 640;
    const r = 0.8 + (i % 3) * 0.5;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(35, 17, 6, 0.14)' : 'rgba(255, 214, 170, 0.06)';
    ctx.fillRect(x, y, r, r);
  }

  // Jahitan benang krem di sekeliling tepi sampul (saddle stitching)
  ctx.save();
  ctx.strokeStyle = '#d9b589';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 7]);
  ctx.strokeRect(18, 18, 512 - 36, 640 - 36);
  ctx.restore();

  // Garis embos dalam
  ctx.strokeStyle = 'rgba(34, 16, 6, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 512 - 60, 640 - 60);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Tekstur tepi tumpukan kertas halaman buku (striated page stack edges)
 */
export function createPageEdgeTexture(maxAnisotropy = 4) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ece3d0';
  ctx.fillRect(0, 0, 256, 128);

  for (let y = 0; y < 128; y += 3) {
    ctx.fillStyle = y % 6 === 0 ? 'rgba(130, 108, 78, 0.24)' : 'rgba(255, 252, 244, 0.35)';
    ctx.fillRect(0, y, 256, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Tekstur bayangan kontak radial lembut di atas permukaan meja kayu
 */
export function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 124);
  grad.addColorStop(0, 'rgba(12, 6, 2, 0.72)');
  grad.addColorStop(0.55, 'rgba(18, 9, 4, 0.35)');
  grad.addColorStop(1, 'rgba(18, 9, 4, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Geometri permukaan halaman terbuka yang melengkung natural (seperti buku tebal terbuka).
 * Untuk side='left': x berada di [-pageW, 0], u=1 berada di spine (x=0), u=0 di tepi kiri (-pageW).
 * Untuk side='right': x berada di [0, pageW], u=0 berada di spine (x=0), u=1 di tepi kanan (+pageW).
 */
export function createCurvedPageGeometry(pageW = 3.25, pageH = 4.35, side = 'right', segX = 28, segZ = 8) {
  const geo = new THREE.PlaneGeometry(pageW, pageH, segX, segZ);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;

  for (let i = 0; i < pos.count; i++) {
    const rawX = pos.getX(i); // [-pageW/2, +pageW/2]
    const rawZ = pos.getZ(i); // [-pageH/2, +pageH/2]

    // Geser agar salah satu tepinya tepat menempel di tulang buku (x = 0)
    const shiftedX = side === 'right' ? rawX + pageW / 2 : rawX - pageW / 2;
    const t = Math.abs(shiftedX) / pageW; // 0 di tulang buku, 1 di tepi luar
    const archY = getPageArchY(t);

    pos.setXYZ(i, shiftedX, archY, rawZ);

    // Pastikan UV (u: kiri->kanan, v: bawah->atas) tetap konsisten menghadap kamera atas
    const u = side === 'right' ? t : 1 - t;
    const v = 0.5 - rawZ / pageH;
    uv.setXY(i, u, v);
  }

  pos.needsUpdate = true;
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Geometri pelindung sudut kuningan (brass corner cap) bergaya album foto klasik (Referensi 1)
 */
export function createBrassCornerMesh(brassMat) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.62, 0);
  shape.lineTo(0.62, 0.16);
  shape.lineTo(0.16, 0.16);
  shape.lineTo(0.16, 0.62);
  shape.lineTo(0, 0.62);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, brassMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Komposit 3D Pushpin berwarna (merah, biru, kuning, hijau - Referensi 2)
 */
export function createPushpinGroup(colorHex = 0xdc2626) {
  const group = new THREE.Group();

  // 1. Batang jarum baja di bawah
  const needleGeo = new THREE.CylinderGeometry(0.012, 0.005, 0.075, 10);
  const needleMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    metalness: 0.9,
    roughness: 0.2,
  });
  const needle = new THREE.Mesh(needleGeo, needleMat);
  needle.position.y = 0.032;
  group.add(needle);

  // 2. Kepala pin plastik mengilap berbentuk profil pin klasik (LatheGeometry)
  const profile = [
    new THREE.Vector2(0.0, 0.05),
    new THREE.Vector2(0.072, 0.05),
    new THREE.Vector2(0.076, 0.068),
    new THREE.Vector2(0.042, 0.095),
    new THREE.Vector2(0.045, 0.145),
    new THREE.Vector2(0.064, 0.165),
    new THREE.Vector2(0.056, 0.185),
    new THREE.Vector2(0.0, 0.19),
  ];
  const headGeo = new THREE.LatheGeometry(profile, 20);
  const headMat = new THREE.MeshPhysicalMaterial({
    color: colorHex,
    roughness: 0.22,
    metalness: 0.05,
    clearcoat: 0.85,
    clearcoatRoughness: 0.15,
  });
  const head = new THREE.Mesh(headGeo, headMat);
  head.castShadow = true;
  head.receiveShadow = true;
  group.add(head);

  return group;
}

/**
 * Komposit 3D Pena Kayu & Kuningan Klasik di atas meja kayu (ground pivot y=0)
 */
export function createWoodenPenGroup() {
  const pen = new THREE.Group();

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x3b2110,
    roughness: 0.38,
    metalness: 0.08,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xe6b84c,
    roughness: 0.22,
    metalness: 0.9,
  });

  // Badan pena
  const bodyGeo = new THREE.CylinderGeometry(0.055, 0.048, 2.25, 16);
  bodyGeo.rotateZ(Math.PI / 2);
  const body = new THREE.Mesh(bodyGeo, woodMat);
  body.position.y = 0.055;
  body.castShadow = true;
  pen.add(body);

  // Cincin tengah kuningan
  const ringGeo = new THREE.CylinderGeometry(0.061, 0.061, 0.12, 16);
  ringGeo.rotateZ(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, brassMat);
  ring.position.set(0.15, 0.055, 0);
  ring.castShadow = true;
  pen.add(ring);

  // Ujung kerucut kuningan
  const tipGeo = new THREE.ConeGeometry(0.048, 0.32, 16);
  tipGeo.rotateZ(-Math.PI / 2);
  const tip = new THREE.Mesh(tipGeo, brassMat);
  tip.position.set(1.28, 0.055, 0);
  tip.castShadow = true;
  pen.add(tip);

  // Klip saku kuningan di tutup pena
  const clipGeo = new THREE.BoxGeometry(0.65, 0.025, 0.035);
  const clip = new THREE.Mesh(clipGeo, brassMat);
  clip.position.set(-0.62, 0.115, 0);
  pen.add(clip);

  return pen;
}

/**
 * Helper menggambar teks multi-baris rapi di atas kanvas 2D dan mengembalikan jumlah baris yang terpakai
 */
function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;

  let line = '';
  let lineNum = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      if (lineNum >= maxLines - 1) {
        let truncated = line;
        while (truncated.length > 4 && ctx.measureText(`${truncated}…`).width > maxWidth) {
          truncated = truncated.slice(0, -1);
        }
        ctx.fillText(`${truncated}…`, x, y + lineNum * lineHeight);
        return lineNum + 1;
      }
      ctx.fillText(line, x, y + lineNum * lineHeight);
      line = words[i];
      lineNum++;
    } else {
      line = testLine;
    }
  }
  if (line && lineNum < maxLines) {
    ctx.fillText(line, x, y + lineNum * lineHeight);
    return lineNum + 1;
  }
  return lineNum;
}

/**
 * Menggambar satu slot foto bergaya gabungan:
 * - Foto berbingkai putih dengan sudut foto segitiga cokelat (Referensi 1)
 * - Atau Polaroid miring dengan kartu indeks bergaris (Referensi 2)
 */
function drawScrapbookPhotoSlot(ctx, {
  photo,
  imgEl,
  cx,
  cy,
  w,
  h,
  angle = 0,
  style = 'corners', // 'corners' | 'polaroid'
}) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const scale = w / 580;
  const framePad = Math.round((style === 'polaroid' ? 22 : 20) * scale);
  const bottomPad = Math.round((style === 'polaroid' ? 92 : 20) * scale);
  const totalW = w + framePad * 2;
  const totalH = h + framePad + bottomPad;
  const ox = -totalW / 2;
  const oy = -totalH / 2;

  // Bayangan lembut bingkai di atas kertas halaman
  ctx.save();
  ctx.shadowColor = 'rgba(28, 14, 4, 0.28)';
  ctx.shadowBlur = Math.round(18 * scale);
  ctx.shadowOffsetX = Math.round(5 * scale);
  ctx.shadowOffsetY = Math.round(7 * scale);
  ctx.fillStyle = '#fffdf9';
  ctx.fillRect(ox, oy, totalW, totalH);
  ctx.restore();

  // Garis tepi bingkai jelas
  ctx.strokeStyle = 'rgba(68, 48, 28, 0.42)';
  ctx.lineWidth = Math.max(2, 2.5 * scale);
  ctx.strokeRect(ox, oy, totalW, totalH);

  const px = ox + framePad;
  const py = oy + framePad;

  // Gambar foto asli (cover crop) atau placeholder elegan
  if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
    const srcRatio = imgEl.naturalWidth / imgEl.naturalHeight;
    const dstRatio = w / h;
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
    ctx.drawImage(imgEl, sx, sy, sw, sh, px, py, w, h);
  } else {
    const grad = ctx.createLinearGradient(px, py, px + w, py + h);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#334155');
    ctx.fillStyle = grad;
    ctx.fillRect(px, py, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `700 ${Math.round(22 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Memuat Foto...', px + w / 2, py + h / 2);
  }

  // Bingkai dalam tipis pada foto
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
  ctx.lineWidth = Math.max(1.5, 2.2 * scale);
  ctx.strokeRect(px, py, w, h);

  if (style === 'polaroid') {
    // Judul singkat & tanggal dengan tinta hitam tegas di bawah Polaroid
    ctx.fillStyle = '#000000';
    ctx.font = `800 ${Math.round(28 * scale)}px Georgia, serif`;
    ctx.textAlign = 'left';
    const rawTitle = photo?.judul || 'Kenangan Kelas';
    const shortTitle = rawTitle.length > 24 ? `${rawTitle.slice(0, 22)}…` : rawTitle;
    ctx.fillText(shortTitle, px + 6 * scale, py + h + 42 * scale);

    ctx.fillStyle = '#0f172a';
    ctx.font = `700 ${Math.round(21 * scale)}px "JetBrains Mono", monospace`;
    ctx.fillText(photo?.tanggal || '2024–2027', px + 6 * scale, py + h + 74 * scale);
  }

  // 4 sudut foto segitiga kertas cokelat klasik (Referensi 1)
  if (style === 'corners') {
    const cSize = Math.round(46 * scale);
    const cornerOffsets = [
      { x: ox - 3, y: oy - 3, dx: 1, dy: 1 },
      { x: ox + totalW + 3, y: oy - 3, dx: -1, dy: 1 },
      { x: ox - 3, y: oy + totalH + 3, dx: 1, dy: -1 },
      { x: ox + totalW + 3, y: oy + totalH + 3, dx: -1, dy: -1 },
    ];
    cornerOffsets.forEach(({ x, y, dx, dy }) => {
      ctx.fillStyle = '#9c6b43';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx * cSize, y);
      ctx.lineTo(x, y + dy * cSize);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#5c381c';
      ctx.lineWidth = Math.max(1.5, 2 * scale);
      ctx.stroke();
    });
  }

  ctx.restore();
}

/**
 * Menggambar kartu indeks putih bergaris horizontal gelap (Referensi 2) dengan tinta hitam kontras tinggi
 */
function drawRuledIndexCard(ctx, { photo, cx, cy, w, h, angle = 0 }) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const s = w / 635;
  const ox = -w / 2;
  const oy = -h / 2;

  // Bayangan kertas kartu catatan
  ctx.save();
  ctx.shadowColor = 'rgba(24, 14, 4, 0.28)';
  ctx.shadowBlur = Math.round(16 * s);
  ctx.shadowOffsetX = Math.round(5 * s);
  ctx.shadowOffsetY = Math.round(7 * s);
  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(ox, oy, w, h);
  ctx.restore();

  // Tepi kartu lebih gelap agar batas kertas tegas
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = Math.max(2, 2.8 * s);
  ctx.strokeRect(ox, oy, w, h);

  const padX = 24 * s;
  const headerLineY = oy + 66 * s;
  const lineStep = 44 * s;
  const firstRuleY = oy + 114 * s;

  // Garis merah tegas header kartu indeks (Referensi 2)
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = Math.max(2.5, 3.6 * s);
  ctx.beginPath();
  ctx.moveTo(ox + 12 * s, headerLineY);
  ctx.lineTo(ox + w - 12 * s, headerLineY);
  ctx.stroke();

  // Garis-garis horizontal kertas dibuat lebih gelap (#64748b) agar tegas dan mudah terbaca
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = Math.max(1.6, 2.1 * s);
  for (let ly = firstRuleY; ly < oy + h - 14 * s; ly += lineStep) {
    ctx.beginPath();
    ctx.moveTo(ox + 12 * s, ly);
    ctx.lineTo(ox + w - 12 * s, ly);
    ctx.stroke();
  }

  // Kategori (pojok kiri header) & Tanggal (pojok kanan header) - tinta gelap pekat
  ctx.fillStyle = '#020617';
  ctx.font = `800 ${Math.round(25 * s)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(photo?.kategori || 'Kenangan', ox + padX, oy + 46 * s);

  ctx.fillStyle = '#0f172a';
  ctx.font = `700 ${Math.round(20 * s)}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'right';
  const rawDate = String(photo?.tanggal || 'XII PPLG 3');
  ctx.fillText(rawDate.length > 18 ? rawDate.slice(0, 17) + '…' : rawDate, ox + w - padX, oy + 46 * s);

  // Judul foto sejajar di atas garis horizontal pertama
  ctx.fillStyle = '#000000';
  ctx.font = `800 ${Math.round(31 * s)}px Georgia, serif`;
  ctx.textAlign = 'left';
  const titleLines = wrapCanvasText(
    ctx,
    photo?.judul || 'Momen XII PPLG 3',
    ox + padX,
    firstRuleY - 8 * s,
    w - padX * 2,
    lineStep,
    2
  );

  // Deskripsi di baris-baris berikutnya tepat di atas garis kertas
  const descStartLine = Math.max(1, titleLines);
  const descStartY = firstRuleY + descStartLine * lineStep - 8 * s;
  const maxDescLines = Math.max(2, Math.floor((oy + h - 18 * s - descStartY) / lineStep) + 1);

  ctx.fillStyle = '#090d16';
  ctx.font = `600 ${Math.round(24 * s)}px "Plus Jakarta Sans", sans-serif`;
  wrapCanvasText(
    ctx,
    photo?.deskripsi || 'Jejak kebersamaan keluarga besar XII PPLG 3 MAKN Ende.',
    ox + padX,
    descStartY,
    w - padX * 2,
    lineStep,
    Math.min(5, maxDescLines)
  );

  ctx.restore();
}

/**
 * Merender tekstur kanvas satu sisi halaman buku album (kiri atau kanan)
 * Menggabungkan layout album Referensi 1 (kertas krem, bayangan tulang, foto sudut cokelat)
 * dan Referensi 2 (kartu catatan bergaris gelap + Polaroid miring + posisi pin).
 * Mengembalikan { texture, hitSlots, pinAnchors }
 */
export function renderAlbumPageSide({
  side,
  pagePhotos,
  pageNumber,
  totalPages,
  loadedImages,
  maxAnisotropy = 4,
}) {
  const W = 1600;
  const H = 2125;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Latar kertas arsip krem hangat agar kartu catatan putih & tulisan hitam sangat kontras
  ctx.fillStyle = '#e3d4b7';
  ctx.fillRect(0, 0, W, H);

  // Tekstur serat kertas lembut
  for (let i = 0; i < 2600; i++) {
    const x = (i * 97) % W;
    const y = (i * 193 + Math.floor(i / 5) * 13) % H;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(95, 68, 36, 0.055)' : 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(x, y, 2, 2);
  }

  // Bayangan lipatan tulang buku (gutter shadow)
  if (side === 'left') {
    const gutter = ctx.createLinearGradient(W - 180, 0, W, 0);
    gutter.addColorStop(0, 'rgba(65, 40, 14, 0)');
    gutter.addColorStop(0.7, 'rgba(65, 40, 14, 0.14)');
    gutter.addColorStop(1, 'rgba(36, 20, 6, 0.38)');
    ctx.fillStyle = gutter;
    ctx.fillRect(W - 180, 0, 180, H);
  } else {
    const gutter = ctx.createLinearGradient(0, 0, 180, 0);
    gutter.addColorStop(0, 'rgba(36, 20, 6, 0.38)');
    gutter.addColorStop(0.3, 'rgba(65, 40, 14, 0.14)');
    gutter.addColorStop(1, 'rgba(65, 40, 14, 0)');
    ctx.fillStyle = gutter;
    ctx.fillRect(0, 0, 180, H);
  }

  // Garis tepi halaman editorial yang lebih tegas
  ctx.strokeStyle = 'rgba(68, 45, 22, 0.42)';
  ctx.lineWidth = 3;
  ctx.strokeRect(54, 54, W - 108, H - 108);

  // Header & nomor halaman buku tahunan dengan tinta gelap pekat
  ctx.fillStyle = '#231409';
  ctx.font = '800 28px "JetBrains Mono", monospace';
  ctx.textAlign = side === 'left' ? 'left' : 'right';
  const headerX = side === 'left' ? 94 : W - 94;
  ctx.fillText(
    side === 'left' ? 'ALBUM KENANGAN · XII PPLG 3' : 'MAKN ENDE · 2024–2027',
    headerX,
    114
  );

  ctx.textAlign = side === 'left' ? 'left' : 'right';
  ctx.fillText(`Hal. ${pageNumber} / ${totalPages}`, headerX, H - 82);

  const hitSlots = [];
  const pinAnchors = [];

  const registerSlot = (
    photo,
    cx,
    cy,
    totalW,
    totalH,
    pinColorHex,
    pinOffsetY = -totalH / 2 + 22,
    focusX = cx,
    focusY = cy
  ) => {
    const uMin = (cx - totalW / 2) / W;
    const uMax = (cx + totalW / 2) / W;
    const vMax = 1 - (cy - totalH / 2) / H;
    const vMin = 1 - (cy + totalH / 2) / H;
    hitSlots.push({
      photo,
      uMin,
      uMax,
      vMin,
      vMax,
      focusU: focusX / W,
      focusV: 1 - focusY / H,
    });

    pinAnchors.push({
      u: cx / W,
      v: 1 - (cy + pinOffsetY) / H,
      colorHex: pinColorHex,
    });
  };

  const p0 = pagePhotos[0];
  const p1 = pagePhotos[1];

  if (p0 && p1) {
    if (side === 'left') {
      // Baris Atas: Foto kiri + Kartu Catatan kanan -> ZERO OVERLAP
      drawScrapbookPhotoSlot(ctx, {
        photo: p0,
        imgEl: loadedImages.get(p0.src),
        cx: 418,
        cy: 568,
        w: 588,
        h: 618,
        angle: -0.015,
        style: 'corners',
      });
      drawRuledIndexCard(ctx, {
        photo: p0,
        cx: 1106,
        cy: 580,
        w: 638,
        h: 435,
        angle: 0.014,
      });
      registerSlot(p0, 418, 568, 632, 664, 0xdc2626, -302, 752, 568);
      pinAnchors.push({ u: 1106 / W, v: 1 - 384 / H, colorHex: 0x2563eb });

      // Baris Bawah: Kartu Catatan kiri + Polaroid kanan -> ZERO OVERLAP
      drawRuledIndexCard(ctx, {
        photo: p1,
        cx: 418,
        cy: 1506,
        w: 632,
        h: 435,
        angle: -0.014,
      });
      drawScrapbookPhotoSlot(ctx, {
        photo: p1,
        imgEl: loadedImages.get(p1.src),
        cx: 1112,
        cy: 1494,
        w: 594,
        h: 488,
        angle: 0.018,
        style: 'polaroid',
      });
      registerSlot(p1, 1112, 1494, 638, 595, 0xeab308, -268, 768, 1494);
      pinAnchors.push({ u: 418 / W, v: 1 - 1310 / H, colorHex: 0x16a34a });
    } else {
      // Halaman Kanan (gutter di sisi kiri) -> area aman x: 168..1506
      // Baris Atas: Kartu Catatan kiri + Polaroid kanan
      drawRuledIndexCard(ctx, {
        photo: p0,
        cx: 488,
        cy: 580,
        w: 632,
        h: 435,
        angle: -0.014,
      });
      drawScrapbookPhotoSlot(ctx, {
        photo: p0,
        imgEl: loadedImages.get(p0.src),
        cx: 1175,
        cy: 575,
        w: 594,
        h: 488,
        angle: 0.018,
        style: 'polaroid',
      });
      registerSlot(p0, 1175, 575, 638, 595, 0x2563eb, -268, 832, 575);
      pinAnchors.push({ u: 488 / W, v: 1 - 384 / H, colorHex: 0xdc2626 });

      // Baris Bawah: Foto kiri + Kartu Catatan kanan
      drawScrapbookPhotoSlot(ctx, {
        photo: p1,
        imgEl: loadedImages.get(p1.src),
        cx: 494,
        cy: 1494,
        w: 606,
        h: 538,
        angle: -0.016,
        style: 'corners',
      });
      drawRuledIndexCard(ctx, {
        photo: p1,
        cx: 1181,
        cy: 1506,
        w: 632,
        h: 435,
        angle: 0.014,
      });
      registerSlot(p1, 494, 1494, 652, 582, 0x16a34a, -265, 838, 1494);
      pinAnchors.push({ u: 1181 / W, v: 1 - 1310 / H, colorHex: 0xeab308 });
    }
  } else if (p0) {
    const centerX = side === 'left' ? W * 0.47 : W * 0.53;
    drawScrapbookPhotoSlot(ctx, {
      photo: p0,
      imgEl: loadedImages.get(p0.src),
      cx: centerX,
      cy: 700,
      w: 975,
      h: 700,
      angle: side === 'left' ? -0.014 : 0.014,
      style: 'corners',
    });
    registerSlot(p0, centerX, 700, 1020, 745, 0xdc2626, -345, centerX, 925);

    drawRuledIndexCard(ctx, {
      photo: p0,
      cx: centerX,
      cy: 1550,
      w: 1025,
      h: 455,
      angle: side === 'left' ? 0.012 : -0.012,
    });
    pinAnchors.push({ u: centerX / W, v: 1 - 1344 / H, colorHex: 0x2563eb });
  } else {
    ctx.fillStyle = '#1c0f06';
    ctx.font = 'italic 800 52px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('XII PPLG 3 · MAKN Ende', W / 2, 850);

    ctx.fillStyle = '#2c180b';
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('“Setiap momen kecil hari ini adalah cerita besar esok hari.”', W / 2, 938);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(16, maxAnisotropy);
  texture.needsUpdate = true;

  return { texture, hitSlots, pinAnchors };
}

/**
 * Properti Meja Referensi 2 di samping buku album:
 * Papan gabus kecil (cork mat) + kartu catatan bergaris + 2 Polaroid miring + pushpin 3D warna-warni
 */
export function createDeskCorkMemoGroup(samplePhotos, loadedImages, maxAnisotropy = 4) {
  const group = new THREE.Group();

  const boardW = 2.45;
  const boardD = 3.15;
  const boardH = 0.08;

  const corkCanvas = document.createElement('canvas');
  corkCanvas.width = 512;
  corkCanvas.height = 640;
  const cctx = corkCanvas.getContext('2d');
  cctx.fillStyle = '#c29258';
  cctx.fillRect(0, 0, 512, 640);
  for (let i = 0; i < 4500; i++) {
    const x = (i * 89) % 512;
    const y = (i * 151 + Math.floor(i / 6) * 19) % 640;
    cctx.fillStyle = i % 3 === 0
      ? 'rgba(138, 88, 38, 0.25)'
      : i % 3 === 1
      ? 'rgba(222, 180, 122, 0.2)'
      : 'rgba(92, 56, 20, 0.18)';
    cctx.fillRect(x, y, 2 + (i % 3), 2);
  }
  const corkTex = new THREE.CanvasTexture(corkCanvas);
  corkTex.colorSpace = THREE.SRGBColorSpace;
  corkTex.anisotropy = Math.min(16, maxAnisotropy);

  const boardGeo = new THREE.BoxGeometry(boardW, boardH, boardD);
  const boardMat = new THREE.MeshStandardMaterial({
    map: corkTex,
    roughness: 0.9,
    metalness: 0.02,
    envMapIntensity: 0.45,
  });
  const boardMesh = new THREE.Mesh(boardGeo, boardMat);
  boardMesh.position.y = boardH / 2;
  boardMesh.castShadow = true;
  boardMesh.receiveShadow = true;
  group.add(boardMesh);

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x4b2c17,
    roughness: 0.55,
    metalness: 0.06,
  });
  const rimThick = 0.06;
  const rimH = 0.095;
  const rimParts = [
    [boardW + rimThick * 2, rimH, rimThick, 0, rimH / 2, -boardD / 2 - rimThick / 2],
    [boardW + rimThick * 2, rimH, rimThick, 0, rimH / 2, boardD / 2 + rimThick / 2],
    [rimThick, rimH, boardD, -boardW / 2 - rimThick / 2, rimH / 2, 0],
    [rimThick, rimH, boardD, boardW / 2 + rimThick / 2, rimH / 2, 0],
  ];
  rimParts.forEach(([w, h, d, x, y, z]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), rimMat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  });

  // Kanvas overlay papan gabus resolusi tinggi tanpa overlap
  const overlayCanvas = document.createElement('canvas');
  overlayCanvas.width = 960;
  overlayCanvas.height = 1236;
  const octx = overlayCanvas.getContext('2d');

  const overlayTex = new THREE.CanvasTexture(overlayCanvas);
  overlayTex.colorSpace = THREE.SRGBColorSpace;
  overlayTex.anisotropy = Math.min(16, maxAnisotropy);

  const refreshOverlay = () => {
    octx.clearRect(0, 0, 960, 1236);

    const pA = samplePhotos[0];
    const pB = samplePhotos[1] || samplePhotos[0];

    drawRuledIndexCard(octx, {
      photo: {
        kategori: 'XII PPLG 3',
        tanggal: '2024–2027',
        judul: 'Catatan Meja Kenangan',
        deskripsi: 'Klik sisi kanan buku untuk balik halaman, atau klik foto untuk zoom.',
      },
      cx: 480,
      cy: 248,
      w: 780,
      h: 382,
      angle: -0.024,
    });

    if (pA) {
      drawScrapbookPhotoSlot(octx, {
        photo: pA,
        imgEl: loadedImages.get(pA.src),
        cx: 278,
        cy: 712,
        w: 338,
        h: 285,
        angle: -0.06,
        style: 'polaroid',
      });
    }

    if (pB) {
      drawScrapbookPhotoSlot(octx, {
        photo: pB,
        imgEl: loadedImages.get(pB.src),
        cx: 682,
        cy: 848,
        w: 338,
        h: 285,
        angle: 0.07,
        style: 'polaroid',
      });
    }

    overlayTex.needsUpdate = true;
  };

  refreshOverlay();

  const overlayGeo = new THREE.PlaneGeometry(boardW - 0.08, boardD - 0.08);
  overlayGeo.rotateX(-Math.PI / 2);
  const overlayMat = new THREE.MeshStandardMaterial({
    map: overlayTex,
    transparent: true,
    roughness: 0.94,
    metalness: 0.0,
    envMapIntensity: 0.3,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const overlayMesh = new THREE.Mesh(overlayGeo, overlayMat);
  overlayMesh.position.y = boardH + 0.004;
  overlayMesh.receiveShadow = true;
  group.add(overlayMesh);

  // 3 Pushpin 3D warna-warni sejajar dengan kartu & 2 Polaroid
  const pinConfigs = [
    { x: 0.0, z: -1.32, color: 0xdc2626 },
    { x: -0.48, z: -0.22, color: 0x2563eb },
    { x: 0.48, z: 0.14, color: 0x16a34a },
  ];
  pinConfigs.forEach(({ x, z, color }) => {
    const pin = createPushpinGroup(color);
    pin.position.set(x, boardH, z);
    group.add(pin);
  });

  return { group, refreshOverlay };
}
