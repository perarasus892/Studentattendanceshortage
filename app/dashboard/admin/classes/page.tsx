'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Clock, AlertTriangle } from 'lucide-react';

interface ClassStat {
    className: string;
    totalStudents: number;
    avgAttendance: number;
    status: 'good' | 'warning' | 'critical';
}

export default function AdminClassesPage() {
    const [stats, setStats] = useState<ClassStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mocking class stats for demonstration
        const mockStats: ClassStat[] = [
            { className: 'CS-A', totalStudents: 45, avgAttendance: 82.5, status: 'good' },
            { className: 'CS-B', totalStudents: 42, avgAttendance: 74.2, status: 'warning' },
            { className: 'ME-A', totalStudents: 38, avgAttendance: 68.9, status: 'warning' },
            { className: 'ME-B', totalStudents: 40, avgAttendance: 79.1, status: 'good' },
            { className: 'EE-A', totalStudents: 35, avgAttendance: 62.4, status: 'critical' },
        ];

        setTimeout(() => {
            setStats(mockStats);
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <DashboardLayout requiredRole="admin">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Class Management</h2>
                        <p className="text-muted-foreground">Detailed overview of attendance across all departments</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Add New Class
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Classes</CardTitle>
                            <GraduationCap className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
                            <Users className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">482</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Attendance</CardTitle>
                            <Clock className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">75.4%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Status</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm bg-card">
                    <CardHeader>
                        <CardTitle>Department Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-10 text-muted-foreground italic">Crunching departmental data...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Class Name</TableHead>
                                        <TableHead>Total Students</TableHead>
                                        <TableHead>Avg Attendance</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.map((item) => (
                                        <TableRow key={item.className}>
                                            <TableCell className="font-semibold">{item.className}</TableCell>
                                            <TableCell>{item.totalStudents}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${item.status === 'good' ? 'bg-emerald-500' :
                                                                    item.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${item.avgAttendance}%` }}
                                                        />
                                                    </div>
                                                    <span>{item.avgAttendance}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        item.status === 'good' ? 'success' :
                                                            item.status === 'warning' ? 'warning' : 'destructive'
                                                    }
                                                >
                                                    {item.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <button className="text-blue-600 hover:underline text-sm font-medium">View Details</button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
