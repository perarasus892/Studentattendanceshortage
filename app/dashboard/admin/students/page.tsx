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

import { GraduationCap, Users, ChevronRight, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
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
  const [isLoading, setIsLoading] = useState(true);

  const getDeptFromClass = (className: string) => {
    if (className.startsWith('CS')) return 'Computer Science';
    if (className.startsWith('ME')) return 'Mechanical Engineering';
    if (className.startsWith('EC')) return 'Electronics & Communication';
    if (className.startsWith('BT')) return 'Biotechnology';
    return 'Other';
  };

  const studentsByDept = [...students, ...mockStudents].reduce((acc, student) => {
    const dept = getDeptFromClass(student.class);
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
    email: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      const newStudent = await res.json();
      setStudents([...students, newStudent]);
      setFormData({ name: '', rollNumber: '', class: '', email: '' });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student');
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Manage Students</h2>
            <p className="text-muted-foreground">Add and manage student information</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition"
          >
            {showForm ? 'Cancel' : 'Add Student'}
          </button>
        </div>

        {showForm && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Add New Student</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-destructive/10 text-destructive rounded">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Class</label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition"
              >
                Add Student
              </button>
            </form>
          </div>
        )}

        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Student Fleet ({[...students, ...mockStudents].length})</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-black">{Object.keys(studentsByDept).length} Depts</Badge>
            </div>
          </div>

          {isLoading && students.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-medium">Loading dataset...</div>
          ) : Object.keys(studentsByDept).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground font-medium">No students registered yet.</div>
          ) : (
            <Tabs defaultValue={Object.keys(studentsByDept)[0]} className="w-full">
              <div className="px-6 pt-4 border-b border-border bg-muted/20">
                <TabsList className="bg-transparent h-auto p-0 gap-6">
                  {Object.keys(studentsByDept).map((dept) => (
                    <TabsTrigger
                      key={dept}
                      value={dept}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 text-xs font-black uppercase tracking-widest shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                    >
                      {dept}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {Object.entries(studentsByDept).map(([dept, classes]) => (
                <TabsContent key={dept} value={dept} className="p-0 m-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(classes).map(([className, classStudents], idx) => (
                      <AccordionItem key={className} value={`class-${idx}`} className="border-b border-border px-6">
                        <AccordionTrigger className="hover:no-underline py-5 group">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                              <GraduationCap size={20} />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-black text-foreground uppercase tracking-tight">Class: {className}</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{classStudents.length} Students Enrolled</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-8">
                          <div className="overflow-x-auto rounded-2xl border border-border bg-muted/30">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                  <th className="text-left py-4 px-6 font-black text-muted-foreground uppercase tracking-wider text-[10px]">Student Identity</th>
                                  <th className="text-left py-4 px-6 font-black text-muted-foreground uppercase tracking-wider text-[10px]">Reference</th>
                                  <th className="text-left py-4 px-6 font-black text-muted-foreground uppercase tracking-wider text-[10px]">Communication</th>
                                  <th className="text-right py-4 px-6 font-black text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {classStudents.map((student) => (
                                  <tr key={student._id} className="hover:bg-background/80 transition-colors group">
                                    <td className="py-4 px-6">
                                      <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 bg-background border border-border rounded-xl flex items-center justify-center text-xs font-black text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                          {student.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-foreground">{student.name}</span>
                                      </div>
                                    </td>
                                    <td className="py-4 px-6 font-mono text-xs font-bold text-muted-foreground">{student.rollNumber}</td>
                                    <td className="py-4 px-6 text-muted-foreground text-xs">{student.email}</td>
                                    <td className="py-4 px-6 text-right">
                                      <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-black tracking-widest uppercase">Active</Badge>
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
