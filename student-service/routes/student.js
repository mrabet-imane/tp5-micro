const express = require('express');
const Student = require('../models/Student');
require('dotenv').config();
const axios = require('axios');
const verifyToken = require('../middleware/verifyToken'); 

const router = express.Router();

const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL || 'http://localhost:5004/course';

router.get('/all', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

router.post('/add', verifyToken, async (req, res) => {
  try {
    const { nom, email } = req.body;

    if (!nom || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const student = new Student({ nom, email, cours: [] });
    await student.save();
    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding student', error: err.message });
  }
});


router.post('/enroll/:etudiant_id/:cours_id', verifyToken, async (req, res) => {
  try {
    const { etudiant_id, cours_id } = req.params;

    const student = await Student.findById(etudiant_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

  
    try {
      const courseResponse = await axios.get(`${COURSE_SERVICE_URL}/${cours_id}`);
      console.log('Full URL:', `${COURSE_SERVICE_URL}/${cours_id}`);

      if (!courseResponse.data || Object.keys(courseResponse.data).length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }
    } catch (err) {
      console.error('Error fetching course:', err.response ? err.response.data : err.message);
      return res.status(404).json({ message: 'Course not found' });
    }

    if (student.cours.includes(cours_id)) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    student.cours.push(cours_id);
    await student.save();

    res.json({ message: 'Student enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error enrolling student', error: err.message });
  }
});

router.get('/enrolledCourses/:etudiant_id', async (req, res) => {
  try {
    const { etudiant_id } = req.params;

    const student = await Student.findById(etudiant_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const validCourses = [];

    for (const cours_id of student.cours) {
      try {
        const courseResponse = await axios.get(`${COURSE_SERVICE_URL}/${cours_id}`);
        if (courseResponse.data) {
          validCourses.push(courseResponse.data);
        }
      } catch (err) {
        console.warn(`Course not found or error fetching course: ${cours_id}`);
      }
    }

    const updatedCourseIds = validCourses.map(course => course._id);
    if (student.cours.length !== updatedCourseIds.length) {
      student.cours = updatedCourseIds;
      await student.save();
    }

    res.json(validCourses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error: err.message });
  }
});

router.get('/students/enrolled/:cours_id', async (req, res) => {
  try {
    const { cours_id } = req.params;
    const students = await Student.find({ cours: cours_id });
    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students enrolled in this course' });
    }
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enrolled students', error: err.message });
  }
});

module.exports = router;