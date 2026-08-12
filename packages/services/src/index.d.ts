import { ProjectManifest } from '@devmirror/shared';
export declare class ServiceManager {
    private dockerSandbox;
    startServices(projectDir: string, manifest: ProjectManifest): Promise<Array<{
        name: string;
        status: 'started' | 'fallback_local' | 'failed';
        details: string;
    }>>;
    stopServices(manifest: ProjectManifest): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map