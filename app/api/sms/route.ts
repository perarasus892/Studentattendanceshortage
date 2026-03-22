import { connectDB, SmsLog, Student } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * BCA FINAL YEAR PROJECT: SMS Simulation API
 * This API simulates sending an SMS when student attendance drops below 75%.
 * Instead of real SMS, we log it in the database and console.
 */

// GET: Fetch all SMS logs for the Admin Dashboard
export async function GET() {
    try {
        await connectDB();
        // Populate student info (name, roll number) for better display
        const logs = await SmsLog.find().populate('studentId').sort({ sentAt: -1 });
        return NextResponse.json(logs);
    } catch (error) {
        console.error('Error fetching SMS logs:', error);
        return NextResponse.json({ error: 'Failed to fetch SMS logs' }, { status: 500 });
    }
}

// POST: Simulate sending an SMS Alert
export async function POST(req: NextRequest) {
    try {
        const { studentId, message } = await req.json();

        if (!studentId || !message) {
            return NextResponse.json({ error: 'Student ID and message are required' }, { status: 400 });
        }

        await connectDB();

        // 1. Check if the student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // 2. LOG THE SMS in Database (realistic persistence)
        const log = new SmsLog({
            studentId,
            message,
            sentAt: new Date()
        });
        await log.save();

        // 3. CONSOLE LOG (The "Simulation")
        // In a real project, you would call a Twilio/Vonage API here.
        console.log('\n----------------------------------------');
        console.log('📱 SIMULATED SMS ALERT SENT');
        console.log(`TO: ${student.name} (${student.rollNumber})`);
        console.log(`MSG: ${message}`);
        console.log('----------------------------------------\n');

        return NextResponse.json({ 
            success: true, 
            message: 'SMS simulation successful',
            logId: log._id
        });

    } catch (error) {
        console.error('Error in SMS simulation:', error);
        return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
    }
}
