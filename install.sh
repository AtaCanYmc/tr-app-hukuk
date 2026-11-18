#!/usr/bin/env sh
# tr-app-hukuk skill installer
# Installs tr-app-hukuk into supported AI agent skill directories.
set -eu

BASE_URL="https://raw.githubusercontent.com/AtaCanYmc/tr-app-hukuk/main/skills/tr-app-hukuk"
REPO_DIR="$(cd "$(dirname "$0" 2>/dev/null || echo ".")" && pwd 2>/dev/null || echo ".")"
LOCAL_SRC="$REPO_DIR/skills/tr-app-hukuk"
DRY_RUN=0

# Handle --print immediately without side effects
for arg in "$@"; do
  if [ "$arg" = "--print" ]; then
    if [ -f "$LOCAL_SRC/SKILL.md" ]; then
      cat "$LOCAL_SRC/SKILL.md"
    else
      curl -fsSL "$BASE_URL/SKILL.md"
    fi
    exit 0
  fi
  if [ "$arg" = "--json" ] || [ "$arg" = "--check" ]; then
    if command -v node >/dev/null 2>&1 && [ -f "$REPO_DIR/install.js" ]; then
      exec node "$REPO_DIR/install.js" "$@"
    fi
  fi
done

install_to() {
  dest="$1"
  name="$2"
  if [ "$DRY_RUN" -eq 1 ]; then
    printf "==> [dry-run] [%s] için simüle ediliyor: %s\n" "$name" "$dest"
    return 0
  fi
  printf "==> [%s] için kuruluyor: %s\n" "$name" "$dest"
  mkdir -p -- "$dest/references"

  if [ -d "$LOCAL_SRC" ]; then
    cp -- "$LOCAL_SRC/SKILL.md" "$dest/SKILL.md"
    if [ -f "$LOCAL_SRC/README.md" ]; then
      cp -- "$LOCAL_SRC/README.md" "$dest/README.md"
    fi
    for ref_file in "$LOCAL_SRC/references/"*.*; do
      if [ -f "$ref_file" ]; then
        cp -- "$ref_file" "$dest/references/"
      fi
    done
  else
    # Remote curl execution fallback
    curl -fsSL "$BASE_URL/SKILL.md" -o "$dest/SKILL.md"
    curl -fsSL "$BASE_URL/references/ceza-limitleri-2026.md" -o "$dest/references/ceza-limitleri-2026.md"
    curl -fsSL "$BASE_URL/references/emsal-kararlar.md" -o "$dest/references/emsal-kararlar.md"
    curl -fsSL "$BASE_URL/references/kanun-maddeleri.md" -o "$dest/references/kanun-maddeleri.md"
    curl -fsSL "$BASE_URL/references/regex-desenleri.md" -o "$dest/references/regex-desenleri.md"
    curl -fsSL "$BASE_URL/references/rapor-semasi.json" -o "$dest/references/rapor-semasi.json"
  fi
}

echo "==> tr-app-hukuk: Yapay Zeka Hukuki Denetim Yeteneği Kurucusu"

target_arg=""
for arg in "$@"; do
  case "$arg" in
    --dry-run)
      DRY_RUN=1
      ;;
    *)
      if [ -z "$target_arg" ]; then
        target_arg="$arg"
      fi
      ;;
  esac
done

if [ -n "$target_arg" ]; then
  case "$target_arg" in
    --antigravity|--gemini)
      install_to "$HOME/.gemini/antigravity/skills/tr-app-hukuk" "Google Antigravity / Gemini"
      ;;
    --claude)
      install_to "$HOME/.claude/skills/tr-app-hukuk" "Claude Code"
      ;;
    --cursor)
      install_to "$HOME/.cursor/skills/tr-app-hukuk" "Cursor"
      ;;
    --copilot|--codex)
      install_to "$HOME/.codex/skills/tr-app-hukuk" "GitHub Copilot / Codex"
      ;;
    --windsurf)
      install_to "$HOME/.windsurf/skills/tr-app-hukuk" "Windsurf"
      ;;
    --all)
      install_to "$HOME/.gemini/antigravity/skills/tr-app-hukuk" "Google Antigravity / Gemini"
      install_to "$HOME/.claude/skills/tr-app-hukuk" "Claude Code"
      install_to "$HOME/.cursor/skills/tr-app-hukuk" "Cursor"
      install_to "$HOME/.codex/skills/tr-app-hukuk" "GitHub Copilot / Codex"
      install_to "$HOME/.windsurf/skills/tr-app-hukuk" "Windsurf"
      ;;
    --target=*)
      custom_target="${target_arg#--target=}"
      if [ -z "$custom_target" ]; then
        echo "Hata: --target değeri boş olamaz." >&2
        exit 1
      fi
      install_to "$custom_target" "Özel Dizin"
      ;;
    -*)
      echo "Hata: Bilinmeyen seçenek '$target_arg'" >&2
      echo "Kullanım: $0 [--antigravity|--claude|--cursor|--copilot|--windsurf|--all|--target=<dizin>|--dry-run|--print|<hedef_dizin>]" >&2
      exit 1
      ;;
    *)
      install_to "$target_arg" "Özel Dizin"
      ;;
  esac
else
  # Auto-detect existing environments or fallback to default
  installed=0
  if [ -d "$HOME/.gemini" ]; then
    install_to "$HOME/.gemini/antigravity/skills/tr-app-hukuk" "Google Antigravity / Gemini"
    installed=1
  fi
  if [ -d "$HOME/.claude" ]; then
    install_to "$HOME/.claude/skills/tr-app-hukuk" "Claude Code"
    installed=1
  fi
  if [ -d "$HOME/.cursor" ]; then
    install_to "$HOME/.cursor/skills/tr-app-hukuk" "Cursor"
    installed=1
  fi
  if [ -d "$HOME/.codex" ]; then
    install_to "$HOME/.codex/skills/tr-app-hukuk" "GitHub Copilot / Codex"
    installed=1
  fi
  if [ -d "$HOME/.windsurf" ]; then
    install_to "$HOME/.windsurf/skills/tr-app-hukuk" "Windsurf"
    installed=1
  fi

  if [ "$installed" -eq 0 ]; then
    install_to "$HOME/.skills/tr-app-hukuk" "Varsayılan Yetenek Dizini"
  fi
fi

echo "==> Kurulum tamamlandı. Asistanınızda şunu yazarak başlatın: \"Projemi hukuki olarak tara\""
