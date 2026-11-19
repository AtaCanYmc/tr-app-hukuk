#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, 'skills', 'tr-app-hukuk');
const pkgPath = path.join(__dirname, 'package.json');
const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : { version: '1.3.0' }; // x-release-please-version

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
let isJson = false;
let isCheck = false;

for (const arg of args) {
  if (arg === '--dry-run') {
    isDryRun = true;
  } else if (arg === '--print') {
    isPrint = true;
  } else if (arg === '--json') {
    isJson = true;
  } else if (arg === '--check') {
    isCheck = true;
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
      console.log('Seçenekler: --dry-run, --print, --json, --check');
      process.exit(1);
    }
  } else {
    console.error(`\x1b[31mBilinmeyen argüman:\x1b[0m ${arg}`);
    process.exit(1);
  }
}

// 1. Mod: --print (Doğrudan SKILL.md stdout çıktısı)
if (isPrint) {
  const skillPath = path.join(sourceDir, 'SKILL.md');
  process.stdout.write(fs.readFileSync(skillPath, 'utf8'));
  process.exit(0);
}

// 2. Mod: --json ve --check (Headless Statik Denetim Motoru)
if (isJson || isCheck) {
  const RULES = [
    {
      id: 'TR-LAW-001',
      category: 'payment_subscription',
      title: 'Abonelik ve Otomatik Yenileme Şartı',
      law: '6502 sayılı Kanun m. 48 & m. 62',
      regex: /(?:auto_renew|autoRenew|recurringPayment|isRecurring)\s*[:=]\s*(?:true|1)|mode:\s*['"]subscription['"]|\.subscription\.initialize/i,
      risk: 'Yüksek',
      penalty_limit_2026: '10.837.065 TL (m.62 & m.77/13)',
      precedent_decision: 'Yargıtay 3. H.D. E. 2021/4812, K. 2021/9340',
      recommendation: 'Aboneliğin otomatik yenileneceği ve cayma süresi ödeme anında tüketiciye açıkça bildirilmelidir.'
    },
    {
      id: 'TR-LAW-002',
      category: 'payment_subscription',
      title: 'Kayıtlı Kart ve Saklama (Card on File)',
      law: '6698 sayılı KVKK m. 12 & 6502 sayılı Kanun',
      regex: /(?:setup_future_usage|save_card|saveCard|store_card|rememberCard)\s*[:=]\s*(?:true|1|['"]off_session['"])/i,
      risk: 'Orta',
      penalty_limit_2026: '17.092.242 TL (KVKK m.12)',
      precedent_decision: 'Yargıtay 12. C.D. E. 2021/6105, K. 2022/4510',
      recommendation: 'Kart bilgilerinin saklanması için kullanıcıdan ayrıca açık rıza ve aydınlatma onayı alınmalıdır.'
    },
    {
      id: 'TR-LAW-003',
      category: 'commercial_message',
      title: 'Ticari Elektronik İleti / E-posta Gönderimi',
      law: '6563 sayılı Kanun m. 6 & m. 8',
      regex: /\.(?:sendMail|emails\.send|sgMail\.send|sendEmail)\(|(?:server\.sendmail|send_mass_mail)\(/,
      risk: 'Yüksek',
      penalty_limit_2026: '42.930 TL (Ret hakkı) / 14.309 TL (Onaysız ileti)',
      precedent_decision: 'Yargıtay 19. H.D. E. 2018/1204, K. 2019/3150',
      recommendation: 'İletilerde alıcıya ret hakkı (unsubscribe bağlantısı) ve MERSİS/iletişim bilgisi sunulmalıdır.'
    },
    {
      id: 'TR-LAW-004',
      category: 'kvkk_cross_border',
      title: 'Yurt Dışına Veri Aktarımı / Telemetri Servisi',
      law: '6698 sayılı KVKK m. 9 & m. 12',
      regex: /from\s+['"](?:@sentry\/|mixpanel|@datadog\/|firebase|@segment\/)|import\s+(?:sentry_sdk|mixpanel|datadog|firebase_admin)/,
      risk: 'Orta',
      penalty_limit_2026: '17.092.242 TL (KVKK m.9 & m.12)',
      precedent_decision: 'Yargıtay 12. C.D. E. 2021/6105, K. 2022/4510',
      recommendation: 'Yurt dışı sunucularına veri aktaran telemetri araçları için KVKK m.9 şartları ve aydınlatma sağlanmalıdır.'
    },
    {
      id: 'TR-LAW-005',
      category: 'database_rls_leak',
      title: 'İstemciye Sızan Supabase service_role veya Gizli Anahtar',
      law: '6698 sayılı KVKK m. 12 (Veri Güvenliği)',
      regex: /(?:NEXT_PUBLIC_.*SERVICE_ROLE|VITE_.*SERVICE_ROLE|REACT_APP_.*SERVICE_ROLE|service_role\s*[:=]\s*['"]ey[A-Za-z0-9-_]+)/i,
      risk: 'Yüksek',
      penalty_limit_2026: '17.092.242 TL (KVKK m.12)',
      precedent_decision: 'KVKK Kurulu Veri Güvenliği İlke Kararı',
      recommendation: 'service_role anahtarı yalnızca yetkili sunucu tarafında tutulmalı; istemci tarafına (NEXT_PUBLIC_/VITE_) asla sızdırılmamalıdır.'
    },
    {
      id: 'TR-LAW-006',
      category: 'commercial_message_iys',
      title: 'Ticari SMS Gönderimi ve İYS Onay Denetimi',
      law: '6563 sayılı Kanun & İYS Yönetmeliği',
      regex: /(?:from\s+['"](?:netgsm|mutlucell|iletimerkezi|vatansms)['"]|\.(?:messages\.create|sendSms)\()/i,
      risk: 'Yüksek',
      penalty_limit_2026: '14.309 TL - 42.930 TL (İYS / Ret hakkı ihlali)',
      precedent_decision: 'Yargıtay 19. H.D. E. 2018/1204, K. 2019/3150',
      recommendation: 'SMS gönderimi öncesinde alıcının İYS sisteminde geçerli onayı olup olmadığı kontrol edilmeli ve iletide ret imkânı sağlanmalıdır.'
    },
    {
      id: 'TR-LAW-007',
      category: 'kvkk_cross_border_cdn',
      title: 'Google Fonts CDN Üzerinden Yurt Dışına Veri / IP Aktarımı',
      law: '6698 sayılı KVKK m. 9 (Yurt Dışı Aktarım)',
      regex: /(?:fonts\.googleapis\.com|fonts\.gstatic\.com)/i,
      risk: 'Orta',
      penalty_limit_2026: '17.092.242 TL (KVKK m.9)',
      precedent_decision: 'LG München I 3 O 17493/20 & KVKK m.9',
      recommendation: 'Google Fonts dinamik CDN çağrısı yerine fontlar projeye indirilip yerel olarak (self-host) sunulmalıdır (next/font veya @fontsource).'
    },
    {
      id: 'TR-LAW-008',
      category: 'kvkk_disclosure_consent',
      title: 'Aydınlatma Metni ile Açık Rızanın Birleştirilmesi / Pre-ticked Onay',
      law: '6698 sayılı KVKK m. 5 & m. 10',
      regex: /(?:Aydınlatma\s+metnini\s+okudum.*(?:kabul|onay|açık\s+rıza)|kvkkAndConsent)/i,
      risk: 'Yüksek',
      penalty_limit_2026: '1.709.200 TL (KVKK m.10)',
      precedent_decision: 'KVKK Kurulu 2020/917 Sayılı İlke Kararı',
      recommendation: 'Aydınlatma metni onay kutusu içine alınamaz; açık rıza için bağımsız ve önceden işaretlenmemiş ayrı bir checkbox sunulmalıdır.'
    }
  ];

  const IGNORED_DIRS = new Set([
    'node_modules', '.git', '.venv', 'venv', 'dist', 'build', '.next', '.nuxt',
    '.claude', '.cursor', '.gemini', '.github', '.windsurf', 'coverage', '.idea', 'references'
  ]);

  const ALLOWED_EXTS = new Set([
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.html'
  ]);

  const scanFiles = (dir) => {
    const results = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
            results.push(...scanFiles(path.join(dir, entry.name)));
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (ALLOWED_EXTS.has(ext)) {
            results.push(path.join(dir, entry.name));
          }
        }
      }
    } catch {
      // Erişim izni olmayan dizinleri atla
    }
    return results;
  };

  const projectRoot = process.cwd();
  const filePaths = scanFiles(projectRoot);
  const findings = [];

  for (const filePath of filePaths) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const relPath = path.relative(projectRoot, filePath);

      lines.forEach((line, index) => {
        for (const rule of RULES) {
          if (rule.regex.test(line)) {
            findings.push({
              id: `${rule.id}-${findings.length + 1}`,
              category: rule.category,
              title: rule.title,
              law: rule.law,
              file: relPath,
              line: index + 1,
              matched_pattern: line.trim().slice(0, 120),
              risk: rule.risk,
              penalty_limit_2026: rule.penalty_limit_2026,
              precedent_decision: rule.precedent_decision,
              recommendation: rule.recommendation
            });
          }
        }
      });
    } catch {
      // Okunamayan dosyaları atla
    }
  }

  const report = {
    version: pkg.version || '1.3.0', // x-release-please-version
    timestamp: new Date().toISOString(),
    target_directory: projectRoot,
    scanned_files: filePaths.length,
    summary: {
      total_findings: findings.length,
      high_risk: findings.filter((f) => f.risk === 'Yüksek').length,
      medium_risk: findings.filter((f) => f.risk === 'Orta').length,
      low_risk: findings.filter((f) => f.risk === 'Düşük').length
    },
    findings,
    references: {
      schema: 'skills/tr-app-hukuk/references/rapor-semasi.json',
      penalties: 'skills/tr-app-hukuk/references/ceza-limitleri-2026.md',
      precedents: 'skills/tr-app-hukuk/references/emsal-kararlar.md',
      patterns: 'skills/tr-app-hukuk/references/regex-desenleri.md'
    }
  };

  if (isJson) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    // --check modu (terminal formatı)
    console.log(`\n\x1b[1m🔍 tr-app-hukuk Headless Denetim Raporu (v${report.version})\x1b[0m`);
    console.log(`Taranan Dosya: ${report.scanned_files} | Toplam Bulgu: ${report.summary.total_findings}`);
    console.log(`Risk Dağılımı: \x1b[31m${report.summary.high_risk} Yüksek\x1b[0m | \x1b[33m${report.summary.medium_risk} Orta\x1b[0m | \x1b[32m${report.summary.low_risk} Düşük\x1b[0m\n`);

    for (const f of findings) {
      console.log(`\x1b[33m● [${f.risk}]\x1b[0m \x1b[1m${f.title}\x1b[0m (${f.law})`);
      console.log(`  Dosya: \x1b[36m${f.file}:${f.line}\x1b[0m`);
      console.log(`  Kod:   \x1b[90m${f.matched_pattern}\x1b[0m`);
      console.log(`  Ceza:  ${f.penalty_limit_2026}`);
      console.log(`  Öneri: ${f.recommendation}\n`);
    }

    if (findings.length === 0) {
      console.log('\x1b[32m✔ Tebrikler! Kod tabanında kritik bir yasal uyumsuzluk deseni tespit edilmedi.\x1b[0m\n');
    }
  }

  // CI modunda bulgu varsa exit 1, yoksa 0
  if (isCheck && findings.length > 0) {
    process.exit(1);
  }
  process.exit(0);
}

// 3. Mod: Kurulum (Default & Target)
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
