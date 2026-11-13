import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// Salin semua foto kenangan dari direktori upload ke public/images/kenangan
const uploadDir = 'C:/Users/Reyhan Humris/.gemini/antigravity/brain/a3b47afa-eac8-440e-88e9-e63a3a6dbd89/.user_uploaded';
const targetDir = path.resolve('public/images/kenangan');

const photosToCopy = [
  // 2 foto sebelumnya
  { src: 'media_1794574162132_73d43195.jpg', dest: 'kebersamaan-guru-wearpack.jpg' },
  { src: 'media_1794574172073_f950e563.jpg', dest: 'lab-rpl-guru.jpg' },
  // 7 foto baru
  { src: 'media_1794574753631_1e13d865.jpg', dest: 'hari-pahlawan.jpg' },
  { src: 'media_1794574753631_1589243a.jpg', dest: 'ratu-gosip-pplg-3.jpg' },
  { src: 'media_1794574753640_89e026e1.jpg', dest: 'malam-api-unggun-mama-angkat.jpg' },
  { src: 'media_1794574753646_bb8f8895.jpg', dest: 'para-buaya.jpg' },
  { src: 'media_1794574753653_eeca0e35.jpg', dest: 'kebersamaan-classmeet.jpg' },
  { src: 'media_1794574753661_73ddd0b5.jpg', dest: 'idul-adha-kelas-10.jpg' },
  { src: 'media_1794574753665_a7bb968d.jpg', dest: 'after-pwpb-ustadzah-ismi.jpg' },
];

try {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  for (const { src, dest } of photosToCopy) {
    const srcPath = path.join(uploadDir, src);
    const destPath = path.join(targetDir, dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
} catch (err) {
  console.error('Gagal menyalin foto:', err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    open: true,
  },
});
