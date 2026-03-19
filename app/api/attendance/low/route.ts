import { connectDB, Attendance, Student } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const thresholdParam = searchParams.get('threshold');
    const threshold = thresholdParam ? Number(thresholdParam) : 75;

    // aggregation to compute counts for students who have attendance records
    const agg = await Attendance.aggregate([
      {
        $group: {
          _id: '$studentId',
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
        },
      },
    ]);

    // Convert aggregation to a map for quick lookup
    const statsMap = new Map<string, { total: number; present: number; percentage: number }>();
    for (const item of agg) {
      const total = item.total || 0;
      const present = item.present || 0;
      const percentage = total > 0 ? (present / total) * 100 : 0;
      statsMap.set(String(item._id), { total, present, percentage: Math.round(percentage * 100) / 100 });
    }

    // fetch all students and compute who falls below threshold
    const students = await Student.find().lean();

    const low: Array<any> = [];

    for (const s of students) {
      const id = String(s._id);
      const stat = statsMap.get(id) || { total: 0, present: 0, percentage: 0 };
      if (stat.percentage < threshold) {
        low.push({
          student: {
            id,
            name: s.name,
            rollNumber: s.rollNumber,
            class: s.class,
            email: s.email,
          },
          stats: stat,
        });
      }
    }

    return NextResponse.json({ threshold, count: low.length, students: low });
  } catch (error) {
    console.error('Error fetching low-attendance students:', error);
    return NextResponse.json({ error: 'Failed to fetch low-attendance students' }, { status: 500 });
  }
}
