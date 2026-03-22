'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  class: string;
  department: string;
  phoneNumber: string;
  email?: string;
}

import { GraduationCap, Users, ChevronRight, User, CheckCircle2, AlertCircle, Phone, BookOpen, Fingerprint } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [mockStudents] = useState<Student[]>([
    { _id: '1', name: 'John Doe', rollNumber: 'CS001', class: 'CS-A', department: 'Computer Science', phoneNumber: '9840123456' },
    { _id: '2', name: 'Jane Smith', rollNumber: 'CS002', class: 'CS-A', department: 'Computer Science', phoneNumber: '9840234567' },
    { _id: '3', name: 'Bob Wilson', rollNumber: 'ME001', class: 'ME-B', department: 'Mechanical Engineering', phoneNumber: '9840345678' },
    { _id: '4', name: 'Alice Brown', rollNumber: 'ME002', class: 'ME-B', department: 'Mechanical Engineering', phoneNumber: '9840456789' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const studentsByDept = [...students, ...mockStudents].reduce((acc, student) => {
    const dept = student.department || 'General';
    if (!acc[dept]) acc[dept] = {};
    if (!acc[dept][student.class]) acc[dept][student.class] = [];
    acc[dept][student.class].push(student);
    return acc;
  }, {} as Record<string, Record<string, Student[]>>);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    class: '',
    department: '',
    phoneNumber: '',
    email: '',
  });
  const [error, setError] = useState('');

  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionSuccess, setProvisionSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProvisioning(true);

    try {
      // Small artificial delay for "Wow" factor / Professional synchronization simulation
      await new Promise(r => setTimeout(r, 1500));

      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }

      const newStudent = await res.json();
      setStudents(prev => [...prev, newStudent]);
      setProvisionSuccess(true);
      setFormData({ name: '', rollNumber: '', class: '', department: '', phoneNumber: '', email: '' });
      
      setTimeout(() => {
        setProvisionSuccess(false);
        setShowForm(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student');
    } finally {
      setIsProvisioning(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 font-outfit">Student Registry</h2>
            <p className="text-slate-500 font-medium font-outfit">Manage and provision student identity access</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              showForm ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {showForm ? 'Discard Action' : 'Add New Student'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
               <User size={120} />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                 <Fingerprint size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-outfit">Identity Provisioning</h3>
            </div>
            
            {provisionSuccess ? (
              <div className="py-12 text-center animate-in zoom-in-95 duration-500">
                 <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 size={40} />
                 </div>
                 <h4 className="text-xl font-black text-slate-900 font-outfit">Registration Locked!</h4>
                 <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest font-outfit">Access granted via Roll Number: {formData.rollNumber}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 font-outfit">Full Legal Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Johnathan Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-bold placeholder:text-slate-300 font-outfit"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 font-outfit">Roll Number / ID</label>
                    <input
                      type="text"
                      placeholder="e.g. CS001"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-bold placeholder:text-slate-300 font-outfit"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 font-outfit">Direct Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9840XXXXXX"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-bold placeholder:text-slate-300 font-outfit"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 font-outfit">Academic Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-bold placeholder:text-slate-300 font-outfit"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 font-outfit">Academic Group (Class)</label>
                    <input
                      type="text"
                      placeholder="e.g. CS-A"
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-bold placeholder:text-slate-300 font-outfit"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProvisioning}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-900/40 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 font-outfit"
                >
                  {isProvisioning ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Syncing with Academic Core...
                    </>
                  ) : (
                    'Finalize Identity Injection'
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-outfit tracking-tight">System Student Repository</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Global Database Records</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-[0.2em] font-black py-1.5 px-4 rounded-xl border-slate-200 text-slate-500 bg-white">
                {Object.keys(studentsByDept).length} Active Domains
              </Badge>
            </div>
          </div>

          {isLoading && students.length === 0 ? (
            <div className="text-center py-20">
               <div className="h-12 w-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Accessing Record Vault...</p>
            </div>
          ) : Object.keys(studentsByDept).length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-black uppercase tracking-widest text-[10px]">No students provisioned yet.</div>
          ) : (
            <Tabs defaultValue={Object.keys(studentsByDept)[0]} className="w-full">
              <div className="px-8 bg-slate-50/30 border-b border-slate-50">
                <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start flex-wrap">
                  {Object.keys(studentsByDept).map((dept) => (
                    <TabsTrigger
                      key={dept}
                      value={dept}
                      className="rounded-none border-b-[3px] border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-6 text-[10px] font-black uppercase tracking-[0.15em] shadow-none focus-visible:ring-0 focus:outline-none text-slate-400 data-[state=active]:text-slate-900 transition-all font-outfit"
                    >
                      {dept}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {Object.entries(studentsByDept).map(([dept, classes]) => (
                <TabsContent key={dept} value={dept} className="p-0 m-0 animate-in fade-in duration-500">
                  <Accordion type="single" collapsible className="w-full border-none">
                    {Object.entries(classes).map(([className, classStudents], idx) => (
                      <AccordionItem key={className} value={`class-${idx}`} className="border-b border-slate-50 px-8 hover:bg-slate-50/20 transition-colors">
                        <AccordionTrigger className="hover:no-underline py-7 group border-none">
                          <div className="flex items-center gap-6">
                            <div className="h-14 w-14 rounded-[1.25rem] bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:shadow-blue-500/20">
                              <GraduationCap size={28} />
                            </div>
                            <div className="text-left space-y-1">
                              <p className="text-lg font-black text-slate-900 uppercase tracking-tight font-outfit">{className}</p>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] font-black font-outfit tracking-widest uppercase py-0.5">{classStudents.length} ENROLLED</Badge>
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Active Academic Segment</span>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-10 pt-2">
                          <div className="overflow-x-auto rounded-[2rem] border border-slate-100 bg-white/50 backdrop-blur-sm shadow-xl">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                  <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[9px] font-outfit">Student Identity</th>
                                  <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[9px] font-outfit">Reference ID</th>
                                  <th className="text-left py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[9px] font-outfit">Contact Intel</th>
                                  <th className="text-right py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[9px] font-outfit">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {classStudents.map((student) => (
                                  <tr key={student._id} className="hover:bg-blue-50/10 transition-colors group">
                                    <td className="py-5 px-8">
                                      <div className="flex items-center gap-4">
                                        <div className="h-11 w-11 bg-white border border-slate-100 rounded-[1.1rem] flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-blue-500/10 group-hover:border-blue-500 font-outfit">
                                          {student.name.charAt(0)}
                                        </div>
                                        <span className="font-black text-slate-800 text-sm font-outfit">{student.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-5 px-8">
                                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black font-mono group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        {student.rollNumber}
                                      </span>
                                    </td>
                                    <td className="py-5 px-8">
                                       <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-900 transition-colors">
                                          <Phone size={12} className="text-slate-400" />
                                          <span className="text-xs font-bold font-outfit tracking-tighter">{student.phoneNumber}</span>
                                       </div>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                      <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black tracking-[0.2em] uppercase py-1 px-3 rounded-lg shadow-lg shadow-emerald-500/20 font-outfit">ACTIVE</Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
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
