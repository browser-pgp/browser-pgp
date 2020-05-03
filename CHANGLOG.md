# Changelog

## [Unreleased]

## [1.0.0-2] - 2020-05-03

### Added

- `/login` 界面添加扫码登录

## [1.0.0-1] - 2020-05-03

### Changed

- 签名内容由 `{"mid":"str","fingerprint":"str"}` 变为 `{"mid":"str","auth":"str","fingerprint":"str"}`, 添加 `auth` 字段避免认证签名被滥用
