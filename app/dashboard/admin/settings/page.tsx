'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { Settings, Shield, Bell, User, Mail, Database, Lock, Globe, Terminal } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AdminSettingsPage() {
    const { user } = useAuth();
    
    const adminPanelGroups = [
        {
            title: 'System Architecture',
            items: [
                { icon: Database, title: 'Database Configuration', desc: 'Manage your MongoDB Atlas connection and backups', action: 'Config' },
                { icon: Terminal, title: 'System Logs', desc: 'Real-time server activity and diagnostics terminal', action: 'Access' }
            ]
        },
        {
            title: 'Core Security',
            items: [
                { icon: Lock, title: 'Admin Logic Credentials', desc: 'Change your global administrator credentials', action: 'Manage' },
                { icon: Shield, title: 'Role Permissions', desc: 'Define access controls for Staff and Students', action: 'Define' }
            ]
        },
        {
            title: 'Portal Personalization',
            items: [
                { icon: Bell, title: 'Global Notifiers', desc: 'Send emergency alerts to the entire student body', action: 'Broadcast' },
                { icon: Globe, title: 'Domain Management', desc: 'Set up your primary and sub-domains', action: 'Set' }
            ]
        }
    ];

    return (
        <DashboardLayout requiredRole="admin">
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Command Center</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] bg-slate-100 px-4 py-1.5 rounded-full w-fit mt-4">Administrative System Configurations</p>
                    </div>
                </div>

                <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {adminPanelGroups.flatMap(g => g.items).map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group flex flex-col items-center text-center">
                            <div className="h-20 w-20 bg-slate-900 rounded-[28px] flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-2xl shadow-slate-900/40">
                                <item.icon size={36} />
                            </div>
                            <h4 className="font-black text-slate-900 text-xl leading-tight tracking-tight italic mb-3">{item.title}</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-1">{item.desc}</p>
                            <button 
                                onClick={() => alert(`Administrator: You are accessing '${item.title}' settings core.`)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                            >
                                {item.action}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
