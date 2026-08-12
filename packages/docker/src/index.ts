import { SecuritySandboxConfig } from '@devmirror/shared';
import { execa } from 'execa';
import * as path from 'node:path';

export class DockerSandbox {
  private blockedPaths = [
    '.ssh',
    '.aws',
    '.gcp',
    '.kube',
    '.azure',
    '.config/gcloud',
    'AppData/Roaming/Mozilla',
    'Library/Application Support/Google/Chrome',
  ];

  isDockerAvailable = false;

  async checkDockerInstalled(): Promise<boolean> {
    try {
      await execa('docker', ['--version']);
      this.isDockerAvailable = true;
      return true;
    } catch {
      this.isDockerAvailable = false;
      return false;
    }
  }

  validateMountPath(targetPath: string): void {
    const normalized = path.normalize(targetPath);
    for (const blocked of this.blockedPaths) {
      if (normalized.includes(blocked)) {
        throw new Error(`Security Violation: Attempted to mount sensitive host directory containing '${blocked}'. Operation aborted.`);
      }
    }
  }

  getSandboxConfig(mode: 'strict' | 'standard' | 'off' = 'standard', networkMode: 'isolated' | 'bridge' | 'host' = 'bridge'): SecuritySandboxConfig {
    return {
      sandboxMode: mode,
      networkMode: mode === 'strict' ? 'isolated' : networkMode,
      allowedPorts: [3000, 5000, 5173, 8000, 8080, 5432, 6379, 27017, 3306],
      blockedMounts: this.blockedPaths,
    };
  }

  async runServiceContainer(
    name: string,
    image: string,
    hostPort: number,
    containerPort: number,
    env: Record<string, string> = {}
  ): Promise<{ containerId: string }> {
    const dockerAvailable = await this.checkDockerInstalled();
    if (!dockerAvailable) {
      throw new Error(`Docker is required to run service '${name}' (${image}), but Docker is not running or not installed.`);
    }

    const envFlags: string[] = [];
    for (const [k, v] of Object.entries(env)) {
      envFlags.push('-e', `${k}=${v}`);
    }

    // Stop existing container with same name if any
    try {
      await execa('docker', ['rm', '-f', `devmirror-${name}`]);
    } catch {}

    const args = [
      'run',
      '-d',
      '--name', `devmirror-${name}`,
      '-p', `${hostPort}:${containerPort}`,
      ...envFlags,
      image
    ];

    const { stdout } = await execa('docker', args);
    return { containerId: stdout.trim() };
  }

  async stopContainer(name: string): Promise<void> {
    try {
      await execa('docker', ['rm', '-f', `devmirror-${name}`]);
    } catch {}
  }
}
