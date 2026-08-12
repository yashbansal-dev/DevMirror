# DevMirror Architecture Specification

DevMirror is designed as a modular monorepo containing decoupled packages for stack detection, environment intelligence, container sandboxing, process execution, error diagnostics, and reproducible snapshots.

## Package Architecture

```text
devmirror/
├── apps/
│   ├── cli/            # Commander CLI binary (`devmirror`)
│   └── dashboard/      # Vite + React glassmorphism dashboard (http://localhost:4242)
├── packages/
│   ├── shared/         # Zod schemas, TypeScript types, log models
│   ├── analyzer/       # Multi-file repo inspector & manifest parser
│   ├── detectors/      # Plugin registry & framework detection
│   ├── environment/    # Env variable intelligence & secret masking
│   ├── services/       # Database & service orchestrator (Postgres, Redis, Docker Compose)
│   ├── docker/         # Container sandbox & mount validator
│   ├── runtime/        # Execution runner & process monitor
│   ├── diagnostics/    # Log parser & failure classifier
│   ├── snapshots/      # YAML snapshot generator & reproducer
│   └── ai/             # Architecture explanation & AI reasoning layer
└── plugins/            # Framework plugins (node, python, docker, postgres, redis)
```

## Plugin Specification

Each stack support package implements the `DevMirrorPlugin` contract:

```typescript
export interface DevMirrorPlugin {
  name: string;
  detect(projectDir: string, files: string[]): Promise<DetectionResult>;
  analyze(projectDir: string, manifest: Partial<ProjectManifest>): Promise<Partial<ProjectManifest>>;
  install?(projectDir: string, manifest: ProjectManifest): Promise<string[]>;
  start?(projectDir: string, manifest: ProjectManifest): Promise<string[]>;
  test?(projectDir: string, manifest: ProjectManifest): Promise<string[]>;
  healthCheck?(projectDir: string, manifest: ProjectManifest): Promise<HealthCheck[]>;
}
```

## Security & Isolation

Execution sandbox modes:
- `strict`: Isolated network namespace, read-only volume mounts, memory/CPU caps.
- `standard`: Bridge container network, local port mapping, blocked host credentials.
- `off`: Direct host execution for local trusted projects.
