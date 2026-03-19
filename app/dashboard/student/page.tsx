'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
  status: 'good' | 'warning' | 'critical';
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.id) {
          // First, find the student record for this user
          const studentsRes = await fetch('/api/students');
          const students = await studentsRes.json();
          const currentStudent = students.find((s: any) => s.userId === user.id);

          if (currentStudent) {
            const statsRes = await fetch(`/api/attendance/stats?studentId=${currentStudent._id}`);
            const data = await statsRes.json();
            setStats(data);
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
                  <img src="/placeholder-user.jpg" alt="profile" className="w-28 h-28 rounded-full mb-4" />
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                    <h3 className="text-xl font-bold mt-2">{user?.name}</h3>
                    <div className="text-sm text-muted-foreground">{/* roll/class placeholder */}</div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-4 text-sm">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">Class</span>
                    <span className="font-medium">{/* student class */}</span>
                  </div>
                  <div className="flex items-start justify-between py-2">
                    <span className="text-muted-foreground">Class Teacher</span>
                    <span className="font-medium">Mrs. S. Kavitha</span>
                  </div>
                  <div className="flex items-start justify-between py-2">
                    <span className="text-muted-foreground">Mentor</span>
                    <span className="font-medium">Mrs. S. Sivaranjani</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right content: stats and summaries */}
            <div className="md:col-span-8 space-y-4">
              {stats ? (
                <>
                  <div className={`bg-white rounded-lg border ${getStatusBgColor(stats.status)} p-6`}> 
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Attendance Percentage</h3>
                        <p className={`text-4xl font-bold ${getStatusColor(stats.status)}`}>{stats.percentage}%</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Total Days</div>
                        <div className="text-2xl font-bold">{stats.totalDays}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg border p-4">
                      <h4 className="text-sm text-muted-foreground">Present</h4>
                      <div className="text-2xl font-bold mt-2 text-green-700">{stats.presentDays}</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <h4 className="text-sm text-muted-foreground">Absent</h4>
                      <div className="text-2xl font-bold mt-2 text-red-700">{stats.absentDays}</div>
                    </div>
                    <div className="bg-white rounded-lg border p-4">
                      <h4 className="text-sm text-muted-foreground">Rate</h4>
                      <div className="text-2xl font-bold mt-2">{stats.percentage}%</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="text-lg font-bold mb-3">Attendance Records</h3>
                    <div className="text-sm text-muted-foreground">Showing recent attendance marks</div>
                    <table className="w-full mt-4 table-fixed text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="w-1/4">Date</th>
                          <th className="w-1/4">Status</th>
                          <th className="w-1/2">Marked By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* fetch recent records would go here; placeholder rows */}
                        <tr>
                          <td className="py-2">2026-03-17</td>
                          <td className="py-2">Present</td>
                          <td className="py-2">Prof. X</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="py-2">2026-03-16</td>
                          <td className="py-2">Absent</td>
                          <td className="py-2">Prof. Y</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">No attendance records found yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
