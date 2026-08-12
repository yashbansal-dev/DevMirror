import { ProjectManifest, SnapshotConfig } from '@devmirror/shared';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import YAML from 'yaml';

export class SnapshotManager {
  createSnapshotConfig(manifest: ProjectManifest): SnapshotConfig {
    const requiredEnvKeys = manifest.environmentVariables.filter((e: any) => e.required).map((e: any) => e.key);
    const optionalEnvKeys = manifest.environmentVariables.filter((e: any) => !e.required).map((e: any) => e.key);

    return {
      version: '1',
      name: manifest.name,
      runtime: {
        language: manifest.language,
        version: manifest.runtime,
      },
      package_manager: manifest.packageManager ? {
        name: manifest.packageManager,
        version: manifest.packageManagerVersion,
      } : undefined,
      services: manifest.services.map((s: any) => ({
        name: s.name,
        type: s.type,
        image: s.image,
        port: s.port,
      })),
      ports: manifest.ports,
      environment: {
        required: requiredEnvKeys,
        optional: optionalEnvKeys.length > 0 ? optionalEnvKeys : undefined,
      },
      commands: {
        install: manifest.commands.install,
        dev: manifest.commands.dev,
        test: manifest.commands.test,
      },
    };
  }

  async saveSnapshot(manifest: ProjectManifest, targetPath: string): Promise<string> {
    const snapshotObj = this.createSnapshotConfig(manifest);
    const yamlString = YAML.stringify(snapshotObj);
    const fullPath = path.resolve(targetPath);
    await fs.writeFile(fullPath, yamlString, 'utf-8');
    return fullPath;
  }

  async loadSnapshot(snapshotFilePath: string): Promise<SnapshotConfig> {
    const content = await fs.readFile(snapshotFilePath, 'utf-8');
    const parsed = YAML.parse(content);
    return parsed as SnapshotConfig;
  }
}
