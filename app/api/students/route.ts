import { connectDB, Student, User } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find().populate('userId');
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, rollNumber, class: className, phoneNumber, department, email } = await req.json();

    if (!name || !rollNumber || !className || !phoneNumber || !department) {
      return NextResponse.json({ error: 'Missing required registration data' }, { status: 400 });
    }

    // 1. Check uniqueness: Student ID must be unique
    const existingStudent = await Student.findOne({ rollNumber });
    const existingUser = await User.findOne({ studentId: rollNumber });
    
    if (existingStudent || existingUser) {
      return NextResponse.json({ error: 'Identity conflict: Roll Number already exists' }, { status: 400 });
    }

    // 2. Provision User account (Default pass: student123)
    const hashedPassword = await hashPassword('student123');
    const user = new User({
      email: email || `${rollNumber}@dgvc.edu.unlisted`, // Safe fallback for schema unique index
      password: hashedPassword,
      name,
      role: 'student',
      studentId: rollNumber
    });

    const savedUser = await user.save();

    // 3. Create linked Student profile
    const student = new Student({
      name,
      rollNumber,
      class: className,
      department,
      phoneNumber,
      email: email || undefined,
      userId: savedUser._id
    });

    await student.save();

    const populatedStudent = await Student.findById(student._id).populate('userId');
    return NextResponse.json(populatedStudent, { status: 201 });
  } catch (error) {
    console.error('Core Logic - Student Insertion Failed:', error);
    return NextResponse.json({ error: 'System error during student insertion' }, { status: 500 });
  }
}
