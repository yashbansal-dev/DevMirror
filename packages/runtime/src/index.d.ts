import { ProjectManifest } from '@devmirror/shared';
export interface ExecutionLog {
    timestamp: string;
    source: 'install' | 'service' | 'app' | 'health';
    type: 'stdout' | 'stderr' | 'info' | 'error';
    message: string;
}
export declare class ProjectRunner {
    private serviceManager;
    private envManager;
    private logs;
    private activeProcess?;
    getLogs(): ExecutionLog[];
    private log;
    installDependencies(projectDir: string, manifest: ProjectManifest): Promise<boolean>;
    runProject(projectDir: string, manifest: ProjectManifest, customEnv?: Record<string, string>): Promise<{
        success: boolean;
        accessUrl: string;
        logs: ExecutionLog[];
    }>;
    checkHealth(targetUrl: string, maxAttempts?: number): Promise<boolean>;
    stop(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map