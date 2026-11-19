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

### 1. Ödeme Ekranı, Ön Bilgilendirme ve Mesafeli Satış Sözleşmesi (6502 sayılı Kanun)

#### Yargıtay 3. Hukuk Dairesi - E. 2021/4812, K. 2021/9340 (T. 07.10.2021)

- **İlgili Kanun & Madde:** 6502 sayılı Tüketicinin Korunması Hakkında Kanun m. 48, Mesafeli Sözleşmeler Yönetmeliği m. 5, m. 6 ve m. 9.
- **Uyuşmazlık Konusu:** Tüketicinin bilgisi ve açık onayı olmadan aboneliğin otomatik yenilenmesi, Ön Bilgilendirme Formu gösterilmeden karttan çekim yapılması.
- **Yargıtay İlkesi:** Tüketiciye sözleşme kurulmadan önce cayma hakkı, sözleşme süresi, nihai bedel ve otomatik yenileme şartlarının yer aldığı Ön Bilgilendirme Formu ile Mesafeli Satış Sözleşmesinin açık ve anlaşılır biçimde sunulup onaylatılması zorunludur. Tüketicinin açık iradesiyle onaylamadığı veya gizlenmiş maddelere dayanan otomatik tahsilatlar haksız şart niteliğindedir ve iadesi gerekir.
- **Kod Denetimi Yansıması:** Ödeme butonundan önce Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi checkbox veya onay adımları zorunlu olmalı; onay kontrolü (`isTermsAccepted`) yapılmadan ödeme API'si çağrılmamalıdır.

---

### 2. İletişim İzinleri, SMS ve İYS Denetimi (6563 sayılı Kanun & İYS Yönetmeliği)

#### Yargıtay 19. Hukuk Dairesi - E. 2018/1204, K. 2019/3150 (T. 09.05.2019)

- **İlgili Kanun & Madde:** 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun m. 6 ve m. 8; Ticari İletişim ve Ticari Elektronik İletiler Hakkında Yönetmelik (İYS Hükümleri).
- **Uyuşmazlık Konusu:** Tüketicinin önceden alınmış İYS veya doğrudan onayı olmaksızın tanıtım ve kampanya içerikli SMS/e-posta gönderimi ve ret imkânı sunulmaması.
- **Yargıtay İlkesi:** Ticari elektronik iletilerde onay alma yükümlülüğü ve bu onayın alındığını ispat külfeti hizmet sağlayıcıya aittir. İleti Yönetim Sistemi (İYS) kaydı ve onayı bulunmayan alıcılara kampanya gönderimi yapılamaz. Gönderilen her iletide alıcıya ret hakkını kullanabileceği kolay ve ücretsiz bir yöntem (SMS ret kodu, e-posta unsubscribe bağlantısı) sunulmalıdır.
- **Kod Denetimi Yansıması:** E-posta veya SMS gönderen servis çağrılarından önce alıcının İYS izin durumu (`checkIysConsent`) sorgulanmalı; şablonlarda ret mekanizması bulunmalıdır.

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

### 5. Formlarda Aydınlatma ve Açık Rızanın Ayrılması İlkesi (6698 sayılı KVKK m.10 & m.5)

#### KVKK Kurulu İlke Kararı - 27/02/2020 Tarih ve 2020/917 Sayılı Karar (ve 2019/387 Sayılı Karar)

- **İlgili Kanun & Madde:** 6698 sayılı KVKK m. 5, m. 10; Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ.
- **Uyuşmazlık Konusu:** Web ve mobil kayıt formlarında Aydınlatma Metni ile Açık Rıza metninin tek bir kutucuk altında birleştirilmesi, rızanın hizmet şartı koşulması.
- **Kurul İlkesi:** Aydınlatma yükümlülüğü ile açık rıza alma şartı hukuken birbirinden tamamen farklı müesseselerdir. Aydınlatma tek taraflı bir bilgilendirmedir ve kullanıcıya onaylatılamaz. Açık rıza ise özgür iradeye dayanmalıdır. Aydınlatma metnini onay kutusu içine almak ("Aydınlatma metnini okudum ve kabul ediyorum/açık rıza veriyorum") açık rızayı sakatlar. Açık rıza ve aydınlatma ayrı tutulmalı, kutucuklar önceden işaretli (pre-ticked) olmamalıdır.
- **Kod Denetimi Yansıması:** Formlarda Aydınlatma Metni link/modal olarak bilgilendirme amaçlı gösterilmeli; varsa açık rıza için ayrı, bağımsız ve önceden işaretlenmemiş bir checkbox sunulmalıdır.

---

### 6. Veri Güvenliği, Supabase / Veritabanı RLS ve 72 Saat İhlal Bildirimi (KVKK m.12)

#### KVKK Kurulu Veri İhlali Kararı - 2021/1183 (ve Yemeksepeti / Marriot Emsalleri)

- **İlgili Kanun & Madde:** 6698 sayılı KVKK m. 12/1 (Teknik Tedbirler) ve m. 12/5 (Veri İhlali Bildirimi).
- **Uyuşmazlık Konusu:** Veritabanı güvenlik politikalarının (RLS vb.) açık bırakılması veya anahtar sızıntısı sonucu yetkisiz kişilerin verilere erişmesi ve ihlalin 72 saat içinde Kurul'a bildirilmemesi.
- **Kurul İlkesi:** Veri sorumluları yetkisiz erişimi engellemek için veritabanı erişim kontrollerini (Row Level Security, anahtar saklama vb.) eksiksiz almakla yükümlüdür. Olası bir sızıntı durumunda ihlalin öğrenildiği andan itibaren en geç **72 saat içinde** Kurul'a ve veri sahiplerine bildirim zorunludur. Denetim logu ve anlık alarm mekanizması bulunmaması nedeniyle ihlali geç fark etmek veya bildirmemek ağır idari para cezası sebebidir.
- **Kod Denetimi Yansıması:** Supabase `public` tablolarında RLS açık olmalı; `service_role` istemciye sızdırılmamalı; audit log ve anlık alert (Sentry, webhook vb.) tanımlanmalıdır.

---

### 7. Yurt Dışına Veri Aktarımı ve Google Fonts Emsali (KVKK m.9)

#### LG München I (Münih Eyalet Mahkemesi) - 20.01.2022, 3 O 17493/20

- **İlgili Kanun & Madde:** 6698 sayılı KVKK m. 9 (ve GDPR m. 6, m. 44).
- **Uyuşmazlık Konusu:** Web sitesinde Google Fonts'un dinamik olarak Google sunucularından (`fonts.googleapis.com`) çağrılması nedeniyle kullanıcının IP adresinin rızasız olarak ABD sunucularına aktarılması.
- **Mahkeme / Kurul İlkesi:** Dinamik yazı tipi (Google Fonts CDN) çağrısı sırasında son kullanıcının kişisel verisi niteliğindeki IP adresi kullanıcının açık rızası olmaksızın harici/yurt dışı sunucuya iletilmektedir. Fontların yerel olarak barındırılması (self-host) teknik olarak mümkünken dinamik çekilmesi hukuka aykırıdır.
- **Kod Denetimi Yansıması:** Harici Google Fonts CDN çağrıları yerine font dosyaları projeye indirilip (`woff2`) kendi sunucusundan servis edilmelidir (`next/font`, `@fontsource/*` vb.).
