import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './socketHandler';
import { countAlfaCalendars, fetchAlfaCalendar, fetchAlfaCustomer, fetchAlfaMessages, fetchAllTables, fetchAllTeachers, fetchBoomiesChats, fetchBoomiesMessages, fetchBoomiesProjects, fetchTableColumns, findActiveAlfaCustomers,  findAlfaChat, findBoomiesChat, findTeacherCustomerWithChats } from './db_teachers';
import { ServerTeacher, TeacherCustomerModel } from './types';
import TeacherHelper from './helpers/teacherHelper';
import teacherRouter from './router/teacherRouter';
import { bumess_messages, mainPool, plPool, testMainPool, uaPool } from './db_pools';
import { startCronJobs } from './cronTasks';
import cors from 'cors'; // Импортируем cors
import { mainBotToken, sendMessage, testChatId } from './sendTgMessage';
import { Pool } from 'mysql2';

const app = express();
const port = 4030;

// Подключаем middleware для обработки JSON
app.use(express.json());

app.use(cors({
  origin: '*', // Разрешаем запросы с любого источника
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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



async function testAlfaCustomer () {
  try {
    const res = await fetchAlfaCustomer(testMainPool);
    if (res && res.length > 0) {
      console.log('Alfa Teacher Customer:', res[0]);
    }
  } catch (error) {
    console.error('Error fetching teacher customer:', error);
  }
}

//test findTeacherCustomer

async function testFindTeacherCustomer(pool: Pool, source: string) {
  try {
    const teacherCustomers:TeacherCustomerModel[]  | null= await findTeacherCustomerWithChats(pool, source);
   
    if (teacherCustomers) {
      console.log('Teacher Customer:', teacherCustomers[0]);
      await TeacherHelper.createTeacherCustomerIfNotExist(teacherCustomers, source);
    }
  } catch (error) {
    console.error('Error fetching teacher customer:', error);
  }
}

//test count distinct customer_id and teacher_id from alfa_calendars table
async function testCountDistinct() {
  try {
    const res = await countAlfaCalendars(plPool, 'pl');
   if (res) {
     console.log('Count distinct:', res);
   }
  } catch (error) {
    console.error('Error fetching alfa calendar:', error);
  }
}


//startCronJobs();


// Запуск сервера и затем вызов fetchAllTeachers
server.listen(port, async () => {
  try {
    console.log(`Server started at http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting server:', error);
  }
});
