import express, { Request, Response } from 'express';
import TeacherHelper from '../helpers/teacherHelper';
const router = express.Router();

// Method to get a teacher by email
// router.get('/teacher', async (req: Request, res: Response) => {
//   const { email } = req.query;
//   if (!email || typeof email !== 'string') {
//     return res.status(400).json({ message: 'Email is required and must be a string' });
//   }

//   try {
//     const teacher = await TeacherHelper.getTeacherByEmail(email);
//     if (!teacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }
//     res.json(teacher);
//   } catch (error) {
//     console.error('Error fetching teacher by email:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

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

export default router;
