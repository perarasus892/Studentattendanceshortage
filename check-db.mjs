
import { connectDB, User } from './lib/db.mjs';
import bcrypt from 'bcryptjs';

async function checkUser() {
  await connectDB();
  const user = await User.findOne({ email: 'admin@dgvc.edu' });
  if (user) {
    console.log('User found:', user.email);
    const match = await bcrypt.compare('password123', user.password);
    console.log('Password match:', match);
  } else {
    console.log('User not found');
  }
  process.exit(0);
}

checkUser();
