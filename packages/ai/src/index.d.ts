import { ProjectManifest, ArchitectureExplanation } from '@devmirror/shared';
export declare class AIEngine {
    private apiKey?;
    constructor();
    explainArchitecture(manifest: ProjectManifest, question?: string): Promise<ArchitectureExplanation>;
}
//# sourceMappingURL=index.d.ts.map