import * as fs from 'node:fs/promises';
import * as path from 'node:path';
export class PostgresPlugin {
    name = 'postgres';
    async detect(projectDir, files) {
        let hasPostgres = false;
        // Check env files or schema files (prisma, drizzle, sqlalchemy, etc.)
        for (const f of ['.env.example', '.env.sample', 'schema.prisma', 'drizzle.config.ts', 'ormconfig.json']) {
            if (files.includes(f)) {
                try {
                    const content = await fs.readFile(path.join(projectDir, f), 'utf-8');
                    if (content.toLowerCase().includes('postgres') || content.toLowerCase().includes('postgresql') || content.includes('DATABASE_URL')) {
                        hasPostgres = true;
                        break;
                    }
                }
                catch { }
            }
        }
        if (!hasPostgres) {
            return { detected: false, confidence: 0, language: 'unknown' };
        }
        const service = {
            name: 'postgres',
            type: 'postgres',
            image: 'postgres:17-alpine',
            port: 5432,
            environment: {
                POSTGRES_USER: 'postgres',
                POSTGRES_PASSWORD: 'postgres_password',
                POSTGRES_DB: 'devmirror_db'
            },
            healthCheckCmd: 'pg_isready -U postgres'
        };
        const database = {
            type: 'postgres',
            name: 'devmirror_db',
            port: 5432,
            connectionStringPattern: 'postgresql://postgres:postgres_password@localhost:5432/devmirror_db'
        };
        return {
            detected: true,
            confidence: 0.9,
            language: 'unknown',
            services: [service],
            databases: [database],
            environmentVariables: [
                {
                    key: 'DATABASE_URL',
                    defaultValue: 'postgresql://postgres:postgres_password@localhost:5432/devmirror_db',
                    description: 'PostgreSQL database connection URL',
                    isSecret: true,
                    required: true
                }
            ]
        };
    }
    async analyze(projectDir, manifest) {
        return manifest;
    }
}
//# sourceMappingURL=index.js.map