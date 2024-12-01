// src/crons/myCronTasks.ts
import cron from 'node-cron';
import TeacherHelper from './helpers/teacherHelper';
import { fetchAllTeachers } from './db_teachers';
import { mainPool, plPool, testMainPool, uaPool } from './db_pools';
import { ServerTeacher } from './types';


async function syncTeachersFromMain() {
    try {
      const teachers: ServerTeacher[] = await fetchAllTeachers(testMainPool);
      console.log('All SERVER Teachers:', teachers.length);
      if (teachers.length > 0) {
        console.log('First Teacher:', teachers[0]);
  
        try {
          let createTeachers = await TeacherHelper.syncTeachers(teachers, 'main');
          console.log('Teachers created:', createTeachers.length);
          
          
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

async function syncTeachersFromUA () {
    try {
        const teachers: ServerTeacher[] = await fetchAllTeachers(uaPool);
        console.log('All UA Teachers:', teachers.length);
        if (teachers.length > 0) {
        console.log('First Teacher:', teachers[0]);
    
        try {
            let createTeachers = await TeacherHelper.syncTeachers(teachers, 'ua');
            console.log('Teachers created:', createTeachers.length);
            
            
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

async function syncTeachersFromPL () {
    try {
        const teachers: ServerTeacher[] = await fetchAllTeachers(plPool);
        console.log('All PL Teachers:', teachers.length);
        if (teachers.length > 0) {
        console.log('First Teacher:', teachers[0]);
    
        try {
            let createTeachers = await TeacherHelper.syncTeachers(teachers, 'pl');
            console.log('Teachers created:', createTeachers.length);
            
            
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



export const startCronJobs = () => {
  cron.schedule('* * * * *', async () => {
    console.log('This task runs every minute');
    try {
       await syncTeachersFromPL();
    } catch (error) {
      console.error('Error during teacher fetch:', error);
        
    }
    //save teachers from main
  });

  cron.schedule('0 0 * * *', () => {
    console.log('This task runs every day at midnight');
    // Your code here, for example, clearing the database or generating a report
  });
};
