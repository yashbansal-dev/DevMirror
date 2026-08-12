import { DevMirrorPlugin, DetectionResult, StackLanguage, PackageManager, Service, Database, EnvironmentVariable, Entrypoint, ProjectCommands } from '@devmirror/shared';
import { NodePlugin } from '@devmirror/plugin-node';
import { PythonPlugin } from '@devmirror/plugin-python';
import { DockerPlugin } from '@devmirror/plugin-docker';
import { PostgresPlugin } from '@devmirror/plugin-postgres';
import { RedisPlugin } from '@devmirror/plugin-redis';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export class DetectorRegistry {
  private plugins: DevMirrorPlugin[] = [];

  constructor() {
    this.registerPlugin(new NodePlugin());
    this.registerPlugin(new PythonPlugin());
    this.registerPlugin(new DockerPlugin());
    this.registerPlugin(new PostgresPlugin());
    this.registerPlugin(new RedisPlugin());
  }

  registerPlugin(plugin: DevMirrorPlugin) {
    this.plugins.push(plugin);
  }

  async runDetection(projectDir: string): Promise<{
    language: StackLanguage;
    framework?: string;
    packageManager?: PackageManager;
    entrypoints: Entrypoint[];
    services: Service[];
    databases: Database[];
    environmentVariables: EnvironmentVariable[];
    commands: ProjectCommands;
    hasDockerCompose: boolean;
    dockerComposeFile?: string;
    rawFilesFound: string[];
  }> {
    let files: string[] = [];
    try {
      files = await fs.readdir(projectDir);
    } catch {
      files = [];
    }

    const composeFile = files.find(f => f === 'docker-compose.yml' || f === 'docker-compose.yaml' || f === 'compose.yml' || f === 'compose.yaml');

    let language: StackLanguage = 'unknown';
    let framework: string | undefined;
    let packageManager: PackageManager | undefined;
    const entrypoints: Entrypoint[] = [];
    const services: Service[] = [];
    const databases: Database[] = [];
    const environmentVariables: EnvironmentVariable[] = [];
    let commands: ProjectCommands = { dev: 'npm start' };

    for (const plugin of this.plugins) {
      const res = await plugin.detect(projectDir, files);
      if (res.detected) {
        if (res.language && res.language !== 'unknown') {
          language = res.language;
        }
        if (res.framework) {
          framework = res.framework;
        }
        if (res.packageManager) {
          packageManager = res.packageManager;
        }
        if (res.entrypoints) {
          entrypoints.push(...res.entrypoints);
        }
        if (res.services) {
          services.push(...res.services);
        }
        if (res.databases) {
          databases.push(...res.databases);
        }
        if (res.environmentVariables) {
          environmentVariables.push(...res.environmentVariables);
        }
        if (res.commands) {
          commands = { ...commands, ...res.commands };
        }
      }
    }

    // Deduplicate services & databases by name/type
    const uniqueServices = Array.from(new Map(services.map(s => [s.name, s])).values());
    const uniqueDatabases = Array.from(new Map(databases.map(d => [d.type, d])).values());

    return {
      language,
      framework,
      packageManager,
      entrypoints,
      services: uniqueServices,
      databases: uniqueDatabases,
      environmentVariables,
      commands,
      hasDockerCompose: !!composeFile,
      dockerComposeFile: composeFile,
      rawFilesFound: files,
    };
  }
}
