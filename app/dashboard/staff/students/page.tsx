'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { Users, Search, Filter, Mail, Phone, MapPin, MoreVertical, ShieldCheck, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface Student {
    _id: string;
    name: string;
    rollNumber: string;
    class: string;
    email: string;
}

export default function StaffStudentListPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch('/api/students');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    setStudents([]);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return (
        <DashboardLayout requiredRole="staff">
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Roster</h1>
                        <p className="text-slate-500 font-medium">Manage and view all students currently under your supervision</p>
                    </div>
                    <Link href="/dashboard/staff/students/add" className="px-6 py-3 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 text-sm flex items-center gap-2">
                        <Users size={18} />
                        + New Student
                    </Link>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                placeholder="Search by name or roll number..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all">
                                <Filter size={20} />
                            </button>
                            <button className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all">
                                Export Data
                            </button>
                        </div>
                    </div>

                    <div className="p-0">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <p className="font-black text-xs uppercase tracking-widest">Compiling Database...</p>
                            </div>
                        ) : students.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-medium">No student records found in this section</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Student Identity</th>
                                            <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Academic Unit</th>
                                            <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Connectivity</th>
                                            <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                                            <th className="py-5 px-8 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {students.map((student) => (
                                            <tr key={student._id} className="group hover:bg-blue-50/30 transition-all">
                                                <td className="py-5 px-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm shadow-slate-200 group-hover:shadow-blue-200">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-base mb-0.5">{student.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.rollNumber}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                                            <GraduationCap size={14} />
                                                        </div>
                                                        <span className="font-bold text-slate-600">{student.class}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                            <Mail size={12} className="text-slate-400" />
                                                            {student.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-8">
                                                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit">
                                                        <ShieldCheck size={12} />
                                                        Verified
                                                    </span>
                                                </td>
                                                <td className="py-5 px-8 text-right">
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <div className="p-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 bg-slate-50/30">
                        <span>Showing {students.length} students</span>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed transition-all">Prev</button>
                            <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
