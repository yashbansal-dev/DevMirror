import { ProjectManifest, SnapshotConfig } from '@devmirror/shared';
export declare class SnapshotManager {
    createSnapshotConfig(manifest: ProjectManifest): SnapshotConfig;
    saveSnapshot(manifest: ProjectManifest, targetPath: string): Promise<string>;
    loadSnapshot(snapshotFilePath: string): Promise<SnapshotConfig>;
}
//# sourceMappingURL=index.d.ts.map