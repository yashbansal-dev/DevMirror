import { DevMirrorPlugin, StackLanguage, PackageManager, Service, Database, EnvironmentVariable, Entrypoint, ProjectCommands } from '@devmirror/shared';
export declare class DetectorRegistry {
    private plugins;
    constructor();
    registerPlugin(plugin: DevMirrorPlugin): void;
    runDetection(projectDir: string): Promise<{
        language: StackLanguage;
        framework?: string;
        packageManager?: PackageManager;
        entrypoints: Entrypoint[];
        services: Service[];
        databases: Database[];
        environmentVariables: EnvironmentVariable[];
        commands: ProjectCommands;
        hasDockerCompose: boolean;
        dockerComposeFile?: string;
        rawFilesFound: string[];
    }>;
}
//# sourceMappingURL=index.d.ts.map