'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddStudentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        class: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Mock API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => router.push('/dashboard/staff/students'), 2000);
        }, 1500);
    };

    return (
        <DashboardLayout requiredRole="staff">
            <div className="max-w-3xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-2 text-sm font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to List
                        </button>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add New Student</h1>
                        <p className="text-slate-500">Register a new student into the college database</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden p-8">
                    {success ? (
                        <div className="py-12 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                            <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
                            <p className="text-slate-500 mb-8">Student has been added to the database. Redirecting...</p>
                            <div className="h-1.5 w-48 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 animate-[progress_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in slide-in-from-top-4">
                                    <AlertCircle className="h-5 w-5" />
                                    {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter full name"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Roll Number</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.rollNumber}
                                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                        placeholder="e.g. CS202601"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="student@college.edu"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none text-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Class / Department</label>
                                <select
                                    required
                                    value={formData.class}
                                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none text-slate-900"
                                >
                                    <option value="">Select a class</option>
                                    <option value="CS-A">CS-A (Computer Science)</option>
                                    <option value="CS-B">CS-B (Computer Science)</option>
                                    <option value="ME-A">ME-A (Mechanical)</option>
                                    <option value="EC-A">EC-A (Electronics)</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-5 w-5" />
                                            Create Student Account
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
