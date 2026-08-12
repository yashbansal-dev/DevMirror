import { DevMirrorPlugin, DetectionResult, ProjectManifest, HealthCheck } from '@devmirror/shared';
export declare class PythonPlugin implements DevMirrorPlugin {
    name: string;
    detect(projectDir: string, files: string[]): Promise<DetectionResult>;
    analyze(projectDir: string, manifest: Partial<ProjectManifest>): Promise<Partial<ProjectManifest>>;
    healthCheck(projectDir: string, manifest: ProjectManifest): Promise<HealthCheck[]>;
}
//# sourceMappingURL=index.d.ts.map