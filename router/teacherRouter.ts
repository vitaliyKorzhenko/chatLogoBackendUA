import express, { Request, Response, NextFunction } from 'express';
import TeacherHelper from '../helpers/teacherHelper';
require('dotenv').config();
const router = express.Router();



// Middleware to check token for all requests
const tokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token || token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

// Apply tokenMiddleware to all routes under /api
router.use('/', tokenMiddleware);

// Method to get all active teachers
router.get('/teachers', async (req: Request, res: Response) => {
  try {
    const teachers = await TeacherHelper.getAllTeachers();
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching all teachers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Method to create a new teacher
router.post('/teacher', async (req: Request, res: Response) => {
  const { serverId, name, phone, email, source, isActive } = req.body;

  if (!serverId || !name || !email) {
    return res.status(400).json({ message: 'serverId, name, and email are required' });
  }

  try {
    const newTeacher = await TeacherHelper.createTeacher({ serverId, name, phone, email, source, isActive });
    res.status(201).json(newTeacher);
  } catch (error) {
    console.error('Error creating new teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Method to update teacher information
router.put('/teacher/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTeacher = await TeacherHelper.updateTeacher(Number(id), updateData);
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(updatedTeacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Method to "delete" a teacher (sets isActive to false)
router.delete('/teacher/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTeacher = await TeacherHelper.deleteTeacher(Number(id));
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deactivated' });
  } catch (error) {
    console.error('Error deactivating teacher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//find teacher by email post method
router.post('/teacher/email', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const teacher = await TeacherHelper.findTeacherByEmail(email);
    if (!teacher) {
      return res.status(200).json(null);
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//find teacher info by email post method
router.post('/teacher/info', async (req: Request, res: Response) => {
  console.log('======= Start find teacher info by email =====', req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const teacher = await TeacherHelper.findTeacherInfoWithCustomersByEmail(email);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher by email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
