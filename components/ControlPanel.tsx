import React from 'react';
import { Card } from './ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const DATA = Array.from({ length: 50 }).map((_, i) => ({
    time: i,
    metricA: Math.sin(i * 0.2) * 30 + 60 + Math.random() * 10,
    metricB: Math.cos(i * 0.3) * 20 + 40 + Math.random() * 5
}));

export const ControlPanel: React.FC = () => {
  return (
    <div className="h-full w-full p-2 flex flex-col gap-6">
        <h1 className="text-3xl font-light text-white tracking-tight px-2">Telemetry</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            <Card title="Traffic Volume" subtitle="Inbound/Outbound" glow>
                 <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={DATA}>
                         <defs>
                             <linearGradient id="colorMetricA" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                             </linearGradient>
                         </defs>
                         <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                         <XAxis dataKey="time" hide />
                         <YAxis hide domain={[0, 120]} />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #333', borderRadius: '4px' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'Inter' }}
                         />
                         <Area type="monotone" dataKey="metricA" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorMetricA)" />
                     </AreaChart>
                 </ResponsiveContainer>
            </Card>

            <Card title="Server Load" subtitle="CPU/Memory">
                 <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={DATA}>
                         <defs>
                             <linearGradient id="colorMetricB" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#64748B" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#64748B" stopOpacity={0}/>
                             </linearGradient>
                         </defs>
                         <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                         <XAxis dataKey="time" hide />
                         <YAxis hide domain={[0, 120]} />
                         <Area type="monotone" dataKey="metricB" stroke="#64748B" strokeWidth={2} fillOpacity={1} fill="url(#colorMetricB)" />
                     </AreaChart>
                 </ResponsiveContainer>
            </Card>
        </div>
    </div>
  );
};