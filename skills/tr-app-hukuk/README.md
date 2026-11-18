[← Ana Depoya Dön](../../README.md)

# tr-app-hukuk Yetenek Modülü

Türkiye mevzuatı ve Kişisel Verilerin Korunması Kanunu (KVKK) uyumluluğu için geliştirilmiş yapay zeka kod denetim yeteneğidir.

---

## İçindekiler

- [Genel Bakış](#genel-bakış)
- [Entegrasyon ve Dosya Yapısı](#entegrasyon-ve-dosya-yapısı)
- [Tetikleme Komutları](#tetikleme-komutları)
- [Denetim Akışı](#denetim-akışı)
- [Referans Kaynakları](#referans-kaynakları)

---

## Genel Bakış

Bu modül, Claude Code, Cursor, Google Antigravity, GitHub Copilot ve Windsurf asistanlarının projeleri Türkiye tüketici, ticaret, telif, yer sağlayıcı ve KVKK mevzuatına göre denetlemesini sağlayan yapısal talimat setidir.

---

## Entegrasyon ve Dosya Yapısı

Modül, ana deponun kök dizininde `npx skills add AtaCanYmc/tr-app-hukuk` veya `npx github:AtaCanYmc/tr-app-hukuk` komutları çalıştırıldığında ilgili yapay zeka aracının çalışma alanı yetenek dizinine yerleştirilir.

```text
skills/tr-app-hukuk/
├── references/
│   ├── ceza-limitleri-2026.md   # 2026 yılı yeniden değerleme oranıyla hesaplanan cezai üst sınırlar
│   ├── emsal-kararlar.md        # Yargıtay içtihat ve emsal karar referansları / arama şablonu
│   ├── kanun-maddeleri.md       # İlgili kanun maddeleri ve fıkra gerekçeleri
│   └── regex-desenleri.md       # TypeScript ve Python ödeme / e-posta regex desen kütüphanesi
├── README.md                    # Bu doküman
└── SKILL.md                     # Asistanın yürüttüğü ana sistem talimatı
```

---

## Tetikleme Komutları

Yapay zeka asistanı sohbet penceresinde aşağıdaki ifadelerden herhangi biri yeteneği devreye alır:

```text
"Projemi hukuki olarak tara"
"Uygulamamı Türkiye yasalarına göre denetle"
"KVKK ve tüketici mevzuatı kontrolü yap"
```

---

## Denetim Akışı

1. **Bağlam Analizi:** Projenin hedef platformu (iOS, Android, Web), harici entegrasyonları (ödeme, analitik, e-posta, CDN) ve toplanan kullanıcı veri kategorileri tespit edilir.
2. **Statik Kod Taraması:** Salt okunur modda kodlar incelenir; her bulgu kesin dosya ve satır referansıyla (`dosya_yolu:satır_no`) eşleştirilir.
3. **Mevzuat ve Emsal Karar Eşleme:** Altı ana yasal başlık altında Durum, Bulgu, Risk Seviyesi ve Çözüm Önerisi tablosu oluşturulur. Cihazda `yargitay-karar-cli` mevcutsa canlı Yargıtay kararları taranır; yoksa kullanıcıya kurulum teklif edilir veya yerleşik `references/emsal-kararlar.md` içtihatları kullanılır.
4. **Opsiyonel Rapor Üretimi:** Kullanıcı onay verirse kök dizinde yapısal bir `hukuk-denetim-raporu.md` dosyası üretilir.
5. **Düzeltme Adımı:** Kullanıcının seçtiği maddeler için hedefe yönelik en az değişiklikle (minimal diff) düzeltme kodları sunulur.

---

## Referans Kaynakları

- **`SKILL.md`**: Asistanın uyacağı salt okunur denetim prensipleri ve raporlama kuralları.
- **`references/ceza-limitleri-2026.md`**: 2026 yılı yeniden değerleme oranı (%25,49) ile güncellenen idari para cezası limitleri.
- **`references/emsal-kararlar.md`**: Tüketici, telif, ticari ileti, yer sağlayıcı ve veri suçları için Yargıtay emsal kararları ve arama şablonu.
- **`references/kanun-maddeleri.md`**: 6502, 6563, 5846, 5651 ve 6698 sayılı kanunların ilgili maddeleri.
- **`references/regex-desenleri.md`**: TypeScript ve Python ödeme sağlayıcıları, abonelik akışları ve e-posta kütüphaneleri için regex kalıpları.
