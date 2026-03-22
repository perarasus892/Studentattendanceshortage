
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/attendance';

async function listUsers() {
  await mongoose.connect(MONGODB_URI);
  const User = mongoose.model('User', new mongoose.Schema({
    email: String,
    role: String,
    name: String
  }));

  const users = await User.find({});
  console.log('--- Current Users in DB ---');
  users.forEach(u => console.log(`${u.role}: ${u.email} (${u.name})`));
  console.log('---------------------------');
  await mongoose.disconnect();
}

listUsers();
