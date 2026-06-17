require('dotenv').config();

const mongoose = require('mongoose');
const Student = require('./models/Student');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/teachers_portal';

const firstNames = [
    'Aarav', 'Ananya', 'Arjun', 'Diya', 'Ishaan', 'Kavya', 'Krish', 'Meera',
    'Neha', 'Pranav', 'Riya', 'Rohan', 'Saanvi', 'Siddharth', 'Tanvi', 'Varun',
    'Aditi', 'Aditya', 'Bhavya', 'Chirag', 'Deepika', 'Farhan', 'Gauri', 'Harsh',
    'Isha', 'Jai', 'Karan', 'Lakshmi', 'Manav', 'Nisha', 'Om', 'Pooja', 'Raj',
    'Shreya', 'Tarun', 'Uday', 'Vanya', 'Yash', 'Zara', 'Aisha'
];

const lastNames = [
    'Sharma', 'Verma', 'Singh', 'Gupta', 'Patel', 'Joshi', 'Mehta', 'Nair',
    'Reddy', 'Iyer', 'Pillai', 'Desai', 'Bose', 'Chatterjee', 'Roy', 'Khan',
    'Malhotra', 'Kapoor', 'Chopra', 'Agarwal', 'Mishra', 'Pandey', 'Tiwari',
    'Srivastava', 'Yadav', 'Kumar', 'Das', 'Bhatt', 'Shah', 'Jain'
];

const classNames = [
    '1st', '2nd', '3rd', '4th', '5th', '6th',
    '7th', '8th', '9th', '10th', '11th', '12th'
];

const genders = ['Male', 'Female', 'Other'];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDOB() {
    const year = Math.floor(Math.random() * 10) + 2000;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
}

function generateRollNumber(index) {
    return `STU${String(index + 1).padStart(4, '0')}`;
}

function generatePhone() {
    const prefixes = ['98', '97', '96', '95', '94', '93', '92', '91', '90', '88', '87', '86', '85', '84'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const rest = Math.floor(10000000 + Math.random() * 90000000);
    return `${prefix}${rest}`.slice(0, 10);
}

function generateAttendance() {
    const records = [];
    const today = new Date();
    for (let i = 30; i >= 1; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        records.push({
            date,
            status: Math.random() > 0.15 ? 'present' : 'absent',
        });
    }
    return records;
}

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await Student.deleteMany({});
        console.log('🗑️  Cleared existing students');

        const students = Array.from({ length: 100 }, (_, i) => {
            const firstName = getRandom(firstNames);
            const lastName = getRandom(lastNames);
            const index = i + 1;

            return {
                name: `${firstName} ${lastName}`,
                rollNumber: generateRollNumber(i),
                className: getRandom(classNames),
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@school.edu`,
                parentContact: generatePhone(),
                gender: getRandom(genders),
                dateOfBirth: getRandomDOB(),
                attendanceRecords: generateAttendance(),
            };
        });

        await Student.insertMany(students);
        console.log('🎉 100 students seeded successfully!');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seed();