import { connectDB, User } from '@/lib/db';
import { comparePasswords, generateToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, studentId } = await req.json();

    if (!password || (!email && !studentId)) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const query = studentId ? { studentId } : { email };
    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken(user._id.toString(), user.email, user.role);

    return NextResponse.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
