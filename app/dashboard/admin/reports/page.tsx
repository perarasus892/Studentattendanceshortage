'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';

import { GraduationCap, Users, ChevronRight, AlertCircle, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';
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

interface StudentWithStats extends Student {
  stats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    percentage: number;
    status: string;
  };
}

export default function ReportsPage() {
  const [studentsWithStats, setStudentsWithStats] = useState<StudentWithStats[]>([]);
  const [mockStudentsWithStats] = useState<StudentWithStats[]>([
    { _id: '1', name: 'John Doe', rollNumber: 'CS001', class: 'CS-A', email: 'john@example.com', stats: { totalDays: 40, presentDays: 28, absentDays: 12, percentage: 70, status: 'warning' } },
    { _id: '2', name: 'Jane Smith', rollNumber: 'CS002', class: 'CS-A', email: 'jane@example.com', stats: { totalDays: 40, presentDays: 34, absentDays: 6, percentage: 85, status: 'good' } },
    { _id: '3', name: 'Bob Wilson', rollNumber: 'ME001', class: 'ME-B', email: 'bob@example.com', stats: { totalDays: 40, presentDays: 24, absentDays: 16, percentage: 60, status: 'critical' } },
    { _id: '4', name: 'Alice Brown', rollNumber: 'ME002', class: 'ME-B', email: 'alice@example.com', stats: { totalDays: 40, presentDays: 32, absentDays: 8, percentage: 80, status: 'good' } },
    { _id: '5', name: 'Charlie Davis', rollNumber: 'EC001', class: 'EC-A', email: 'charlie@example.com', stats: { totalDays: 40, presentDays: 26, absentDays: 14, percentage: 65, status: 'warning' } },
    { _id: '6', name: 'David Evans', rollNumber: 'EC002', class: 'EC-A', email: 'david@example.com', stats: { totalDays: 40, presentDays: 36, absentDays: 4, percentage: 90, status: 'good' } },
    { _id: '7', name: 'Eva Foster', rollNumber: 'BT001', class: 'BT-C', email: 'eva@example.com', stats: { totalDays: 40, presentDays: 30, absentDays: 10, percentage: 75, status: 'good' } },
    { _id: '8', name: 'Frank Green', rollNumber: 'BT002', class: 'BT-C', email: 'frank@example.com', stats: { totalDays: 40, presentDays: 20, absentDays: 20, percentage: 50, status: 'critical' } },
    { _id: '9', name: 'Grace Hill', rollNumber: 'CS003', class: 'CS-B', email: 'grace@example.com', stats: { totalDays: 40, presentDays: 31, absentDays: 9, percentage: 77.5, status: 'good' } },
    { _id: '10', name: 'Henry Ford', rollNumber: 'ME003', class: 'ME-A', email: 'henry@example.com', stats: { totalDays: 40, presentDays: 29, absentDays: 11, percentage: 72.5, status: 'warning' } },
    { _id: '11', name: 'Irene Adler', rollNumber: 'CS004', class: 'CS-A', email: 'irene@example.com', stats: { totalDays: 40, presentDays: 30, absentDays: 10, percentage: 75, status: 'good' } },
    { _id: '12', name: 'Jack Sparrow', rollNumber: 'BT003', class: 'BT-C', email: 'jack@example.com', stats: { totalDays: 40, presentDays: 25, absentDays: 15, percentage: 62.5, status: 'critical' } },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning' | 'good'>('all');

  const getDeptFromClass = (className: string) => {
    if (className.startsWith('CS')) return 'Computer Science';
    if (className.startsWith('ME')) return 'Mechanical Engineering';
    if (className.startsWith('EC')) return 'Electronics & Communication';
    if (className.startsWith('BT')) return 'Biotechnology';
    return 'Other';
  };

  const allStudents = [...studentsWithStats, ...mockStudentsWithStats];

  const studentsByDept = allStudents.reduce((acc, student) => {
    const dept = getDeptFromClass(student.class);
    if (!acc[dept]) acc[dept] = {};
    if (!acc[dept][student.class]) acc[dept][student.class] = { shortage: [], adequate: [] };

    if (student.stats.percentage < 75) {
      acc[dept][student.class].shortage.push(student);
    } else {
      acc[dept][student.class].adequate.push(student);
    }
    return acc;
  }, {} as Record<string, Record<string, { shortage: StudentWithStats[], adequate: StudentWithStats[] }>>);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const studentsRes = await fetch('/api/students');
        const students = await studentsRes.json();

        const statsPromises = students.map(async (student: Student) => {
          const statsRes = await fetch(`/api/attendance/stats?studentId=${student._id}`);
          const stats = await statsRes.json();
          return { ...student, stats };
        });

        const results = await Promise.all(statsPromises);
        setStudentsWithStats(results);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'good':
        return '✓ Good';
      case 'warning':
        return '⚠ Warning';
      case 'critical':
        return '✕ Critical';
      default:
        return 'Unknown';
    }
  };

  const filteredStudents = studentsWithStats.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.stats.status === filterStatus;
  });

  const criticalCount = studentsWithStats.filter((s) => s.stats.status === 'critical').length;
  const warningCount = studentsWithStats.filter((s) => s.stats.status === 'warning').length;

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Attendance Reports</h2>
          <p className="text-muted-foreground">Overview of student attendance statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-xl border border-red-100 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Critical (Below 65%)</p>
                <p className="text-3xl font-black text-slate-900">{allStudents.filter((s) => s.stats.percentage < 65).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-amber-100 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <TrendingDown size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Warning (65-75%)</p>
                <p className="text-3xl font-black text-slate-900">{allStudents.filter((s) => s.stats.percentage >= 65 && s.stats.percentage < 75).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-emerald-100 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Good (75%+)</p>
                <p className="text-3xl font-black text-slate-900">{allStudents.filter((s) => s.stats.percentage >= 75).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Academic Attendance Audit</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-slate-100/50 text-slate-600 border-none text-[10px] uppercase tracking-widest font-black px-3 py-1.5">{allStudents.length} Students tracked</Badge>
            </div>
          </div>

          {isLoading && studentsWithStats.length === 0 ? (
            <div className="text-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Compiling Attendance Data...</p>
            </div>
          ) : (
            <Tabs defaultValue={Object.keys(studentsByDept)[0]} className="w-full">
              <div className="px-6 pt-4 border-b border-slate-100 bg-slate-50/50">
                <TabsList className="bg-transparent h-auto p-0 gap-8">
                  {Object.keys(studentsByDept).map((dept) => (
                    <TabsTrigger
                      key={dept}
                      value={dept}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-0 py-4 text-xs font-black uppercase tracking-widest shadow-none transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                    >
                      {dept}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {Object.entries(studentsByDept).map(([dept, classes]) => (
                <TabsContent key={dept} value={dept} className="p-0 m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(classes).map(([className, classData], idx) => (
                      <AccordionItem key={className} value={`class-${idx}`} className="border-b border-slate-100 px-6 last:border-none">
                        <AccordionTrigger className="hover:no-underline py-6 group">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                              <GraduationCap size={24} />
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <p className="text-base font-black text-slate-900 uppercase tracking-tight">CLASS: {className}</p>
                                {classData.shortage.length > 0 && (
                                  <Badge className="bg-red-500 text-white border-none text-[8px] font-black tracking-widest uppercase px-2 shadow-sm animate-pulse">Action Required</Badge>
                                )}
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{classData.shortage.length + classData.adequate.length} Total Students Audit</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-8 space-y-6">
                          {/* Shortage Section */}
                          {classData.shortage.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-red-600 px-2">
                                <AlertCircle size={16} />
                                <h4 className="text-xs font-black uppercase tracking-widest">Attendance Shortage (Below 75%)</h4>
                              </div>
                              <div className="overflow-x-auto rounded-3xl border border-red-100 bg-red-50/30">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-red-100">
                                      <th className="text-left py-4 px-6 font-black text-red-400 uppercase tracking-wider text-[10px]">Student Identity</th>
                                      <th className="text-left py-4 px-6 font-black text-red-400 uppercase tracking-wider text-[10px]">Reference</th>
                                      <th className="text-left py-4 px-6 font-black text-red-400 uppercase tracking-wider text-[10px]">Stats (P/T)</th>
                                      <th className="text-right py-4 px-6 font-black text-red-400 uppercase tracking-wider text-[10px]">Percentage</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-red-50">
                                    {classData.shortage.map((student) => (
                                      <tr key={student._id} className="hover:bg-white/50 transition-colors group">
                                        <td className="py-4 px-6">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-white border border-red-200 rounded-xl flex items-center justify-center text-[10px] font-black text-red-600">
                                              {student.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-900">{student.name}</span>
                                          </div>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-[10px] font-bold text-slate-500">{student.rollNumber}</td>
                                        <td className="py-4 px-6 text-slate-500 text-xs font-bold">{student.stats.presentDays}/{student.stats.totalDays}</td>
                                        <td className="py-4 px-6 text-right">
                                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 rounded-xl font-black text-[10px] tracking-widest border border-red-200 shadow-sm">
                                            <TrendingDown size={10} />
                                            {student.stats.percentage}%
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Adequate Section */}
                          {classData.adequate.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-emerald-600 px-2">
                                <CheckCircle2 size={16} />
                                <h4 className="text-xs font-black uppercase tracking-widest">Adequate Attendance (75%+)</h4>
                              </div>
                              <div className="overflow-x-auto rounded-3xl border border-emerald-100 bg-emerald-50/30">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-emerald-100">
                                      <th className="text-left py-4 px-6 font-black text-emerald-400 uppercase tracking-wider text-[10px]">Student Identity</th>
                                      <th className="text-left py-4 px-6 font-black text-emerald-400 uppercase tracking-wider text-[10px]">Reference</th>
                                      <th className="text-left py-4 px-6 font-black text-emerald-400 uppercase tracking-wider text-[10px]">Stats (P/T)</th>
                                      <th className="text-right py-4 px-6 font-black text-emerald-400 uppercase tracking-wider text-[10px]">Percentage</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-emerald-50">
                                    {classData.adequate.map((student) => (
                                      <tr key={student._id} className="hover:bg-white/50 transition-colors group">
                                        <td className="py-4 px-6">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-white border border-emerald-200 rounded-xl flex items-center justify-center text-[10px] font-black text-emerald-600">
                                              {student.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-900">{student.name}</span>
                                          </div>
                                        </td>
                                        <td className="py-4 px-6 font-mono text-[10px] font-bold text-slate-500">{student.rollNumber}</td>
                                        <td className="py-4 px-6 text-slate-500 text-xs font-bold">{student.stats.presentDays}/{student.stats.totalDays}</td>
                                        <td className="py-4 px-6 text-right">
                                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-600 rounded-xl font-black text-[10px] tracking-widest border border-emerald-200 shadow-sm">
                                            <TrendingUp size={10} />
                                            {student.stats.percentage}%
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
