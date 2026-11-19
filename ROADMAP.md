# Yol Haritası (Roadmap)

`tr-app-hukuk` projesinin tamamlanan ve planlanan geliştirme kilometre taşları.

## [1.0.0] - Tamamlandı

- [x] Sıfır bağımlılıklı `npx github:AtaCanYmc/tr-app-hukuk` kurulum CLI aracı.
- [x] Claude Code `.claude/skills/` yetenek mimarisi.
- [x] 6 temel yasal denetim başlığı (6502, 6563, 5846, 5651, KVKK m.10, KVKK m.9/12).
- [x] 2026 yılı yeniden değerleme oranı tablosu (%25,49).
- [x] İsteğe bağlı `hukuk-denetim-raporu.md` dosya üretim akışı.
- [x] GitHub Actions CI ve Release Please entegrasyonu.

## [1.1.0] - Tamamlandı

- [x] Cursor, Gemini, Copilot ve Windsurf için çoklu hedef bayrakları (`--target=cursor`, `--target=gemini`, vb.).
- [x] Doğrudan terminal çıktısı ve simülasyon için `--print` ve `--dry-run` parametreleri.
- [x] TypeScript/Python tabanlı ödeme ve e-posta kütüphaneleri için regex desen kütüphanesi.
- [x] Yargıtay emsal kararları entegrasyonu ve `yargitay-karar-cli` tespit mekanizması.

## [1.2.0] - Mevcut Sürüm

- [x] CI/CD pipeline üzerinde doğrudan çalıştırılabilen headless denetim modu (`--check`).
- [x] JSON formatında makine tarafından okunabilir denetim çıktısı (`--json`).
- [x] JSON Schema standartlarında denetim raporu şeması (`references/rapor-semasi.json`).
- [x] Kayıt, iletişim ve bülten formlarında KVKK Aydınlatma Metni linki ve açık rıza ayrımı denetimi (KVKK m.5 & m.10).
- [x] Supabase veritabanı Row Level Security (RLS) ve istemciye sızan `service_role` anahtarı kontrolleri (KVKK m.12).
- [x] 72 saat içinde Kurul'a veri ihlali bildirimi için audit log ve alerting mekanizması denetimi (KVKK m.12/5).
- [x] Ticari SMS ve İYS (İleti Yönetim Sistemi) ön onay kontrolü (6563 sayılı Kanun).
- [x] Ödeme öncesi Ön Bilgilendirme Formu (ÖBF) ve Mesafeli Satış Sözleşmesi (MSS) onay kontrolü (6502 sayılı Kanun m.48).
- [x] Google Fonts ve CDN tespiti ile yerel barındırma (self-host) çözüm rehberi (KVKK m.9 & LG München emsali).
- [x] Release Please manifestosu ve tüm depo genelinde versiyon senkronizasyonu (`extra-files`).
- [x] Otomatik GitHub Actions hibrit PR denetim botu ve yasal risk raporlayıcısı (`action.yml` & `scripts/pr-bot.js`).

## [2.0.0] - Planlanan

- [ ] Zengin metinli interaktif terminal arayüzü (TUI) ve filtreleme.
- [ ] Mevzuat değişikliklerini ve Kurul ilke kararlarını otomatik izleyen senkronizasyon motoru.
