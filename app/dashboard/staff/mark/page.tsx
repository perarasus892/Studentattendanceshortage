'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  class: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent';
}

export default function MarkAttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        setStudents(data);
        // Initialize all students as present by default
        const initialAttendance: Record<string, 'present' | 'absent'> = {};
        data.forEach((student: Student) => {
          initialAttendance[student._id] = 'present';
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const promises = Object.entries(attendance).map(([studentId, status]) =>
        fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            date: selectedDate,
            status,
            userId: user?.id,
          }),
        })
      );

      await Promise.all(promises);
      setMessage('Attendance marked successfully!');
      
      // Reset after 2 seconds
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Error marking attendance. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStudent = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const absentCount = students.length - presentCount;

  return (
    <DashboardLayout requiredRole="staff">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Mark Attendance</h2>
          <p className="text-muted-foreground">Record attendance for today</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <label className="block text-sm font-medium text-foreground mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-600">Present</h3>
              <p className="text-2xl font-bold text-green-700 mt-2">{presentCount}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-600">Absent</h3>
              <p className="text-2xl font-bold text-red-700 mt-2">{absentCount}</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Students</h3>
            
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading...</div>
            ) : students.length === 0 ? (
              <div className="text-center text-muted-foreground">No students found</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student._id}
                    onClick={() => toggleStudent(student._id)}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      attendance[student._id] === 'present'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                      </div>
                      <span className={`font-bold ${attendance[student._id] === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                        {attendance[student._id] === 'present' ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Saving...' : 'Save Attendance'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
