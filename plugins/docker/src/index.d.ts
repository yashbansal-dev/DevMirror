import { DevMirrorPlugin, DetectionResult, ProjectManifest } from '@devmirror/shared';
export declare class DockerPlugin implements DevMirrorPlugin {
    name: string;
    detect(projectDir: string, files: string[]): Promise<DetectionResult>;
    analyze(projectDir: string, manifest: Partial<ProjectManifest>): Promise<Partial<ProjectManifest>>;
}
//# sourceMappingURL=index.d.ts.map