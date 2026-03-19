import { connectDB, User } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, name, role, rollNumber } = await req.json();

    if (role === 'student' && !rollNumber) {
      return NextResponse.json({ error: 'rollNumber required for students' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
      ...(role === 'student' ? { studentId: rollNumber } : {}),
    });

    await user.save();

    if (role === 'student') {
      const { Student } = await import('@/lib/db');
      const student = new Student({
        name,
        rollNumber,
        class: 'Class A',
        email,
        userId: user._id,
      });
      await student.save();
    }

    const token = generateToken(user._id.toString(), email, role);

    return NextResponse.json(
      { user: { id: user._id, email, name, role }, token },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
