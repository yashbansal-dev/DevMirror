import { DevMirrorPlugin, DetectionResult, ProjectManifest, HealthCheck, PackageManager } from '@devmirror/shared';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export class NodePlugin implements DevMirrorPlugin {
  name = 'node';

  async detect(projectDir: string, files: string[]): Promise<DetectionResult> {
    const hasPackageJson = files.includes('package.json');
    if (!hasPackageJson) {
      return { detected: false, confidence: 0, language: 'unknown' };
    }

    let packageJson: any = {};
    try {
      const content = await fs.readFile(path.join(projectDir, 'package.json'), 'utf-8');
      packageJson = JSON.parse(content);
    } catch {
      // JSON parse fallback
    }

    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Framework detection
    let framework = 'Node.js';
    if (deps['next']) framework = 'Next.js';
    else if (deps['vite']) framework = 'Vite';
    else if (deps['@nuxt/core'] || deps['nuxt']) framework = 'Nuxt';
    else if (deps['vue']) framework = 'Vue';
    else if (deps['@angular/core']) framework = 'Angular';
    else if (deps['@nestjs/core']) framework = 'NestJS';
    else if (deps['express']) framework = 'Express';
    else if (deps['fastify']) framework = 'Fastify';
    else if (deps['react']) framework = 'React';

    // Package manager detection
    let pm: PackageManager = 'npm';
    if (files.includes('pnpm-lock.yaml')) pm = 'pnpm';
    else if (files.includes('yarn.lock')) pm = 'yarn';
    else if (files.includes('bun.lockb') || files.includes('bun.lock')) pm = 'bun';
    else if (files.includes('package-lock.json')) pm = 'npm';

    const language = (deps['typescript'] || files.some(f => f.endsWith('.ts') || f.endsWith('.tsx') || f === 'tsconfig.json')) ? 'typescript' : 'javascript';

    // Determine dev command
    const scripts = packageJson.scripts || {};
    let devCmd = `${pm} run dev`;
    if (scripts['dev']) devCmd = `${pm} run dev`;
    else if (scripts['start']) devCmd = `${pm} start`;
    else if (scripts['serve']) devCmd = `${pm} run serve`;
    else devCmd = `${pm} start`;

    let installCmd = `${pm} install`;

    // Port detection hint
    let port = 3000;
    if (framework === 'Vite') port = 5173;
    if (framework === 'NestJS') port = 3000;
    if (framework === 'Express' || framework === 'Fastify') port = 8080;

    return {
      detected: true,
      confidence: 0.95,
      language,
      framework,
      packageManager: pm,
      entrypoints: [
        {
          name: packageJson.name || 'node-app',
          path: packageJson.main || 'src/index.js',
          type: (framework === 'Express' || framework === 'Fastify' || framework === 'NestJS') ? 'api' : 'web',
          port,
        }
      ],
      commands: {
        install: installCmd,
        dev: devCmd,
        build: scripts['build'] ? `${pm} run build` : undefined,
        test: scripts['test'] ? `${pm} test` : `${pm} test`,
      }
    };
  }

  async analyze(projectDir: string, manifest: Partial<ProjectManifest>): Promise<Partial<ProjectManifest>> {
    return manifest;
  }

  async healthCheck(projectDir: string, manifest: ProjectManifest): Promise<HealthCheck[]> {
    const mainPort = manifest.ports[0] || 3000;
    return [
      {
        name: `${manifest.name || 'node'}-health`,
        type: 'http',
        target: `http://localhost:${mainPort}`,
        port: mainPort,
        path: '/',
        expectedStatus: 200,
      }
    ];
  }
}
