#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, 'skills', 'tr-app-hukuk');

const TARGETS = {
  claude: path.join(process.cwd(), '.claude', 'skills', 'tr-app-hukuk'),
  cursor: path.join(process.cwd(), '.cursor', 'skills', 'tr-app-hukuk'),
  gemini: path.join(process.cwd(), '.gemini', 'skills', 'tr-app-hukuk'),
  windsurf: path.join(process.cwd(), '.windsurf', 'skills', 'tr-app-hukuk'),
  copilot: path.join(process.cwd(), '.github', 'skills', 'tr-app-hukuk'),
};

const args = process.argv.slice(2);
let selectedTarget = 'claude';

for (const arg of args) {
  if (arg.startsWith('--target=')) {
    selectedTarget = arg.split('=')[1].toLowerCase();
  } else if (arg.startsWith('--')) {
    const flag = arg.slice(2).toLowerCase();
    if (TARGETS[flag] || flag === 'all') selectedTarget = flag;
  }
}

const installTo = (destPath, name) => {
  fs.cpSync(sourceDir, destPath, { recursive: true });
  const relative = path.relative(process.cwd(), destPath);
  console.log(`\x1b[32m✔ [${name}] yeteneği kuruldu:\x1b[0m \x1b[1m${relative}\x1b[0m`);
};

try {
  if (selectedTarget === 'all') {
    for (const [key, dest] of Object.entries(TARGETS)) {
      installTo(dest, key);
    }
  } else if (TARGETS[selectedTarget]) {
    installTo(TARGETS[selectedTarget], selectedTarget);
  } else {
    console.error(`\x1b[31mBilinmeyen hedef:\x1b[0m ${selectedTarget}`);
    console.log(`Geçerli hedefler: ${Object.keys(TARGETS).join(', ')}, all`);
    process.exit(1);
  }

  console.log('\n\x1b[33mKullanmak için asistanınıza şunu yazabilirsiniz:\x1b[0m');
  console.log('\x1b[36m   "Projemi hukuki olarak tara"\x1b[0m\n');
} catch (error) {
  console.error('\x1b[31mKurulum sırasında hata oluştu:\x1b[0m', error.message);
  process.exit(1);
}
