'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  class: string;
  email: string;
}

import { Users, GraduationCap, BarChart3, ShieldCheck, Mail, UserCheck, BookOpen, UserCog, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock staff data grouped by department
  const staffMembers = [
    { name: 'Dr. Ramesh Kumar', dept: 'Computer Science', active: true, email: 'ramesh@dgvc.edu' },
    { name: 'Dr. Priya S', dept: 'Computer Science', active: true, email: 'priya@dgvc.edu' },
    { name: 'Prof. Sneha Gupta', dept: 'Mechanical Eng.', active: true, email: 'sneha@dgvc.edu' },
    { name: 'Prof. Vikram R', dept: 'Mechanical Eng.', active: true, email: 'vikram@dgvc.edu' },
    { name: 'Dr. Amit Varma', dept: 'Electronics', active: false, email: 'amit@dgvc.edu' },
    { name: 'Dr. Kavitha M', dept: 'Electronics', active: true, email: 'kavitha@dgvc.edu' },
    { name: 'Prof. Rajesh K', dept: 'Biotechnology', active: true, email: 'rajesh@dgvc.edu' },
    { name: 'Dr. Meera N', dept: 'Biotechnology', active: true, email: 'meera@dgvc.edu' },
    { name: 'Dr. Suresh B', dept: 'Computer Science', active: true, email: 'suresh@dgvc.edu' },
    { name: 'Prof. Anitha J', dept: 'Mechanical Eng.', active: false, email: 'anitha@dgvc.edu' },
  ];

  const facultyByDept = staffMembers.reduce((acc, staff) => {
    if (!acc[staff.dept]) acc[staff.dept] = [];
    acc[staff.dept].push(staff);
    return acc;
  }, {} as Record<string, typeof staffMembers>);

  const getDeptFromClass = (className: string) => {
    if (className.startsWith('CS')) return 'Computer Science';
    if (className.startsWith('ME')) return 'Mechanical Engineering';
    if (className.startsWith('EC')) return 'Electronics & Communication';
    if (className.startsWith('BT')) return 'Biotechnology';
    return 'Other';
  };

  const [mockStudents] = useState<Student[]>([
    { _id: '1', name: 'John Doe', rollNumber: 'CS001', class: 'CS-A', email: 'john@example.com' },
    { _id: '2', name: 'Jane Smith', rollNumber: 'CS002', class: 'CS-A', email: 'jane@example.com' },
    { _id: '3', name: 'Bob Wilson', rollNumber: 'ME001', class: 'ME-B', email: 'bob@example.com' },
    { _id: '4', name: 'Alice Brown', rollNumber: 'ME002', class: 'ME-B', email: 'alice@example.com' },
    { _id: '5', name: 'Charlie Davis', rollNumber: 'EC001', class: 'EC-A', email: 'charlie@example.com' },
    { _id: '6', name: 'David Evans', rollNumber: 'EC002', class: 'EC-A', email: 'david@example.com' },
    { _id: '7', name: 'Eva Foster', rollNumber: 'BT001', class: 'BT-C', email: 'eva@example.com' },
    { _id: '8', name: 'Frank Green', rollNumber: 'BT002', class: 'BT-C', email: 'frank@example.com' },
    { _id: '9', name: 'Grace Hill', rollNumber: 'CS003', class: 'CS-B', email: 'grace@example.com' },
    { _id: '10', name: 'Henry Ford', rollNumber: 'ME003', class: 'ME-A', email: 'henry@example.com' },
  ]);

  const studentsByDept = [...students, ...mockStudents].reduce((acc, student) => {
    const dept = getDeptFromClass(student.class);
    if (!acc[dept]) acc[dept] = {};
    if (!acc[dept][student.class]) acc[dept][student.class] = [];
    acc[dept][student.class].push(student);
    return acc;
  }, {} as Record<string, Record<string, Student[]>>);

  useEffect(() => {
    setMounted(true);
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
    <DashboardLayout requiredRole="admin">
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Administrative Central</h2>
            <p className="text-slate-500 font-medium">Global management of students, staff, and academic resources</p>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
            <button className="px-4 py-2 bg-white text-slate-900 rounded-xl text-sm font-black shadow-sm tracking-wide">Overview</button>
            <button className="px-4 py-2 text-slate-500 hover:text-slate-700 rounded-xl text-sm font-bold transition-colors">Audit Logs</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Students', value: [...students, ...mockStudents].length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100/50' },
            { label: 'Academic Classes', value: new Set([...students, ...mockStudents].map((s) => s.class)).size, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
            { label: 'Faculty Members', value: staffMembers.length, icon: UserCog, color: 'text-amber-600', bg: 'bg-amber-100/50' },
            { label: 'System Uptime', value: '99.9%', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100/50' },
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                    <UserCheck size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Enrollments</h3>
                </div>
                <Link href="/dashboard/admin/students" className="text-sm font-black text-blue-600 hover:text-blue-700 underline underline-offset-4 tracking-wide">VIEW ALL</Link>
              </div>
              <div className="p-0">
                {isLoading ? (
                  <div className="text-center py-12 text-slate-400 font-medium">Fetching dataset...</div>
                ) : Object.keys(studentsByDept).length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-medium">No records found</div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(studentsByDept).map(([dept, classes], idx) => (
                      <AccordionItem key={dept} value={`dept-${idx}`} className="border-b border-slate-100 px-6">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                              <GraduationCap size={16} />
                            </div>
                            <span className="font-bold text-slate-900">{dept}</span>
                            <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600 border-none text-[10px]">
                              {Object.values(classes).flat().length} Students
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6">
                          <div className="space-y-6 pt-2">
                            {Object.entries(classes).map(([className, classStudents]) => (
                              <div key={className} className="space-y-3">
                                <div className="flex items-center gap-2 px-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Class: {className}</span>
                                </div>
                                <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/30">
                                  <table className="w-full text-sm font-sans">
                                    <thead>
                                      <tr className="bg-slate-50/50">
                                        <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase tracking-wider text-[9px]">Student Info</th>
                                        <th className="text-left py-3 px-4 font-bold text-slate-400 uppercase tracking-wider text-[9px]">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {classStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-white transition-colors group">
                                          <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                              <div className="h-8 w-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {student.name.charAt(0)}
                                              </div>
                                              <div>
                                                <p className="font-bold text-slate-800 text-xs">{student.name}</p>
                                                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">{student.rollNumber}</p>
                                              </div>
                                            </div>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-wider">Active</span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Academic Distribution</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['CS-A', 'CS-B', 'ME-A', 'EC-A'].map((className, i) => {
                  const randomVal = mounted ? Math.floor(Math.random() * 40 + 60) : 75;
                  return (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider">
                        <span>{className}</span>
                        <span>{randomVal}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${randomVal}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Faculty Directory</h3>
                <Badge variant="outline" className="border-slate-200 text-slate-500 font-bold text-[10px]">{staffMembers.length} Total</Badge>
              </div>
              <Tabs defaultValue={Object.keys(facultyByDept)[0]} className="w-full">
                <div className="px-6 pt-4">
                  <TabsList className="bg-slate-100/50 p-1 h-auto flex-wrap">
                    {Object.keys(facultyByDept).map((dept) => (
                      <TabsTrigger key={dept} value={dept} className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        {dept.split(' ')[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                {Object.entries(facultyByDept).map(([dept, members]) => (
                  <TabsContent key={dept} value={dept} className="p-4 space-y-3 mt-0">
                    <p className="px-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <span className="h-px flex-1 bg-slate-100"></span>
                      {dept}
                      <span className="h-px flex-1 bg-slate-100"></span>
                    </p>
                    {members.map((staff, i) => (
                      <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <UserCog size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{staff.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{staff.dept}</p>
                            </div>
                          </div>
                          <div className={`h-2 w-2 rounded-full mt-1 ${staff.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                            <Mail size={12} />
                            {staff.email}
                          </div>
                          <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1">
                            Profile <ChevronRight size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
              <div className="p-6 bg-slate-50/30 text-center border-t border-slate-100">
                <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Manage All Faculty</button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={140} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-1 tracking-tight">Security Center</h3>
                <p className="text-indigo-200 mb-6 text-sm font-medium">Verify system logs and manage access permissions.</p>
                <button className="flex items-center justify-center gap-3 w-full py-4 bg-white text-indigo-900 rounded-2xl hover:bg-slate-100 transition-all font-black text-sm shadow-xl active:scale-95">
                  Access Controls
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
