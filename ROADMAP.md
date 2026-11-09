# Yol Haritası (Roadmap)

`tr-app-hukuk` projesinin planlanan geliştirme adımları.

## [1.0.0] - Mevcut Sürüm
- [x] Sıfır bağımlılıklı `npx github:AtaCanYmc/tr-app-hukuk` kurulum CLI aracı.
- [x] Claude Code `.claude/skills/` yetenek mimarisi.
- [x] 6 temel yasal denetim başlığı (6502, 6563, 5846, 5651, KVKK m.10, KVKK m.9/12).
- [x] 2026 yılı yeniden değerleme oranı tablosu (%25,49).
- [x] İsteğe bağlı `hukuk-denetim-raporu.md` dosya üretim akışı.
- [x] GitHub Actions CI ve Release Please entegrasyonu.

## [1.1.0] - Planlanan
- [x] Cursor, Gemini, Copilot ve Windsurf için çoklu hedef bayrakları (`--target=cursor`, `--target=gemini`, vb.).
- [ ] Doğrudan terminal çıktısı için `--print` ve `--dry-run` parametreleri.
- [ ] TypeScript/Python tabanlı ödeme ve e-posta kütüphaneleri için regex desen kütüphanesi.

## [2.0.0] - Gelecek Hedefler
- [ ] CI pipeline üzerinde doğrudan çalıştırılabilen headless denetim modu (`npx github:AtaCanYmc/tr-app-hukuk --check`).
- [ ] JSON formatında makine tarafından okunabilir denetim çıktısı (`--json`).
