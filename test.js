import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hukuk-test-'));
const cliPath = path.resolve('./install.js');

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

  console.log('✓ install.js multi-target tests passed');
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
