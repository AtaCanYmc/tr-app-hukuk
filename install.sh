#!/usr/bin/env sh
# tr-app-hukuk skill installer
# Installs tr-app-hukuk into supported AI agent skill directories.
set -eu

BASE_URL="https://raw.githubusercontent.com/AtaCanYmc/tr-app-hukuk/main/skills/tr-app-hukuk"
REPO_DIR="$(cd "$(dirname "$0" 2>/dev/null || echo ".")" && pwd 2>/dev/null || echo ".")"
LOCAL_SRC="$REPO_DIR/skills/tr-app-hukuk"

install_to() {
  dest="$1"
  name="$2"
  printf "==> [%s] için kuruluyor: %s\n" "$name" "$dest"
  mkdir -p "$dest/references"

  if [ -d "$LOCAL_SRC" ]; then
    cp "$LOCAL_SRC/SKILL.md" "$dest/SKILL.md"
    if [ -f "$LOCAL_SRC/README.md" ]; then
      cp "$LOCAL_SRC/README.md" "$dest/README.md"
    fi
    cp "$LOCAL_SRC/references/"*.md "$dest/references/"
  else
    # Remote curl execution fallback
    curl -fsSL "$BASE_URL/SKILL.md" -o "$dest/SKILL.md"
    curl -fsSL "$BASE_URL/references/ceza-limitleri-2026.md" -o "$dest/references/ceza-limitleri-2026.md"
    curl -fsSL "$BASE_URL/references/kanun-maddeleri.md" -o "$dest/references/kanun-maddeleri.md"
  fi
}

echo "==> tr-app-hukuk: Yapay Zeka Hukuki Denetim Yeteneği Kurucusu"

if [ $# -gt 0 ]; then
  case "$1" in
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
    *)
      install_to "$1" "Özel Dizin"
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
