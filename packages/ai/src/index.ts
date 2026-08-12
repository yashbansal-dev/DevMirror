import { ProjectManifest, ArchitectureExplanation, ArchitectureNode, ArchitectureEdge } from '@devmirror/shared';

export class AIEngine {
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.DEVMIRROR_AI_KEY;
  }

  async explainArchitecture(manifest: ProjectManifest, question?: string): Promise<ArchitectureExplanation> {
    const nodes: ArchitectureNode[] = [
      { id: 'frontend', label: `${manifest.framework || manifest.language} Frontend`, type: 'frontend', details: 'User interface & client routing' },
      { id: 'api', label: `${manifest.language} API Server`, type: 'api', details: 'Business logic & REST/GraphQL API' },
    ];

    const edges: ArchitectureEdge[] = [
      { from: 'frontend', to: 'api', label: 'HTTP / REST' },
    ];

    for (const db of manifest.databases) {
      const nodeType: ArchitectureNode['type'] = db.type === 'redis' ? 'cache' : 'database';
      nodes.push({
        id: db.type,
        label: `${db.type.toUpperCase()} Database`,
        type: nodeType,
        details: `Port ${db.port}`,
      });
      edges.push({
        from: 'api',
        to: db.type,
        label: db.type === 'redis' ? 'Caching / Sessions' : 'Data Storage',
      });
    }

    const details: Record<string, string> = {};

    if (question) {
      const qLower = question.toLowerCase();
      if (qLower.includes('auth')) {
        details['Authentication'] = 'Authentication is handled via standard token/session middleware in the API layer, referencing database models for user accounts.';
      } else if (qLower.includes('payment') || qLower.includes('stripe')) {
        details['Payments'] = 'Payment processing is routed through API payment endpoints interacting with external payment provider webhooks.';
      } else if (qLower.includes('sign') || qLower.includes('register')) {
        details['User Registration'] = 'User signup flow validates incoming credentials, hashes passwords, inserts a record into PostgreSQL, and initializes a session in Redis.';
      } else {
        details['Query Focus'] = `Analysis for query: "${question}". Implementation routes through the ${manifest.language} service layer and persistence storage.`;
      }
    } else {
      details['Overview'] = `This project is a ${manifest.framework || manifest.language} application running on ${manifest.runtime || 'Node.js'}.`;
      details['Data Layer'] = manifest.databases.length > 0
        ? `Uses ${manifest.databases.map((d: any) => d.type).join(', ')} for persistence and caching.`
        : 'No external database specified.';
    }

    return {
      summary: `${manifest.name} Architecture (${manifest.framework || manifest.language})`,
      diagram: { nodes, edges },
      details,
    };
  }
}
