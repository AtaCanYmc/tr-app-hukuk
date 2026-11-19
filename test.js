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
  assert.ok(fs.existsSync(path.join(shTarget, 'references', 'regex-desenleri.md')), 'install.sh must install regex-desenleri');
  assert.ok(fs.existsSync(path.join(shTarget, 'references', 'rapor-semasi.json')), 'install.sh must install rapor-semasi.json');

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

  // Test 9: CLI --json audit output
  const jsonScanDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hukuk-json-'));
  try {
    // Riski içeren sahte bir TypeScript dosyası oluştur
    const dummyFile = path.join(jsonScanDir, 'checkout.ts');
    fs.writeFileSync(dummyFile, 'export const config = { auto_renew: true };\nmailClient.sendMail();\n');

    const jsonRaw = execFileSync('node', [cliPath, '--json'], { cwd: jsonScanDir, encoding: 'utf8' });
    const parsed = JSON.parse(jsonRaw);
    assert.ok(parsed.version, 'JSON report must have version');
    assert.ok(parsed.timestamp, 'JSON report must have timestamp');
    assert.strictEqual(parsed.scanned_files, 1, 'JSON report must report 1 scanned file');
    assert.strictEqual(parsed.summary.total_findings, 2, 'JSON report must detect 2 findings');
    assert.strictEqual(parsed.summary.high_risk, 2, 'JSON report must classify both as high risk');
    assert.strictEqual(parsed.findings[0].category, 'payment_subscription');
    assert.strictEqual(parsed.findings[1].category, 'commercial_message');

    // Shell script wrapper test
    const shJsonRaw = execFileSync(shPath, ['--json'], { cwd: jsonScanDir, encoding: 'utf8' });
    const shParsed = JSON.parse(shJsonRaw);
    assert.strictEqual(shParsed.summary.total_findings, 2, 'install.sh --json must produce matching results');
  } finally {
    fs.rmSync(jsonScanDir, { recursive: true, force: true });
  }

  // Test 10: New rules (Supabase service_role, Google Fonts, SMS/IYS, Bundled consent)
  const newRulesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hukuk-newrules-'));
  try {
    const dummyClient = path.join(newRulesDir, 'app.tsx');
    fs.writeFileSync(
      dummyClient,
      [
        'const key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;',
        'const font = "https://fonts.googleapis.com/css2?family=Inter";',
        'import { netgsm } from "netgsm";',
        '<label>Aydınlatma metnini okudum ve kabul ediyorum</label>'
      ].join('\n')
    );

    const jsonRaw = execFileSync('node', [cliPath, '--json'], { cwd: newRulesDir, encoding: 'utf8' });
    const parsed = JSON.parse(jsonRaw);
    assert.strictEqual(parsed.summary.total_findings, 4, 'Must detect all 4 new rule findings');
    const categories = parsed.findings.map((f) => f.category);
    assert.ok(categories.includes('database_rls_leak'), 'Must detect database_rls_leak');
    assert.ok(categories.includes('kvkk_cross_border_cdn'), 'Must detect kvkk_cross_border_cdn');
    assert.ok(categories.includes('commercial_message_iys'), 'Must detect commercial_message_iys');
    assert.ok(categories.includes('kvkk_disclosure_consent'), 'Must detect kvkk_disclosure_consent');
  } finally {
    fs.rmSync(newRulesDir, { recursive: true, force: true });
  }

  console.log('✓ install.js and install.sh security & integration tests passed');
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
