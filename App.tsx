import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, BarChart3, CheckCircle2, ChevronRight, CircleAlert, Clock3, Cloud, Cpu, Database, Download, GitBranch, Globe2, LayoutDashboard, Menu, Orbit, Pause, Play, Plus, RadioTower, RefreshCw, RotateCcw, Search, Settings2, ShieldCheck, Wifi, WifiOff, X } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './index.css';

type Page = 'overview' | 'nodes' | 'pipelines' | 'analytics' | 'settings';
type NodeState = 'online' | 'attention' | 'paused';
type EdgeNode = { id: string; name: string; region: string; status: NodeState; latency: number; load: number };
type Job = { name: string; detail: string; stages: number; running: boolean; last: string };
type Health = { state: 'checking' | 'online' | 'offline'; latency?: number; at?: string };

const ORIGINAL: EdgeNode[] = [
  { id: 'OG-001', name: 'Northstar', region: 'North America · East', status: 'online', latency: 24, load: 42 },
  { id: 'OG-002', name: 'Polaris', region: 'North America · West', status: 'online', latency: 31, load: 68 },
  { id: 'OG-003', name: 'Vega', region: 'Europe · West', status: 'online', latency: 43, load: 36 },
  { id: 'OG-004', name: 'Rigel', region: 'Europe · Central', status: 'online', latency: 51, load: 79 },
  { id: 'OG-005', name: 'Arcturus', region: 'Asia · East', status: 'attention', latency: 118, load: 91 },
  { id: 'OG-006', name: 'Sirius', region: 'Asia · South', status: 'online', latency: 64, load: 57 },
  { id: 'OG-007', name: 'Altair', region: 'Oceania', status: 'online', latency: 87, load: 23 },
  { id: 'OG-008', name: 'Deneb', region: 'South America', status: 'paused', latency: 0, load: 0 }
];
const JOBS: Job[] = [
  { name: 'Signal ingestion', detail: 'Collect and normalize incoming node events', stages: 4, running: false, last: 'Not run this session' },
  { name: 'Edge diagnostics', detail: 'Evaluate health, capacity, and anomalies', stages: 6, running: false, last: 'Not run this session' },
  { name: 'Snapshot delivery', detail: 'Prepare a portable operational snapshot', stages: 3, running: false, last: 'Not run this session' }
];
const NAV = [
  { key: 'overview', name: 'Overview', icon: LayoutDashboard },
  { key: 'nodes', name: 'Node explorer', icon: RadioTower },
  { key: 'pipelines', name: 'Pipelines', icon: GitBranch },
  { key: 'analytics', name: 'Analytics', icon: BarChart3 },
  { key: 'settings', name: 'Settings', icon: Settings2 }
] as const;
const SAMPLE = Array.from({ length: 24 }, (_, index) => ({
  time: String(index).padStart(2, '0') + ':00',
  traffic: Math.round(230 + Math.sin(index / 2.5) * 55 + Math.cos(index / 1.8) * 22 + index * 2),
  compute: Math.round(48 + Math.sin(index / 3) * 14 + Math.cos(index / 2) * 8)
}));
function loadNodes(): EdgeNode[] {
  try {
    const stored = JSON.parse(localStorage.getItem('orbital:nodes:v2') || 'null');
    return Array.isArray(stored) && stored.length > 0 ? stored : ORIGINAL;
  } catch { return ORIGINAL; }
}
function time() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
function Status({ status }: { status: NodeState }) {
  return <span className={'state ' + status}><i/>{status}</span>;
}
function PanelTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="panel-title"><div><small>{eyebrow}</small><h3>{title}</h3></div>{action}</div>;
}
export default function App() {
  const [page, setPage] = useState<Page>('overview');
  const [menu, setMenu] = useState(false);
  const [nodes, setNodes] = useState<EdgeNode[]>(loadNodes);
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [health, setHealth] = useState<Health>({ state: 'checking' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [chosen, setChosen] = useState('OG-001');
  const [autoHealth, setAutoHealth] = useState(true);
  const [compact, setCompact] = useState(false);
  const [events, setEvents] = useState<string[]>(['Demo session initialized']);
  const activity = (message: string) => setEvents(old => [message, ...old].slice(0, 6));
  const checkHealth = useCallback(async () => {
    const started = performance.now();
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch('/api/health', { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('API failure');
      const result = await response.json() as { status: string };
      if (result.status !== 'ok') throw new Error('Unexpected response');
      setHealth({ state: 'online', latency: Math.round(performance.now() - started), at: time() });
    } catch { setHealth({ state: 'offline', at: time() }); }
    finally { window.clearTimeout(timeout); }
  }, []);
  useEffect(() => { void checkHealth(); }, [checkHealth]);
  useEffect(() => {
    if (!autoHealth) return;
    const interval = window.setInterval(() => void checkHealth(), 60000);
    return () => window.clearInterval(interval);
  }, [checkHealth, autoHealth]);
  useEffect(() => { try { localStorage.setItem('orbital:nodes:v2', JSON.stringify(nodes)); } catch { /* storage disabled */ } }, [nodes]);
  const counts = { online: nodes.filter(n => n.status === 'online').length, attention: nodes.filter(n => n.status === 'attention').length };
  const average = (field: 'latency' | 'load') => {
    const active = nodes.filter(n => n.status !== 'paused');
    return Math.round(active.reduce((sum, node) => sum + node[field], 0) / Math.max(1, active.length));
  };
  const visible = useMemo(() => nodes.filter(n => (filter === 'all' || n.status === filter) && (n.name + n.region + n.id).toLowerCase().includes(search.toLowerCase())), [nodes, filter, search]);
  const selected = nodes.find(n => n.id === chosen);
  const switchPage = (next: Page) => { setPage(next); setMenu(false); };
  const toggle = (id: string) => {
    const item = nodes.find(n => n.id === id);
    if (!item) return;
    const paused = item.status !== 'paused';
    setNodes(old => old.map(n => n.id === id ? { ...n, status: paused ? 'paused' : 'online', load: paused ? 0 : 38, latency: paused ? 0 : 45 } : n));
    activity(item.name + (paused ? ' paused' : ' resumed') + ' · demo');
  };
  const addNode = () => {
    const next = Math.max(...nodes.map(n => Number(n.id.slice(3)) || 0), 0) + 1;
    const id = 'OG-' + String(next).padStart(3, '0');
    setNodes(old => [...old, { id, name: 'New node ' + next, region: 'Local simulation', status: 'online', latency: 46, load: 25 }]);
    setChosen(id); setFilter('all'); setSearch(''); activity(id + ' created locally');
  };
  const reset = () => { setNodes(ORIGINAL); setJobs(JOBS); setChosen('OG-001'); setSearch(''); setFilter('all'); activity('Demo data restored'); };
  const runJob = (index: number) => {
    if (jobs[index]?.running) return;
    setJobs(old => old.map((j, i) => i === index ? { ...j, running: true } : j));
    activity(JOBS[index].name + ' launched · demo');
    window.setTimeout(() => {
      setJobs(old => old.map((j, i) => i === index ? { ...j, running: false, last: 'Completed at ' + time() } : j));
      activity(JOBS[index].name + ' completed · demo');
    }, 1600);
  };
  const exportData = () => {
    const file = new Blob([JSON.stringify({ product: 'Orbital Glass', mode: 'demo', exportedAt: new Date().toISOString(), edgeHealth: health, nodes, jobs }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url; link.download = 'orbital-glass-snapshot.json'; document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    activity('JSON snapshot exported');
  };
  const healthText = health.state === 'online' ? 'Edge API connected' : health.state === 'checking' ? 'Checking edge API' : 'Edge API unreachable';
  const headline = { overview: 'Your edge, in focus.', nodes: 'Node explorer', pipelines: 'Pipeline studio', analytics: 'Signal analytics', settings: 'Workspace settings' };
  const subline = { overview: 'A clearer view of your systems, signals, and workflows.', nodes: 'Inspect and manage your simulated fleet.', pipelines: 'Run interactive demo workflows, from start to finish.', analytics: 'Explore representative trends without fabricated live metrics.', settings: 'Shape your local workspace experience.' };
  return <div className={'app-shell' + (compact ? ' compact' : '')}>
    <aside className={'sidebar' + (menu ? ' is-open' : '')}>
      <div className="brand"><div className="brand-icon"><Orbit size={25}/></div><div><strong>orbital<span>.</span>glass</strong><small>MISSION CONTROL / 02</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav aria-label="Primary navigation">{NAV.map(n => { const Icon = n.icon; return <button key={n.key} onClick={() => switchPage(n.key)} className={'nav-button' + (page === n.key ? ' active' : '')} aria-current={page === n.key ? 'page' : undefined}><Icon size={18}/>{n.name}{page === n.key && <ChevronRight size={15} className="nav-arrow"/>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="sandbox"><strong><span className="signal"/> SANDBOX MODE</strong><p>Explore the control room with zero services to configure or pay for.</p><small>LOCAL SIMULATION</small></div><div className="profile"><div>OG</div><span>Orbital workspace<small>Free • Cloudflare native</small></span></div></div>
    </aside>
    {menu && <button className="scrim" aria-label="Close navigation" onClick={() => setMenu(false)}/>}
    <div className="workspace">
      <header className="topbar"><div className="crumbs"><button aria-label="Toggle navigation" className="mobile-menu" onClick={() => setMenu(v => !v)}><Menu size={20}/></button>WORKSPACE <ChevronRight size={13}/> <strong>{page.toUpperCase()}</strong></div><div className="header-right"><div className={'connect-pill ' + health.state}><span className="signal"/>{healthText}</div><button className="button ghost" onClick={exportData}><Download size={15}/> <span className="desktop-only">Export</span></button><div className="initials">OG</div></div></header>
      <main className="main">
        <div className="page-label"><span/> ORBITAL OPERATIONS / CONSOLE</div><div className="hero"><div><h1>{headline[page]}</h1><p>{subline[page]}</p></div><div className="hero-actions"><div className="demo-label"><span className="signal"/> DEMO DATA</div><button className="button primary" onClick={page === 'nodes' ? addNode : page === 'pipelines' ? () => runJob(0) : page === 'settings' ? reset : exportData}>{page === 'nodes' ? <Plus size={16}/> : page === 'pipelines' ? <Play size={16}/> : page === 'settings' ? <RotateCcw size={16}/> : <Download size={16}/>} {page === 'nodes' ? 'Add node' : page === 'pipelines' ? 'Run pipeline' : page === 'settings' ? 'Reset demo' : 'Export snapshot'}</button></div></div>

        {page === 'overview' && <>
          <div className="metrics">
            <div className="metric"><div className="metric-label">ACTIVE NODES <RadioTower size={18}/></div><strong>{counts.online}<small> / {nodes.length}</small></strong><div className="metric-note"><span>● Demo fleet</span><span>Online nodes</span></div></div>
            <div className="metric"><div className="metric-label">AVERAGE LATENCY <Activity size={18}/></div><strong>{average('latency')}<small> ms</small></strong><div className="metric-note"><span>● Simulated</span><span>Active nodes</span></div></div>
            <div className="metric"><div className="metric-label">NODE LOAD <Cpu size={18}/></div><strong>{average('load')}<small> %</small></strong><div className="metric-note"><span>● Sample workload</span><span>Fleet average</span></div></div>
            <div className="metric"><div className="metric-label">ATTENTION <CircleAlert size={18}/></div><strong>{String(counts.attention).padStart(2, '0')}</strong><div className="metric-note"><span>● Needs review</span><span>Flagged nodes</span></div></div>
          </div>
          <div className="overview-grid">
            <section className="panel map-panel"><PanelTitle eyebrow="01 / NETWORK TOPOLOGY" title="Fleet overview" action={<button className="text-action" onClick={() => switchPage('nodes')}>Explore nodes <ArrowRight size={15}/></button>}/><div className="orbit-map" role="img" aria-label="Decorative orbital map representing demo fleet"><div className="orbit-ring ring1"/><div className="orbit-ring ring2"/><div className="orbit-ring ring3"/><div className="orbit-center"><Orbit size={36}/><strong>ORBITAL</strong><small>SIMULATED FLEET</small></div>{nodes.slice(0, 8).map((n, i) => <span key={n.id} className={'orbit-node dot' + i + ' ' + n.status} title={n.name}/>)}</div><div className="legend"><span>● {counts.online} active</span><span>● {counts.attention} attention</span><span>● {nodes.filter(n => n.status === 'paused').length} paused</span></div></section>
            <section className="panel edge-panel"><PanelTitle eyebrow="02 / CONNECTIVITY" title="Cloudflare edge" action={<Cloud size={19}/>}/><div className="edge-summary"><div className={'edge-icon ' + health.state}>{health.state === 'online' ? <Wifi size={27}/> : <WifiOff size={27}/>}</div><div><strong>{healthText}</strong><p>Actual response from this app's Worker health endpoint</p></div></div><div className="health-table"><div><span>API route</span><code>/api/health</code></div><div><span>Response time</span><strong>{health.latency === undefined ? '—' : health.latency + ' ms'}</strong></div><div><span>Last checked</span><strong>{health.at || 'Checking…'}</strong></div></div><button className="button secondary full" onClick={() => void checkHealth()}><RefreshCw size={15}/> Check connection</button><div className="note"><ShieldCheck size={17}/> Only the edge health result is live. All fleet metrics are demo data.</div></section>
          </div>
          <div className="bottom-grid"><section className="panel"><PanelTitle eyebrow="03 / FLEET SNAPSHOT" title="Node status" action={<button className="text-action" onClick={() => switchPage('nodes')}>View all <ArrowRight size={15}/></button>}/><div className="scroll"><table><thead><tr><th>NODE</th><th>REGION</th><th>STATUS</th><th>LOAD</th></tr></thead><tbody>{nodes.slice(0, 5).map(n => <tr key={n.id} onClick={() => { setChosen(n.id); switchPage('nodes'); }}><td><b>{n.name}</b><small>{n.id}</small></td><td>{n.region}</td><td><Status status={n.status}/></td><td>{n.load}%</td></tr>)}</tbody></table></div></section><section className="panel"><PanelTitle eyebrow="04 / THIS SESSION" title="Activity feed" action={<Clock3 size={18}/>}/>{events.map((message, index) => <div className="event" key={message + index}><div><Activity size={15}/></div><span>{message}<small>Local session</small></span></div>)}</section></div>
        </>}

        {page === 'nodes' && <><div className="section-header"><div><small>FLEET MANAGEMENT</small><h2>Your nodes</h2><p>Changes are saved in this browser, not to real servers.</p></div><button className="button secondary" onClick={reset}><RotateCcw size={15}/> Reset fleet</button></div><div className="node-tools"><div className="search"><Search size={17}/><input aria-label="Search nodes" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search nodes, IDs, regions…"/></div><div className="tabs">{['all', 'online', 'attention', 'paused'].map(k => <button key={k} className={filter === k ? 'selected' : ''} onClick={() => setFilter(k)}>{k}</button>)}</div></div><div className="nodes-layout"><div className="node-list">{visible.length ? visible.map(n => <button className={'node-row' + (chosen === n.id ? ' selected' : '')} key={n.id} onClick={() => setChosen(n.id)}><div className="node-icon"><Database size={19}/></div><div className="node-name"><b>{n.name}</b><small>{n.id} · {n.region}</small></div><div className="node-end"><Status status={n.status}/><small>{n.status === 'paused' ? '—' : n.latency + ' ms'} <ChevronRight size={14}/></small></div></button>) : <div className="empty">No matches. Try another filter.</div>}</div><section className="panel detail">{selected ? <><small className="overline">SELECTED / {selected.id}</small><div className="detail-title"><div className="node-icon"><Database size={24}/></div><div><h2>{selected.name}</h2><p>{selected.region}</p></div></div><div className="detail-status"><Status status={selected.status}/><span>Demo node</span></div>{(['load', 'latency'] as const).map(field => <div className="measure" key={field}><small>{field.toUpperCase()}</small><strong>{field === 'latency' && selected.status === 'paused' ? '—' : selected[field] + (field === 'latency' ? ' ms' : '%')}</strong><div className="progress"><span style={{ width: Math.min(100, field === 'latency' ? selected[field] / 1.5 : selected[field]) + '%' }}/></div></div>)}<button className="button primary full" onClick={() => toggle(selected.id)}>{selected.status === 'paused' ? <Play size={15}/> : <Pause size={15}/>} {selected.status === 'paused' ? 'Resume demo node' : 'Pause demo node'}</button><div className="note">This action changes local example data only.</div></> : <div className="empty">Select a node.</div>}</section></div></>}

        {page === 'pipelines' && <><div className="section-header"><div><small>AUTOMATION LAB</small><h2>Workflow library</h2><p>Interactive pipeline demonstrations. All processing stays in your browser.</p></div></div><div className="pipeline-grid">{jobs.map((job, index) => <section className="panel pipeline" key={job.name}><div className="pipeline-head"><div className="node-icon"><GitBranch size={23}/></div><small>0{index + 1} / 03</small></div><h3>{job.name}</h3><p>{job.detail}</p><div className="stages">{Array.from({ length: job.stages }, (_, i) => <React.Fragment key={i}><span>{i + 1}</span>{i < job.stages - 1 && <i/>}</React.Fragment>)}</div><div className="pipeline-foot"><small>{job.running ? 'Running simulation…' : job.last}</small><button className="button secondary" disabled={job.running} onClick={() => runJob(index)}><Play size={14}/> {job.running ? 'Running' : 'Run demo'}</button></div></section>)}</div><div className="panel explanation"><Cloud size={26}/><div><h3>Built to extend on the real edge.</h3><p>The frontend is Cloudflare-native. Real orchestration would require authenticated Worker endpoints and separately configured integrations.</p></div></div></>}

        {page === 'analytics' && <><div className="section-header"><div><small>SIGNAL EXPLORER</small><h2>Performance trends</h2><p>Deterministic sample series, not actual Cloudflare Analytics.</p></div></div><div className="analytics-grid"><section className="panel chart"><PanelTitle eyebrow="SAMPLE DATA / LAST 24 HOURS" title="Traffic profile"/><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={SAMPLE} margin={{ top: 15, right: 5, left: -18, bottom: 0 }}><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#65e9bf" stopOpacity={0.24}/><stop offset="100%" stopColor="#65e9bf" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#284253" strokeDasharray="3 6" vertical={false}/><XAxis dataKey="time" stroke="#7595a6" tickLine={false} axisLine={false} tick={{ fontSize: 11 }}/><YAxis stroke="#7595a6" tickLine={false} axisLine={false} tick={{ fontSize: 11 }}/><Tooltip contentStyle={{ background: '#102634', border: '1px solid #385568', borderRadius: 10, color: '#e9faf6' }}/><Area dataKey="traffic" name="Sample events/min" type="monotone" stroke="#68e9bf" strokeWidth={2.5} fill="url(#areaFill)"/></AreaChart></ResponsiveContainer></div></section><section className="panel insights"><PanelTitle eyebrow="AT A GLANCE" title="Sample signals"/><div><Activity size={20}/><span>PEAK TRAFFIC<strong>{Math.max(...SAMPLE.map(d => d.traffic))} <small>events/min</small></strong></span></div><div><Cpu size={20}/><span>AVERAGE COMPUTE<strong>{Math.round(SAMPLE.reduce((sum, d) => sum + d.compute, 0) / SAMPLE.length)}<small>%</small></strong></span></div><div><Globe2 size={20}/><span>FLEET SIZE<strong>{nodes.length} <small>demo nodes</small></strong></span></div><p className="note">Charts are illustrative, not live infrastructure telemetry.</p></section></div></>}

        {page === 'settings' && <><div className="section-header"><div><small>PERSONALIZATION</small><h2>Console preferences</h2><p>No account or paid service required.</p></div></div><div className="settings-grid"><section className="panel"><h3>Display & connectivity</h3><label className="setting"><div><strong>Compact layout</strong><p>Reduce spacing across cards and sections.</p></div><input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)}/></label><label className="setting"><div><strong>Automatic health checks</strong><p>Check the Worker health route every minute.</p></div><input type="checkbox" checked={autoHealth} onChange={e => setAutoHealth(e.target.checked)}/></label></section><section className="panel"><h3>Workspace controls</h3><p>Export your current local demo or restore the original nodes.</p><button className="button secondary full" onClick={exportData}><Download size={15}/> Export JSON snapshot</button><button className="button secondary full" onClick={reset}><RotateCcw size={15}/> Reset example fleet</button><div className="note"><ShieldCheck size={17}/> API credentials belong in GitHub Actions secrets, never in the browser.</div></section></div></>}
      </main>
      <footer>ORBITAL GLASS / EDGE CONTROL ROOM <span>React · TypeScript · Cloudflare Workers · Free tier</span></footer>
    </div>
  </div>;
}
