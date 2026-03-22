const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use current DB URI from env or default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance';

async function setupDemo() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define models (simplified for script)
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String, enum: ['admin', 'staff', 'student'], required: true },
      studentId: { type: String }
    }));

    const Student = mongoose.models.Student || mongoose.model('Student', new mongoose.Schema({
      name: { type: String, required: true },
      rollNumber: { type: String, required: true, unique: true },
      class: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }));

    const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', new mongoose.Schema({
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
      date: { type: Date, required: true },
      status: { type: String, enum: ['present', 'absent'], required: true },
      markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }));

    // 1. Create User
    const email = 'shortage@dgvc.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if exists
    let user = await User.findOne({ email });
    if (user) {
      await User.deleteOne({ email });
      console.log('Deleted existing demo user');
    }

    user = new User({
      email,
      password: hashedPassword,
      name: 'Demo Shortage Student',
      role: 'student',
      studentId: 'DEMO001'
    });
    await user.save();
    console.log('User created');

    // 2. Create Student
    let student = await Student.findOne({ rollNumber: 'DEMO001' });
    if (student) {
      await Student.deleteOne({ rollNumber: 'DEMO001' });
      await Attendance.deleteMany({ studentId: student._id });
      console.log('Deleted existing demo student and records');
    }

    student = new Student({
      name: 'Demo Shortage Student',
      rollNumber: 'DEMO001',
      class: 'CS-A',
      email: 'shortage@dgvc.com',
      userId: user._id
    });
    await student.save();
    console.log('Student created');

    // 3. Create Attendance Records (4 present, 6 absent = 40% attendance)
    const records = [];
    const baseDate = new Date();
    
    // 4 Present
    for (let i = 0; i < 4; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i - 1);
      records.push({
        studentId: student._id,
        date: d,
        status: 'present',
        markedBy: user._id // Self-marked for demo or just use any ID
      });
    }

    // 6 Absent
    for (let i = 4; i < 10; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() - i - 1);
        records.push({
          studentId: student._id,
          date: d,
          status: 'absent',
          markedBy: user._id
        });
      }

    await Attendance.insertMany(records);
    console.log('Attendance records inserted (4 Present, 6 Absent)');

    console.log('\n--- DEMO ACCOUNT CREATED ---');
    console.log('Email: shortage@dgvc.com');
    console.log('Password: password123');
    console.log('Expected Attendance: 40%');
    console.log('---------------------------');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setupDemo();
