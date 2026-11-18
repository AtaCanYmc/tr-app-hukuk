#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, 'skills', 'tr-app-hukuk');

const TARGETS = Object.freeze({
  claude: path.join(process.cwd(), '.claude', 'skills', 'tr-app-hukuk'),
  cursor: path.join(process.cwd(), '.cursor', 'skills', 'tr-app-hukuk'),
  gemini: path.join(process.cwd(), '.gemini', 'skills', 'tr-app-hukuk'),
  windsurf: path.join(process.cwd(), '.windsurf', 'skills', 'tr-app-hukuk'),
  copilot: path.join(process.cwd(), '.github', 'skills', 'tr-app-hukuk'),
});

const VALID_TARGETS = new Set(Object.keys(TARGETS));

const args = process.argv.slice(2);
let selectedTarget = 'claude';
let isDryRun = false;
let isPrint = false;

for (const arg of args) {
  if (arg === '--dry-run') {
    isDryRun = true;
  } else if (arg === '--print') {
    isPrint = true;
  } else if (arg.startsWith('--target=')) {
    const val = arg.split('=')[1].toLowerCase();
    if (VALID_TARGETS.has(val) || val === 'all') {
      selectedTarget = val;
    } else {
      console.error(`\x1b[31mBilinmeyen hedef:\x1b[0m ${val}`);
      console.log(`Geçerli hedefler: ${[...VALID_TARGETS].join(', ')}, all`);
      process.exit(1);
    }
  } else if (arg.startsWith('--')) {
    const flag = arg.slice(2).toLowerCase();
    if (VALID_TARGETS.has(flag) || flag === 'all') {
      selectedTarget = flag;
    } else {
      console.error(`\x1b[31mBilinmeyen seçenek:\x1b[0m ${arg}`);
      console.log(`Geçerli hedefler: ${[...VALID_TARGETS].join(', ')}, all`);
      console.log('Seçenekler: --dry-run, --print');
      process.exit(1);
    }
  } else {
    console.error(`\x1b[31mBilinmeyen argüman:\x1b[0m ${arg}`);
    process.exit(1);
  }
}

if (isPrint) {
  const skillPath = path.join(sourceDir, 'SKILL.md');
  process.stdout.write(fs.readFileSync(skillPath, 'utf8'));
  process.exit(0);
}

const listFilesRecursively = (dir, base = '') => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = base ? path.join(base, entry.name) : entry.name;
    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(path.join(dir, entry.name), relativePath));
    } else {
      files.push(relativePath);
    }
  }
  return files;
};

const installTo = (destPath, name) => {
  const relative = path.relative(process.cwd(), destPath);
  if (isDryRun) {
    console.log(`\x1b[34mℹ [dry-run] [${name}] hedefi simüle ediliyor:\x1b[0m \x1b[1m${relative}\x1b[0m`);
    const files = listFilesRecursively(sourceDir);
    for (const file of files) {
      console.log(`  \x1b[90m→ ${file}\x1b[0m`);
    }
    return;
  }
  fs.mkdirSync(destPath, { recursive: true });
  fs.cpSync(sourceDir, destPath, { recursive: true });
  console.log(`\x1b[32m✔ [${name}] yeteneği kuruldu:\x1b[0m \x1b[1m${relative}\x1b[0m`);
};

try {
  if (selectedTarget === 'all') {
    for (const [key, dest] of Object.entries(TARGETS)) {
      installTo(dest, key);
    }
  } else if (Object.hasOwn(TARGETS, selectedTarget)) {
    installTo(TARGETS[selectedTarget], selectedTarget);
  } else {
    console.error(`\x1b[31mBilinmeyen hedef:\x1b[0m ${selectedTarget}`);
    console.log(`Geçerli hedefler: ${[...VALID_TARGETS].join(', ')}, all`);
    process.exit(1);
  }

  if (isDryRun) {
    console.log('\n\x1b[33m[dry-run] Simülasyon tamamlandı. Hiçbir dosya veya dizin yazılmadı.\x1b[0m\n');
    process.exit(0);
  }

  console.log('\n\x1b[33mKullanmak için asistanınıza şunu yazabilirsiniz:\x1b[0m');
  console.log('\x1b[36m   "Projemi hukuki olarak tara"\x1b[0m\n');
} catch (error) {
  console.error('\x1b[31mKurulum sırasında hata oluştu:\x1b[0m', error.message);
  process.exit(1);
}
