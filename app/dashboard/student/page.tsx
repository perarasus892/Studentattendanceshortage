'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AlertTriangle, CheckCircle2, AlertCircle, Info, ArrowRight, User as UserIcon, FileText, History as HistoryIcon } from 'lucide-react';


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
  const [smsSent, setSmsSent] = useState(false);

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

            // BCA PROJECT FEATURE: TRIGGER SMS SIMULATION IF < 75%
            if (data.percentage < 75 && !sessionStorage.getItem('sms_sent_' + currentStudent._id)) {
              const smsRes = await fetch('/api/sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  studentId: currentStudent._id,
                  message: `Alert! Your attendance is ${data.percentage}%, which is below 75%. Please improve.`
                })
              });
              if (smsRes.ok) {
                setSmsSent(true);
                sessionStorage.setItem('sms_sent_' + currentStudent._id, 'true');
              }
            } else if (data.percentage < 75) {
              setSmsSent(true); // Already sent in this session
            }
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
            <div className="md:col-span-8 space-y-6">
              {stats ? (
                <>
                  {/* Shortage Alert Banner */}
                  {(stats.status === 'warning' || stats.status === 'critical') && (
                    <div className={`p-6 rounded-[2.5rem] border-2 animate-in slide-in-from-top-4 duration-500 shadow-2xl relative overflow-hidden ${
                      stats.status === 'critical' ? 'bg-red-50/50 border-red-200 text-red-900' : 'bg-amber-50/50 border-amber-200 text-amber-900'
                    }`}>
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                         <AlertTriangle size={80} />
                      </div>
                      <div className="flex gap-6 items-start relative z-10">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                          stats.status === 'critical' ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-white'
                        }`}>
                          <AlertCircle size={28} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black text-2xl tracking-tight mb-2 font-outfit">
                            {stats.status === 'critical' ? 'CRITICAL: Attendance Shortage' : 'ATTENTION: Low Attendance'}
                          </h3>
                          <p className="font-medium text-sm opacity-90 leading-relaxed mb-6 max-w-xl">
                            You are currently at <span className="font-black bg-white/50 px-2 py-0.5 rounded-lg border border-red-200 mx-1">{stats.percentage}%</span>. 
                            The University requires a minimum of 75% for exam eligibility. {stats.status === 'critical' ? 'Urgent action is required to avoid debarment.' : 'Please improve your presence immediately.'}
                          </p>
                          
                          {smsSent && (
                            <div className="bg-white px-4 py-2 rounded-2xl border border-red-200 shadow-xl shadow-red-500/10 w-fit mb-6 animate-bounce flex items-center gap-2">
                               <span className="text-xl">📩</span>
                               <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em]">Automated Alert Dispatched to Parent</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3">
                             <div className="px-4 py-2 bg-white/80 backdrop-blur rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border border-slate-100">
                               <ArrowRight size={14} className="text-blue-600" />
                               Required: <span className="text-blue-600 text-xs">{Math.max(1, 3 * stats.totalDays - 4 * stats.presentDays)}</span> more presence
                             </div>
                             <button onClick={() => alert("Connecting to Faculty Advisor via secure channel...")} className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                                Contact Advisor
                             </button>
                             <button onClick={() => alert("Downloading encrypted shortage report...")} className="px-5 py-2 bg-white border border-slate-200 text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                                <Info size={12} />
                                Official PDF Log
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 group transition-all hover:shadow-2xl hover:-translate-y-1`}> 
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-center md:text-left">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Academic Engagement</h3>
                        <p className={`text-7xl font-black tracking-tighter font-outfit ${getStatusColor(stats.status)}`}>{stats.percentage}%</p>
                        <div className={`mt-4 px-4 py-1.5 rounded-xl inline-block text-[10px] font-black uppercase tracking-widest ${
                           stats.status === 'good' ? 'bg-emerald-50 text-emerald-600' : 
                           stats.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                        }`}>
                           System Status: {stats.status}
                        </div>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                         <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Classes</p>
                            <p className="text-3xl font-black text-slate-900 font-outfit">{stats.totalDays}</p>
                         </div>
                         <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 text-center">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Present</p>
                            <p className="text-3xl font-black text-emerald-600 font-outfit">{stats.presentDays}</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mt-8">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                       <div>
                         <h3 className="text-xl font-black text-slate-900 tracking-tight font-outfit">Validated Records</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Audit trail for current semester</p>
                       </div>
                       <HistoryIcon className="text-slate-300" size={24} />
                    </div>
                    <div className="p-0">
                       <table className="w-full text-sm">
                         <thead>
                           <tr className="bg-slate-50/80">
                             <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Node</th>
                             <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Marked Status</th>
                             <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified By</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                           {[
                             { date: '2026-03-22', status: 'Present', prof: 'Prof. S. Kavitha' },
                             { date: '2026-03-21', status: 'Present', prof: 'Prof. M. Rajesh' },
                             { date: '2026-03-20', status: 'Absent', prof: 'Prof. K. Uma' },
                             { date: '2026-03-19', status: 'Present', prof: 'Prof. S. Sivaranjani' }
                           ].map((rec, i) => (
                             <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                               <td className="py-5 px-8">
                                 <span className="font-bold text-slate-600">{rec.date}</span>
                               </td>
                               <td className="py-5 px-8">
                                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase w-fit tracking-tighter ${
                                   rec.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                 }`}>
                                   {rec.status}
                                 </div>
                               </td>
                               <td className="py-5 px-8 text-right">
                                 <span className="text-xs font-black text-slate-900 italic">{rec.prof}</span>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                       <div className="p-6 bg-slate-50/30 text-center border-t border-slate-50">
                          <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline">Request Full Ledger Access</button>
                       </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-dashed border-slate-200">
                   <div className="p-4 bg-slate-100 rounded-[2rem] inline-block mb-4">
                      <FileText className="text-slate-400" size={32} />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">Record Silence</h3>
                   <p className="text-slate-500 font-medium max-w-xs mx-auto">Our database is currently awaiting finalized attendance nodes for your ID.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
