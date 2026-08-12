import { ProjectManifest } from '@devmirror/shared';
export interface EnvStatus {
    key: string;
    status: 'configured' | 'missing' | 'default';
    isSecret: boolean;
    maskedValue?: string;
}
export declare class EnvironmentManager {
    static maskSecret(key: string, value?: string): string;
    inspectEnvironment(projectDir: string, manifest: ProjectManifest): Promise<EnvStatus[]>;
    prepareEnvironment(projectDir: string, manifest: ProjectManifest, customOverrides?: Record<string, string>): Promise<Record<string, string>>;
    private readEnvFile;
}
//# sourceMappingURL=index.d.ts.map