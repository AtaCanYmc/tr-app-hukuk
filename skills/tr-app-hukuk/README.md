[← Ana Depoya Dön](../../README.md)

# tr-app-hukuk Yeteneği

Claude Code ve uyumlu yapay zeka kodlama asistanları için Türkiye mevzuatı ve KVKK denetim modülüdür.

## Entegrasyon

Bu klasör, ana projenin kök dizininde `npx github:AtaCanYmc/tr-app-hukuk` çalıştırıldığında projenin `.claude/skills/tr-app-hukuk` dizinine kopyalanır.

## Kullanım Komutları

Claude Code oturumunda aşağıdaki ifadelerden herhangi biri yeteneği tetikler:

```text
"Projemi hukuki olarak tara"
"Uygulamamı Türkiye yasalarına göre denetle"
"KVKK ve tüketici mevzuatı kontrolü yap"
```

Tarama bitiminde asistan size sonuçları `hukuk-denetim-raporu.md` dosyası olarak kaydetmek isteyip istemediğinizi sorar ve onaylarsanız oluşturur.

## Denetim Akışı

1. **Bağlam Tespiti:** Projenin platformu, harici bağımlılıkları, ödeme ve analitik altyapısı tespit edilir.
2. **Statik Kod Taraması:** İlgili dosyalar taranarak dosya ve satır numaralarıyla bulgular listelenir.
3. **Tablo Raporu:** Altı yasal başlık altında Durum, Bulgu, Risk Seviyesi ve Önerilen Düzeltme sunulur.
4. **Rapor Dosyası Çıktısı:** Kullanıcı onay verirse kök dizinde `hukuk-denetim-raporu.md` dosyası üretilir.
5. **Düzeltme Adımı:** Kullanıcının seçtiği maddeler için kod refactor önerisi sunulur.

## Dosya Yapısı

- `SKILL.md`: Asistanın izleyeceği çalışma kuralları ve prompt yönergeleri.
- `references/ceza-limitleri-2026.md`: 2026 yeniden değerleme oranı ile hesaplanan idari para cezası limitleri.
- `references/kanun-maddeleri.md`: 6502, 6563, 5846, 5651 ve 6698 sayılı kanunların ilgili bentleri.
