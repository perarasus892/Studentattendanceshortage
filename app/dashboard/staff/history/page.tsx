'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { History, Calendar, CheckCircle2, XCircle, Search, Filter, Download, Info } from 'lucide-react';

const historyData = [
    { date: '2026-03-21', time: '09:00 AM', class: 'CS-A', count: 48, status: 'Completed' },
    { date: '2026-03-21', time: '11:00 AM', class: 'CS-B', count: 42, status: 'Completed' },
    { date: '2026-03-20', time: '09:30 AM', class: 'CS-A', count: 45, status: 'Completed' },
    { date: '2026-03-19', time: '02:00 PM', class: 'ME-A', count: 38, status: 'Incomplete' },
    { date: '2026-03-18', time: '10:00 AM', class: 'EC-A', count: 50, status: 'Completed' },
];

export default function StaffHistoryPage() {
    return (
        <DashboardLayout requiredRole="staff">
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Session History</h1>
                        <p className="text-slate-500 font-medium">Audit logs and past attendance records</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2">
                            <Download size={18} />
                            Download Logs
                        </button>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-bold text-slate-600">Last 30 Days</span>
                            </div>
                            <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
                            <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium text-slate-500">Totals: 24 Sessions</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input placeholder="Filter by class..." className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20" />
                            </div>
                            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Session Context</th>
                                    <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Academic Class</th>
                                    <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Turnout</th>
                                    <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Verification</th>
                                    <th className="px-8 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {historyData.map((session, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-rotate-3">
                                                    <History size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{session.time}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="font-black text-slate-600">{session.class}</span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-slate-800">{session.count} Students</span>
                                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(session.count / 60) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            {session.status === 'Completed' ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                                    <CheckCircle2 size={14} />
                                                    Finalized
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                                                    <XCircle size={14} />
                                                    Incomplete
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
