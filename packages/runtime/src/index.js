import { ServiceManager } from '@devmirror/services';
import { EnvironmentManager } from '@devmirror/environment';
import { execa } from 'execa';
import * as http from 'node:http';
export class ProjectRunner {
    serviceManager = new ServiceManager();
    envManager = new EnvironmentManager();
    logs = [];
    activeProcess;
    getLogs() {
        return [...this.logs];
    }
    log(source, type, message) {
        const entry = {
            timestamp: new Date().toISOString(),
            source,
            type,
            message: message.trim(),
        };
        this.logs.push(entry);
    }
    async installDependencies(projectDir, manifest) {
        if (!manifest.commands.install) {
            this.log('install', 'info', 'No explicit install command required.');
            return true;
        }
        this.log('install', 'info', `Running dependency install: ${manifest.commands.install}`);
        try {
            const parts = manifest.commands.install.split(' ');
            const cmd = parts[0];
            const args = parts.slice(1);
            const { stdout, stderr } = await execa(cmd, args, { cwd: projectDir });
            if (stdout)
                this.log('install', 'stdout', stdout);
            if (stderr)
                this.log('install', 'stderr', stderr);
            this.log('install', 'info', 'Dependencies installed successfully.');
            return true;
        }
        catch (err) {
            this.log('install', 'error', `Dependencies installation failed: ${err.message}`);
            if (err.stdout)
                this.log('install', 'stdout', err.stdout);
            if (err.stderr)
                this.log('install', 'stderr', err.stderr);
            return false;
        }
    }
    async runProject(projectDir, manifest, customEnv = {}) {
        // 1. Environment Preparation
        const preparedEnv = await this.envManager.prepareEnvironment(projectDir, manifest, customEnv);
        this.log('app', 'info', 'Environment variables prepared and loaded.');
        // 2. Start Services
        this.log('service', 'info', 'Starting required database infrastructure services...');
        const serviceStatuses = await this.serviceManager.startServices(projectDir, manifest);
        for (const st of serviceStatuses) {
            this.log('service', 'info', `Service ${st.name}: ${st.status} (${st.details})`);
        }
        // 3. Dependency Install
        const installed = await this.installDependencies(projectDir, manifest);
        if (!installed) {
            return { success: false, accessUrl: '', logs: this.logs };
        }
        // 4. Start Application
        const devCmd = manifest.commands.dev;
        this.log('app', 'info', `Starting application with command: ${devCmd}`);
        const mainPort = manifest.ports[0] || 3000;
        const accessUrl = `http://localhost:${mainPort}`;
        try {
            const parts = devCmd.split(' ');
            const cmd = parts[0];
            const args = parts.slice(1);
            this.activeProcess = execa(cmd, args, {
                cwd: projectDir,
                env: preparedEnv,
                all: true,
            });
            this.activeProcess.all?.on('data', (chunk) => {
                const str = chunk.toString();
                this.log('app', 'stdout', str);
            });
            // Allow 2 seconds for early startup crash detection
            await new Promise((resolve) => setTimeout(resolve, 2000));
            if (this.activeProcess.exitCode !== null) {
                this.log('app', 'error', `Application exited early with code ${this.activeProcess.exitCode}`);
                return { success: false, accessUrl, logs: this.logs };
            }
            this.log('health', 'info', `Application running on ${accessUrl}`);
            return { success: true, accessUrl, logs: this.logs };
        }
        catch (err) {
            this.log('app', 'error', `Application startup error: ${err.message}`);
            return { success: false, accessUrl, logs: this.logs };
        }
    }
    async checkHealth(targetUrl, maxAttempts = 5) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const status = await new Promise((resolve) => {
                    const req = http.get(targetUrl, (res) => resolve(res.statusCode || 500));
                    req.on('error', () => resolve(500));
                    req.end();
                });
                if (status >= 200 && status < 500)
                    return true;
            }
            catch { }
            await new Promise((r) => setTimeout(r, 1000));
        }
        return false;
    }
    async stop() {
        if (this.activeProcess) {
            this.activeProcess.kill();
            this.activeProcess = undefined;
        }
    }
}
//# sourceMappingURL=index.js.map