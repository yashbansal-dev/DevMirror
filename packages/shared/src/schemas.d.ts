import { z } from 'zod';
export declare const EntrypointSchema: z.ZodObject<{
    path: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["web", "api", "worker", "cli", "service"]>;
    port: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "web" | "api" | "service" | "worker" | "cli";
    path: string;
    port?: number | undefined;
}, {
    name: string;
    type: "web" | "api" | "service" | "worker" | "cli";
    path: string;
    port?: number | undefined;
}>;
export declare const ServiceSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["postgres", "mysql", "mongodb", "redis", "rabbitmq", "elasticsearch", "sqlite", "custom"]>;
    image: z.ZodOptional<z.ZodString>;
    port: z.ZodNumber;
    environment: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    healthCheckCmd: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    port: number;
    type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
    image?: string | undefined;
    environment?: Record<string, string> | undefined;
    healthCheckCmd?: string | undefined;
}, {
    name: string;
    port: number;
    type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
    image?: string | undefined;
    environment?: Record<string, string> | undefined;
    healthCheckCmd?: string | undefined;
}>;
export declare const EnvironmentVariableSchema: z.ZodObject<{
    key: z.ZodString;
    defaultValue: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    isSecret: z.ZodBoolean;
    required: z.ZodBoolean;
    sourceFile: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    key: string;
    isSecret: boolean;
    required: boolean;
    defaultValue?: string | undefined;
    description?: string | undefined;
    sourceFile?: string | undefined;
}, {
    key: string;
    isSecret: boolean;
    required: boolean;
    defaultValue?: string | undefined;
    description?: string | undefined;
    sourceFile?: string | undefined;
}>;
export declare const DatabaseSchema: z.ZodObject<{
    type: z.ZodEnum<["postgres", "mysql", "mongodb", "redis", "rabbitmq", "elasticsearch", "sqlite"]>;
    name: z.ZodOptional<z.ZodString>;
    port: z.ZodNumber;
    connectionStringPattern: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    port: number;
    type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite";
    name?: string | undefined;
    connectionStringPattern?: string | undefined;
}, {
    port: number;
    type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite";
    name?: string | undefined;
    connectionStringPattern?: string | undefined;
}>;
export declare const ProjectCommandsSchema: z.ZodObject<{
    install: z.ZodOptional<z.ZodString>;
    build: z.ZodOptional<z.ZodString>;
    dev: z.ZodString;
    start: z.ZodOptional<z.ZodString>;
    test: z.ZodOptional<z.ZodString>;
    lint: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    dev: string;
    test?: string | undefined;
    build?: string | undefined;
    start?: string | undefined;
    install?: string | undefined;
    lint?: string | undefined;
}, {
    dev: string;
    test?: string | undefined;
    build?: string | undefined;
    start?: string | undefined;
    install?: string | undefined;
    lint?: string | undefined;
}>;
export declare const ProjectManifestSchema: z.ZodObject<{
    name: z.ZodString;
    language: z.ZodEnum<["javascript", "typescript", "python", "go", "rust", "java", "cpp", "php", "ruby", "unknown"]>;
    framework: z.ZodOptional<z.ZodString>;
    packageManager: z.ZodOptional<z.ZodEnum<["npm", "pnpm", "yarn", "bun", "pip", "poetry", "uv", "pipenv", "cargo", "go", "maven", "gradle", "composer", "bundler"]>>;
    runtime: z.ZodOptional<z.ZodString>;
    packageManagerVersion: z.ZodOptional<z.ZodString>;
    entrypoints: z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<["web", "api", "worker", "cli", "service"]>;
        port: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "web" | "api" | "service" | "worker" | "cli";
        path: string;
        port?: number | undefined;
    }, {
        name: string;
        type: "web" | "api" | "service" | "worker" | "cli";
        path: string;
        port?: number | undefined;
    }>, "many">;
    services: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["postgres", "mysql", "mongodb", "redis", "rabbitmq", "elasticsearch", "sqlite", "custom"]>;
        image: z.ZodOptional<z.ZodString>;
        port: z.ZodNumber;
        environment: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        healthCheckCmd: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
        image?: string | undefined;
        environment?: Record<string, string> | undefined;
        healthCheckCmd?: string | undefined;
    }, {
        name: string;
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
        image?: string | undefined;
        environment?: Record<string, string> | undefined;
        healthCheckCmd?: string | undefined;
    }>, "many">;
    environmentVariables: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        defaultValue: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        isSecret: z.ZodBoolean;
        required: z.ZodBoolean;
        sourceFile: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        isSecret: boolean;
        required: boolean;
        defaultValue?: string | undefined;
        description?: string | undefined;
        sourceFile?: string | undefined;
    }, {
        key: string;
        isSecret: boolean;
        required: boolean;
        defaultValue?: string | undefined;
        description?: string | undefined;
        sourceFile?: string | undefined;
    }>, "many">;
    ports: z.ZodArray<z.ZodNumber, "many">;
    databases: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["postgres", "mysql", "mongodb", "redis", "rabbitmq", "elasticsearch", "sqlite"]>;
        name: z.ZodOptional<z.ZodString>;
        port: z.ZodNumber;
        connectionStringPattern: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite";
        name?: string | undefined;
        connectionStringPattern?: string | undefined;
    }, {
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite";
        name?: string | undefined;
        connectionStringPattern?: string | undefined;
    }>, "many">;
    commands: z.ZodObject<{
        install: z.ZodOptional<z.ZodString>;
        build: z.ZodOptional<z.ZodString>;
        dev: z.ZodString;
        start: z.ZodOptional<z.ZodString>;
        test: z.ZodOptional<z.ZodString>;
        lint: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        dev: string;
        test?: string | undefined;
        build?: string | undefined;
        start?: string | undefined;
        install?: string | undefined;
        lint?: string | undefined;
    }, {
        dev: string;
        test?: string | undefined;
        build?: string | undefined;
        start?: string | undefined;
        install?: string | undefined;
        lint?: string | undefined;
    }>;
    hasDockerCompose: z.ZodBoolean;
    dockerComposeFile: z.ZodOptional<z.ZodString>;
    rawFilesFound: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    services: {
        name: string;
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
        image?: string | undefined;
        environment?: Record<string, string> | undefined;
        healthCheckCmd?: string | undefined;
    }[];
    language: "python" | "ruby" | "typescript" | "javascript" | "unknown" | "go" | "rust" | "java" | "cpp" | "php";
    entrypoints: {
        name: string;
        type: "web" | "api" | "service" | "worker" | "cli";
        path: string;
        port?: number | undefined;
    }[];
    databases: {
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite";
        name?: string | undefined;
        connectionStringPattern?: string | undefined;
    }[];
    environmentVariables: {
        key: string;
        isSecret: boolean;
        required: boolean;
        defaultValue?: string | undefined;
        description?: string | undefined;
        sourceFile?: string | undefined;
    }[];
    commands: {
        dev: string;
        test?: string | undefined;
        build?: string | undefined;
        start?: string | undefined;
        install?: string | undefined;
        lint?: string | undefined;
    };
    rawFilesFound: string[];
    hasDockerCompose: boolean;
    ports: number[];
    framework?: string | undefined;
    packageManager?: "npm" | "go" | "pnpm" | "yarn" | "bun" | "pip" | "poetry" | "uv" | "pipenv" | "cargo" | "maven" | "gradle" | "composer" | "bundler" | undefined;
    dockerComposeFile?: string | undefined;
    runtime?: string | undefined;
    packageManagerVersion?: string | undefined;
}, {
    name: string;
    services: {
        name: string;
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
        image?: string | undefined;
        environment?: Record<string, string> | undefined;
        healthCheckCmd?: string | undefined;
    }[];
    language: "python" | "ruby" | "typescript" | "javascript" | "unknown" | "go" | "rust" | "java" | "cpp" | "php";
    entrypoints: {
        name: string;
        type: "web" | "api" | "service" | "worker" | "cli";
        path: string;
        port?: number | undefined;
    }[];
    databases: {
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite";
        name?: string | undefined;
        connectionStringPattern?: string | undefined;
    }[];
    environmentVariables: {
        key: string;
        isSecret: boolean;
        required: boolean;
        defaultValue?: string | undefined;
        description?: string | undefined;
        sourceFile?: string | undefined;
    }[];
    commands: {
        dev: string;
        test?: string | undefined;
        build?: string | undefined;
        start?: string | undefined;
        install?: string | undefined;
        lint?: string | undefined;
    };
    rawFilesFound: string[];
    hasDockerCompose: boolean;
    ports: number[];
    framework?: string | undefined;
    packageManager?: "npm" | "go" | "pnpm" | "yarn" | "bun" | "pip" | "poetry" | "uv" | "pipenv" | "cargo" | "maven" | "gradle" | "composer" | "bundler" | undefined;
    dockerComposeFile?: string | undefined;
    runtime?: string | undefined;
    packageManagerVersion?: string | undefined;
}>;
export declare const SnapshotConfigSchema: z.ZodObject<{
    version: z.ZodString;
    name: z.ZodString;
    runtime: z.ZodObject<{
        language: z.ZodString;
        version: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        language: string;
        version?: string | undefined;
    }, {
        language: string;
        version?: string | undefined;
    }>;
    package_manager: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version?: string | undefined;
    }, {
        name: string;
        version?: string | undefined;
    }>>;
    services: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["postgres", "mysql", "mongodb", "redis", "rabbitmq", "elasticsearch", "sqlite", "custom"]>;
        image: z.ZodOptional<z.ZodString>;
        port: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
        image?: string | undefined;
    }, {
        name: string;
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
        image?: string | undefined;
    }>, "many">;
    ports: z.ZodArray<z.ZodNumber, "many">;
    environment: z.ZodOptional<z.ZodObject<{
        required: z.ZodArray<z.ZodString, "many">;
        optional: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        required: string[];
        optional?: string[] | undefined;
    }, {
        required: string[];
        optional?: string[] | undefined;
    }>>;
    commands: z.ZodObject<{
        install: z.ZodOptional<z.ZodString>;
        dev: z.ZodString;
        test: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        dev: string;
        test?: string | undefined;
        install?: string | undefined;
    }, {
        dev: string;
        test?: string | undefined;
        install?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    services: {
        name: string;
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
        image?: string | undefined;
    }[];
    version: string;
    commands: {
        dev: string;
        test?: string | undefined;
        install?: string | undefined;
    };
    runtime: {
        language: string;
        version?: string | undefined;
    };
    ports: number[];
    environment?: {
        required: string[];
        optional?: string[] | undefined;
    } | undefined;
    package_manager?: {
        name: string;
        version?: string | undefined;
    } | undefined;
}, {
    name: string;
    services: {
        name: string;
        port: number;
        type: "postgres" | "redis" | "mysql" | "mongodb" | "rabbitmq" | "elasticsearch" | "sqlite" | "custom";
        image?: string | undefined;
    }[];
    version: string;
    commands: {
        dev: string;
        test?: string | undefined;
        install?: string | undefined;
    };
    runtime: {
        language: string;
        version?: string | undefined;
    };
    ports: number[];
    environment?: {
        required: string[];
        optional?: string[] | undefined;
    } | undefined;
    package_manager?: {
        name: string;
        version?: string | undefined;
    } | undefined;
}>;
//# sourceMappingURL=schemas.d.ts.map