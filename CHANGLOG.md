# Changelog

## [Unreleased]

## [1.0.0-1] - 2020-05-03

### Changed

- 签名内容由 `{"mid":"str","fingerprint":"str"}` 变为 `{"mid":"str","auth":"str","fingerprint":"str"}`, 添加 `auth` 字段避免认证签名被滥用
