'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { Bell, Clock, Info, CheckCircle2, UserPlus, AlertTriangle, MessageSquare, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StaffNotificationsPage() {
    const notifications = [
        { icon: UserPlus, color: 'blue', title: 'New Student Request', time: '10 mins ago', desc: 'A new student, Raj Kumar, has been assigned to your CS-A class list.', category: 'Enrolment' },
        { icon: AlertTriangle, color: 'amber', title: 'Shortage Warning', time: '1 hour ago', desc: 'Three students in ME-B have fallen below the 75% attendance threshold. Please review.', category: 'Attendance' },
        { icon: CheckCircle2, color: 'emerald', title: 'Session Verified', time: '4 hours ago', desc: 'Your today\'s 09:00 AM session attendance has been successfully synced with the server.', category: 'System' },
        { icon: MessageSquare, color: 'indigo', title: 'New Message', time: 'Yesterday', desc: 'HOD S. Kavitha has sent a new circular regarding the upcoming internal examinations.', category: 'Circulars' },
        { icon: ShieldCheck, color: 'purple', title: 'Security Alert', time: '2 days ago', desc: 'Your staff portal account was logged in from a new IP Address in Chennai.', category: 'Security' }
    ];

    return (
        <DashboardLayout requiredRole="staff">
            <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700 pb-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Communications Hub</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Real-time system updates and faculty alerts</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {notifications.map((notif, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-6 hover:shadow-2xl hover:border-indigo-100 transition-all group cursor-pointer relative overflow-hidden">
                            <div className={`p-4 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform`}>
                                <notif.icon size={28} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-black text-slate-900 text-lg leading-tight tracking-tight italic">{notif.title}</h4>
                                        <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest">{notif.category}</Badge>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{notif.time}</span>
                                </div>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">{notif.desc}</p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => alert("Marked as read.")} className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Mark Read</button>
                                    <button className="px-3 py-1 bg-white border border-slate-200 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-indigo-600 transition-all">Report Issue</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
