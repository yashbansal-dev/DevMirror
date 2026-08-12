# Changelog

All notable changes to DevMirror will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-12

### Added
- Core CLI commands: `run`, `analyze`, `diagnose`, `explain`, `test`, `snapshot`, `reproduce`, `dashboard`.
- Plugin Architecture with initial detectors for Node.js, Python, Docker Compose, PostgreSQL, Redis.
- Security sandbox engine (`--sandbox strict`, `--network isolated`) with host path protection against sensitive credential leakage.
- Environment variable intelligence with automated `.env.example` parsing, secret variable detection, and secret output masking.
- Intelligent Error Diagnostic engine providing structured observed facts, confidence scores (e.g. 96%), evidence snippets, and suggested fixes.
- Reproducible environment snapshots generator (`snapshot.yaml`).
- Vite + React modern dark glassmorphism dashboard running on `http://localhost:4242`.
- `demo-fullstack` showcase repository with Next.js, Express, PostgreSQL, Redis, Docker Compose, env variables, and automated tests.
