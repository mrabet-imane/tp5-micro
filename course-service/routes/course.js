const express = require('express');
const Course = require('../models/Course');
const verifyToken = require('../middleware/verifyToken'); 

const router = express.Router();



router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

  
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course', error: err.message });
  }
});


router.post('/add', verifyToken, async (req, res) => {
  try {
    const { titre, professeur_id, description, prix } = req.body;

    if (!titre || !professeur_id || !description || !prix) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const course = new Course({ titre, professeur_id, description, prix });
    await course.save();
    res.status(201).json({ message: 'Course added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding course', error: err.message });
  }
});

router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    Object.assign(course, updates);
    await course.save();
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;


    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
});


router.get('/search', async (req, res) => {
  try {
    const { q } = req.query; 

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const courses = await Course.find({
      $or: [
        { titre: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error searching courses', error: err.message });
  }
});

module.exports = router;