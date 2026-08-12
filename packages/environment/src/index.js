import * as fs from 'node:fs/promises';
import * as path from 'node:path';
export class EnvironmentManager {
    static maskSecret(key, value) {
        if (!value)
            return '<missing>';
        const isSecret = key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD') || key.includes('TOKEN') || key.includes('URL');
        if (isSecret) {
            if (value.length <= 6)
                return '******';
            return `${value.slice(0, 3)}...${value.slice(-3)}`;
        }
        return value;
    }
    async inspectEnvironment(projectDir, manifest) {
        const existingEnv = await this.readEnvFile(path.join(projectDir, '.env'));
        const statuses = [];
        for (const envVar of manifest.environmentVariables) {
            if (existingEnv[envVar.key]) {
                statuses.push({
                    key: envVar.key,
                    status: 'configured',
                    isSecret: envVar.isSecret,
                    maskedValue: EnvironmentManager.maskSecret(envVar.key, existingEnv[envVar.key]),
                });
            }
            else if (envVar.defaultValue) {
                statuses.push({
                    key: envVar.key,
                    status: 'default',
                    isSecret: envVar.isSecret,
                    maskedValue: EnvironmentManager.maskSecret(envVar.key, envVar.defaultValue),
                });
            }
            else {
                statuses.push({
                    key: envVar.key,
                    status: 'missing',
                    isSecret: envVar.isSecret,
                });
            }
        }
        return statuses;
    }
    async prepareEnvironment(projectDir, manifest, customOverrides = {}) {
        const existingEnv = await this.readEnvFile(path.join(projectDir, '.env'));
        const finalEnv = { ...process.env, ...existingEnv, ...customOverrides };
        for (const envVar of manifest.environmentVariables) {
            if (!finalEnv[envVar.key] && envVar.defaultValue) {
                finalEnv[envVar.key] = envVar.defaultValue;
            }
        }
        // Write computed values to temporary .env file if it doesn't exist
        const envFilePath = path.join(projectDir, '.env');
        let envContent = '';
        for (const [k, v] of Object.entries(finalEnv)) {
            if (v !== undefined && k !== 'PATH') {
                envContent += `${k}=${v}\n`;
            }
        }
        try {
            await fs.writeFile(envFilePath, envContent, 'utf-8');
        }
        catch { }
        return finalEnv;
    }
    async readEnvFile(filePath) {
        const result = {};
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const lines = content.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#'))
                    continue;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx !== -1) {
                    const k = trimmed.slice(0, eqIdx).trim();
                    const v = trimmed.slice(eqIdx + 1).trim();
                    result[k] = v;
                }
            }
        }
        catch { }
        return result;
    }
}
//# sourceMappingURL=index.js.map