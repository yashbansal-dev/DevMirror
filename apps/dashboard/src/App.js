import React, { useState } from 'react';
import { Activity, Terminal, Server, Network, Stethoscope, CheckCircle } from 'lucide-react';
export default function App() {
    const [activeTab, setActiveTab] = useState('overview');
    const mockProject = {
        name: 'demo-fullstack',
        status: 'Running',
        url: 'http://localhost:3000',
        framework: 'Next.js 16',
        language: 'TypeScript',
        packageManager: 'pnpm 10.4.0',
        runtime: 'Node.js 22.14.0',
        services: [
            { name: 'web', type: 'Frontend App', status: 'healthy', port: 3000 },
            { name: 'api', type: 'Express API Server', status: 'healthy', port: 8080 },
            { name: 'postgres', type: 'PostgreSQL 17', status: 'healthy', port: 5432 },
            { name: 'redis', type: 'Redis 7', status: 'healthy', port: 6379 }
        ],
        logs: [
            { time: '19:20:01', source: 'system', text: 'DevMirror execution started' },
            { time: '19:20:02', source: 'analyzer', text: 'Detected stack: Next.js + Express + PostgreSQL + Redis' },
            { time: '19:20:03', source: 'services', text: 'PostgreSQL container initialized on port 5432' },
            { time: '19:20:03', source: 'services', text: 'Redis container initialized on port 6379' },
            { time: '19:20:04', source: 'app', text: 'Next.js server listening on http://localhost:3000' },
            { time: '19:20:05', source: 'health', text: 'HTTP health check passed: 200 OK' }
        ]
    };
    return (<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header style={{
            background: 'rgba(11, 15, 25, 0.9)',
            borderBottom: '1px solid var(--border-color)',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold'
        }}>
            DM
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>DevMirror</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Execution Dashboard v0.1.0</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="status-badge status-green">
            <CheckCircle size={14}/> DevMirror Ready
          </span>
          <a href={mockProject.url} target="_blank" rel="noreferrer" style={{
            background: '#0284c7',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
        }}>
            Open App → {mockProject.url}
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ flex: 1, padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {/* Navigation Tabs */}
        <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <Activity size={16} style={{ display: 'inline', marginRight: '6px' }}/> Overview
          </button>
          <button className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
            <Terminal size={16} style={{ display: 'inline', marginRight: '6px' }}/> Real-time Logs
          </button>
          <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
            <Server size={16} style={{ display: 'inline', marginRight: '6px' }}/> Services
          </button>
          <button className={`tab-btn ${activeTab === 'architecture' ? 'active' : ''}`} onClick={() => setActiveTab('architecture')}>
            <Network size={16} style={{ display: 'inline', marginRight: '6px' }}/> Architecture Graph
          </button>
          <button className={`tab-btn ${activeTab === 'diagnostics' ? 'active' : ''}`} onClick={() => setActiveTab('diagnostics')}>
            <Stethoscope size={16} style={{ display: 'inline', marginRight: '6px' }}/> Diagnostics
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="glass-card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '6px' }}>Project Name</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{mockProject.name}</div>
            </div>
            <div className="glass-card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '6px' }}>Detected Framework</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{mockProject.framework}</div>
            </div>
            <div className="glass-card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '6px' }}>Package Manager</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{mockProject.packageManager}</div>
            </div>
            <div className="glass-card">
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '6px' }}>Runtime Engine</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-green)' }}>{mockProject.runtime}</div>
            </div>
          </div>)}

        {/* Tab 2: Real-time Logs */}
        {activeTab === 'logs' && (<div className="glass-card" style={{ background: '#090d16' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={18} color="var(--accent-cyan)"/> Live Terminal Stream
              </div>
              <span className="status-badge status-green">Streaming</span>
            </div>
            <pre style={{ margin: 0, padding: '16px', background: '#030712', borderRadius: '8px', overflowX: 'auto', fontSize: '0.875rem', lineHeight: '1.6' }}>
              {mockProject.logs.map((log, i) => (<div key={i} style={{ marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>[{log.time}]</span>{' '}
                  <span style={{ color: 'var(--accent-cyan)' }}>[{log.source}]</span>{' '}
                  <span style={{ color: '#e2e8f0' }}>{log.text}</span>
                </div>))}
            </pre>
          </div>)}

        {/* Tab 3: Services */}
        {activeTab === 'services' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mockProject.services.map((s, idx) => (<div key={idx} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Server size={22} color="var(--accent-cyan)"/>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{s.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.type}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>Port: {s.port}</span>
                  <span className="status-badge status-green">🟢 Active</span>
                </div>
              </div>))}
          </div>)}

        {/* Tab 4: Architecture */}
        {activeTab === 'architecture' && (<div className="glass-card">
            <h3 style={{ marginTop: 0, color: 'var(--accent-cyan)' }}>Repository Component Graph</h3>
            <div style={{ padding: '30px', textAlign: 'center', background: '#090d16', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ padding: '16px 24px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontWeight: 600 }}>
                  🌐 Next.js Web Frontend (3000)
                </div>
                <div style={{ color: 'var(--accent-cyan)' }}>➔ HTTP ➔</div>
                <div style={{ padding: '16px 24px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontWeight: 600 }}>
                  ⚡ Express API Gateway (8080)
                </div>
                <div style={{ color: 'var(--accent-cyan)' }}>➔ TCP ➔</div>
                <div style={{ padding: '16px 24px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontWeight: 600 }}>
                  🐘 PostgreSQL (5432)
                </div>
              </div>
            </div>
          </div>)}

        {/* Tab 5: Diagnostics */}
        {activeTab === 'diagnostics' && (<div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-green)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              <CheckCircle size={24}/> Health Status: 100% Operational
            </div>
            <p style={{ color: 'var(--text-muted)' }}>No runtime errors or missing environment variables detected in current execution session.</p>
          </div>)}
      </div>
    </div>);
}
//# sourceMappingURL=App.js.map