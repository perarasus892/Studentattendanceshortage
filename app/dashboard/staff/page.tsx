'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  class: string;
}

export default function StaffDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchStudents();
  }, []);

  return (
    <DashboardLayout requiredRole="staff">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Staff Dashboard</h2>
          <p className="text-muted-foreground">Mark attendance and view records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
            <p className="text-2xl font-bold text-foreground mt-2">{students.length}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">Classes</h3>
            <p className="text-2xl font-bold text-foreground mt-2">
              {new Set(students.map((s) => s.class)).size}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/dashboard/staff/mark"
              className="p-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition text-center font-medium"
            >
              Mark Today's Attendance
            </a>
            <a
              href="#"
              className="p-4 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition text-center font-medium"
            >
              View Records
            </a>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Students</h3>
          
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : students.length === 0 ? (
            <div className="text-center text-muted-foreground">No students found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Roll Number</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">{student.name}</td>
                      <td className="py-3 px-4 text-foreground">{student.rollNumber}</td>
                      <td className="py-3 px-4 text-foreground">{student.class}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
