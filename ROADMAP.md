# DevMirror Roadmap

## Phase 1: MVP CLI Foundation (Completed v0.1.0)
- [x] Repository downloading & local path resolution
- [x] Extensible plugin system (Node.js, Python, Docker, Postgres, Redis)
- [x] Environment variable intelligence & secret masking
- [x] Security sandbox & host credential protection
- [x] Diagnostics engine with facts vs hypotheses
- [x] Snapshot generation & reproduction (`snapshot.yaml`)
- [x] Local execution dashboard (`http://localhost:4242`)

## Phase 2: Expanded Framework & Language Support
- [ ] Go plugin (Gin, Fiber, Echo)
- [ ] Rust plugin (Actix-web, Axum)
- [ ] Java plugin (Spring Boot, Quarkus)
- [ ] PHP plugin (Laravel, Symfony)
- [ ] Ruby plugin (Ruby on Rails)

## Phase 3: Cloud & GitHub Integration
- [ ] GitHub Actions automatic reproduction step (`devmirror action`)
- [ ] GitHub PR environment preview bot
- [ ] Remote container execution & DevMirror Cloud workspace synchronization
