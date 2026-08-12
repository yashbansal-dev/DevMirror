import { DetectorRegistry } from '@devmirror/detectors';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { execa } from 'execa';
export class ProjectAnalyzer {
    detectorRegistry = new DetectorRegistry();
    async analyze(repoPathOrUrl) {
        const { projectDir, isTemporary } = await this.resolveRepository(repoPathOrUrl);
        const detection = await this.detectorRegistry.runDetection(projectDir);
        let projectName = path.basename(path.resolve(projectDir));
        if (projectName === '.' || !projectName)
            projectName = 'app';
        // Collect additional env variables from .env.example / .env.sample
        const envVars = [...detection.environmentVariables];
        const extractedEnvs = await this.extractEnvFiles(projectDir);
        for (const env of extractedEnvs) {
            if (!envVars.some(e => e.key === env.key)) {
                envVars.push(env);
            }
        }
        // Determine ports
        const ports = [];
        for (const ep of detection.entrypoints) {
            if (ep.port && !ports.includes(ep.port))
                ports.push(ep.port);
        }
        for (const svc of detection.services) {
            if (svc.port && !ports.includes(svc.port))
                ports.push(svc.port);
        }
        if (ports.length === 0)
            ports.push(3000);
        const manifest = {
            name: projectName,
            language: detection.language,
            framework: detection.framework,
            packageManager: detection.packageManager,
            runtime: detection.language === 'typescript' || detection.language === 'javascript' ? 'Node.js 22' : (detection.language === 'python' ? 'Python 3.12' : undefined),
            entrypoints: detection.entrypoints.length > 0 ? detection.entrypoints : [{ name: 'main', path: 'src/index.js', type: 'web', port: 3000 }],
            services: detection.services,
            environmentVariables: envVars,
            ports,
            databases: detection.databases,
            commands: detection.commands,
            hasDockerCompose: detection.hasDockerCompose,
            dockerComposeFile: detection.dockerComposeFile,
            rawFilesFound: detection.rawFilesFound,
        };
        return { projectDir, manifest, isTemporary };
    }
    async resolveRepository(repoPathOrUrl) {
        // If it's a GitHub URL or "user/repo" shortcut
        if (repoPathOrUrl.startsWith('http://') || repoPathOrUrl.startsWith('https://') || (repoPathOrUrl.includes('/') && !repoPathOrUrl.startsWith('.') && !repoPathOrUrl.startsWith('/') && !path.isAbsolute(repoPathOrUrl))) {
            let cloneUrl = repoPathOrUrl;
            if (!repoPathOrUrl.startsWith('http')) {
                cloneUrl = `https://github.com/${repoPathOrUrl}.git`;
            }
            const tmpDir = path.join(process.cwd(), '.devmirror_repos', `repo-${Date.now()}`);
            await fs.mkdir(tmpDir, { recursive: true });
            await execa('git', ['clone', '--depth', '1', cloneUrl, tmpDir]);
            return { projectDir: tmpDir, isTemporary: true };
        }
        const resolved = path.resolve(repoPathOrUrl);
        const stat = await fs.stat(resolved);
        if (!stat.isDirectory()) {
            throw new Error(`Target path ${repoPathOrUrl} is not a valid directory.`);
        }
        return { projectDir: resolved, isTemporary: false };
    }
    async extractEnvFiles(projectDir) {
        const envVars = [];
        const filesToSearch = ['.env.example', '.env.sample', '.env.template', '.env.local.example'];
        for (const f of filesToSearch) {
            const fullPath = path.join(projectDir, f);
            try {
                const content = await fs.readFile(fullPath, 'utf-8');
                const lines = content.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith('#'))
                        continue;
                    const eqIdx = trimmed.indexOf('=');
                    if (eqIdx !== -1) {
                        const key = trimmed.slice(0, eqIdx).trim();
                        const val = trimmed.slice(eqIdx + 1).trim();
                        const isSecret = key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD') || key.includes('TOKEN') || key.includes('URL');
                        envVars.push({
                            key,
                            defaultValue: val,
                            isSecret,
                            required: true,
                            sourceFile: f,
                        });
                    }
                }
            }
            catch { }
        }
        return envVars;
    }
}
//# sourceMappingURL=index.js.map