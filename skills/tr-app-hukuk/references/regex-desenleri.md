# Ödeme ve E-posta Regex Desen Kütüphanesi

Bu belge, `tr-app-hukuk` denetimlerinde TypeScript/JavaScript ve Python kod tabanlarındaki ödeme, abonelik ve ticari ileti (e-posta) entegrasyonlarını, tetikleyicilerini ve şüpheli kalıpları kesin satır referanslarıyla (`dosya:satır`) tespit etmek için kullanılan regex desenlerini içerir.

---

## 1. Ödeme ve Abonelik Kütüphaneleri (6502 sayılı Tüketici Kanunu)

Tüketiciyi yanıltan otomatik yenilemeler, gizlenmiş abonelik bedelleri ve onaysız kart saklama pratiklerini tespit etmek için kullanılır.

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

---

### 1.2. Python Ödeme Sağlayıcıları

#### İçe Aktarma ve İstemci Tanımlamaları

```regex
# iyzico
(?:import\s+iyzipay|from\s+iyzipay\s+import|iyzipay\.HttpClient\()

# Stripe & dj-stripe
(?:import\s+stripe|from\s+stripe\s+import|from\s+djstripe|stripe\.api_key)

# PayTR & Diğer Sağlayıcılar
(?:import\s+paytr|from\s+paytr|paytr\.Payment|django_payments)

# Paddle & LemonSqueezy
(?:import\s+paddle|from\s+paddle\s+import|import\s+lemonsqueezy)
```

#### Abonelik ve Checkout Çağrıları

```regex
# Checkout ve Abonelik
(?:stripe\.checkout\.Session\.create|stripe\.Subscription\.create|iyzipay\.Subscription\(\)|iyzipay\.CheckoutForm\(\))

# Abonelik Plan ve Fiyatlandırma
(?:interval\s*=\s*['"](?:month|year)['"]|recurring\s*=\s*\{|billing_cycle\s*=)
```

#### Şüpheli Yenileme ve Saklama Kalıpları

```regex
# Otomatik Yenileme ve Deneme Süresi
(?:auto_renew|is_recurring|automatic_tax)\s*=\s*True

# Kart Saklama
(?:save_payment_method|save_card|setup_future_usage)\s*=\s*(?:True|['"]off_session['"])
```

---

## 2. Ticari İleti ve E-posta Kütüphaneleri (6563 sayılı ETK)

Onaysız pazarlama gönderimleri, ticari bültenler ve ret hakkı (`unsubscribe`) eksikliklerini tespit etmek için kullanılır.

### 2.1. TypeScript / JavaScript E-posta Sağlayıcıları

#### İçe Aktarma ve Servis Tanımlamaları

```regex
# Nodemailer
(?:import\s+.*?\s+from\s+['"]nodemailer['"]|require\(['"]nodemailer['"]\)|nodemailer\.createTransport)

# Resend
(?:import\s+.*?\s+from\s+['"]resend['"]|require\(['"]resend['"]\)|new\s+Resend\()

# SendGrid
(?:import\s+.*?\s+from\s+['"]@sendgrid/mail['"]|require\(['"]@sendgrid/mail['"]\)|sgMail\.setApiKey)

# Postmark & AWS SES & Mailgun
(?:from\s+['"]postmark['"]|from\s+['"]mailgun\.js['"]|from\s+['"]@aws-sdk/client-ses['"])
```

#### E-posta Gönderim Fonksiyonları

```regex
# Gönderim Çağrıları
(?:\.sendMail\(|resend\.emails\.send\(|sgMail\.send\(|client\.sendEmail\(|transporter\.send\()
```

#### Pazarlama ve Toplu Gönderim Kalıpları

```regex
# Kampanya ve Bülten Şablonları
(?:subject|template|category|tags)\s*[:=]\s*.*?(?:bülten|kampanya|newsletter|promotion|marketing|duyuru|indirim)

# Alıcı Listeleri ve Segmentler
(?:broadcast|bulkEmail|sendNewsletter|audience|subscriberList)
```

#### Zorunlu Yasal Öğeler (Doğrulama Desenleri)

```regex
# Ret Hakkı / Unsubscribe Bağlantısı (Bulunması Zorunlu)
(?:unsubscribe|opt-out|ret-hakki|abonelikten[-_]cik|cikis-linki|list-unsubscribe)

# Ticari Tanıtıcı Bilgiler (MERSİS / VKN / Adres)
(?:mersis|ticaret\s*sicil|vergi\s*dairesi|vkn|iletisim\s*adresi)
```

---

### 2.2. Python E-posta Sağlayıcıları

#### İçe Aktarma ve Servis Tanımlamaları

```regex
# Standart Kütüphane (smtplib / email)
(?:import\s+smtplib|from\s+smtplib\s+import|from\s+email\.mime)

# Django Core Mail
(?:from\s+django\.core\.mail\s+import\s+(?:send_mail|send_mass_mail|EmailMessage|EmailMultiAlternatives))

# FastAPI Mail & Flask Mail
(?:from\s+fastapi_mail|from\s+flask_mail|FastMail\()

# 3. Parti SDK (SendGrid / AWS SES)
(?:from\s+sendgrid\s+import|boto3\.client\(['"]ses['"]\)|from\s+resend\s+import)
```

#### E-posta Gönderim Fonksiyonları

```regex
# Gönderim Çağrıları
(?:server\.sendmail\(|send_mail\(|send_mass_mail\(|mail\.send\(|sg\.client\.mail\.send)
```

#### Pazarlama ve Bülten Kalıpları

```regex
# Konu ve Şablon Tanımları
(?:subject|template_name)\s*=\s*.*?(?:kampanya|bülten|newsletter|fırsat|indirim|marketing)
```

---

## 3. Pratik Tarama Komutları (CLI Örnekleri)

Asistan denetim sırasında hedef kod tabanında aşağıdaki komut kalıplarını çalıştırabilir:

```bash
# Projede ödeme kütüphanelerini tara:
grep -rnE "(iyzipay|stripe|lemonsqueezy|paytr|paddle)" --include="*.ts" --include="*.js" --include="*.py" .

# Gizli otomatik yenileme ve kart saklama kalıplarını ara:
grep -rnE "(auto_renew|autoRenew|recurringPayment|save_card|setup_future_usage)" --include="*.ts" --include="*.js" --include="*.py" .

# E-posta gönderim fonksiyonlarını tara:
grep -rnE "(sendMail|emails\.send|sgMail\.send|send_mail)" --include="*.ts" --include="*.js" --include="*.py" .

# E-posta şablonlarında ret hakkı (unsubscribe) varlığını denetle:
grep -rnEi "(unsubscribe|opt-out|ret-hakki|abonelikten)" --include="*.ts" --include="*.js" --include="*.py" --include="*.html" .
```
