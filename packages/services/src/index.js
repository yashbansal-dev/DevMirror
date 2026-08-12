import { DockerSandbox } from '@devmirror/docker';
import { execa } from 'execa';
export class ServiceManager {
    dockerSandbox = new DockerSandbox();
    async startServices(projectDir, manifest) {
        const results = [];
        // If project has docker-compose file, try docker compose up first
        if (manifest.hasDockerCompose && manifest.dockerComposeFile) {
            try {
                const isDocker = await this.dockerSandbox.checkDockerInstalled();
                if (isDocker) {
                    await execa('docker', ['compose', '-f', manifest.dockerComposeFile, 'up', '-d'], { cwd: projectDir });
                    return manifest.services.map((s) => ({
                        name: s.name,
                        status: 'started',
                        details: `Running via Docker Compose on port ${s.port}`,
                    }));
                }
            }
            catch (err) {
                // Compose start failed or docker not installed, continue to individual service startup
            }
        }
        const isDockerAvailable = await this.dockerSandbox.checkDockerInstalled();
        for (const service of manifest.services) {
            if (isDockerAvailable && service.image) {
                try {
                    await this.dockerSandbox.runServiceContainer(service.name, service.image, service.port, service.port, service.environment || {});
                    results.push({
                        name: service.name,
                        status: 'started',
                        details: `${service.name} container running on localhost:${service.port}`
                    });
                }
                catch (err) {
                    results.push({
                        name: service.name,
                        status: 'fallback_local',
                        details: `Docker container launch failed: ${err.message}. Assuming local ${service.name} service or mock.`
                    });
                }
            }
            else {
                results.push({
                    name: service.name,
                    status: 'fallback_local',
                    details: `Docker not available. Assuming local ${service.name} daemon active on port ${service.port}.`
                });
            }
        }
        return results;
    }
    async stopServices(manifest) {
        for (const service of manifest.services) {
            await this.dockerSandbox.stopContainer(service.name);
        }
    }
}
//# sourceMappingURL=index.js.map