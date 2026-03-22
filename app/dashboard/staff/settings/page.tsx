'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { Settings, Shield, Bell, User, Mail, Globe, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function StaffSettingsPage() {
    const { user } = useAuth();
    
    const settingsGroups = [
        {
            title: 'Account & Profile',
            items: [
                { icon: User, title: 'Personal Information', desc: 'Update your official name and designation', action: 'Update' },
                { icon: Mail, title: 'Contact Email', desc: 'Manage your primary communication address', action: 'Change' }
            ]
        },
        {
            title: 'Security',
            items: [
                { icon: Lock, title: 'Password Settings', desc: 'Change your login credentials regularly', action: 'Reset' },
                { icon: Shield, title: 'Two-Factor Auth', desc: 'Add an extra layer of protection', action: 'Enable' }
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: Bell, title: 'Notification Channels', desc: 'Choose between Email, SMS or Push', action: 'Manage' },
                { icon: Globe, title: 'Language & Region', desc: 'Set your preferred display language', action: 'Set' }
            ]
        }
    ];

    return (
        <DashboardLayout requiredRole="staff">
            <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Faculty Settings</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Portal Configuration & Security</p>
                    </div>
                    <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Settings size={28} />
                    </div>
                </div>

                <div className="grid gap-10">
                    {settingsGroups.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-4">
                            <h3 className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-4">
                                {group.title}
                                <span className="h-px flex-1 bg-slate-200"></span>
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {group.items.map((item, iIdx) => (
                                    <div key={iIdx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <item.icon size={22} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.title}</h4>
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => alert(`Setting '${item.title}' is currently managed by IT Department.`)}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                                        >
                                            {item.action}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
