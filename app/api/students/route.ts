import { connectDB, Student } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find().populate('userId');
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students, returning mock data:', error);
    // Mock data fallback
    const mockStudents = [
      { _id: '1', name: 'John Doe', rollNumber: 'CS001', class: 'CS-A', email: 'john@example.com' },
      { _id: '2', name: 'Jane Smith', rollNumber: 'CS002', class: 'CS-A', email: 'jane@example.com' },
      { _id: '3', name: 'Bob Wilson', rollNumber: 'ME001', class: 'ME-B', email: 'bob@example.com' },
    ];
    return NextResponse.json(mockStudents);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, rollNumber, class: className, email } = await req.json();

    if (!name || !rollNumber || !className || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return NextResponse.json({ error: 'Student already exists' }, { status: 400 });
    }

    const student = new Student({
      name,
      rollNumber,
      class: className,
      email,
    });

    await student.save();

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
