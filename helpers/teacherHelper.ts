import { Op } from "sequelize";
import Teacher from "../models/Teacher";
import { ServerTeacher, TeacherCustomerModel, TeacherIdModel, TeacherInfoWithCustomer } from "../types";
import TeacherCustomer from "../models/Teacher_Customer";
import { channel } from "diagnostics_channel";
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
  static async syncTeachers(teachers: ServerTeacher[], source: string = 'main'): Promise<Teacher[]> {
    try {
        // Parse ServerTeacher to Teacher
        const teacherItems = teachers.map((teacher) => ({
            serverId: teacher.serverId,
            name: teacher.name,
            phone: teacher.phone,
            email: teacher.email,
            source: source,
            isActive: true,
        }));

        // Get existing teachers by serverId and source
        const serverIds: string[] = teachers.map(teacher => teacher.serverId.toString());
        const existingTeachers: Teacher[] = await Teacher.findAll({ where: { serverId: { [Op.in]: serverIds }, source: source } });

        // Create or update teachers
        const existingTeacherIds: string[] = existingTeachers.map(teacher => teacher.serverId.toString());

        // Обновить существующих учителей одним запросом
        await Teacher.update(
            {
                isActive: true,
            },
            {
                where: {
                    serverId: { [Op.in]: existingTeacherIds },
                    source: source
                }
            }
        );

        // Найти учителей, которых нужно создать
        const newTeachersData = teacherItems.filter(teacher => !existingTeacherIds.includes(teacher.serverId.toString()));
        const newTeachers = await Teacher.bulkCreate(newTeachersData);

        console.log('New teachers created:', newTeachers.map(teacher => teacher.toJSON()));
        return [...existingTeachers, ...newTeachers];
    } catch (error) {
        console.error('Error syncing teachers:', error);
        throw error;
    }
}



    static async getTeachersIdServerId(source: string = 'main'): Promise<TeacherIdModel[]> {
        try {
        const teachers = await Teacher.findAll({
            attributes: ['id', 'serverId'],
            where:{
                source: source
            }
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

    //find teacher by serverId
    static async findTeacherByServerId(serverId: string): Promise<Teacher | null> {
        try {
        const teacher = await Teacher.findOne({
            where: {
            serverId,
            },
        });
        return teacher;
        } catch (error) {
        console.error('Error fetching teacher:', error);
        throw error;
        }
    }

    //find teacher by email
    static async findTeacherByEmail(email: string): Promise<Teacher | null> {
        try {
        const teacher = await Teacher.findOne({
            where: {
            email,
            },
        });
        return teacher;
        } catch (error) {
        console.error('Error fetching teacher:', error);
        throw error;
        }
    }

    //find teachers by source
    static async findTeachersBySource(source: string): Promise<Teacher[]> {
        try {
        const teachers = await Teacher.findAll({
            where: {
            source,
            },
        });
        return teachers;
        } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
        }
    }


    //create if not exist TeacherCustomer use 
    static async createTeacherCustomerIfNotExist(teacherCustomer: TeacherCustomerModel[], source: string) {
        try {
          //get teachers for source
        const teachers = await TeacherHelper.findTeachersBySource(source);
        const teacherIds = teachers.map((teacher) => teacher.id);

        const existingTeacherCustomers = await TeacherCustomer.findAll({
            where: {
            teacherId: { [Op.in]: teacherIds },
            }
        });

  

        let newTeacherCustomerData: any[] = [];

        for (let i = 0; i < teacherCustomer.length; i++) {
            let teacher = teachers.find((item) => item.serverId == teacherCustomer[i].teacherServerId.toString());
            if (teacher) {
              let currentTeacherCustomer = existingTeacherCustomers.find((item) => item.customerId == teacherCustomer[i].customerId.toString() && item.teacherId == teacher.id);
              if (!currentTeacherCustomer) {
              newTeacherCustomerData.push({
                teacherId: teacher.id,
                customerId: teacherCustomer[i].customerId,
                customerName: teacherCustomer[i].customerName,
                customerPhones: teacherCustomer[i].customerPhones,
                customerEmails: teacherCustomer[i].customerEmails,
                chatInfo: teacherCustomer[i].chatInfo,
                isActive: true,
                source: source,
                channelId: teacherCustomer[i].channelId,
                chatId: teacherCustomer[i].chatId,
                trackingCode: teacherCustomer[i].trackingCode
                
              });
            }
            }
        }
        console.log('NEW CUSTOMER LENGTH', newTeacherCustomerData.length);
        console.log('First New Teacher Customer:', newTeacherCustomerData[0]);
        const newTeacherCustomers = await TeacherCustomer.bulkCreate(newTeacherCustomerData);
        console.log('new First Teacher Customer:', newTeacherCustomers[0]);
       // console.log('New teacher customers created:', newTeacherCustomers.map((item) => item.toJSON()));
        return [...existingTeacherCustomers, ...newTeacherCustomers];
        } catch (error) {
        console.error('Error creating teacher customers:', error);
        throw error;
        }
    }

    //create teacher info with teacher customers (by email teacher)


    static async findTeacherInfoWithCustomersByEmail(email: string): Promise<TeacherInfoWithCustomer | null> {
        try {
        const teacher = await TeacherHelper.findTeacherByEmail(email);
        if (!teacher) {
            console.log('Teacher not found');
            return null;
        }

        const teacherCustomers = await TeacherCustomer.findAll({
            where: {
            teacherId: teacher.id,
            isActive: true,
            },
            raw: true
        });
        let teacherInfoWithCustomer: TeacherInfoWithCustomer = {
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherEmail: teacher.email ?? '',
            source: teacher.source ?? '',
            customers: []
        };
        //add customers to teacherInfoWithCustomer
        teacherCustomers.forEach((item) => {
            teacherInfoWithCustomer.customers.push({
              customerId: Number(item.customerId),
              customerName: item.customerName,
              customerEmails: item.customerEmails?? [],
              customerPhones: item.customerPhones ?? [],
              chatInfo: ''
            });
        });
        return teacherInfoWithCustomer;
        } catch (error) {
        console.error('Error fetching teacher info with customers:', error);
        throw error;
        }
    }

}

export default TeacherHelper;
