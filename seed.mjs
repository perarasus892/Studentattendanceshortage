
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
    studentId: { type: String },
  });


  const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });


  const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  });

  const User = mongoose.models.User || mongoose.model('User', userSchema);
  const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
  const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

  // Clear existing
  await User.deleteMany({});
  await Student.deleteMany({});
  await Attendance.deleteMany({});

  const hashedPassword = await bcryptjs.hash('password123', 10);

  // Users
  const admin = await User.create({
    email: 'admin@dgvc.edu',
    password: hashedPassword,
    name: 'Admin Principal',
    role: 'admin'
  });

  const staff = await User.create({
    email: 'staff@dgvc.edu',
    password: hashedPassword,
    name: 'John Professor',
    role: 'staff'
  });

  console.log('Users created: admin@dgvc.edu, staff@dgvc.edu');

  // Students
  const students = [];
  const studentData = [
    { name: 'Arun Kumar', rollNumber: 'CS2201', class: 'CS-A', email: 'arun@student.dgvc.edu' },
    { name: 'Basker S', rollNumber: 'CS2202', class: 'CS-A', email: 'basker@student.dgvc.edu' },
    { name: 'Deepika R', rollNumber: 'CS2203', class: 'CS-A', email: 'deepika@student.dgvc.edu' },
    { name: 'Eshwar M', rollNumber: 'EC2241', class: 'EC-B', email: 'eshwar@student.dgvc.edu' },
  ];

  for (const data of studentData) {
    const student = await Student.create(data);
    const user = await User.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: 'student',
      studentId: student._id.toString()
    });
    student.userId = user._id;
    await student.save();
    students.push(student);
  }

  console.log('Students created (and their login accounts):', students.length);


  // Attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await Attendance.create(students.map(s => ({
    studentId: s._id,
    date: today,
    status: Math.random() > 0.2 ? 'present' : 'absent',
    markedBy: staff._id
  })));

  console.log('Attendance records seeded for today');

  await mongoose.disconnect();
}

seed().catch(console.error);
