'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AlertTriangle, CheckCircle2, AlertCircle, Info, ArrowRight, User as UserIcon } from 'lucide-react';


interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
  status: 'good' | 'warning' | 'critical';
  rollNumber?: string;
  className?: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.id) {
          // First, find the student record for this user
          const studentsRes = await fetch('/api/students');
          const students = await studentsRes.json();
          // Robust check for userId (could be string or object)
          const currentStudent = students.find((s: any) => 
            s.userId === user.id || 
            s.userId?._id === user.id || 
            s.userId?._id?.toString() === user.id
          );

          if (currentStudent) {
            const statsRes = await fetch(`/api/attendance/stats?studentId=${currentStudent._id}`);
            const data = await statsRes.json();
            // Attach student metadata for the UI
            setStats({...data, rollNumber: currentStudent.rollNumber, className: currentStudent.class});
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">View your attendance record and statistics</p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading your statistics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left profile card */}
            <div className="md:col-span-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col items-center">
                  <div className="h-28 w-28 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl mb-4 group-hover:scale-105 transition-transform">
                    <UserIcon size={48} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{stats?.rollNumber || 'Fetching...'}</div>
                    <h3 className="text-xl font-black mt-1 text-slate-900 tracking-tight">{user?.name}</h3>
                  </div>
                </div>

                <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll No</span>
                    <span className="font-bold text-slate-700">{stats?.rollNumber || '---'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</span>
                    <span className="font-bold text-slate-700">{stats?.className || '---'}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HOD / Mentor</span>
                    <div className="text-right">
                      <p className="font-bold text-slate-700 text-xs">Mrs. S. Kavitha</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Mrs. S. Sivaranjani</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right content: stats and summaries */}
            <div className="md:col-span-8 space-y-4">
              {stats ? (
                <>
                  {/* Shortage Alert Banner */}
                  {(stats.status === 'warning' || stats.status === 'critical') && (
                    <div className={`p-5 rounded-3xl border-2 mb-6 animate-in slide-in-from-top-4 duration-500 shadow-lg ${
                      stats.status === 'critical' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <div className="flex gap-4 items-start">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          stats.status === 'critical' ? 'bg-red-200 text-red-700' : 'bg-amber-200 text-amber-700'
                        }`}>
                          <AlertTriangle size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black text-lg tracking-tight mb-1">
                            {stats.status === 'critical' ? 'Attendance Shortage Alert!' : 'Attendance Warning'}
                          </h3>
                          <p className="font-medium text-sm opacity-90 leading-relaxed mb-3">
                            Your current attendance is <span className="font-black underline">{stats.percentage}%</span>. 
                            The minimum requirement is 75%. {stats.status === 'critical' ? 'You are currently in the shortage list.' : 'You are approaching the shortage limit.'}
                          </p>
                          <div className="flex flex-wrap gap-3">
                             <div className="px-3 py-1.5 bg-white/50 rounded-xl text-xs font-bold flex items-center gap-2">
                               <ArrowRight size={14} />
                               Need <span className="underline">{Math.max(1, 3 * stats.totalDays - 4 * stats.presentDays)}</span> more classes for 75%
                             </div>
                             <button onClick={() => alert("Redirecting to support portal...")} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform">
                                Contact Advisor
                             </button>
                             <button onClick={() => alert("Generating Official Shortage PDF Report... Check your downloads folder soon.")} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                                <Info size={12} />
                                Download Official Report
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`bg-white rounded-[2rem] border-2 shadow-sm ${getStatusBgColor(stats.status)} p-8 transition-all hover:shadow-md`}> 
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Percentage</h3>
                        <p className={`text-6xl font-black tracking-tighter ${getStatusColor(stats.status)}`}>{stats.percentage}%</p>
                      </div>
                      <div className="h-20 w-[2px] bg-slate-200 hidden md:block"></div>
                      <div className="flex gap-8">
                        <div className="text-center">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Days</div>
                          <div className="text-3xl font-black text-slate-900 tracking-tighter">{stats.totalDays}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Days Present</div>
                          <div className="text-3xl font-black text-emerald-600 tracking-tighter">{stats.presentDays}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                          <div className={`text-xs font-black uppercase px-3 py-1 rounded-full mt-1 ${
                             stats.status === 'good' ? 'bg-green-100 text-green-700' : 
                             stats.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {stats.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg border p-4">
                      <h4 className="text-sm text-muted-foreground">Present</h4>
                      <div className="text-2xl font-bold mt-2 text-green-700">{stats.presentDays}</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <h4 className="text-sm text-muted-foreground">Absent</h4>
                      <div className="text-2xl font-bold mt-2 text-red-700">{stats.absentDays}</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <h4 className="text-sm text-muted-foreground">Rate</h4>
                      <div className="text-2xl font-bold mt-2">{stats.percentage}%</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="text-lg font-bold mb-3">Attendance Records</h3>
                    <div className="text-sm text-muted-foreground">Showing recent attendance marks</div>
                    <table className="w-full mt-4 table-fixed text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="w-1/4">Date</th>
                          <th className="w-1/4">Status</th>
                          <th className="w-1/2">Marked By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* fetch recent records would go here; placeholder rows */}
                        <tr>
                          <td className="py-2">2026-03-17</td>
                          <td className="py-2">Present</td>
                          <td className="py-2">Prof. X</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-2">2026-03-16</td>
                          <td className="py-2">Absent</td>
                          <td className="py-2">Prof. Y</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">No attendance records found yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
