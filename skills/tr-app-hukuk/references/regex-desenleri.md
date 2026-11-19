# Hukuki Kod Denetimi Regex Desen Kütüphanesi

Bu belge, `tr-app-hukuk` denetimlerinde TypeScript/JavaScript, Python ve SQL kod tabanlarındaki ödeme, sözleşme, ticari ileti (e-posta & SMS), İYS, KVKK formları, veritabanı/Supabase RLS ve harici yurt dışı kaynakları kesin satır referanslarıyla (`dosya:satır`) tespit etmek için kullanılan regex desenlerini içerir.

---

## 1. Ödeme, Abonelik ve Mesafeli Sözleşmeler (6502 sayılı Kanun)

Tüketiciyi yanıltan otomatik yenilemeler, gizlenmiş abonelik bedelleri, onaysız kart saklama ve **Ön Bilgilendirme Formu / Mesafeli Satış Sözleşmesi onaysız tahsilatları** tespit etmek için kullanılır.

### 1.1. TypeScript / JavaScript Ödeme Sağlayıcıları

#### İçe Aktarma ve İstemci Tanımlamaları

```regex
# iyzico
(?:import\s+.*?\s+from\s+['"]iyzipay['"]|require\(['"]iyzipay['"]\)|new\s+Iyzipay\()

# Stripe
(?:import\s+.*?\s+from\s+['"]stripe['"]|require\(['"]stripe['"]\)|new\s+Stripe\()

# LemonSqueezy
(?:import\s+.*?\s+from\s+['"]@lemonsqueezy/lemonsqueezy\.js['"]|require\(['"]@lemonsqueezy/lemonsqueezy\.js['"]\)|lemonSqueezySetup\()

# PayTR & Yerel Sağlayıcılar
(?:PayTRToken|get_token|paytr_token|new\s+PayTR|from\s+['"]@param/|from\s+['"]@hepsipay/)

# Paddle & RevenueCat
(?:from\s+['"]@paddle/paddle-node-sdk['"]|from\s+['"]purchases-typescript['"]|Purchases\.configure)
```

#### Abonelik ve Checkout Çağrıları

```regex
# Checkout ve Oturum Başlatma
(?:\.checkout\.sessions\.create|\.subscription\.initialize|checkoutFormInitialize|createCheckout\()

# Abonelik ve Periyot Belirteçleri
(?:mode:\s*['"]subscription['"]|interval:\s*['"](?:month|year|week)['"]|recurring:\s*\{)
```

#### Şüpheli Otomatik Yenileme ve Kart Saklama Kalıpları

```regex
# Otomatik Yenileme Bayrakları
(?:auto_renew|autoRenew|recurringPayment|isRecurring)\s*[:=]\s*(?:true|1)

# Kart Saklama / Card on File
(?:setup_future_usage|save_card|saveCard|store_card|rememberCard)\s*[:=]\s*(?:true|['"]off_session['"]|['"]on_session['"])
```

### 1.2. Ön Bilgilendirme Formu (ÖBF) ve Mesafeli Satış Sözleşmesi (MSS) Onay Desenleri

Ödeme butonuna basılmadan veya checkout oturumu başlatılmadan önce sözleşmelerin onaylandığını doğrulayan yapılar:

```regex
# Ön Bilgilendirme ve Mesafeli Sözleşme Kontrolleri
(?:pre_information_form|on_bilgilendirme|onBilgilendirmeFormu|distance_sales_agreement|mesafeli_satis|mesafeliSatisSozlesmesi)

# Sözleşme Onay State ve Checkbox Kalıpları
(?:isTermsAccepted|isAgreementsChecked|hasAcceptedDistanceContract|acceptContracts|sozlesmeOnay)\s*[:=]\s*(?:true|false|boolean)

# Tehlikeli: Sözleşme Onay Kontrolü Olmadan Doğrudan Ödeme Çağrısı
(?:onClick|onSubmit)\s*=\s*\{\s*(?:handleCheckout|startPayment|processPayment)\s*\}
```

---

## 2. Ticari İletiler, E-posta, SMS ve İYS (6563 sayılı ETK & İYS Yönetmeliği)

Onaysız pazarlama gönderimleri, ticari bültenler, SMS bildirimleri ve İYS (`İleti Yönetim Sistemi`) onay kontrolü eksikliklerini tespit etmek için kullanılır.

### 2.1. E-posta Sağlayıcıları ve Gönderim Çağrıları

```regex
# E-posta Sağlayıcı Tanımları (TS/JS & Python)
(?:from\s+['"](?:nodemailer|resend|@sendgrid\/mail|postmark|mailgun\.js|@aws-sdk\/client-ses)['"]|from\s+django\.core\.mail|from\s+fastapi_mail)

# E-posta Gönderim Çağrıları
(?:\.sendMail\(|resend\.emails\.send\(|sgMail\.send\(|client\.sendEmail\(|transporter\.send\(|send_mail\(|send_mass_mail\()

# Kampanya ve Bülten Şablonları
(?:subject|template|category|tags)\s*[:=]\s*.*?(?:bülten|kampanya|newsletter|promotion|marketing|duyuru|indirim)
```

### 2.2. SMS Sağlayıcıları ve Gönderim Çağrıları

```regex
# SMS Sağlayıcı Tanımları (Netgsm, Twilio, MutluCell, İletimerkezi, Vatansms)
(?:from\s+['"](?:netgsm|twilio|mutlucell|iletimerkezi|vatansms)['"]|require\(['"](?:netgsm|twilio)['"]\)|new\s+Twilio\()

# SMS Gönderim Çağrıları
(?:\.messages\.create\(|netgsm\.sendSms\(|sendSMS\(|send_sms\(|mutlucell\.send\()
```

### 2.3. İYS (İleti Yönetim Sistemi) ve Onay Kontrol Desenleri

Gönderimden önce alıcının İYS sisteminde onaylı olup olmadığını denetleyen desenler:

```regex
# İYS Kontrol Fonksiyon ve Değişkenleri (Mevcut olması gerekenler)
(?:iys|iys_code|iysStatus|checkIysConsent|iysOnay|queryIys|validateIysConsent|isCommercialConsentGranted)

# Ret ve Unsubscribe Doğrulama Kalıpları
(?:unsubscribe|opt-out|ret-hakki|abonelikten[-_]cik|list-unsubscribe|RET\s+[A-Z0-9]+)
```

---

## 3. Kayıt, İletişim, Bülten Formları ve KVKK Aydınlatma / Rıza Ayrımı (KVKK m.10 & m.5)

Form bileşenlerinde aydınlatma linkinin varlığı ve açık rıza onayının aydınlatma metninden ayrı tutulup tutulmadığını tespit eder.

```regex
# Form Tanımları (Kayıt, İletişim, Bülten)
(?:<form|useForm|handleSubmit|registerForm|signupForm|contactForm|newsletterForm|newsletter_subscription)

# KVKK Aydınlatma Metni Bağlantısı (Bulunması Zorunlu)
(?:href\s*=\s*['"]\/(?:kvkk|aydinlatma|aydinlatma-metni|privacy-policy|gizlilik-politikasi)['"]|AydinlatmaMetniModal|KvkkModal)

# Hatalı / Tehlikeli: Aydınlatma ile Açık Rızayı Tek Kutuda Birleştiren Kalıplar
(?:Aydınlatma\s+metnini\s+okudum.*(?:kabul|onay|açık\s+rıza)|kvkkAndConsent|termsAndPrivacyConsent)

# Hatalı: Açık Rıza Kutusunun Varsayılan Olarak İşaretli (Pre-ticked) Gelmesi
(?:defaultChecked\s*=\s*\{?true\}?|checked\s*=\s*\{?true\}?)
```

---

## 4. Veritabanı & Supabase RLS ve Gizli Anahtar Sızıntıları (KVKK m.12)

Supabase veya veritabanı katmanında RLS (`Row Level Security`) durumunu ve istemciye sızan `service_role` gibi yetkili anahtarları tespit eder.

```regex
# Supabase İstemci Başlatma
(?:createClient\s*\(\s*process\.env\.|createBrowserClient|createServerClient)

# Tehlikeli: service_role Anahtarının İstemciye Açılması (Next.js / Vite / Client Bundle)
(?:NEXT_PUBLIC_.*SERVICE_ROLE|VITE_.*SERVICE_ROLE|REACT_APP_.*SERVICE_ROLE|PUBLIC_.*SERVICE_ROLE)

# Tehlikeli: Hardcoded Supabase Service Role Key veya Secret Key
(?:service_role|supabase_admin_key)\s*[:=]\s*['"]ey[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+['"]

# SQL / Migration: RLS Etkinleştirme (Mevcut olması gereken)
(?:alter\s+table\s+.*?enable\s+row\s+level\s+security|create\s+policy\s+)
```

---

## 5. 72 Saat Veri İhlali Bildirimi, Güvenlik Loglama ve Alerting (KVKK m.12/5)

Veri güvenliği ihlallerini Kurul'a 72 saat içinde bildirebilmek için gerekli denetim izi (audit log) ve gerçek zamanlı uyarı sistemlerini tarar.

```regex
# Güvenlik ve Denetim İzi Logları (Audit Logging)
(?:auditLog|securityLog|logSecurityEvent|accessLog|authAudit|logBreachAttempt)

# Anlık Hata ve Güvenlik Alarmları (Alerting / Webhook)
(?:sentry\.captureException|datadog\.increment|pagerduty|opsgenie|alertWebhook|securityAlertChannel)

# Güvenlik İletişim Adımı / Bildirim Dosyası
(?:security@|SECURITY\.md|security_contact|reportSecurityIssue)
```

---

## 6. Yurt Dışı Sunucular, CDN ve Google Fonts Tespiti (KVKK m.9)

Son kullanıcı IP adresini veya verisini kullanıcının açık rızası olmaksızın yurt dışına aktaran kaynakları tespit eder.

```regex
# Google Fonts Harici İstekleri (Self-host yapılması gerekenler)
(?:fonts\.googleapis\.com|fonts\.gstatic\.com|@import\s+url\(['"]https:\/\/fonts\.googleapis)

# Harici CDN İstekleri
(?:cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|code\.jquery\.com)

# Önerilen Yerel Font Çözümleri (Self-host Uyumluluk Kalıpları)
(?:next\/font\/(?:google|local)|@fontsource\/|@nuxtjs\/google-fonts)
```

---

## 7. Pratik CLI Tarama Komutları

Asistan denetim sırasında hedef kod tabanında aşağıdaki komut kalıplarını çalıştırabilir:

```bash
# 1. Supabase service_role ve istemci anahtarlarını tara:
grep -rnE "(SERVICE_ROLE|service_role|supabase_admin)" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.env*" .

# 2. Google Fonts ve harici CDN referanslarını ara:
grep -rnE "(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com)" .

# 3. Form bileşenlerinde KVKK linki ve açık rıza kontrollerini tara:
grep -rnEi "(kvkk|aydinlatma|acik-riza|onay|newsletter|contact)" --include="*.tsx" --include="*.jsx" --include="*.vue" --include="*.html" .

# 4. SMS sağlayıcıları ve İYS kontrollerini tara:
grep -rnE "(netgsm|twilio|mutlucell|iletimerkezi|vatansms|iys|checkIys)" --include="*.ts" --include="*.js" --include="*.py" .

# 5. Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi kontrollerini tara:
grep -rnEi "(pre_information|on_bilgilendirme|distance_sales|mesafeli_satis)" --include="*.ts" --include="*.tsx" --include="*.js" .

# 6. Veritabanı tablolarında RLS durumunu kontrol et (SQL/Migration):
grep -rnEi "(enable\s+row\s+level\s+security|create\s+policy)" --include="*.sql" .
```
