# Changelog

All notable changes to this project will be documented in this file.

## [1.3.1](https://github.com/AtaCanYmc/tr-app-hukuk/compare/tr-app-hukuk-v1.3.0...tr-app-hukuk-v1.3.1) (2026-11-23)


### Bug Fixes

* **ci:** fix release-please condition, add workflows permission and clean tag push ([5c1076d](https://github.com/AtaCanYmc/tr-app-hukuk/commit/5c1076d47cec5aa2abddad5a4cbb1201e2e27de9))
* **ci:** remove invalid workflows permission key ([d46cac1](https://github.com/AtaCanYmc/tr-app-hukuk/commit/d46cac1b922a163c80dcd10a265c7ec801876c1a))

## [1.3.0](https://github.com/AtaCanYmc/tr-app-hukuk/compare/tr-app-hukuk-v1.2.0...tr-app-hukuk-v1.3.0) (2026-11-19)


### Features

* **action:** add hybrid (static + LLM) GitHub Action PR bot and report engine ([1d35d6e](https://github.com/AtaCanYmc/tr-app-hukuk/commit/1d35d6ed3e1a1cb52853f6b8c2dae160fc7289bb))
* add initial project structure with legal compliance features and CI configuration ([cff6795](https://github.com/AtaCanYmc/tr-app-hukuk/commit/cff6795bf0353a4ab1208427e785c41070a99ece))
* add POSIX shell installer script and update README for installation methods ([c4981ff](https://github.com/AtaCanYmc/tr-app-hukuk/commit/c4981ff671b123e2967d595d3e4600d7cdbbb1a3))
* add Windows PowerShell installer script and update README with installation methods ([e0bbd0b](https://github.com/AtaCanYmc/tr-app-hukuk/commit/e0bbd0b2a807fb6f1e1b0834ea0f0c1079c9b4e0))
* add Yargitay precedent decisions support and integration guide ([476b960](https://github.com/AtaCanYmc/tr-app-hukuk/commit/476b9600eeb7cfba65bd6e165a496d72f91eb0a6))
* **audit:** add legal compliance checks and configure release-please extra-files ([fc8cee0](https://github.com/AtaCanYmc/tr-app-hukuk/commit/fc8cee09a77fdadc66b91b845b126927327aae25))
* **cli:** add --print and --dry-run flags across installers ([169a095](https://github.com/AtaCanYmc/tr-app-hukuk/commit/169a095071a173995119baebc232f3f06b7fe18d))
* **cli:** add machine-readable JSON output (--json) and headless audit mode (--check) ([7d4cf44](https://github.com/AtaCanYmc/tr-app-hukuk/commit/7d4cf442edb00128361a0aa43afdfb6b48bf568a))
* improve README formatting and enhance logo display ([13cf3eb](https://github.com/AtaCanYmc/tr-app-hukuk/commit/13cf3eb9805cb629ae648c60bdaec78ced8a5090))
* **patterns:** add regex pattern library for payment and email libraries ([579f0f3](https://github.com/AtaCanYmc/tr-app-hukuk/commit/579f0f378e0b85f6dfd490cfef6d761a1c6584f4))
* prompt user to install yargitay-karar-cli if missing ([fc2a66e](https://github.com/AtaCanYmc/tr-app-hukuk/commit/fc2a66ef852b919c738975a2f7fd83c087f69c3e))
* **release:** remove package-name from release-please configuration ([c8175a0](https://github.com/AtaCanYmc/tr-app-hukuk/commit/c8175a06371f66f5c3f14d44595b45a8bb1e4d98))
* update logo dimensions and enhance README content for clarity and compliance ([870d3d8](https://github.com/AtaCanYmc/tr-app-hukuk/commit/870d3d8dba1cf8e3124f3bf77f5c0d5e002ee774))


### Bug Fixes

* allow release-please changelog spacing in markdown lint ([ec8497a](https://github.com/AtaCanYmc/tr-app-hukuk/commit/ec8497a515911d07814ed012f80816a63eb322b7))
* remove extra blank line in CHANGELOG.md (MD012) ([5f83c42](https://github.com/AtaCanYmc/tr-app-hukuk/commit/5f83c42ca488713c0d5515ddba8cf67d2550ea27))
* **security:** prevent prototype pollution and argument injection in installers ([7d09d44](https://github.com/AtaCanYmc/tr-app-hukuk/commit/7d09d441f90a77466d81306f9661f80d510d2b5e))

## [1.2.0](https://github.com/AtaCanYmc/tr-app-hukuk/compare/v1.1.1...v1.2.0) (2026-11-18)


### Features

* **cli:** add --print and --dry-run flags across installers ([169a095](https://github.com/AtaCanYmc/tr-app-hukuk/commit/169a095071a173995119baebc232f3f06b7fe18d))
* **cli:** add machine-readable JSON output (--json) and headless audit mode (--check) ([7d4cf44](https://github.com/AtaCanYmc/tr-app-hukuk/commit/7d4cf442edb00128361a0aa43afdfb6b48bf568a))
* **patterns:** add regex pattern library for payment and email libraries ([579f0f3](https://github.com/AtaCanYmc/tr-app-hukuk/commit/579f0f378e0b85f6dfd490cfef6d761a1c6584f4))

## [1.1.1](https://github.com/AtaCanYmc/tr-app-hukuk/compare/v1.1.0...v1.1.1) (2026-11-18)

### Bug Fixes

* **security:** prevent prototype pollution and argument injection in installers ([7d09d44](https://github.com/AtaCanYmc/tr-app-hukuk/commit/7d09d441f90a77466d81306f9661f80d510d2b5e))

## [1.1.0](https://github.com/AtaCanYmc/tr-app-hukuk/compare/v1.0.0...v1.1.0) (2026-11-18)

### Features

* add Yargitay precedent decisions support and integration guide ([476b960](https://github.com/AtaCanYmc/tr-app-hukuk/commit/476b9600eeb7cfba65bd6e165a496d72f91eb0a6))
* prompt user to install yargitay-karar-cli if missing ([fc2a66e](https://github.com/AtaCanYmc/tr-app-hukuk/commit/fc2a66ef852b919c738975a2f7fd83c087f69c3e))

### Security

* Prevent prototype pollution / property injection in CLI installer (`install.js`).
* Prevent argument and option injection in shell installer (`install.sh`).
* Add automated security regression tests in `test.js`.

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
