import { DevMirrorPlugin, DetectionResult, ProjectManifest, Service, Database } from '@devmirror/shared';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export class RedisPlugin implements DevMirrorPlugin {
  name = 'redis';

  async detect(projectDir: string, files: string[]): Promise<DetectionResult> {
    let hasRedis = false;

    for (const f of ['.env.example', '.env.sample', 'package.json', 'requirements.txt', 'pyproject.toml']) {
      if (files.includes(f)) {
        try {
          const content = await fs.readFile(path.join(projectDir, f), 'utf-8');
          if (content.toLowerCase().includes('redis') || content.includes('REDIS_URL')) {
            hasRedis = true;
            break;
          }
        } catch {}
      }
    }

    if (!hasRedis) {
      return { detected: false, confidence: 0, language: 'unknown' };
    }

    const service: Service = {
      name: 'redis',
      type: 'redis',
      image: 'redis:7-alpine',
      port: 6379,
      healthCheckCmd: 'redis-cli ping'
    };

    const database: Database = {
      type: 'redis',
      name: 'redis_cache',
      port: 6379,
      connectionStringPattern: 'redis://localhost:6379'
    };

    return {
      detected: true,
      confidence: 0.9,
      language: 'unknown',
      services: [service],
      databases: [database],
      environmentVariables: [
        {
          key: 'REDIS_URL',
          defaultValue: 'redis://localhost:6379',
          description: 'Redis cache connection URL',
          isSecret: false,
          required: false
        }
      ]
    };
  }

  async analyze(projectDir: string, manifest: Partial<ProjectManifest>): Promise<Partial<ProjectManifest>> {
    return manifest;
  }
}
