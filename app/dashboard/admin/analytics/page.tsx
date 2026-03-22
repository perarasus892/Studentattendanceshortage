'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, Award, Medal, Building2, CheckCircle2, Star, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const overallTimeline = [
    { name: 'Mon', attendance: 85, predicted: 82 },
    { name: 'Tue', attendance: 88, predicted: 85 },
    { name: 'Wed', attendance: 92, predicted: 89 },
    { name: 'Thu', attendance: 89, predicted: 88 },
    { name: 'Fri', attendance: 95, predicted: 90 },
];

export default function AdminAnalyticsPage() {
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedClass, setSelectedClass] = useState('All');

    const [mockStudentsWithStats] = useState([
        { _id: '1', name: 'John Doe', rollNumber: 'CS001', class: 'CS-A', stats: { percentage: 70 } },
        { _id: '2', name: 'Jane Smith', rollNumber: 'CS002', class: 'CS-A', stats: { percentage: 85 } },
        { _id: '3', name: 'Bob Wilson', rollNumber: 'ME001', class: 'ME-B', stats: { percentage: 60 } },
        { _id: '4', name: 'Alice Brown', rollNumber: 'ME002', class: 'ME-B', stats: { percentage: 80 } },
        { _id: '5', name: 'Charlie Davis', rollNumber: 'EC001', class: 'EC-A', stats: { percentage: 65 } },
        { _id: '6', name: 'David Evans', rollNumber: 'EC002', class: 'EC-A', stats: { percentage: 92 } },
        { _id: '7', name: 'Eva Foster', rollNumber: 'BT001', class: 'BT-C', stats: { percentage: 75 } },
        { _id: '8', name: 'Frank Green', rollNumber: 'BT002', class: 'BT-C', stats: { percentage: 50 } },
        { _id: '9', name: 'Grace Hill', rollNumber: 'CS003', class: 'CS-B', stats: { percentage: 77.5 } },
        { _id: '10', name: 'Henry Ford', rollNumber: 'ME003', class: 'ME-A', stats: { percentage: 72.5 } },
        { _id: '11', name: 'Irene Adler', rollNumber: 'CS004', class: 'CS-A', stats: { percentage: 75 } },
        { _id: '12', name: 'Jack Sparrow', rollNumber: 'BT003', class: 'BT-C', stats: { percentage: 62.5 } },
    ]);

    const getDeptFromClass = (className: string) => {
        if (className.startsWith('CS')) return 'CS';
        if (className.startsWith('ME')) return 'ME';
        if (className.startsWith('EC')) return 'EC';
        if (className.startsWith('BT')) return 'BT';
        return 'Other';
    };

    // Calculate Dept Averages
    const deptStatsMap = mockStudentsWithStats.reduce((acc, student) => {
        const dept = getDeptFromClass(student.class);
        if (!acc[dept]) acc[dept] = { total: 0, count: 0 };
        acc[dept].total += student.stats.percentage;
        acc[dept].count += 1;
        return acc;
    }, {} as Record<string, { total: number, count: number }>);

    const deptData = Object.entries(deptStatsMap).map(([name, stats]) => ({
        name,
        value: Math.round(stats.total / stats.count)
    })).sort((a, b) => b.value - a.value);

    // Calculate Class Averages
    const classStatsMap = mockStudentsWithStats.reduce((acc, student) => {
        if (!acc[student.class]) acc[student.class] = { total: 0, count: 0, dept: getDeptFromClass(student.class) };
        acc[student.class].total += student.stats.percentage;
        acc[student.class].count += 1;
        return acc;
    }, {} as Record<string, { total: number, count: number, dept: string }>);

    const classData = Object.entries(classStatsMap).map(([name, stats]) => ({
        name,
        dept: stats.dept,
        value: Math.round(stats.total / stats.count)
    })).sort((a, b) => b.value - a.value);

    const bestDept = deptData[0];
    const bestClass = classData[0];

    const filteredTimelineData = useMemo(() => {
        if (selectedClass === 'All' && selectedDept === 'All') return overallTimeline;

        let baseValue = 0;
        if (selectedClass !== 'All') {
            baseValue = classData.find(c => c.name === selectedClass)?.value || 75;
        } else if (selectedDept !== 'All') {
            baseValue = deptData.find(d => d.name === selectedDept)?.value || 75;
        }

        // Mock jitter logic based on baseValue
        const jitters = [-2, 3, -1, 4, 1];
        return overallTimeline.map((item, idx) => ({
            ...item,
            attendance: Math.min(100, Math.max(0, baseValue + jitters[idx]))
        }));
    }, [selectedDept, selectedClass, deptData, classData]);

    const departments = ['All', ...deptData.map(d => d.name)];
    const classesForDept = useMemo(() => {
        if (selectedDept === 'All') return ['All'];
        return ['All', ...classData.filter(c => c.dept === selectedDept).map(c => c.name)];
    }, [selectedDept, classData]);

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                                    <Award size={24} />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight">Best Department</h3>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-black text-white">{bestDept.name}</span>
                                <Badge className="bg-white/20 text-white border-none text-[10px] font-black tracking-widest uppercase px-3 py-1 mb-1">Top Tier</Badge>
                            </div>
                            <p className="text-indigo-100 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                <CheckCircle2 size={12} />
                                {bestDept.value}% Average Attendance
                            </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Building2 size={180} className="text-white" />
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-2xl">
                                    <Medal size={24} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Star Class</h3>
                            </div>
                            <Star className="text-amber-400 fill-amber-400" size={20} />
                        </div>
                        <div className="mt-6 flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900">{bestClass.name}</span>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Dept: {bestClass.dept}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Peak Performance</p>
                            <span className="text-lg font-black text-emerald-600">{bestClass.value}%</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <Calendar className="text-indigo-600" size={24} />
                                Attendance Trends
                            </h3>
                            <div className="flex items-center gap-3">
                                <Select value={selectedDept} onValueChange={(val) => { setSelectedDept(val); setSelectedClass('All'); }}>
                                    <SelectTrigger className="w-[120px] bg-slate-100/50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest h-9">
                                        <SelectValue placeholder="Dept" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(dept => (
                                            <SelectItem key={dept} value={dept} className="text-xs font-bold">{dept === 'All' ? 'All Depts' : dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={selectedClass} onValueChange={setSelectedClass} disabled={selectedDept === 'All'}>
                                    <SelectTrigger className="w-[120px] bg-slate-100/50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest h-9">
                                        <SelectValue placeholder="Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classesForDept.map(cls => (
                                            <SelectItem key={cls} value={cls} className="text-xs font-bold">{cls === 'All' ? 'All Classes' : cls}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="h-[260px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filteredTimelineData}>
                                    <defs>
                                        <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                    />
                                    <Area type="monotone" dataKey="attendance" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorAtt)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl h-[400px]">
                        <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
                            <Building2 className="text-indigo-600" size={24} />
                            Departmental Benchmarks
                        </h3>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deptData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                    />
                                    <Bar dataKey="value" fill="#4f46e5" radius={[12, 12, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-xl text-slate-600">
                                <BarChart3 size={20} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Class-wise Performance Analytics</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Academic Class</th>
                                    <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Department</th>
                                    <th className="text-right py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Attendance Index</th>
                                    <th className="text-right py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Comparative Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {classData.map((cls, idx) => (
                                    <tr key={cls.name} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-5 px-8 font-black text-slate-900">{cls.name}</td>
                                        <td className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest">{cls.dept}</td>
                                        <td className="py-5 px-8 text-right font-black text-slate-900">{cls.value}%</td>
                                        <td className="py-5 px-8 text-right">
                                            <Badge className={`${idx === 0 ? 'bg-emerald-500' : 'bg-slate-200 text-slate-600'} border-none text-[8px] font-black tracking-widest uppercase px-3 shadow-sm`}>
                                                {idx === 0 ? 'Leader' : 'Rank ' + (idx + 1)}
                                            </Badge>
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
