# Katkı Kılavuzu (Contributing)

Projeye katkıda bulunmak istediğiniz için teşekkürler!

## Geliştirme Süreci

1. Projeyi çatallayın (fork) ve yerel ortamınıza klonlayın:
   ```bash
   git clone https://github.com/AtaCanYmc/tr-app-hukuk.git
   cd tr-app-hukuk
   ```
2. Testleri çalıştırarak çalıştığından emin olun:
   ```bash
   npm test
   ```
3. Yeni bir özellik veya düzeltme için dal (branch) açın:
   ```bash
   git checkout -b feat/yeni-mevzuat-maddesi
   ```

## Commit Mesaj Kuralları

Depoda **Release Please** kullanıldığı için commit mesajlarının [Conventional Commits](https://www.conventionalcommits.org/) formatına uyması zorunludur:

- `feat:` Yeni bir özellik veya yetenek eklendiğinde (minor sürüm tetikler: `1.0.0` -> `1.1.0`)
- `fix:` Bir hata giderildiğinde (patch sürüm tetikler: `1.0.0` -> `1.0.1`)
- `docs:` Yalnızca dokümantasyon değişikliklerinde
- `chore:` Yapılandırma, CI/CD veya bakım işlerinde
- `feat!:` veya `fix!:` Geriye uyumsuz (breaking change) değişikliklerde (major sürüm tetikler: `1.0.0` -> `2.0.0`)

## Test ve Doğrulama

Tüm değişikliklerden önce ve sonra testin başarıyla tamamlandığını doğrulayın:

```bash
npm test
```

## Pull Request Süreci

- PR başlığında da conventional commit biçimini kullanın.
- PR açıklamasında değişikliğin hangi kanun maddesi, ceza limiti veya yetenek geliştirmesiyle ilişkili olduğunu belirtin.
- CI kontrollerinin (Node 18, 20, 22) yeşil olduğunu kontrol edin.
