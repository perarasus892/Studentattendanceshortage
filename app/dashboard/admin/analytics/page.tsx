'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const data = [
    { name: 'Mon', attendance: 85, predicted: 82 },
    { name: 'Tue', attendance: 88, predicted: 85 },
    { name: 'Wed', attendance: 92, predicted: 89 },
    { name: 'Thu', attendance: 89, predicted: 88 },
    { name: 'Fri', attendance: 95, predicted: 90 },
];

const deptData = [
    { name: 'CS', value: 94 },
    { name: 'ME', value: 82 },
    { name: 'EC', value: 88 },
    { name: 'BT', value: 76 },
];

export default function AdminAnalyticsPage() {
    return (
        <DashboardLayout requiredRole="admin">
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Analytics</h1>
                        <p className="text-slate-500 font-medium">Advanced insights and attendance forecasting</p>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
                        <button className="px-4 py-2 bg-white text-slate-900 rounded-xl text-sm font-black shadow-sm tracking-wide">Weekly</button>
                        <button className="px-4 py-2 text-slate-500 hover:text-slate-700 rounded-xl text-sm font-bold transition-colors">Monthly</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Growth rate</p>
                                <h3 className="text-3xl font-black text-slate-900">+12.5%</h3>
                            </div>
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                            <ArrowUpRight size={14} />
                            <span>Higher than last week</span>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Impact</p>
                                <h3 className="text-3xl font-black text-slate-900">890</h3>
                            </div>
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                                <Users size={20} />
                            </div>
                        </div>
                        <div className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                            Students monitored daily
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
                                <h3 className="text-3xl font-black text-slate-900">96.2%</h3>
                            </div>
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                                <BarChart3 size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-tighter">
                            <ArrowDownRight size={14} />
                            <span>-0.4% from average</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl h-[400px]">
                        <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
                            <Calendar className="text-blue-600" size={24} />
                            Attendance Trends
                        </h3>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                    />
                                    <Area type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAtt)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl h-[400px]">
                        <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Department Performance</h3>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deptData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
