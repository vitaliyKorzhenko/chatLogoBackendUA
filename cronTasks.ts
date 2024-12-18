// src/crons/myCronTasks.ts
import cron from 'node-cron';
import TeacherHelper from './helpers/teacherHelper';
import { fetchAllTeachers, findTeacherCustomerWithChats } from './db_teachers';
import { ServerTeacher, TeacherCustomerModel } from './types';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';

export async function syncTeachers (pool: Pool, source: string) {
    try {
        const teachers: ServerTeacher[] = await fetchAllTeachers(pool);
        console.log('All Teachers:', teachers.length);
        if (teachers.length > 0) {
        console.log('First Teacher:', teachers[0]);
    
        try {
           // let createTeachers = await TeacherHelper.syncTeachers(teachers, source);
            //console.log('Teachers created:', createTeachers.length);
            
            
        } catch (error) {
            console.error('Error creating teachers:', error);
            
        }
        } else {
        console.log('No teachers found');
        }
    } catch (error) {
        console.error('Error during teacher fetch:', error);
    }
}


export async function findTeachersCustomer(pool: Pool, source: string) {
  try {
    const teacherCustomers:TeacherCustomerModel[]  | null= await findTeacherCustomerWithChats(pool, source);
   
    if (teacherCustomers) {
      console.log('Teacher Customer FIND!:', teacherCustomers[0]);
      await TeacherHelper.createTeacherCustomerIfNotExist(teacherCustomers, source);
    }
  } catch (error) {
    console.error('Error fetching teacher customer:', error);
  }
}





export const startAllCronJobs = () => {



  cron.schedule('2 * * * *', async () => {
    console.log('This task runs every minute');
    try {
      // await findTeachersCustomer(testMainPool, 'main');
    } catch (error) {
      console.error('Error during teacher fetch:', error);
        
    }

  });
};
