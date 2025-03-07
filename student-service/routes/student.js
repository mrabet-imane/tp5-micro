const express = require('express');
const Student = require('../models/Student');
const verifyToken = require('../middleware/verifyToken'); // Middleware pour vérifier le token JWT

const router = express.Router();


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

    res.json(student.cours);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error: err.message });
  }
});

module.exports = router;