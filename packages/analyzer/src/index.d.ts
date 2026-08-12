import { ProjectManifest } from '@devmirror/shared';
export interface AnalyzeOptions {
    repoPathOrUrl: string;
}
export declare class ProjectAnalyzer {
    private detectorRegistry;
    analyze(repoPathOrUrl: string): Promise<{
        projectDir: string;
        manifest: ProjectManifest;
        isTemporary: boolean;
    }>;
    private resolveRepository;
    private extractEnvFiles;
}
//# sourceMappingURL=index.d.ts.map