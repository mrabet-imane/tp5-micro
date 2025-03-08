const express = require('express');
const Teacher = require('../models/Teacher');
const verifyToken = require('../middleware/verifyToken'); 
const axios = require('axios');


const router = express.Router();

router.get('/all', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teachers', error: err.message });
  }
});

router.post('/add', verifyToken, async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const teacher = new Teacher({ name, bio, cours: [] });
    await teacher.save();
    res.status(201).json({ message: 'Teacher added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding teacher', error: err.message });
  }
});


router.post('/assign/:professeur_id/:cours_id', verifyToken, async (req, res) => {
  try {
    const { professeur_id, cours_id } = req.params;

    const teacher = await Teacher.findById(professeur_id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    console.log(`Fetching course data from: http://localhost:5004/course/${cours_id}`);
    const response = await axios.get(`http://localhost:5004/course/${cours_id}`);

    const course = response.data;

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.assigned) {
      return res.status(400).json({ message: 'Course is already assigned or unavailable' });
    }

    if (teacher.cours.includes(cours_id)) {
      return res.status(400).json({ message: 'Course already assigned to this teacher' });
    }

    teacher.cours.push(cours_id);
    await teacher.save();
    res.json({ message: 'Course assigned to teacher successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning course', error: err.message });
  }
});


router.get('/enrolledStudents/:cours_id', async (req, res) => {
  try {
    const { cours_id } = req.params;

    if (!cours_id) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    const STUDENT_SERVICE_URL = 'http://localhost:5005'; 

    const response = await axios.get(`${STUDENT_SERVICE_URL}/student/students/enrolled/${cours_id}`);
    const students = response.data;

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students enrolled in this course' });
    }

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enrolled students', error: err.message });
  }
});

module.exports = router;