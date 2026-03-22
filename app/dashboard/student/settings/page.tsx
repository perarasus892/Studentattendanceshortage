'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { Settings, Shield, Bell, User } from 'lucide-react';

export default function SettingsPage() {
    return (
        <DashboardLayout requiredRole="student">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h2>
                    <p className="text-slate-500 font-medium">Configure your account preferences and security</p>
                </div>

                <div className="grid gap-6">
                    {[
                        { icon: User, title: 'Profile Information', desc: 'Update your display name and contact details' },
                        { icon: Shield, title: 'Privacy & Security', desc: 'Manage your password and active sessions' },
                        { icon: Bell, title: 'Notifications', desc: 'Choose what alerts you want to receive' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                                Configure
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
