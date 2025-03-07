const express = require('express');
const Teacher = require('../models/Teacher');
const verifyToken = require('../middleware/verifyToken'); 

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

  
    const students = await Student.find({ cours: cours_id });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enrolled students', error: err.message });
  }
});

module.exports = router;