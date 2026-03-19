import { connectDB, Attendance } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    const allAttendance = await Attendance.find({ studentId });

    const totalDays = allAttendance.length;
    const presentDays = allAttendance.filter((a) => a.status === 'present').length;

    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    let status = 'good';
    if (percentage >= 75) {
      status = 'good';
    } else if (percentage >= 65) {
      status = 'warning';
    } else {
      status = 'critical';
    }

    return NextResponse.json({
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      percentage: Math.round(percentage * 100) / 100,
      status,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
