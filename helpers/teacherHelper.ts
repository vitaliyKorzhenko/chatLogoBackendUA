import Teacher from "../models/Teacher";
import { ServerTeacher, TeacherIdModel } from "../types";
class TeacherHelper {
  // Метод для создания нового учителя
  static async createTeacher(data: {
    serverId: string;
    name: string;
    phone?: string;
    email?: string;
    source?: string;
    isActive?: boolean;
  }) {
    try {
      const newTeacher = await Teacher.create(data);
      console.log('New teacher created:', newTeacher.toJSON());
      return newTeacher;
    } catch (error) {
      console.error('Error creating new teacher:', error);
      throw error;
    }
  }

  // Метод для получения учителя по ID
  static async getTeacherById(id: number) {
    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        console.log('Teacher not found');
        return null;
      }
      return teacher;
    } catch (error) {
      console.error('Error fetching teacher by ID:', error);
      throw error;
    }
  }

  // Метод для получения всех учителей
  static async getAllTeachers() {
    try {
      const teachers = await Teacher.findAll();
      return teachers;
    } catch (error) {
      console.error('Error fetching all teachers:', error);
      throw error;
    }
  }

  // Метод для обновления информации об учителе
  static async updateTeacher(id: number, updateData: Partial<{
    serverId: string;
    name: string;
    phone?: string;
    email?: string;
    source?: string;
    isActive?: boolean;
  }>) {
    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        console.log('Teacher not found');
        return null;
      }
      await teacher.update(updateData);
      console.log('Teacher updated:', teacher.toJSON());
      return teacher;
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  }

  // Метод для "удаления" учителя по ID (устанавливает isActive в false)
  static async deleteTeacher(id: number) {
    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        console.log('Teacher not found');
        return null;
      }
      await teacher.update({ isActive: false });
      console.log('Teacher deactivated:', id);
      return teacher;
    } catch (error) {
      console.error('Error deactivating teacher:', error);
      throw error;
    }
  }

  //create Teachers use ServeTeacher [] array 
    static async createTeachers(teachers: ServerTeacher[]) {
        try {
        //parse ServerTeacher to Teacher
        let teacherItems = teachers.map((teacher) => ({
            serverId: teacher.serverId,
            name: teacher.name,
            phone: teacher.phone,
            email: teacher.email,
            source: 'main',
            isActive: true,
        }));
        const newTeachers = await Teacher.bulkCreate(teacherItems);
        console.log('New teachers created:', newTeachers.map((teacher) => teacher.toJSON()));
        return newTeachers;
        } catch (error) {
        console.error('Error creating new teachers:', error);
        throw error;
        }
    }

    //find id and serverId return arrays [{id: 1, serverId: '1'}, {id: 2, serverId: '2'}]

    static async getTeachersIdServerId(): Promise<TeacherIdModel[]> {
        try {
        const teachers = await Teacher.findAll({
            attributes: ['id', 'serverId'],
        });
        let teacherModels: TeacherIdModel[] = teachers.map((teacher) => ({
            id: teacher.id,
            serverId: teacher.serverId,
        }));
        return teacherModels;
        } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
        }
    }
}

export default TeacherHelper;
