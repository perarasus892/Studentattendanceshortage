'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState, useMemo } from 'react';
import { Users, Search, Filter, Mail, Phone, MapPin, MoreVertical, ShieldCheck, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

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

    const getDeptFromClass = (className: string) => {
        if (className.startsWith('CS')) return 'Computer Science';
        if (className.startsWith('ME')) return 'Mechanical Engineering';
        if (className.startsWith('EC')) return 'Electronics & Communication';
        if (className.startsWith('BT')) return 'Biotechnology';
        return 'General Studies';
    };

    const studentsByDeptAndClass = useMemo(() => {
        return students.reduce((acc, student) => {
            const dept = getDeptFromClass(student.class);
            if (!acc[dept]) acc[dept] = {};
            if (!acc[dept][student.class]) acc[dept][student.class] = [];
            acc[dept][student.class].push(student);
            return acc;
        }, {} as Record<string, Record<string, Student[]>>);
    }, [students]);

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

                    <div className="p-0 bg-white">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <p className="font-black text-xs uppercase tracking-widest">Compiling Database...</p>
                            </div>
                        ) : Object.keys(studentsByDeptAndClass).length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-medium">No student records found in this section</div>
                        ) : (
                            <Tabs defaultValue={Object.keys(studentsByDeptAndClass)[0]} className="w-full">
                                <div className="px-8 pt-4 border-b border-slate-200 bg-slate-100/50">
                                    <TabsList className="bg-transparent h-auto p-0 gap-8">
                                        {Object.keys(studentsByDeptAndClass).map((dept) => (
                                            <TabsTrigger
                                                key={dept}
                                                value={dept}
                                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-4 text-xs font-black uppercase tracking-widest shadow-none transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                                            >
                                                {dept}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>

                                {Object.entries(studentsByDeptAndClass).map(([dept, classes]) => (
                                    <TabsContent key={dept} value={dept} className="p-0 m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <Accordion type="single" collapsible className="w-full">
                                            {Object.entries(classes).map(([className, classStudents], idx) => (
                                                <AccordionItem key={className} value={`class-${idx}`} className="border-b border-slate-100 px-8 py-2">
                                                    <AccordionTrigger className="hover:no-underline py-4 group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-slate-100 shadow-sm">
                                                                <GraduationCap size={24} />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Class: {className}</p>
                                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{classStudents.length} Students Enrolled</p>
                                                            </div>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pb-8">
                                                        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50/50 shadow-sm">
                                                            <table className="w-full text-sm">
                                                                <thead>
                                                                    <tr className="bg-slate-100/80 border-b border-slate-200">
                                                                        <th className="text-left py-4 px-6 font-black text-slate-400 uppercase tracking-wider text-[10px]">Student Identity</th>
                                                                        <th className="text-left py-4 px-6 font-black text-slate-400 uppercase tracking-wider text-[10px]">Reference</th>
                                                                        <th className="text-left py-4 px-6 font-black text-slate-400 uppercase tracking-wider text-[10px]">Communication</th>
                                                                        <th className="text-right py-4 px-6 font-black text-slate-400 uppercase tracking-wider text-[10px]">Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-100 bg-white">
                                                                    {classStudents.map((student) => (
                                                                        <tr key={student._id} className="hover:bg-blue-50/30 transition-colors group">
                                                                            <td className="py-4 px-6">
                                                                                <div className="flex items-center gap-4">
                                                                                    <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-[14px] flex items-center justify-center text-sm font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                                                        {student.name.charAt(0)}
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="font-bold text-slate-900 block">{student.name}</span>
                                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.class}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-4 px-6 font-mono text-xs font-bold text-slate-500">{student.rollNumber}</td>
                                                                            <td className="py-4 px-6 text-slate-500 text-xs font-medium flex items-center gap-2">
                                                                                <Mail size={14} className="text-slate-400" />
                                                                                {student.email || 'N/A'}
                                                                            </td>
                                                                            <td className="py-4 px-6 text-right">
                                                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black tracking-widest uppercase inline-flex items-center gap-1.5 shadow-sm">
                                                                                    <CheckCircle2 size={12} />
                                                                                    Active
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </TabsContent>
                                ))}
                            </Tabs>
                        )}
                    </div>
                    <div className="p-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 bg-slate-50/30">
                        <span>Showing {students.length} Total Students</span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
