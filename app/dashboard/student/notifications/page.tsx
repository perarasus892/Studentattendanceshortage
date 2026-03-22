'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { Bell, Clock, Info, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function NotificationsPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (user?.id) {
                    const studentsRes = await fetch('/api/students');
                    const students = await studentsRes.json();
                    const currentStudent = students.find((s: any) => 
                        s.userId === user.id || s.userId?._id === user.id || s.userId?._id?.toString() === user.id
                    );

                    if (currentStudent) {
                        const statsRes = await fetch(`/api/attendance/stats?studentId=${currentStudent._id}`);
                        const data = await statsRes.json();
                        setStats(data);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [user?.id]);

    const notifications = [
        { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', title: 'Attendance Marked', time: '2 hours ago', desc: 'Prof. S. Kavitha marked you as Present for CS2201 Class.' },
        { icon: Info, color: 'text-blue-600', bgColor: 'bg-blue-50', title: 'Dean\'s List Status', time: 'Yesterday', desc: 'Congratulations! You have been awarded as a Dean\'s List student for the current semester.' },
        { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50', title: 'System Maintenance', time: '2 days ago', desc: 'The portal will be undergoing maintenance on Saturday, 00:00 to 04:00 AM.' }
    ];

    // Inject shortage notification if applicable
    if (stats && (stats.status === 'warning' || stats.status === 'critical')) {
        notifications.unshift({
            icon: ShieldAlert,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            title: 'Attendance Shortage Warning',
            time: 'JUST NOW',
            desc: `URGENT: Your attendance has dropped to ${stats.percentage}%. Please contact your departmental HOD immediately to avoid debarment from exams.`
        });
    }

    return (
        <DashboardLayout requiredRole="student">
            <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Center Communications</h2>
                        <p className="text-slate-500 font-medium">Your recent alerts and system updates</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-slate-400 font-medium">Synchronizing notifications...</div>
                    ) : (
                        notifications.map((notif, idx) => (
                            <div key={idx} className={`bg-white p-6 rounded-[2.5rem] border ${notif.title.includes('Shortage') ? 'border-red-200 shadow-red-100 shadow-lg' : 'border-slate-100 shadow-sm'} flex items-start gap-6 hover:shadow-md transition-shadow group cursor-pointer`}>
                                <div className={`h-16 w-16 ${notif.bgColor} rounded-3xl flex items-center justify-center ${notif.color} shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                                    <notif.icon size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className={`font-black tracking-tight text-lg ${notif.title.includes('Shortage') ? 'text-red-900' : 'text-slate-900'}`}>{notif.title}</h4>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${notif.time === 'JUST NOW' ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>{notif.time}</span>
                                    </div>
                                    <p className={`font-medium leading-relaxed ${notif.title.includes('Shortage') ? 'text-red-700' : 'text-slate-500'}`}>{notif.desc}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
