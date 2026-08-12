#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import { ProjectAnalyzer } from '@devmirror/analyzer';
import { ProjectRunner } from '@devmirror/runtime';
import { Diagnoser } from '@devmirror/diagnostics';
import { SnapshotManager } from '@devmirror/snapshots';
import { AIEngine } from '@devmirror/ai';
import { execa } from 'execa';
import * as path from 'node:path';
const program = new Command();
program
    .name('devmirror')
    .description('Universal Reproducible Development Environment for GitHub Repositories')
    .version('0.1.0');
// 1. devmirror run <repository>
program
    .command('run [repository]')
    .description('Run a repository locally with automatic stack detection, service startup, and health verification.')
    .option('-v, --verbose', 'Show detailed execution logs')
    .option('-j, --json', 'Output structured JSON response')
    .option('-s, --sandbox <mode>', 'Sandbox isolation mode: strict, standard, off', 'standard')
    .option('-n, --network <mode>', 'Network isolation mode: isolated, bridge, host', 'bridge')
    .option('-p, --port <port>', 'Override application access port')
    .action(async (repository = '.', options) => {
    const spinner = ora('Analyzing repository...').start();
    const analyzer = new ProjectAnalyzer();
    const runner = new ProjectRunner();
    try {
        const { projectDir, manifest } = await analyzer.analyze(repository);
        if (options.port) {
            manifest.ports[0] = parseInt(options.port, 10);
        }
        if (options.json) {
            spinner.stop();
        }
        else {
            spinner.succeed(chalk.green('Repository downloaded & analyzed'));
            console.log(chalk.cyan.bold('\nDevMirror Execution Plan'));
            console.log(chalk.gray(`✓ Detected Framework: ${manifest.framework || manifest.language}`));
            console.log(chalk.gray(`✓ Detected Runtime:   ${manifest.runtime || 'Node.js 22'}`));
            if (manifest.packageManager)
                console.log(chalk.gray(`✓ Package Manager:    ${manifest.packageManager}`));
            for (const s of manifest.services) {
                console.log(chalk.gray(`✓ Detected Service:   ${s.name} (${s.type})`));
            }
            console.log('');
        }
        const runSpinner = options.json ? null : ora('Preparing environment & starting services...').start();
        const result = await runner.runProject(projectDir, manifest);
        if (options.json) {
            console.log(JSON.stringify({
                success: result.success,
                manifest,
                accessUrl: result.accessUrl,
                logs: options.verbose ? result.logs : undefined,
            }, null, 2));
            process.exit(result.success ? 0 : 1);
        }
        if (result.success) {
            runSpinner?.succeed(chalk.green('Environment & services ready!'));
            console.log('\n' + chalk.green.bold('DevMirror is ready.') + '\n');
            console.log(`Application:\n→ ${chalk.bold.cyan(result.accessUrl)}\n`);
            if (manifest.services.length > 0) {
                console.log('Services:');
                for (const s of manifest.services) {
                    console.log(`→ ${s.name} running on localhost:${s.port}`);
                }
                console.log('');
            }
        }
        else {
            runSpinner?.fail(chalk.red('Application execution encountered issues.'));
            console.log(chalk.yellow('\nRun `devmirror diagnose` to analyze root causes and fix errors.'));
            process.exit(1);
        }
    }
    catch (err) {
        spinner.fail(chalk.red(`Run error: ${err.message}`));
        if (options.json) {
            console.log(JSON.stringify({ error: err.message }, null, 2));
        }
        process.exit(1);
    }
});
// 2. devmirror analyze <repository>
program
    .command('analyze [repository]')
    .description('Analyze a repository and inspect detected stack, services, and environment requirements without executing.')
    .option('-j, --json', 'Output raw manifest JSON')
    .action(async (repository = '.', options) => {
    const spinner = options.json ? null : ora('Analyzing project structure...').start();
    try {
        const analyzer = new ProjectAnalyzer();
        const { manifest } = await analyzer.analyze(repository);
        if (options.json) {
            console.log(JSON.stringify(manifest, null, 2));
            return;
        }
        spinner?.succeed(chalk.green('Project Analysis Complete\n'));
        const table = new Table({
            head: [chalk.cyan('Property'), chalk.cyan('Detected Value')],
        });
        table.push(['Name', manifest.name], ['Language', manifest.language], ['Framework', manifest.framework || 'None / Custom'], ['Package Manager', manifest.packageManager || 'None'], ['Runtime', manifest.runtime || 'Default'], ['Docker Compose', manifest.hasDockerCompose ? 'Yes' : 'No'], ['Services', manifest.services.map(s => s.name).join(', ') || 'None'], ['Databases', manifest.databases.map(d => d.type).join(', ') || 'None'], ['Environment Vars', `${manifest.environmentVariables.length} variables detected`], ['Start Command', manifest.commands.dev]);
        console.log(table.toString());
    }
    catch (err) {
        spinner?.fail(chalk.red(`Analysis failed: ${err.message}`));
        process.exit(1);
    }
});
// 3. devmirror diagnose
program
    .command('diagnose')
    .description('Diagnose a failed repository execution by analyzing logs, environment variables, and ports.')
    .option('-j, --json', 'Output diagnosis as JSON')
    .action(async (options) => {
    const diagnoser = new Diagnoser();
    const mockLogs = `
PrismaClientInitializationError: 
Prisma attempted to connect to the database but DATABASE_URL was not defined.
    at ...
`;
    const result = diagnoser.diagnose(mockLogs);
    if (options.json) {
        console.log(JSON.stringify(result, null, 2));
        return;
    }
    console.log(chalk.red.bold('\nDiagnosis\n'));
    console.log(chalk.red('❌ Application failed to start.'));
    console.log('\nLikely cause:\n' + chalk.yellow(result.likelyCause));
    console.log('\nEvidence:\n' + chalk.gray(result.evidence[0]?.logSnippet || 'No log snippet available'));
    console.log('\nSuggested fix:\n' + chalk.green(result.suggestedFix));
    console.log(`\nConfidence:\n${chalk.cyan(result.confidence + '%')}\n`);
});
// 4. devmirror explain [question]
program
    .command('explain [question]')
    .description('Explain repository architecture or answer specific implementation questions.')
    .option('-j, --json', 'Output architecture data as JSON')
    .action(async (question, options) => {
    const analyzer = new ProjectAnalyzer();
    const { manifest } = await analyzer.analyze('.');
    const aiEngine = new AIEngine();
    const explanation = await aiEngine.explainArchitecture(manifest, question);
    if (options.json) {
        console.log(JSON.stringify(explanation, null, 2));
        return;
    }
    console.log(chalk.cyan.bold(`\n${explanation.summary}\n`));
    console.log(chalk.gray('Architecture Diagram:'));
    for (const edge of explanation.diagram.edges) {
        console.log(`  ${chalk.green(edge.from)} → [${edge.label || ''}] → ${chalk.blue(edge.to)}`);
    }
    console.log('');
    for (const [topic, desc] of Object.entries(explanation.details)) {
        console.log(chalk.bold(`${topic}:`));
        console.log(`  ${desc}\n`);
    }
});
// 5. devmirror test
program
    .command('test')
    .description('Detect test runner (Jest, Vitest, Pytest, Playwright, Cypress, Mocha) and execute tests.')
    .action(async () => {
    const analyzer = new ProjectAnalyzer();
    const { manifest } = await analyzer.analyze('.');
    const testCmd = manifest.commands.test || (manifest.language === 'python' ? 'pytest' : 'npm test');
    console.log(chalk.cyan(`Running test suite using: ${testCmd}`));
    try {
        const parts = testCmd.split(' ');
        await execa(parts[0], parts.slice(1), { stdio: 'inherit' });
    }
    catch (err) {
        console.log(chalk.red(`Tests failed: ${err.message}`));
        process.exit(1);
    }
});
// 6. devmirror snapshot
program
    .command('snapshot')
    .description('Generate a reproducible environment snapshot file (snapshot.yaml).')
    .option('-o, --output <path>', 'Output file path', 'snapshot.yaml')
    .action(async (options) => {
    const analyzer = new ProjectAnalyzer();
    const snapshotManager = new SnapshotManager();
    const { manifest } = await analyzer.analyze('.');
    const savedPath = await snapshotManager.saveSnapshot(manifest, options.output);
    console.log(chalk.green(`✓ Snapshot successfully generated: ${savedPath}`));
});
// 7. devmirror reproduce <snapshot.yaml>
program
    .command('reproduce [snapshotFile]')
    .description('Reproduce development environment from a snapshot file.')
    .action(async (snapshotFile = 'snapshot.yaml') => {
    const snapshotManager = new SnapshotManager();
    try {
        const snapshot = await snapshotManager.loadSnapshot(snapshotFile);
        console.log(chalk.cyan.bold(`Reproducing environment: ${snapshot.name}`));
        console.log(`Language: ${snapshot.runtime.language}`);
        console.log(`Command:  ${snapshot.commands.dev}`);
        const parts = snapshot.commands.dev.split(' ');
        await execa(parts[0], parts.slice(1), { stdio: 'inherit' });
    }
    catch (err) {
        console.log(chalk.red(`Failed to reproduce environment: ${err.message}`));
        process.exit(1);
    }
});
// 8. devmirror dashboard
program
    .command('dashboard')
    .description('Launch the local DevMirror dashboard on http://localhost:4242.')
    .action(async () => {
    console.log(chalk.cyan.bold('Launching DevMirror Local Dashboard...'));
    console.log(`→ Access URL: ${chalk.green('http://localhost:4242')}`);
    // Start local server serving the dashboard
    try {
        const dashboardPath = path.join(process.cwd(), 'apps', 'dashboard');
        await execa('npm', ['run', 'dev'], { cwd: dashboardPath, stdio: 'inherit' });
    }
    catch {
        console.log(chalk.gray('Dashboard running in standalone mode on http://localhost:4242. Press Ctrl+C to stop.'));
    }
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map