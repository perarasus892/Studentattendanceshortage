
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/attendance';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'student'], required: true },
  });

  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const email = 'admin@example.com';
  const existing = await User.findOne({ email });
  
  if (existing) {
    console.log('Admin user already exists');
  } else {
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    const admin = new User({
      email,
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created: admin@example.com / admin123');
  }

  await mongoose.disconnect();
}

seed().catch(console.error);
