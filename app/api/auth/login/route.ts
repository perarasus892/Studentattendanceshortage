import { connectDB, User } from '@/lib/db';
import { comparePasswords, generateToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, studentId } = await req.json();

    if (!password || (!email && !studentId)) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // 1. Mock fallback check (Prioritize for demo stability)
    let user = null;
    if (email === 'admin@dgvc.edu' && password === 'password123') {
      user = { _id: 'mock-admin-id', email: 'admin@dgvc.edu', name: 'Admin Principal', role: 'admin' };
    } else if (email === 'staff@dgvc.edu' && password === 'password123') {
      user = { _id: 'mock-staff-id', email: 'staff@dgvc.edu', name: 'John Professor', role: 'staff' };
    }

    // 2. Database check (Only if mock didn't match)
    if (!user) {
      try {
        await connectDB();
        const query = studentId ? { studentId } : { email };
        user = await User.findOne(query);

        if (user && !(await comparePasswords(password, user.password))) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
      } catch (dbError) {
        console.error('Database error during login:', dbError);
        // If DB fails and it's not a mock user, we can't authenticate
        return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userIdString = user._id ? user._id.toString() : 'mock-user-id';
    const token = generateToken(userIdString, user.email, user.role);

    return NextResponse.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
