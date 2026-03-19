'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  class: string;
}

interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
  status: 'good' | 'warning' | 'critical';
}

interface StudentWithStats extends Student {
  stats: AttendanceStats;
}

export default function ReportsPage() {
  const [studentsWithStats, setStudentsWithStats] = useState<StudentWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning' | 'good'>('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const studentsRes = await fetch('/api/students');
        const students = await studentsRes.json();

        const statsPromises = students.map(async (student: Student) => {
          const statsRes = await fetch(`/api/attendance/stats?studentId=${student._id}`);
          const stats = await statsRes.json();
          return { ...student, stats };
        });

        const results = await Promise.all(statsPromises);
        setStudentsWithStats(results);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'good':
        return '✓ Good';
      case 'warning':
        return '⚠ Warning';
      case 'critical':
        return '✕ Critical';
      default:
        return 'Unknown';
    }
  };

  const filteredStudents = studentsWithStats.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.stats.status === filterStatus;
  });

  const criticalCount = studentsWithStats.filter((s) => s.stats.status === 'critical').length;
  const warningCount = studentsWithStats.filter((s) => s.stats.status === 'warning').length;

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Attendance Reports</h2>
          <p className="text-muted-foreground">Overview of student attendance statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-red-600">Critical (Below 65%)</h3>
            <p className="text-2xl font-bold text-red-700 mt-2">{criticalCount}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-yellow-600">Warning (65-75%)</h3>
            <p className="text-2xl font-bold text-yellow-700 mt-2">{warningCount}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-green-600">Good (75%+)</h3>
            <p className="text-2xl font-bold text-green-700 mt-2">
              {studentsWithStats.filter((s) => s.stats.status === 'good').length}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">Student Attendance Report</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value="all">All Students</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
              <option value="good">Good Only</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center text-muted-foreground">No students found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Roll No</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Total Days</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Present</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Absent</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Percentage</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">{student.name}</td>
                      <td className="py-3 px-4 text-foreground">{student.rollNumber}</td>
                      <td className="py-3 px-4 text-foreground">{student.stats.totalDays}</td>
                      <td className="py-3 px-4 text-foreground">{student.stats.presentDays}</td>
                      <td className="py-3 px-4 text-foreground">{student.stats.absentDays}</td>
                      <td className="py-3 px-4 text-foreground">{student.stats.percentage}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.stats.status)}`}>
                          {getStatusLabel(student.stats.status)}
                        </span>
                      </td>
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
