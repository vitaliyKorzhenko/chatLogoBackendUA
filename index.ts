import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './socketHandler';
import { fetchAlfaCalendar, fetchAlfaCustomer, fetchAllTeachers, findTeacherCustomer } from './db_teachers';
import { ServerTeacher } from './types';
import TeacherHelper from './helpers/teacherHelper';
import teacherRouter from './router/teacherRouter';

const app = express();
const port = 3000;

// Подключаем middleware для обработки JSON
app.use(express.json());

// Подключаем ваш роутер на /api
app.use('/api', teacherRouter);

// Создаем HTTP сервер на основе Express
const server = http.createServer(app);

// Создаем Socket.IO сервер и подключаем его к HTTP серверу
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Используем обработчик сокетов
socketHandler(io);

// Маршрут для проверки сервера
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

//save teachers from main
async function SaveTeachersFromMain() {
  try {
    const teachers: ServerTeacher[] = await fetchAllTeachers();
    console.log('All Teachers:', teachers.length);
    if (teachers.length > 0) {
      console.log('First Teacher:', teachers[0]);

      try {
        let createTeachers = await TeacherHelper.createTeachers(teachers);
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


async function testAlfaCustomer () {
  try {
    const res = await fetchAlfaCustomer();
    if (res && res.length > 0) {
      console.log('Alfa Teacher Customer:', res[0]);
    }
  } catch (error) {
    console.error('Error fetching teacher customer:', error);
  }
}

//test findTeacherCustomer

async function testFindTeacherCustomer() {
  try {
    const teacher = await findTeacherCustomer();
    console.log('Teacher Customer:', teacher);
  } catch (error) {
    console.error('Error fetching teacher customer:', error);
  }
}

// Запуск сервера и затем вызов fetchAllTeachers
server.listen(port, async () => {
  console.log(`Server started at http://localhost:${port}`);
  try {
   // await testAlfaCustomer();
  } catch (error) {
    console.error('Error starting server:', error);
  }
});
