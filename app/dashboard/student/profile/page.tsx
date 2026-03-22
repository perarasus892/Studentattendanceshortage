'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { User, Mail, ShieldCheck, MapPin, Camera, Star, Clock, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StudentProfilePage() {
    const { user } = useAuth();
    const [studentData, setStudentData] = useState<any>(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (user?.id) {
                try {
                    const res = await fetch('/api/students');
                    const students = await res.json();
                    const record = students.find((s: any) => s.userId === user.id || s.userId?._id === user.id);
                    if (record) {
                        setStudentData(record);
                    }
                } catch (error) {
                    console.error('Error fetching student details:', error);
                }
            }
        };
        fetchStudentData();
    }, [user?.id]);

    return (
        <DashboardLayout requiredRole="student">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Profile Header */}
                <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-10">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="0.1" fill="none" />
                        </svg>
                    </div>
                </div>

                <div className="px-8 -mt-24 relative z-10 flex flex-col md:flex-row items-end gap-6 mb-8">
                    <div className="relative group">
                        <div className="h-32 w-32 bg-white rounded-3xl p-1.5 shadow-2xl overflow-hidden border border-white/40">
                            <div className="h-full w-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden relative">
                                <User size={64} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white">
                            <ShieldCheck size={20} />
                        </div>
                    </div>
                    <div className="pb-2 text-center md:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name || studentData?.name}</h1>
                        <p className="text-slate-500 font-bold flex items-center gap-2 justify-center md:justify-start">
                            <GraduationCap size={16} className="text-blue-600" />
                            Roll Number: {studentData?.rollNumber || 'DGVC-' + (user?.id?.substring(0, 6) || 'N/A')}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-xl">
                            <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Academic Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                                        <p className="font-bold text-slate-700 flex items-center gap-2">
                                            <Mail size={16} className="text-blue-500" />
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Class</p>
                                        <p className="font-bold text-slate-700 font-sans tracking-tight">{studentData?.class || 'Computer Science & Engineering'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Campus Location</p>
                                        <p className="font-bold text-slate-700 flex items-center gap-2">
                                            <MapPin size={16} className="text-red-500" />
                                            Main Campus, Chennai
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Academic Year</p>
                                        <p className="font-bold text-slate-700 font-sans tracking-tight">3rd Year, Semester VI</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-3">
                                <button 
                                    onClick={() => alert("Excellence recognized: You are currently on the Dean's List for Academic Performance!")}
                                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2 hover:bg-blue-100 transition-colors"
                                >
                                    <Star size={12} fill="currentColor" />
                                    Dean's List
                                </button>
                                <button 
                                    onClick={() => alert("Consistency is key: You have maintained a 98% attendance rate this semester.")}
                                    className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2 hover:bg-emerald-100 transition-colors"
                                >
                                    <Clock size={12} fill="currentColor" />
                                    98% Attendance
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-slate-100">
                                <ShieldCheck size={140} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-4 tracking-tight">Access Control</h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Manager your passwords and account security settings.</p>
                                <button 
                                    onClick={() => alert("Password reset link has been sent to your registered email: " + user?.email)}
                                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-95 shadow-lg shadow-white/10"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>

                        <div 
                            onClick={() => alert("Your Academic Performance: Outstanding! Cumulative GPA updated as of last semester.")}
                            className="bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-xl flex items-center justify-between hover:scale-105 transition-transform cursor-pointer group"
                        >
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current CGPA</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">9.24 / 10</p>
                            </div>
                            <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                <Star size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
