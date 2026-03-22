'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState, useMemo } from 'react';
import { CheckSquare, Users, Calendar, ArrowLeft, CheckCircle2, AlertCircle, Clock, Search, MapPin, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  class: string;
}

export default function MarkAttendancePage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (Array.isArray(data)) {
          setStudents(data);
          const initialMarked: Record<string, boolean> = {};
          data.forEach(s => initialMarked[s._id] = true); // Default all to present
          setMarked(initialMarked);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const toggleStatus = (id: string) => {
    setMarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

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
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-2 text-sm font-bold">
              <ArrowLeft size={16} />
              Return to Dashboard
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Active Session</h1>
            <p className="text-slate-500 font-medium">Class Attendance marking system for current period</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Elapsed</p>
              <p className="text-xl font-black text-blue-600 tracking-tighter">14:52</p>
            </div>
            <div className="hidden lg:block p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin className="text-red-500" size={20} />
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geo-Location</p>
                  <p className="text-xs font-bold text-slate-700">Lecture Hall C4</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {success ? (
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-16 rounded-[40px] shadow-2xl flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-emerald-100 rounded-[32px] flex items-center justify-center mb-8 rotate-12 transition-transform">
              <CheckCircle2 size={48} className="text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Finalized!</h2>
            <p className="text-slate-500 font-medium mb-8 max-w-sm">The attendance data for this session has been encrypted and synced with the central blockchain. Great job!</p>
            <button onClick={() => router.push('/dashboard/staff')} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm tracking-wider hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
              RETURN TO OVERVIEW
            </button>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/30">
              <div className="flex-1 w-full max-w-lg">
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <input placeholder="Search for a student name..." className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-bold placeholder:text-slate-300" />
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-3xl">
                  <Users className="text-slate-400" size={18} />
                  <span className="font-black text-slate-700">{students.length} Total</span>
                </div>
                <button onClick={handleSubmit} disabled={isSubmitting || students.length === 0} className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.05] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckSquare size={18} />}
                  {isSubmitting ? 'Syncing...' : 'Finalize Session'}
                </button>
              </div>
            </div>

            <div className="p-0">
              {isLoading && students.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-medium">Loading session data...</div>
              ) : Object.keys(studentsByDeptAndClass).length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-medium">No students registered for this session.</div>
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
                      {Object.entries(classes).map(([className, classStudents]) => (
                        <div key={className} className="border-b border-slate-100 last:border-0">
                          <div className="p-8 bg-white flex items-center gap-4 border-b border-slate-50">
                            <div className="h-10 w-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                              <GraduationCap size={20} />
                            </div>
                            <div>
                              <h3 className="text-lg font-black text-slate-900 tracking-tight">Class: {className}</h3>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{classStudents.length} Students marking attendance</p>
                            </div>
                          </div>
                          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50/30">
                            {classStudents.map((student) => (
                              <div
                                key={student._id}
                                onClick={() => toggleStatus(student._id)}
                                className={`relative p-6 rounded-[32px] border-2 transition-all cursor-pointer group select-none ${marked[student._id]
                                  ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                                  : 'bg-white border-slate-200 hover:border-red-200 hover:bg-red-50/30 shadow-sm'
                                  }`}
                              >
                                <div className="flex items-center gap-4 mb-4">
                                  <div className={`h-12 w-12 rounded-[20px] flex items-center justify-center text-lg font-black transition-all ${marked[student._id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {student.name.charAt(0)}
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <p className={`font-bold tracking-tight truncate leading-tight mb-1 ${marked[student._id] ? 'text-blue-900' : 'text-slate-600'}`}>
                                      {student.name}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{student.rollNumber}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 shadow-sm rounded-full">
                                    <div className={`h-2 w-2 rounded-full ${marked[student._id] ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-tight ${marked[student._id] ? 'text-emerald-700' : 'text-slate-400'}`}>
                                      {marked[student._id] ? 'Present' : 'Absent'}
                                    </span>
                                  </div>
                                  <div className={`h-8 w-8 border-2 rounded-xl flex items-center justify-center transition-all ${marked[student._id] ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-300'
                                    }`}>
                                    {marked[student._id] ? <CheckCircle2 size={16} /> : <div className="h-4 w-4 rounded-lg bg-slate-200" />}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
