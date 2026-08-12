import { SecuritySandboxConfig } from '@devmirror/shared';
export declare class DockerSandbox {
    private blockedPaths;
    isDockerAvailable: boolean;
    checkDockerInstalled(): Promise<boolean>;
    validateMountPath(targetPath: string): void;
    getSandboxConfig(mode?: 'strict' | 'standard' | 'off', networkMode?: 'isolated' | 'bridge' | 'host'): SecuritySandboxConfig;
    runServiceContainer(name: string, image: string, hostPort: number, containerPort: number, env?: Record<string, string>): Promise<{
        containerId: string;
    }>;
    stopContainer(name: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map