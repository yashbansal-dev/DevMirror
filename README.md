# DevMirror

> **Universal Reproducible Development Environment for GitHub Repositories**

Clone any repository. Run it with one command.

```bash
devmirror run https://github.com/user/repository
```

DevMirror automatically analyzes any GitHub repository or local codebase, detects its tech stack and package managers, prepares environment variables, provisions required database infrastructure (PostgreSQL, Redis, MySQL, MongoDB), launches sandboxed containers, and delivers a fully operational development environment with verified health checks.

---

## Key Features

- ⚡ **One-Command Execution**: `devmirror run <repo>` resolves dependencies, infrastructure, and startup scripts automatically.
- 🔍 **Deep Stack & Framework Detection**: Extensible provider architecture supporting Node.js, Next.js, Vite, React, Express, NestJS, Python (FastAPI, Django, Flask, Streamlit), Docker Compose, Go, Rust, Java, and more.
- 🛡️ **Security Sandbox & Isolation**: Prevents host credential leaks (never mounts `.ssh`, AWS/GCP secrets, or browser profiles) with strict network & volume isolation (`--sandbox strict`, `--network isolated`).
- 🩺 **Intelligent Failure Diagnostics**: Structured log analysis that isolates root causes, separates **Observed Facts** from **AI Hypotheses**, and scores confidence levels (e.g. 96% confidence: Missing `DATABASE_URL`).
- 📸 **Deterministic Snapshots**: Export environment definitions into `snapshot.yaml` to ensure `"Works on my machine"` disappears across engineering teams.
- 📊 **Local Web Dashboard**: Rich visual monitoring interface serving real-time logs, service health indicators, and dynamic component architecture graphs on `http://localhost:4242`.

---

## Quick Start

### Installation

```bash
npm install -g devmirror
```

### Basic Commands

```bash
# Run any GitHub repo or local directory
devmirror run https://github.com/user/project

# Analyze stack & dependencies without executing
devmirror analyze ./my-project

# Diagnose execution failures & get recommended fixes
devmirror diagnose

# Explain repository architecture & answer code questions
devmirror explain "How does authentication work?"

# Run test suites inside the DevMirror environment
devmirror test

# Create reproducible environment snapshot
devmirror snapshot

# Reproduce environment from snapshot.yaml
devmirror reproduce snapshot.yaml

# Launch local execution dashboard
devmirror dashboard
```

---

## Architecture Overview

```text
GitHub Repository / Local Path
             ↓
    Repository Analyzer
             ↓
       Stack Detection
             ↓
    Environment Intelligence
             ↓
    Service & Database Engine
             ↓
     Sandboxed Execution
             ↓
    Health Check & Access URL
```

---

## Security Model

Security is a primary design goal:
- **Zero Host Credential Exposure**: Host sensitive paths (`~/.ssh`, `~/.aws`, `~/.config/gcloud`) are strictly forbidden from container volume mounts.
- **Path Traversal & Injection Shields**: Sanitizes input parameters against command injection and directory escape vectors.
- **Offline Core**: Core detection and execution require no cloud accounts or telemetry.

---

## Governance & Contributing

We welcome community contributions! Please review:
- [ARCHITECTURE.md](./ARCHITECTURE.md) for technical deep dives.
- [SECURITY.md](./SECURITY.md) for our vulnerability disclosure policy.
- [CONTRIBUTING.md](./CONTRIBUTING.md) for setup and guidelines.

---

## License

[MIT License](./LICENSE) © DevMirror Contributors.
