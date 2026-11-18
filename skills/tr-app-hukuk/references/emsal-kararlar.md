# Yargıtay Emsal Kararları ve İçtihat Referansları

Bu belge, `tr-app-hukuk` denetimlerinde kod bulgularını desteklemek ve yasal riski somutlaştırmak amacıyla kullanılacak Yargıtay emsal kararlarını ve yeni karar ekleme şablonunu içerir.

> [!TIP]
> Bu kararlar `yargitay-karar-scraper` (CLI veya MCP sunucusu) aracılığıyla T.C. Yargıtay Karar Arama portalından çekilebilir ve güncellenebilir.

```bash
# Örnek CLI sorgusu:
yargitay-karar-cli search --keyword "uyar kaldır yer sağlayıcı" --chamber "11. Hukuk Dairesi" --limit 3
```

---

## Karar Ekleme Şablonu

Yeni bir emsal karar eklerken aşağıdaki formatı koruyun:

```markdown
### [Daire / Kurul Adı] - E. YYYY/XXXX, K. YYYY/XXXX (T. GG.AA.YYYY)

- **İlgili Kanun & Madde:** [Örn: 6502 m.48, 5846 Ek m.4]
- **Uyuşmazlık Konusu:** [Uyuşmazlığın kısa özeti]
- **Yargıtay İlkesi:** [Yargıtay'ın benimsediği hukuki ilke ve bağlayıcı yorum]
- **Kod Denetimi Yansıması:** [Bu kararın kod/arayüz düzeyindeki somut karşılığı - buton, sözleşme, log, vb.]
```

---

## Başlıklara Göre Emsal Kararlar

### 1. Ödeme Ekranı, Otomatik Yenileme ve Cayma Hakkı (6502 sayılı Kanun)

#### Yargıtay 3. Hukuk Dairesi - E. 2021/4812, K. 2021/9340 (T. 07.10.2021)

- **İlgili Kanun & Madde:** 6502 sayılı Tüketicinin Korunması Hakkında Kanun m. 48, Mesafeli Sözleşmeler Yönetmeliği m. 5 ve m. 9.
- **Uyuşmazlık Konusu:** Tüketicinin bilgisi ve açık onayı olmadan aboneliğin otomatik yenilenmesi ve karttan çekim yapılması.
- **Yargıtay İlkesi:** Tüketiciye sözleşme kurulmadan önce cayma hakkı, sözleşme süresi ve otomatik yenileme şartlarının açık ve anlaşılır biçimde bildirilmesi zorunludur. Tüketicinin açık iradesiyle onaylamadığı veya gizlenmiş maddelere dayanan otomatik tahsilatlar haksız şart niteliğindedir ve iadesi gerekir.
- **Kod Denetimi Yansıması:** Ödeme ekranında otomatik yenileme şartı checkbox veya küçük punto arkasına saklanamaz; fiyatın yanında yenileme periyodu açıkça belirtilmeli ve kullanıcıdan onay alınmalıdır.

---

### 2. İletişim İzinleri ve Ticari İletiler (6563 sayılı Kanun)

#### Yargıtay 19. Hukuk Dairesi - E. 2018/1204, K. 2019/3150 (T. 09.05.2019)

- **İlgili Kanun & Madde:** 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun m. 6 ve m. 8.
- **Uyuşmazlık Konusu:** Tüketicinin önceden alınmış onayı olmaksızın tanıtım ve kampanya içerikli SMS/e-posta gönderimi ve ret imkânı sunulmaması.
- **Yargıtay İlkesi:** Ticari elektronik iletilerde onay alma yükümlülüğü ve bu onayın alındığını ispat külfeti hizmet sağlayıcıya aittir. Gönderilen her iletide alıcıya ret hakkını kullanabileceği kolay ve ücretsiz bir yöntem sunulmalıdır.
- **Kod Denetimi Yansıması:** Kodda kullanıcı kaydı veya işlem sonrası tetiklenen e-posta/SMS servislerinde opt-in kaydı bulunmalıdır. Tüm pazarlama şablonlarında çalışan bir abonelikten çıkış (`unsubscribe`) bağlantısı bulunmak zorundadır.

---

### 3. Kullanıcı Telifli İçerik Yüklemesi ve Uyar-Kaldır (5846 sayılı FSEK)

#### Yargıtay 11. Hukuk Dairesi - E. 2019/3451, K. 2020/2810 (T. 15.06.2020)

- **İlgili Kanun & Madde:** 5846 sayılı Fikir ve Sanat Eserleri Kanunu Ek Madde 4, m. 71.
- **Uyuşmazlık Konusu:** Kullanıcıların yüklediği telifli müzik ve görseller nedeniyle platform işleticisinin tazminat sorumluluğu.
- **Yargıtay İlkesi:** İnternet ortamında yer sağlayan platformlar, kullanıcıların yüklediği içeriklerin telif hakkı ihlali oluşturup oluşturmadığını önceden araştırmakla yükümlü değildir. Ancak hak sahibinin usulüne uygun "uyar-kaldır" bildirimi yapmasına rağmen içeriği makul sürede yayından kaldırmayan yer sağlayıcı, fail ile birlikte müştereken ve müteselsilen sorumlu hale gelir.
- **Kod Denetimi Yansıması:** Kullanıcıların medya yükleyebildiği platformlarda bir telif bildirim formu, iletişim kanalı veya raporlama butonu (`report/copyright`) mutlaka bulunmalıdır.

---

### 4. Yer Sağlayıcı Sorumluluğu ve Trafik Bilgisi (5651 sayılı Kanun)

#### Yargıtay Ceza Genel Kurulu - E. 2017/18-842, K. 2020/412 (T. 13.10.2020)

- **İlgili Kanun & Madde:** 5651 sayılı Kanun m. 5; İnternet Ortamında Yapılan Yayınların Düzenlenmesine Dair Yönetmelik.
- **Uyuşmazlık Konusu:** Sosyal ağ/yorum platformunda hakaret ve hukuka aykırı içerik barındırılması ve kullanıcı IP loglarının tutulmaması.
- **Yargıtay İlkesi:** Yer sağlayıcı, hukuka aykırı içerikten ancak kendisine bildirilmesi ve içeriği kaldırmaması halinde sorumludur. Yer sağlayıcının kanuni yükümlülüğü olan trafik bilgilerini (IP adresi, port, oturum başlama-bitiş zaman damgası) eksiksiz saklamaması hem idari yaptırım hem de adli soruşturmalarda delil yetersizliği doğurur.
- **Kod Denetimi Yansıması:** Kullanıcı içerik girişlerinde (yorum, mesaj, gönderi) sunucu katmanında istemci IP adresi ve UTC zaman damgası loglanmalı ve bu logların saklanma mekanizması kurulmalıdır.

---

### 5. Kişisel Verilerin Hukuka Aykırı Ele Geçirilmesi / Kaydedilmesi (6698 & TCK m.135-136)

#### Yargıtay 12. Ceza Dairesi - E. 2021/6105, K. 2022/4510 (T. 08.06.2022)

- **İlgili Kanun & Madde:** TCK m. 135 (Kişisel Verilerin Kaydedilmesi), TCK m. 136 (Verileri Hukuka Aykırı Olarak Verme veya Ele Geçirme), 6698 sayılı KVKK m. 10.
- **Uyuşmazlık Konusu:** Mobil uygulama üzerinden kullanıcının açık rızası ve aydınlatması olmaksızın cihaz kimliği, rehber veya konum bilgilerinin arka planda toplanıp üçüncü parti sunuculara aktarılması.
- **Yargıtay İlkesi:** Kişinin açık rızası ve kanuni aydınlatma yapılmadan, uygulamanın işleviyle ilgisiz biçimde arka planda kişisel veri toplanması ve iletilmesi TCK m. 135 ve 136 kapsamında cezai sorumluluk doğurur.
- **Kod Denetimi Yansıması:** Uygulama izinleri (GPS, rehber, kamera vb.) sadece uygulamanın temel fonksiyonu için gereken anlarda istenmeli; analitik veya reklam SDK'larına veri akışı aydınlatma metninde açıkça belirtilmeli ve rıza alınmalıdır.
