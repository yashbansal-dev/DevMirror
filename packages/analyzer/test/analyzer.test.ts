import test from 'node:test';
import assert from 'node:assert';
import { ProjectAnalyzer } from '../src/index.js';
import * as path from 'node:path';

test('ProjectAnalyzer analyzes demo-fullstack repository', async () => {
  const analyzer = new ProjectAnalyzer();
  const demoPath = path.resolve('examples/demo-fullstack');
  const { manifest } = await analyzer.analyze(demoPath);

  assert.strictEqual(manifest.name, 'demo-fullstack');
  assert.ok(manifest.rawFilesFound.includes('package.json'));
  assert.ok(manifest.rawFilesFound.includes('docker-compose.yml'));
  assert.strictEqual(manifest.hasDockerCompose, true);
});
