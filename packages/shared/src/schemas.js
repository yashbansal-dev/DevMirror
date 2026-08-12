import { z } from 'zod';
export const EntrypointSchema = z.object({
    path: z.string(),
    name: z.string(),
    type: z.enum(['web', 'api', 'worker', 'cli', 'service']),
    port: z.number().optional(),
});
export const ServiceSchema = z.object({
    name: z.string(),
    type: z.enum(['postgres', 'mysql', 'mongodb', 'redis', 'rabbitmq', 'elasticsearch', 'sqlite', 'custom']),
    image: z.string().optional(),
    port: z.number(),
    environment: z.record(z.string()).optional(),
    healthCheckCmd: z.string().optional(),
});
export const EnvironmentVariableSchema = z.object({
    key: z.string(),
    defaultValue: z.string().optional(),
    description: z.string().optional(),
    isSecret: z.boolean(),
    required: z.boolean(),
    sourceFile: z.string().optional(),
});
export const DatabaseSchema = z.object({
    type: z.enum(['postgres', 'mysql', 'mongodb', 'redis', 'rabbitmq', 'elasticsearch', 'sqlite']),
    name: z.string().optional(),
    port: z.number(),
    connectionStringPattern: z.string().optional(),
});
export const ProjectCommandsSchema = z.object({
    install: z.string().optional(),
    build: z.string().optional(),
    dev: z.string(),
    start: z.string().optional(),
    test: z.string().optional(),
    lint: z.string().optional(),
});
export const ProjectManifestSchema = z.object({
    name: z.string(),
    language: z.enum(['javascript', 'typescript', 'python', 'go', 'rust', 'java', 'cpp', 'php', 'ruby', 'unknown']),
    framework: z.string().optional(),
    packageManager: z.enum(['npm', 'pnpm', 'yarn', 'bun', 'pip', 'poetry', 'uv', 'pipenv', 'cargo', 'go', 'maven', 'gradle', 'composer', 'bundler']).optional(),
    runtime: z.string().optional(),
    packageManagerVersion: z.string().optional(),
    entrypoints: z.array(EntrypointSchema),
    services: z.array(ServiceSchema),
    environmentVariables: z.array(EnvironmentVariableSchema),
    ports: z.array(z.number()),
    databases: z.array(DatabaseSchema),
    commands: ProjectCommandsSchema,
    hasDockerCompose: z.boolean(),
    dockerComposeFile: z.string().optional(),
    rawFilesFound: z.array(z.string()),
});
export const SnapshotConfigSchema = z.object({
    version: z.string(),
    name: z.string(),
    runtime: z.object({
        language: z.string(),
        version: z.string().optional(),
    }),
    package_manager: z.object({
        name: z.string(),
        version: z.string().optional(),
    }).optional(),
    services: z.array(z.object({
        name: z.string(),
        type: z.enum(['postgres', 'mysql', 'mongodb', 'redis', 'rabbitmq', 'elasticsearch', 'sqlite', 'custom']),
        image: z.string().optional(),
        port: z.number(),
    })),
    ports: z.array(z.number()),
    environment: z.object({
        required: z.array(z.string()),
        optional: z.array(z.string()).optional(),
    }).optional(),
    commands: z.object({
        install: z.string().optional(),
        dev: z.string(),
        test: z.string().optional(),
    }),
});
//# sourceMappingURL=schemas.js.map