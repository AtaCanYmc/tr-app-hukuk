# İlgili Mevzuat Maddeleri Özeti

Kod incelemelerinde hukuki dayanak oluşturacak temel kanun maddeleri ve gereklilikleri.

---

## 1. 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK)

- **Madde 10 (Aydınlatma Yükümlülüğü):** Veri sorumlusu; verilerin hangi amaçla işleneceği, kimlere aktarılacağı, toplama yöntemi, hukuki sebebi ve 11. maddedeki haklar konusunda veri sahibini ilk temas anında (kayıt, iletişim, bülten formları vb.) bilgilendirmekle yükümlüdür.
- **Madde 5 (Açık Rıza ve Aydınlatmanın Ayrılması İlkesi):** Açık rıza; belirli bir konuya ilişkin, bilgilendirilmeye dayanan ve özgür iradeyle açıklanan rızadır. Aydınlatma tek taraflı bir bildirim olup kullanıcıya "onaylatılamaz". Aydınlatma metni ile açık rızanın tek kutuda birleştirilmesi veya hizmet şartı olarak rıza dayatılması hukuken geçersizdir.
- **Madde 9 (Kişisel Verilerin Yurt Dışına Aktarılması):** Yurt dışı sunuculara veya CDN ağlarına (Google Fonts, Sentry, Mixpanel vb.) veri (IP adresi dahil) aktarımı ancak Kurul onaylı güvenceler (standart sözleşme vb.) veya açık rıza ile mümkündür.
- **Madde 12 (Veri Güvenliğine İlişkin Yükümlülükler):** Veri sorumlusu, kişisel verilerin hukuka aykırı işlenmesini ve erişilmesini önlemek amacıyla her türlü teknik (veritabanı güvenliği, Row Level Security - RLS, gizli anahtarların istemciden gizlenmesi) ve idari tedbiri almak zorundadır.
- **Madde 12/5 (Veri İhlali Bildirimi - 72 Saat Kuralı):** İşlenen kişisel verilerin kanuni olmayan yollarla başkaları tarafından elde edilmesi hâlinde, veri sorumlusu bu durumu en kısa sürede ve en geç **72 saat içinde** Kurul'a ve ilgilisine bildirir. Bu sebeple sistemlerde audit log ve anlık alert mekanizması bulunması zorunludur.

---

## 2. 6502 Sayılı Tüketicinin Korunması Hakkında Kanun & Mesafeli Sözleşmeler Yönetmeliği

- **Madde 48 (Mesafeli Sözleşmeler):** Tüketici sözleşme kurulmadan veya buna karşılık gelen herhangi bir teklifi kabul etmeden önce bilgilendirilmelidir. Cayma hakkı konusunda bilgilendirilmeyen tüketici 14 günlük süreyle bağlı değildir.
- **Yönetmelik Madde 5, 6 ve 7 (Ön Bilgilendirme Formu ve Sözleşme Onayı):** Tüketici, mesafeli sözleşmenin kurulmasından ya da buna karşılık gelen herhangi bir ödeme yükümlülüğü altına girmeden önce Ön Bilgilendirme Formu ile bilgilendirilmek ve bu formu ile Mesafeli Satış Sözleşmesini açıkça onaylamak zorundadır.
- **Madde 62 (Ticari Reklam ve Haksız Ticari Uygulamalar):** Tüketiciyi aldatıcı veya onun tecrübe ve bilgi noksanlıklarını istismar edici uygulamalar yapılamaz. Otomatik abonelik yenilemeleri şeffaf olmalı, gizli yenileme (dark pattern) tuzakları kurulamaz.

---

## 3. 6563 Sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun & İYS Yönetmeliği

- **Madde 6 (Ticari Elektronik İleti Gönderme Şartı):** Ticari elektronik iletiler (kampanya/tanıtım e-postası ve SMS), alıcılara ancak önceden onayları alınmak kaydıyla gönderilebilir.
- **İleti Yönetim Sistemi (İYS) Yönetmeliği:** Hizmet sağlayıcılar, ticari elektronik ileti gönderebilmek için onayları İYS'ye kaydetmek ve gönderim öncesinde alıcının İYS üzerinde onay durumunu sorgulamakla yükümlüdür. Onayı bulunmayan alıcılara ticari ileti gönderilemez.
- **Madde 7 (İletinin İçeriği):** İletide hizmet sağlayıcının tanınmasını sağlayan unvan, MERSİS/iletişim adresi yer almalıdır.
- **Madde 8 (Reddetme Hakkı):** Alıcı hiçbir gerekçe göstermeksizin ticari elektronik iletileri almayı reddedebilir; ret bildirimi imkânı iletide kolay ve ücretsiz şekilde (e-postada unsubscribe linki, SMS'te ret kodu/numarası) sunulmalıdır.

---

## 4. 5846 Sayılı Fikir ve Sanat Eserleri Kanunu

- **Ek Madde 4 & Madde 71 (Uyar-Kaldır Prensibi):** Eser sahiplerinin haklarının ihlali durumunda, hak sahibi ihlalin durdurulmasını talep eder. İçeriği kaldırmayan sağlayıcı hukuki ve cezai olarak sorumlu hale gelir.

---

## 5. 5651 Sayılı Kanun

- **Madde 5 (Yer Sağlayıcının Yükümlülükleri):** Yer sağlayıcı, yer sağladığı içeriği kontrol etmek veya hukuka aykırı bir faaliyetin söz konusu olup olmadığını araştırmakla yükümlü değildir. Ancak haberdar edildiğinde hukuka aykırı içeriği yayından çıkarmakla yükümlüdür.
- **Trafik Bilgisi:** Yer sağlayıcı, yer sağladığı hizmetlere ilişkin trafik bilgilerini kanunda belirtilen süre boyunca saklamak ve doğruluğunu sağlamakla yükümlüdür.
