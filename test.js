import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hukuk-test-'));
const cliPath = path.resolve('./install.js');
const shPath = path.resolve('./install.sh');

try {
  // Test 1: Default installation (Claude Code)
  execFileSync('node', [cliPath], { cwd: tempDir, encoding: 'utf8' });
  const claudeSkill = path.join(tempDir, '.claude', 'skills', 'tr-app-hukuk', 'SKILL.md');
  assert.ok(fs.existsSync(claudeSkill), 'Default install must create .claude skill');

  // Test 2: Custom target (Cursor)
  execFileSync('node', [cliPath, '--target=cursor'], { cwd: tempDir, encoding: 'utf8' });
  const cursorSkill = path.join(tempDir, '.cursor', 'skills', 'tr-app-hukuk', 'SKILL.md');
  assert.ok(fs.existsSync(cursorSkill), 'Cursor target must create .cursor skill');

  // Test 3: All targets
  execFileSync('node', [cliPath, '--target=all'], { cwd: tempDir, encoding: 'utf8' });
  const geminiSkill = path.join(tempDir, '.gemini', 'skills', 'tr-app-hukuk', 'SKILL.md');
  const copilotSkill = path.join(tempDir, '.github', 'skills', 'tr-app-hukuk', 'SKILL.md');
  assert.ok(fs.existsSync(geminiSkill), 'Target all must create .gemini skill');
  assert.ok(fs.existsSync(copilotSkill), 'Target all must create .github skill');

  // Test 4: POSIX shell installer
  const shTarget = path.join(tempDir, 'sh-skill');
  execFileSync(shPath, [shTarget], { cwd: tempDir, encoding: 'utf8' });
  assert.ok(fs.existsSync(path.join(shTarget, 'SKILL.md')), 'install.sh must install SKILL.md');
  assert.ok(fs.existsSync(path.join(shTarget, 'references', 'ceza-limitleri-2026.md')), 'install.sh must install references');
  assert.ok(fs.existsSync(path.join(shTarget, 'references', 'emsal-kararlar.md')), 'install.sh must install emsal-kararlar');

  // Test 5: Security - Prototype pollution / invalid target rejection in install.js
  assert.throws(
    () => execFileSync('node', [cliPath, '--target=constructor'], { cwd: tempDir, encoding: 'utf8' }),
    'install.js must reject prototype property constructor'
  );
  assert.throws(
    () => execFileSync('node', [cliPath, '--__proto__'], { cwd: tempDir, encoding: 'utf8' }),
    'install.js must reject prototype property __proto__'
  );

  // Test 6: Security - Option / argument injection rejection in install.sh
  assert.throws(
    () => execFileSync(shPath, ['--invalid-flag'], { cwd: tempDir, encoding: 'utf8' }),
    'install.sh must reject unknown flags safely'
  );

  // Test 7: CLI --print parameter
  const nodePrintOutput = execFileSync('node', [cliPath, '--print'], { encoding: 'utf8' });
  assert.ok(nodePrintOutput.includes('name: tr-app-hukuk'), 'install.js --print must output SKILL.md frontmatter');
  assert.ok(nodePrintOutput.includes('Hukuki Tarama Yeteneği'), 'install.js --print must output skill header');

  const shPrintOutput = execFileSync(shPath, ['--print'], { encoding: 'utf8' });
  assert.ok(shPrintOutput.includes('name: tr-app-hukuk'), 'install.sh --print must output SKILL.md frontmatter');

  // Test 8: CLI --dry-run parameter (should not write files)
  const dryRunDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hukuk-dryrun-'));
  try {
    const dryRunOutput = execFileSync('node', [cliPath, '--dry-run', '--target=claude'], { cwd: dryRunDir, encoding: 'utf8' });
    assert.ok(dryRunOutput.includes('[dry-run]'), 'install.js --dry-run must indicate simulation');
    const dryRunTarget = path.join(dryRunDir, '.claude', 'skills', 'tr-app-hukuk');
    assert.ok(!fs.existsSync(dryRunTarget), 'install.js --dry-run must not create target directory');

    const shDryRunOutput = execFileSync(shPath, ['--dry-run', '--claude'], { cwd: dryRunDir, encoding: 'utf8' });
    assert.ok(shDryRunOutput.includes('[dry-run]'), 'install.sh --dry-run must indicate simulation');
  } finally {
    fs.rmSync(dryRunDir, { recursive: true, force: true });
  }

  console.log('✓ install.js and install.sh security & integration tests passed');
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
