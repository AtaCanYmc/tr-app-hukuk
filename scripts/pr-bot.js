#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const installCli = path.join(repoRoot, 'install.js');

const COMMENT_TAG = '<!-- tr-app-hukuk-pr-comment -->';

// 1. LLM Çağrı Yardımcıları (Zero-Dependency Native fetch)
async function callGemini(apiKey, model, prompt) {
  const targetModel = model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.2 }
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API hatası (${res.status}): ${errText}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callClaude(apiKey, model, prompt) {
  const targetModel = model || 'claude-3-5-haiku-20241022';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: targetModel,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API hatası (${res.status}): ${errText}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

async function callOpenAI(apiKey, model, prompt) {
  const targetModel = model || 'gpt-4o-mini';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: targetModel,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API hatası (${res.status}): ${errText}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function getLlmAnalysis(findings) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const model = process.env.BOT_MODEL;

  if (process.env.MOCK_LLM_RESPONSE) {
    return process.env.MOCK_LLM_RESPONSE;
  }

  if (!geminiKey && !anthropicKey && !openAiKey) {
    return null; // Statik mod (LLM anahtarı girilmemiş)
  }

  const prompt = [
    'Sen Türkiye mevzuatı (6698 KVKK, 6502 Tüketici Kanunu, 6563 ETK, İYS, 5651 ve 5846 FSEK) alanında uzman bir yapay zeka kod denetçisisin.',
    'Aşağıda bir GitHub Pull Request taramasında tespit edilen şüpheli kod bulguları listelenmiştir:',
    JSON.stringify(findings, null, 2),
    '',
    'Lütfen geliştirici için kısa, somut ve teknik bir hukuki değerlendirme hazırla:',
    '1. Tespit edilen bulguların yasal boyutu ve doğurabileceği cezai risk nedir?',
    '2. Geliştirici kodda hangi değişikliği yapmalıdır? (Kısa ve uygulanabilir bir kod önerisi ver).'
  ].join('\n');

  try {
    if (geminiKey) {
      return await callGemini(geminiKey, model, prompt);
    }
    if (anthropicKey) {
      return await callClaude(anthropicKey, model, prompt);
    }
    if (openAiKey) {
      return await callOpenAI(openAiKey, model, prompt);
    }
  } catch (err) {
    console.warn(`[tr-app-hukuk] LLM analizi sırasında uyarı: ${err.message}`);
    return null;
  }
  return null;
}

// 2. PR Yorumu Yönetimi (GitHub REST API)
async function postOrUpdateComment(prNumber, commentBody) {
  const token = process.env.GITHUB_TOKEN;
  const repoSlug = process.env.GITHUB_REPOSITORY;

  if (!token || !repoSlug || !prNumber) {
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'tr-app-hukuk-bot'
  };

  try {
    // Mevcut yorumları listele
    const listRes = await fetch(`https://api.github.com/repos/${repoSlug}/issues/${prNumber}/comments`, { headers });
    if (!listRes.ok) return;
    const comments = await listRes.json();
    const existing = Array.isArray(comments) ? comments.find((c) => c.body?.includes(COMMENT_TAG)) : null;

    if (existing) {
      // Varsa mevcut yorumu güncelle
      await fetch(`https://api.github.com/repos/${repoSlug}/issues/comments/${existing.id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: commentBody })
      });
      console.log(`[tr-app-hukuk] PR #${prNumber} üzerindeki mevcut uyumluluk yorumu güncellendi.`);
    } else {
      // Yoksa yeni yorum oluştur
      await fetch(`https://api.github.com/repos/${repoSlug}/issues/${prNumber}/comments`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: commentBody })
      });
      console.log(`[tr-app-hukuk] PR #${prNumber} altına yeni uyumluluk raporu eklendi.`);
    }
  } catch (err) {
    console.warn(`[tr-app-hukuk] GitHub PR yorumu gönderilemedi: ${err.message}`);
  }
}

// 3. Ana Yürütücü
export async function runPrBot(targetDir = process.cwd()) {
  console.log(`[tr-app-hukuk] Hibrit yasal uyumluluk denetimi başlatılıyor: ${targetDir}`);

  // Statik tarama motorunu çalıştır
  const outputRaw = execFileSync('node', [installCli, '--json'], { cwd: targetDir, encoding: 'utf8' });
  const report = JSON.parse(outputRaw);

  const total = report.summary?.total_findings || 0;
  const highRisk = report.summary?.high_risk || 0;
  console.log(`[tr-app-hukuk] Tarama tamamlandı. Toplam bulgu: ${total} (Yüksek risk: ${highRisk})`);

  let prNumber = null;
  if (process.env.GITHUB_EVENT_PATH && fs.existsSync(process.env.GITHUB_EVENT_PATH)) {
    try {
      const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      prNumber = event.pull_request?.number || event.issue?.number || null;
    } catch {}
  }

  // PR Yorum Gövdesi İnşası
  let markdown = `${COMMENT_TAG}\n## tr-app-hukuk Yasal Uyumluluk Raporu\n\n`;

  if (total === 0) {
    markdown += `Tebrikler! PR kapsamında incelenen dosyalarda Türkiye mevzuatına ve KVKK kurallarına aykırı kritik bir risk deseni tespit edilmedi.\n\n`;
    markdown += `*Taranan dosya sayısı: ${report.scanned_files}*\n`;
  } else {
    markdown += `Bu Pull Request kapsamında yapılan incelemede **${total}** adet yasal uyumluluk riski tespit edildi:\n\n`;
    markdown += `| Seviye | Kategori | Dosya:Satır | İlgili Kanun | 2026 Ceza Üst Sınırı |\n`;
    markdown += `| :--- | :--- | :--- | :--- | :--- |\n`;

    for (const f of report.findings) {
      markdown += `| **${f.risk}** | ${f.title} | \`${f.file}:${f.line}\` | ${f.law} | ${f.penalty_limit_2026} |\n`;
    }

    markdown += `\n### Bulgu Detayları ve Düzeltme Önerileri\n\n`;
    for (const f of report.findings) {
      markdown += `#### [${f.risk}] ${f.title}\n`;
      markdown += `- **Konum:** \`${f.file}:${f.line}\`\n`;
      markdown += `- **Eşleşen Kod:** \`${f.matched_pattern}\`\n`;
      markdown += `- **Yasal Dayanak:** ${f.law}\n`;
      markdown += `- **2026 Cezai Yaptırımı:** ${f.penalty_limit_2026}\n`;
      if (f.precedent_decision) {
        markdown += `- **Emsal Karar:** ${f.precedent_decision}\n`;
      }
      markdown += `- **Önerilen Çözüm:** ${f.recommendation}\n\n`;
    }

    // Aşama 2: LLM Derin Hukuki Analiz (Eğer API Key varsa)
    const llmAnalysis = await getLlmAnalysis(report.findings);
    if (llmAnalysis) {
      markdown += `\n### 🤖 Yapay Zeka Hukuki Değerlendirmesi ve Çözüm Rehberi\n\n`;
      markdown += `${llmAnalysis.trim()}\n\n`;
    }
  }

  markdown += `\n---\n*Bu rapor [tr-app-hukuk](https://github.com/AtaCanYmc/tr-app-hukuk) GitHub Actions Botu tarafından otomatik üretilmiştir.*`;

  // PR yorumunu gönder (Etkinse ve PR ortamındaysa)
  if (process.env.ENABLE_PR_COMMENT !== 'false' && prNumber) {
    await postOrUpdateComment(prNumber, markdown);
  } else {
    // Konsola yazdır
    console.log('\n--- RAPOR ÇIKTISI ---');
    console.log(markdown);
  }

  // Yüksek riskli bulgu varsa ve fail-on-risk açıksa exit 1
  const failOnRisk = process.env.FAIL_ON_RISK !== 'false';
  if (failOnRisk && highRisk > 0) {
    console.error(`\n[tr-app-hukuk] HATA: ${highRisk} adet yüksek riskli hukuki uyumsuzluk tespit edildi!`);
    process.exit(1);
  }

  console.log('\n[tr-app-hukuk] Denetim başarıyla tamamlandı.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runPrBot().catch((err) => {
    console.error('[tr-app-hukuk] Beklenmeyen hata:', err);
    process.exit(1);
  });
}
