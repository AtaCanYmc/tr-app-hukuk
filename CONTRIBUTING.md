# Katkı Kılavuzu (Contributing)

Bu belge, projeye kod veya dokümantasyon katkısı sağlamak isteyen geliştiriciler için iş akışı standartlarını ve doğrulama adımlarını belirler.

---

## Geliştirme Süreci

1. Depoyu GitHub üzerinden çatallayın (fork) ve yerel çalışma alanınıza klonlayın:

   ```bash
   git clone https://github.com/AtaCanYmc/tr-app-hukuk.git
   cd tr-app-hukuk
   ```

2. Yerel test paketini çalıştırarak temel işlevlerin çalıştığını doğrulayın:

   ```bash
   npm test
   ```

3. Yeni bir özellik veya yasal madde düzeltmesi için amaca uygun bir çalışma dalı oluşturun:

   ```bash
   git checkout -b feat/yeni-mevzuat-maddesi
   ```

---

## Commit Standartları (Conventional Commits)

Otomatik sürümleme ve değişiklik günlüğü üretimi için commit mesajlarında [Conventional Commits](https://www.conventionalcommits.org/) formatı zorunludur:

| Önek | Kapsam | Tetiklenen Sürüm |
| :--- | :--- | :---: |
| `feat:` | Yeni yasal kontrol kuralı, CLI bayrağı veya yetenek | Minor (`1.0.0` -> `1.1.0`) |
| `fix:` | Hata giderme, ceza limiti düzeltmesi veya uyumluluk yaması | Patch (`1.0.0` -> `1.0.1`) |
| `docs:` | Dokümantasyon eklemeleri veya düzeltmeleri | Patch (veya sürüm tetiklemez) |
| `test:` | Yeni test senaryoları veya test altyapısı geliştirmeleri | Patch (veya sürüm tetiklemez) |
| `chore:` | Bağımlılık güncellemeleri, CI/CD veya yapılandırma işleri | Patch (veya sürüm tetiklemez) |
| `feat!:` / `fix!:` | Geriye uyumsuz yapısal veya API değişiklikleri | Major (`1.0.0` -> `2.0.0`) |

---

## Doğrulama ve Test Adımları

Değişikliklerinizi commit etmeden önce aşağıdaki doğrulama adımlarını yerel ortamınızda tamamlayın:

```bash
# 1. Kurulum ve platform testlerini yürütün
npm test

# 2. Kabuk betiği sözdizimini doğrulayın
sh -n install.sh

# 3. Dokümantasyon içi bağlantıların geçerliliğini kontrol edin
python3 -c '
import re, glob, os

def check_file(f):
    content = open(f, encoding="utf-8").read()
    content = re.sub(r"```[\s\S]*?```", "", content)
    content = re.sub(r"`[^`]*`", "", content)
    links = re.findall(r"\[.*?\]\((?!https?://|mailto:)(.*?)(?:#.*)?\)", content)
    broken = []
    for link in links:
        link = link.strip()
        if not link or link.startswith("#"): continue
        target = os.path.normpath(os.path.join(os.path.dirname(f), link))
        if not os.path.exists(target):
            broken.append(f"{f} -> {link}")
    return broken

all_broken = []
for f in glob.glob("**/*.md", recursive=True):
    all_broken.extend(check_file(f))

if all_broken:
    print("Kırık doküman bağlantıları bulundu:", all_broken)
    exit(1)
print("Tüm doküman bağlantıları geçerli.")
'
```

---

## Pull Request Süreci

1. Çalışma dalınızı kendi çatallanmış (fork) deponuza gönderin:

   ```bash
   git push origin feat/yeni-mevzuat-maddesi
   ```

2. GitHub üzerinde bir Pull Request açın.
3. PR başlığının ve commit mesajlarının Conventional Commits formatında olduğunu teyit edin.
4. PR açıklamasında değişikliğin hangi kanun maddesi, ceza tutarı veya yetenek dosyasıyla ilişkili olduğunu belirtin.
5. GitHub Actions CI iş akışının tüm adımlarının yeşil olarak tamamlandığını kontrol edin.
