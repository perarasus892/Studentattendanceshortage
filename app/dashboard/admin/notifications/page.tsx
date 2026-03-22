'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { Bell, Clock, Info, CheckCircle2, UserPlus, AlertTriangle, ShieldAlert, Cpu, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminNotificationsPage() {
    const logEntries = [
        { icon: ShieldAlert, color: 'red', title: 'System Security Breach Attempt', time: '15 mins ago', desc: 'Multiple failed login attempts detected from IP: 192.168.1.45. Account locked for safety.', level: 'CRITICAL', service: 'Auth Engine' },
        { icon: Cpu, color: 'blue', title: 'Node Sync Complete', time: '45 mins ago', desc: 'All regional attendance nodes successfully synchronized with the central MongoDB Cluster.', level: 'INFO', service: 'Sync Engine' },
        { icon: Database, color: 'purple', title: 'Weekly Backup Successful', time: '3 hours ago', desc: 'Full system backup (1.2 GB) successfully stored on AWS S3 Glacier.', level: 'SUCCESS', service: 'DB Backup' },
        { icon: UserPlus, color: 'indigo', title: 'Audit Log: Staff Modified', time: 'Yesterday', desc: 'Admin User modified permissions for Prof. Ramesh Kumar.', level: 'AUDIT', service: 'Admin Panel' },
        { icon: AlertTriangle, color: 'amber', title: 'Disk Usage Warning', time: 'Yesterday', desc: 'System log partition is 85% full. Please archive old logs.', level: 'WARNING', service: 'System Health' }
    ];

    const getLevelColor = (level: string) => {
        switch(level) {
            case 'CRITICAL': return 'bg-red-600 text-white';
            case 'WARNING': return 'bg-amber-100 text-amber-700';
            case 'SUCCESS': return 'bg-emerald-100 text-emerald-700';
            case 'AUDIT': return 'bg-slate-900 text-white';
            default: return 'bg-blue-100 text-blue-700';
        }
    }

    return (
        <DashboardLayout requiredRole="admin">
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Operational Intelligence</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] bg-slate-100 px-4 py-1.5 rounded-full w-fit mt-4 flex items-center gap-2">
                           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                           Real-time System Audit & Notification Stream
                        </p>
                    </div>
                    <button onClick={() => alert("All logs exported to JSON format.")} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Export Audit</button>
                </div>

                <div className="space-y-6">
                    {logEntries.map((log, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex items-start gap-8 hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden backdrop-blur-3xl">
                            <div className={`h-20 w-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform flex-shrink-0 border border-slate-100 shadow-sm`}>
                                <log.icon size={36} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <h4 className="font-black text-slate-900 text-2xl leading-tight tracking-tight italic">{log.title}</h4>
                                        <Badge className={`${getLevelColor(log.level)} border-none font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg`}>{log.level}</Badge>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{log.time}</span>
                                </div>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed mb-6 max-w-3xl">{log.desc}</p>
                                <div className="flex items-center gap-8 py-4 border-t border-slate-50">
                                   <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service:</span>
                                       <span className="text-xs font-bold text-slate-800 italic underline decoration-blue-500/30 underline-offset-4">{log.service}</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <button onClick={() => alert("Accessing security trace...")} className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1.5 underline underline-offset-4">
                                           Trace Incident →
                                       </button>
                                   </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
