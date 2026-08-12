import * as fs from 'node:fs/promises';
import * as path from 'node:path';
export class DockerPlugin {
    name = 'docker';
    async detect(projectDir, files) {
        const composeFile = files.find(f => f === 'docker-compose.yml' || f === 'docker-compose.yaml' || f === 'compose.yml' || f === 'compose.yaml');
        const hasDockerfile = files.includes('Dockerfile');
        if (!composeFile && !hasDockerfile) {
            return { detected: false, confidence: 0, language: 'unknown' };
        }
        const services = [];
        const databases = [];
        if (composeFile) {
            try {
                const content = await fs.readFile(path.join(projectDir, composeFile), 'utf-8');
                const lower = content.toLowerCase();
                if (lower.includes('postgres')) {
                    services.push({ name: 'postgres', type: 'postgres', port: 5432, image: 'postgres:17' });
                    databases.push({ type: 'postgres', port: 5432, connectionStringPattern: 'postgresql://postgres:postgres@localhost:5432/dev' });
                }
                if (lower.includes('redis')) {
                    services.push({ name: 'redis', type: 'redis', port: 6379, image: 'redis:7-alpine' });
                    databases.push({ type: 'redis', port: 6379, connectionStringPattern: 'redis://localhost:6379' });
                }
                if (lower.includes('mysql')) {
                    services.push({ name: 'mysql', type: 'mysql', port: 3306, image: 'mysql:8' });
                    databases.push({ type: 'mysql', port: 3306 });
                }
                if (lower.includes('mongo')) {
                    services.push({ name: 'mongodb', type: 'mongodb', port: 27017, image: 'mongo:7' });
                    databases.push({ type: 'mongodb', port: 27017 });
                }
            }
            catch {
                // Fallback
            }
        }
        return {
            detected: true,
            confidence: 0.85,
            language: 'unknown',
            services,
            databases,
            commands: composeFile ? {
                dev: `docker compose -f ${composeFile} up`,
            } : undefined
        };
    }
    async analyze(projectDir, manifest) {
        return manifest;
    }
}
//# sourceMappingURL=index.js.map