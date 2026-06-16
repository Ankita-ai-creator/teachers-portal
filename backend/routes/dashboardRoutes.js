const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');

// ─── GET /api/dashboard/stats ── aggregate dashboard data
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Run aggregations and queries concurrently
    const [
      totalStudents,
      classesList,
      pendingAssignments,
      subjectAverages,
      recentStudents,
      recentAssignments
    ] = await Promise.all([
      Student.countDocuments(),
      Student.distinct('className'),
      Assignment.countDocuments({ dueDate: { $gte: today } }),
      
      // Average score per subject for Grade Chart
      Grade.aggregate([
        { $group: { _id: '$subject', avgPercentage: { $avg: '$percentage' } } },
        { $project: { subject: '$_id', avgPercentage: { $round: ['$avgPercentage', 2] }, _id: 0 } },
        { $sort: { subject: 1 } }
      ]),

      // Recent 5 students
      Student.find().sort({ createdAt: -1 }).limit(5).select('name createdAt'),
      
      // Recent 5 assignments
      Assignment.find().sort({ createdAt: -1 }).limit(5).select('title createdAt')
    ]);

    // Mocking "Today's Classes" and "Attendance Chart Data" since we don't have historical scheduler tables
    const todaysClasses = Math.max(1, Math.floor(classesList.length * 0.8)); // roughly 80% of classes happen today
    
    const attendanceChartData = [
      { day: 'Mon', attendance: 92 },
      { day: 'Tue', attendance: 95 },
      { day: 'Wed', attendance: 89 },
      { day: 'Thu', attendance: 96 },
      { day: 'Fri', attendance: 90 },
    ];

    // Build Activity Feed by merging recent students and assignments, then sorting
    let activityFeed = [
      ...recentStudents.map(s => ({
        id: `s-${s._id}`,
        message: `New student registered: ${s.name}`,
        timestamp: s.createdAt,
        type: 'student'
      })),
      ...recentAssignments.map(a => ({
        id: `a-${a._id}`,
        message: `Assignment created: ${a.title}`,
        timestamp: a.createdAt,
        type: 'assignment'
      }))
    ];

    // Sort descending by timestamp and take top 5
    activityFeed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    activityFeed = activityFeed.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalClasses: classesList.length,
        pendingAssignments,
        todaysClasses,
        attendanceChartData,
        gradeChartData: subjectAverages,
        activityFeed
      }
    });
  } catch (error) {
    console.error('GET /api/dashboard/stats error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching dashboard stats' });
  }
});

module.exports = router;
