'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdCarousel } from '@/components/ad-carousel';
import { Users, GraduationCap, Calendar, CheckSquare, AlertTriangle, UserPlus, BookOpen, Clock, ChevronRight, LayoutGrid, Building2, UserCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useMemo } from 'react';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  class: string;
}

export default function StaffDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [mockStudents] = useState<Student[]>([
    { _id: '1', name: 'John Doe', rollNumber: 'CS001', class: 'CS-A' },
    { _id: '2', name: 'Jane Smith', rollNumber: 'CS002', class: 'CS-A' },
    { _id: '3', name: 'Bob Wilson', rollNumber: 'ME001', class: 'ME-B' },
    { _id: '4', name: 'Alice Brown', rollNumber: 'ME002', class: 'ME-B' },
    { _id: '5', name: 'Charlie Davis', rollNumber: 'CS003', class: 'CS-A' },
    { _id: '6', name: 'David Evans', rollNumber: 'CS004', class: 'CS-A' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (Array.isArray(data)) {
          setStudents(data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const allStudents = useMemo(() => {
    return students.length > 0 ? students : mockStudents;
  }, [students, mockStudents]);

  const getDeptFromClass = (className: string) => {
    if (className.startsWith('CS')) return 'Computer Science';
    if (className.startsWith('ME')) return 'Mechanical Engineering';
    if (className.startsWith('EC')) return 'Electronics & Communication';
    if (className.startsWith('BT')) return 'Biotechnology';
    return 'General Studies';
  };

  const studentsByClass = useMemo(() => {
    return allStudents.reduce((acc, s) => {
      if (!acc[s.class]) acc[s.class] = [];
      acc[s.class].push(s);
      return acc;
    }, {} as Record<string, Student[]>);
  }, [allStudents]);

  return (
    <DashboardLayout requiredRole="staff">
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 italic">Professor's Portal</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Strategic Academic Oversight Content</p>
          </div>
          <div className="flex items-center gap-3 text-sm bg-white/70 backdrop-blur-xl text-indigo-700 px-6 py-3 rounded-2xl border border-indigo-100 shadow-xl font-black italic">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          <AdCarousel />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Assigned Students', value: allStudents.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100/50' },
            { label: 'Active Classes', value: Object.keys(studentsByClass).length, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
            { label: 'Weekly Attendance', value: '88%', icon: CheckSquare, color: 'text-indigo-600', bg: 'bg-indigo-100/50' },
            { label: 'Active Hours', value: '42', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100/50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-xl text-white">
                  <LayoutGrid size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Main Academic Roster</h3>
              </div>
              <Link href="/dashboard/staff/students" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Directory</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(studentsByClass).map(([className, classStudents]) => (
                <div key={className} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border-b-4 border-b-indigo-500">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-indigo-50">
                        <GraduationCap size={32} />
                      </div>
                      <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] px-3 py-1">Active Class</Badge>
                    </div>

                    <div className="space-y-1 mb-6">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{className}</h4>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Building2 size={14} className="text-slate-400" />
                        <p className="text-xs font-black uppercase tracking-widest">{getDeptFromClass(className)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 py-4 border-y border-slate-50 mb-6">
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enrolled</p>
                        <p className="text-lg font-black text-slate-800">{classStudents.length} Students</p>
                      </div>
                      <div className="h-10 w-[1px] bg-slate-100" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                        <p className="text-lg font-black text-emerald-600">85% Avg</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/staff/mark?class=${className}`}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
                      >
                        <CheckSquare size={14} />
                        Mark All
                      </Link>
                      <Link
                        href={`/dashboard/staff/students?class=${className}`}
                        className="aspect-square flex items-center justify-center w-12 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors active:scale-95"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <UserCircle2 size={240} />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-4">Quick Shortcuts</p>
                <h3 className="text-3xl font-black mb-6 tracking-tight italic">Operations</h3>
                <div className="space-y-4">
                  <Link href="/dashboard/staff/mark" className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10 group/item">
                    <div className="flex items-center gap-3">
                      <CheckSquare size={18} className="text-indigo-300" />
                      <span className="font-black text-xs uppercase tracking-widest">Mark Attendance</span>
                    </div>
                    <ChevronRight size={16} className="group-hover/item:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/dashboard/staff/history" className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all border border-white/10 group/item">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-indigo-300" />
                      <span className="font-black text-xs uppercase tracking-widest">View History</span>
                    </div>
                    <ChevronRight size={16} className="group-hover/item:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/dashboard/staff/students/add" className="flex items-center justify-between p-4 bg-indigo-500 rounded-2xl hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-950/20 active:scale-95 group/item">
                    <div className="flex items-center gap-3">
                      <UserPlus size={18} />
                      <span className="font-black text-xs uppercase tracking-widest">New Student</span>
                    </div>
                    <ChevronRight size={16} className="group-hover/item:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white border border-amber-100 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1 w-full bg-amber-400" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                  <AlertTriangle size={20} />
                </div>
                <h4 className="font-black text-amber-950 uppercase tracking-[0.1em] text-[10px]">Shortage alerts</h4>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                  <p className="text-xs font-bold text-amber-900">CS-A Critical</p>
                  <span className="text-xs font-black text-amber-600">2 Students</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                  <p className="text-xs font-bold text-amber-900">ME-B Warning</p>
                  <span className="text-xs font-black text-amber-600">1 Student</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
