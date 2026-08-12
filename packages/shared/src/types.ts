export type StackLanguage = 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'go' 
  | 'rust' 
  | 'java' 
  | 'cpp' 
  | 'php' 
  | 'ruby' 
  | 'unknown';

export type PackageManager = 
  | 'npm' 
  | 'pnpm' 
  | 'yarn' 
  | 'bun' 
  | 'pip' 
  | 'poetry' 
  | 'uv' 
  | 'pipenv' 
  | 'cargo' 
  | 'go' 
  | 'maven' 
  | 'gradle' 
  | 'composer' 
  | 'bundler';

export type DatabaseType = 
  | 'postgres' 
  | 'mysql' 
  | 'mongodb' 
  | 'redis' 
  | 'rabbitmq' 
  | 'elasticsearch' 
  | 'sqlite';

export interface Entrypoint {
  path: string;
  name: string;
  type: 'web' | 'api' | 'worker' | 'cli' | 'service';
  port?: number;
}

export interface Service {
  name: string;
  type: DatabaseType | 'custom';
  image?: string;
  port: number;
  environment?: Record<string, string>;
  healthCheckCmd?: string;
}

export interface EnvironmentVariable {
  key: string;
  defaultValue?: string;
  description?: string;
  isSecret: boolean;
  required: boolean;
  sourceFile?: string;
}

export interface Database {
  type: DatabaseType;
  name?: string;
  port: number;
  connectionStringPattern?: string;
}

export interface ProjectCommands {
  install?: string;
  build?: string;
  dev: string;
  start?: string;
  test?: string;
  lint?: string;
}

export interface ProjectManifest {
  name: string;
  language: StackLanguage;
  framework?: string;
  packageManager?: PackageManager;
  runtime?: string;
  packageManagerVersion?: string;
  entrypoints: Entrypoint[];
  services: Service[];
  environmentVariables: EnvironmentVariable[];
  ports: number[];
  databases: Database[];
  commands: ProjectCommands;
  hasDockerCompose: boolean;
  dockerComposeFile?: string;
  rawFilesFound: string[];
}

export interface HealthCheck {
  name: string;
  type: 'http' | 'tcp';
  target: string;
  port: number;
  path?: string;
  expectedStatus?: number;
}

export interface DetectionResult {
  detected: boolean;
  confidence: number; // 0 to 1
  language: StackLanguage;
  framework?: string;
  packageManager?: PackageManager;
  entrypoints?: Entrypoint[];
  services?: Service[];
  databases?: Database[];
  commands?: Partial<ProjectCommands>;
  environmentVariables?: EnvironmentVariable[];
}

export interface DevMirrorPlugin {
  name: string;
  detect(projectDir: string, files: string[]): Promise<DetectionResult>;
  analyze(projectDir: string, manifest: Partial<ProjectManifest>): Promise<Partial<ProjectManifest>>;
  install?(projectDir: string, manifest: ProjectManifest): Promise<string[]>;
  start?(projectDir: string, manifest: ProjectManifest): Promise<string[]>;
  test?(projectDir: string, manifest: ProjectManifest): Promise<string[]>;
  healthCheck?(projectDir: string, manifest: ProjectManifest): Promise<HealthCheck[]>;
}

export interface DiagnosisEvidence {
  logSnippet: string;
  context: string;
  source: 'terminal' | 'docker' | 'build' | 'runtime' | 'env';
}

export interface DiagnosisResult {
  success: boolean;
  observedFact: string;
  likelyCause: string;
  confidence: number; // e.g. 96 (0-100)
  evidence: DiagnosisEvidence[];
  suggestedFix: string;
  proposedFileChanges?: Array<{
    filePath: string;
    description: string;
    diffOrContent: string;
  }>;
}

export interface SnapshotServiceConfig {
  name: string;
  type: DatabaseType | 'custom';
  image?: string;
  port: number;
}

export interface SnapshotConfig {
  version: string;
  name: string;
  runtime: {
    language: string;
    version?: string;
  };
  package_manager?: {
    name: string;
    version?: string;
  };
  services: SnapshotServiceConfig[];
  ports: number[];
  environment?: {
    required: string[];
    optional?: string[];
  };
  commands: {
    install?: string;
    dev: string;
    test?: string;
  };
}

export interface SecuritySandboxConfig {
  sandboxMode: 'strict' | 'standard' | 'off';
  networkMode: 'isolated' | 'bridge' | 'host';
  allowedPorts: number[];
  blockedMounts: string[];
}

export interface RunOptions {
  repoPathOrUrl: string;
  verbose?: boolean;
  json?: boolean;
  sandbox?: 'strict' | 'standard' | 'off';
  network?: 'isolated' | 'bridge' | 'host';
  port?: number;
  env?: Record<string, string>;
  nonInteractive?: boolean;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'frontend' | 'api' | 'logic' | 'database' | 'service' | 'cache';
  details?: string;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ArchitectureExplanation {
  summary: string;
  diagram: {
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
  };
  details: Record<string, string>; // answers to specific aspects e.g. Auth, Dataflow, Payments
}
