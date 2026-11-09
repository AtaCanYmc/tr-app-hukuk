# tr-app-hukuk PowerShell Skill Installer
[CmdletBinding()]
param (
    [string]$Target = "",
    [switch]$Claude,
    [switch]$Cursor,
    [switch]$Gemini,
    [switch]$Antigravity,
    [switch]$Copilot,
    [switch]$Codex,
    [switch]$Windsurf,
    [switch]$All
)

$ErrorActionPreference = "Stop"
$BaseUrl = "https://raw.githubusercontent.com/AtaCanYmc/tr-app-hukuk/main/skills/tr-app-hukuk"
$ScriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$LocalSrc = Join-Path $ScriptDir "skills/tr-app-hukuk"

function Install-Skill {
    param (
        [string]$Dest,
        [string]$Name
    )
    Write-Host "==> [$Name] için kuruluyor: $Dest" -ForegroundColor Cyan
    $refDir = Join-Path $Dest "references"
    if (-not (Test-Path $refDir)) {
        New-Item -ItemType Directory -Path $refDir -Force | Out-Null
    }

    if (Test-Path (Join-Path $LocalSrc "SKILL.md")) {
        Copy-Item -Path (Join-Path $LocalSrc "SKILL.md") -Destination (Join-Path $Dest "SKILL.md") -Force
        if (Test-Path (Join-Path $LocalSrc "README.md")) {
            Copy-Item -Path (Join-Path $LocalSrc "README.md") -Destination (Join-Path $Dest "README.md") -Force
        }
        Copy-Item -Path (Join-Path $LocalSrc "references/*") -Destination $refDir -Force
    } else {
        Invoke-WebRequest -Uri "$BaseUrl/SKILL.md" -OutFile (Join-Path $Dest "SKILL.md")
        Invoke-WebRequest -Uri "$BaseUrl/references/ceza-limitleri-2026.md" -OutFile (Join-Path $refDir "ceza-limitleri-2026.md")
        Invoke-WebRequest -Uri "$BaseUrl/references/kanun-maddeleri.md" -OutFile (Join-Path $refDir "kanun-maddeleri.md")
    }
}

Write-Host "==> tr-app-hukuk: Yapay Zeka Hukuki Denetim Yeteneği Kurucusu (PowerShell)" -ForegroundColor Green

$claudePath = Join-Path $HOME ".claude/skills/tr-app-hukuk"
$cursorPath = Join-Path $HOME ".cursor/skills/tr-app-hukuk"
$geminiPath = Join-Path $HOME ".gemini/antigravity/skills/tr-app-hukuk"
$copilotPath = Join-Path $HOME ".codex/skills/tr-app-hukuk"
$windsurfPath = Join-Path $HOME ".windsurf/skills/tr-app-hukuk"

if ($All) {
    Install-Skill -Dest $geminiPath -Name "Google Antigravity / Gemini"
    Install-Skill -Dest $claudePath -Name "Claude Code"
    Install-Skill -Dest $cursorPath -Name "Cursor"
    Install-Skill -Dest $copilotPath -Name "GitHub Copilot / Codex"
    Install-Skill -Dest $windsurfPath -Name "Windsurf"
} elseif ($Claude) {
    Install-Skill -Dest $claudePath -Name "Claude Code"
} elseif ($Cursor) {
    Install-Skill -Dest $cursorPath -Name "Cursor"
} elseif ($Gemini -or $Antigravity) {
    Install-Skill -Dest $geminiPath -Name "Google Antigravity / Gemini"
} elseif ($Copilot -or $Codex) {
    Install-Skill -Dest $copilotPath -Name "GitHub Copilot / Codex"
} elseif ($Windsurf) {
    Install-Skill -Dest $windsurfPath -Name "Windsurf"
} elseif ($Target -ne "") {
    Install-Skill -Dest $Target -Name "Özel Dizin"
} else {
    # Auto-detect existing environments
    $installed = $false
    if (Test-Path (Join-Path $HOME ".gemini")) {
        Install-Skill -Dest $geminiPath -Name "Google Antigravity / Gemini"
        $installed = $true
    }
    if (Test-Path (Join-Path $HOME ".claude")) {
        Install-Skill -Dest $claudePath -Name "Claude Code"
        $installed = $true
    }
    if (Test-Path (Join-Path $HOME ".cursor")) {
        Install-Skill -Dest $cursorPath -Name "Cursor"
        $installed = $true
    }
    if (Test-Path (Join-Path $HOME ".codex")) {
        Install-Skill -Dest $copilotPath -Name "GitHub Copilot / Codex"
        $installed = $true
    }
    if (Test-Path (Join-Path $HOME ".windsurf")) {
        Install-Skill -Dest $windsurfPath -Name "Windsurf"
        $installed = $true
    }

    if (-not $installed) {
        $defaultPath = Join-Path $HOME ".skills/tr-app-hukuk"
        Install-Skill -Dest $defaultPath -Name "Varsayılan Yetenek Dizini"
    }
}

Write-Host "==> Kurulum tamamlandı. Asistanınızda şunu yazarak başlatın: `"Projemi hukuki olarak tara`"" -ForegroundColor Green
