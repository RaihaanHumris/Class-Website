import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function parseEnvFile(filePath) {
  const result = {};
  if (!fs.existsSync(filePath)) return result;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    const val = line.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && val) result[key] = val;
  }
  return result;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const cwd = process.cwd();
  const loaded = loadEnv(mode, cwd, ['VITE_', 'NEXT_PUBLIC_']);
  const exampleVars = parseEnvFile(path.resolve(cwd, '.env.example'));

  const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    loaded.VITE_SUPABASE_URL ||
    loaded.NEXT_PUBLIC_SUPABASE_URL ||
    exampleVars.VITE_SUPABASE_URL ||
    exampleVars.NEXT_PUBLIC_SUPABASE_URL ||
    '';

  const supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    loaded.VITE_SUPABASE_ANON_KEY ||
    loaded.VITE_SUPABASE_PUBLISHABLE_KEY ||
    loaded.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    loaded.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    exampleVars.VITE_SUPABASE_ANON_KEY ||
    exampleVars.VITE_SUPABASE_PUBLISHABLE_KEY ||
    exampleVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    exampleVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return {
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: {
      __APP_SUPABASE_URL__: JSON.stringify(supabaseUrl),
      __APP_SUPABASE_ANON_KEY__: JSON.stringify(supabaseAnonKey),
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
    },
  };
});

