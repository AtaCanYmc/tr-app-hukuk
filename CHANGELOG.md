# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0](https://github.com/AtaCanYmc/tr-app-hukuk/compare/v1.0.0...v1.1.0) (2026-11-18)


### Features

* add Yargitay precedent decisions support and integration guide ([476b960](https://github.com/AtaCanYmc/tr-app-hukuk/commit/476b9600eeb7cfba65bd6e165a496d72f91eb0a6))
* prompt user to install yargitay-karar-cli if missing ([fc2a66e](https://github.com/AtaCanYmc/tr-app-hukuk/commit/fc2a66ef852b919c738975a2f7fd83c087f69c3e))

## [1.1.0] - 2026-11-18

### Added

* Yargıtay emsal kararları ve içtihat arama şablonu (`references/emsal-kararlar.md`).
* `yargitay-karar-cli` ve `yargitay-karar-mcp` entegrasyon kuralları (`SKILL.md`).
* Kurulum scriptleri (`install.sh`, `install.ps1`) ve test paketine emsal karar referansı desteği.

## 1.0.0 (2026-11-09)

### Features

* add initial project structure with legal compliance features and CI configuration ([cff6795](https://github.com/AtaCanYmc/tr-app-hukuk/commit/cff6795bf0353a4ab1208427e785c41070a99ece))
* add POSIX shell installer script and update README for installation methods ([c4981ff](https://github.com/AtaCanYmc/tr-app-hukuk/commit/c4981ff671b123e2967d595d3e4600d7cdbbb1a3))
* add Windows PowerShell installer script and update README with installation methods ([e0bbd0b](https://github.com/AtaCanYmc/tr-app-hukuk/commit/e0bbd0b2a807fb6f1e1b0834ea0f0c1079c9b4e0))
* improve README formatting and enhance logo display ([13cf3eb](https://github.com/AtaCanYmc/tr-app-hukuk/commit/13cf3eb9805cb629ae648c60bdaec78ced8a5090))
* update logo dimensions and enhance README content for clarity and compliance ([870d3d8](https://github.com/AtaCanYmc/tr-app-hukuk/commit/870d3d8dba1cf8e3124f3bf77f5c0d5e002ee774))

## [1.0.0] - 2026-11-09

### Added

* Claude Code skill package (`skills/tr-app-hukuk/SKILL.md`).
* 2026 legal penalty limits and statutory references (`references/`).
* Zero-dependency installation CLI script (`install.js`) runnable via `npx`.
