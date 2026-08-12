import { DiagnosisResult, DiagnosisEvidence, ProjectManifest } from '@devmirror/shared';

export interface LogLine {
  source?: string;
  message: string;
}

export class Diagnoser {
  diagnose(logs: LogLine[] | string, manifest?: ProjectManifest): DiagnosisResult {
    const rawText = typeof logs === 'string' ? logs : logs.map(l => l.message).join('\n');
    const lower = rawText.toLowerCase();

    // 1. Missing Environment Variable Error
    if (lower.includes('database_url') && (lower.includes('missing') || lower.includes('undefined') || lower.includes('cannot read property') || lower.includes('prisma'))) {
      return {
        success: false,
        observedFact: 'DATABASE_URL is undefined or empty in environment.',
        likelyCause: 'Prisma/ORM attempted to connect to PostgreSQL but DATABASE_URL environment variable was not set.',
        confidence: 96,
        evidence: [
          {
            logSnippet: this.extractSnippet(rawText, 'DATABASE_URL'),
            context: 'Database client initialization',
            source: 'runtime',
          }
        ],
        suggestedFix: 'Set DATABASE_URL in your .env file e.g., postgresql://postgres:postgres@localhost:5432/devmirror_db',
        proposedFileChanges: [
          {
            filePath: '.env',
            description: 'Define default DATABASE_URL for local development',
            diffOrContent: 'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/devmirror_db\n',
          }
        ]
      };
    }

    if (lower.includes('eaddrinuse') || lower.includes('address already in use')) {
      const match = rawText.match(/listen EADDRINUSE:? address already in use (?:::|127\.0\.0\.1|0\.0\.0\.0):(\d+)/i) || rawText.match(/port (\d+) is already in use/i);
      const portStr = match ? match[1] : '3000';
      return {
        success: false,
        observedFact: `Port ${portStr} is already in use by another process on the system.`,
        likelyCause: `A web server or existing container is bound to port ${portStr}.`,
        confidence: 98,
        evidence: [
          {
            logSnippet: this.extractSnippet(rawText, 'EADDRINUSE'),
            context: 'Network binding step',
            source: 'runtime',
          }
        ],
        suggestedFix: `Kill the process occupying port ${portStr} using 'npx kill-port ${portStr}' or pass '--port ${Number(portStr) + 1}' to devmirror.`,
      };
    }

    if (lower.includes('cannot find module') || lower.includes('module_not_found') || lower.includes('no module named')) {
      const match = rawText.match(/cannot find module ['"]([^'"]+)['"]/i) || rawText.match(/no module named ['"]([^'"]+)['"]/i);
      const missingMod = match ? match[1] : 'required dependency';
      return {
        success: false,
        observedFact: `Module '${missingMod}' was not found in node_modules or Python environment.`,
        likelyCause: `Dependencies were not installed properly or '${missingMod}' is missing from package manifest.`,
        confidence: 94,
        evidence: [
          {
            logSnippet: this.extractSnippet(rawText, missingMod),
            context: 'Module resolution',
            source: 'build',
          }
        ],
        suggestedFix: `Run '${manifest?.packageManager || 'npm'} install ${missingMod}' to install the missing package.`,
      };
    }

    if (lower.includes('connection refused') || lower.includes('econnrefused') || lower.includes('could not connect to server')) {
      return {
        success: false,
        observedFact: 'Database/Redis service connection was refused on target port.',
        likelyCause: 'Required database service (PostgreSQL/Redis) is not running or failed health checks.',
        confidence: 92,
        evidence: [
          {
            logSnippet: this.extractSnippet(rawText, 'ECONNREFUSED'),
            context: 'Service health verification',
            source: 'docker',
          }
        ],
        suggestedFix: 'Ensure Docker daemon is running and execute devmirror run with --sandbox off if needed.',
      };
    }

    // Generic crash diagnosis fallback
    return {
      success: false,
      observedFact: 'Application process terminated unexpectedly during startup phase.',
      likelyCause: 'Uncaught runtime error or missing runtime environment requirement.',
      confidence: 70,
      evidence: [
        {
          logSnippet: rawText.slice(-300),
          context: 'Process termination output',
          source: 'terminal',
        }
      ],
      suggestedFix: 'Review logs above for detailed stack trace or inspect .env configuration.',
    };
  }

  private extractSnippet(text: string, keyword: string): string {
    const lines = text.split('\n');
    const lineIdx = lines.findIndex(l => l.toLowerCase().includes(keyword.toLowerCase()));
    if (lineIdx === -1) return text.slice(0, 200);
    const start = Math.max(0, lineIdx - 1);
    const end = Math.min(lines.length, lineIdx + 3);
    return lines.slice(start, end).join('\n');
  }
}
