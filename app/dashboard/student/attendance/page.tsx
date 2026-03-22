'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface AttendanceRecord {
  _id: string;
  date: string;
  status: 'present' | 'absent';
  markedBy: {
    name: string;
  };
}

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        if (user?.id) {
          // First, find the student record for this user
          const studentsRes = await fetch('/api/students');
          const students = await studentsRes.json();
          const currentStudent = students.find((s: any) => 
            s.userId === user.id || 
            s.userId?._id === user.id || 
            s.userId?._id?.toString() === user.id
          );

          if (currentStudent) {
            let url = `/api/attendance?studentId=${currentStudent._id}`;
            if (startDate) url += `&startDate=${startDate}`;
            if (endDate) url += `&endDate=${endDate}`;

            const recordsRes = await fetch(url);
            const data = await recordsRes.json();
            setRecords(data.sort((a: AttendanceRecord, b: AttendanceRecord) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ));
          }
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [user?.id, startDate, endDate]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger refetch by resetting loading state
    setIsLoading(true);
  };

  return (
    <DashboardLayout requiredRole="student">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Attendance</h2>
          <p className="text-muted-foreground">Detailed record of all attendance marks</p>
        </div>

        <form onSubmit={handleFilter} className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition"
              >
                Filter
              </button>
            </div>
          </div>
        </form>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Attendance Records</h3>
          
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : records.length === 0 ? (
            <div className="text-center text-muted-foreground">No attendance records found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Marked By</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : 'bg-red-100 text-red-700 border-red-300'
                          }`}
                        >
                          {record.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{record.markedBy.name}</td>
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
