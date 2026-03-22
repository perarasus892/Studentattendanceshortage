'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdCarousel } from '@/components/ad-carousel';
import { Users, GraduationCap, Calendar, CheckSquare, AlertTriangle, UserPlus, BookOpen, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  class: string;
}

export default function StaffDashboard() {
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
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Staff Overview</h2>
            <p className="text-slate-500 font-medium">Manage your classes and track student attendance</p>
          </div>
          <div className="flex items-center gap-3 text-sm bg-white/50 backdrop-blur-md text-blue-700 px-5 py-2.5 rounded-2xl border border-white shadow-sm font-bold">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          <AdCarousel />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'My Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100/50' },
            { label: 'Total Classes', value: new Set(students.map((s) => s.class)).size, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
            { label: 'Attendance Marked', value: '85%', icon: CheckSquare, color: 'text-amber-600', bg: 'bg-amber-100/50' },
            { label: 'Active Sessions', value: '12', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100/50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Students</h3>
                <Link href="/dashboard/staff/students" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All</Link>
              </div>
              <div className="p-0">
                {isLoading ? (
                  <div className="text-center py-12 text-slate-400 font-medium">Loading student roster...</div>
                ) : students.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-medium">No students assigned yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="text-left py-4 px-6 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Name</th>
                          <th className="text-left py-4 px-6 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Roll Number</th>
                          <th className="text-left py-4 px-6 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Department</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students.slice(0, 5).map((student: Student) => (
                          <tr key={student._id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                  {student.name.charAt(0)}
                                </div>
                                <span className="font-bold text-slate-700">{student.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-slate-500 font-medium">{student.rollNumber}</td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                {student.class}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <GraduationCap size={140} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2 tracking-tight">Class Manager</h3>
                <p className="text-blue-100 mb-8 text-sm leading-relaxed font-medium">Quickly mark attendance or add new students to your roster.</p>
                <div className="space-y-3">
                  <Link href="/dashboard/staff/mark" className="flex items-center justify-center gap-3 w-full py-4 bg-white text-blue-700 rounded-2xl hover:bg-blue-50 transition-all font-black text-sm shadow-xl shadow-blue-900/20 active:scale-95">
                    <CheckSquare size={18} />
                    Mark Attendance
                  </Link>
                  <Link href="/dashboard/staff/students/add" className="flex items-center justify-center gap-3 w-full py-4 bg-blue-500/30 text-white rounded-2xl hover:bg-blue-500/50 transition-all font-black text-sm backdrop-blur-md border border-white/20 active:scale-95">
                    <UserPlus size={18} />
                    Add New Student
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                  <AlertTriangle size={20} />
                </div>
                <h4 className="font-black text-amber-900 uppercase tracking-wider text-xs">Action Required</h4>
              </div>
              <p className="text-sm text-amber-800/80 font-medium leading-relaxed">
                <span className="font-black">3 students</span> have attendance below 75% this week. Please review their status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
