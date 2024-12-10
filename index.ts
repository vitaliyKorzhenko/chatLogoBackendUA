import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './socketHandler';
import { countAlfaCalendars, fetchAlfaCalendar, fetchAlfaCustomer, fetchAlfaMessages, fetchAllTables, fetchAllTeachers, fetchBoomiesChats, fetchBoomiesMessages, fetchBoomiesProjects, fetchTableColumns, findActiveAlfaCustomers,  findAlfaChat, findBoomiesChat, findMessagesWithFullInfo, findTeacherCustomerWithChats } from './db_teachers';
import { ServerTeacher, TeacherCustomerModel } from './types';
import TeacherHelper from './helpers/teacherHelper';
import teacherRouter from './router/teacherRouter';
import { bumess_messages, mainPool, plPool, testMainPool, uaPool } from './db_pools';
import { findTeachersCustomer, startAllCronJobs } from './cronTasks';
import cors from 'cors'; // Импортируем cors
import { mainBotToken, sendMessage, testChatId } from './sendTgMessage';
import { Pool } from 'mysql2';
import { ChatMessagesModel } from './types';
import { launchBot } from './chatLogoBot';

const app = express();
//use env port or 4030
const port = process.env.PORT || 4030;

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

// // Создаем Socket.IO сервер и подключаем его к HTTP серверу
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




//startAllCronJobs();


async function LoadChatMessagesFromSource (pool: Pool, source: string) {
  try {
    //step 1 find current ChatLoader
    let chatLoader = await TeacherHelper.findChatLoaderBySource(source);
    if (!chatLoader) {
      console.log('ChatLoader not found for source:', source);
      return;
    }
    //findMessagesWithFullInfo use source and lastDate from chatLoader
    console.log('ChatLoader:', chatLoader);
    let rows = await findMessagesWithFullInfo(pool, source, Number(chatLoader.serverId));
    if (rows) {
      console.log('Count:', rows.length);
      console.log('First row:', rows[0]);
      //parse rows and save to chat_messages ChatMessagesModel array
      let chatMessages: ChatMessagesModel[] = [];
      let orderNumber = chatLoader.orderNumber;
      //array customerIds
      let customerIds: string[] = rows.map((row) => row.customerId.toString());
      //find teacherId by customerId
      let teachers = await TeacherHelper.findTeacherCustomersByCustomerIdsAndSource(customerIds, source);
      console.log('Teachers-CUSTOMERS:', teachers.length);
      console.log('First Teacher:', teachers[0]);

    rows.forEach( (row) => {
      //1 find teacherId by customerId
      let teacher = teachers.find((teacher) => teacher.customerId == row.customerId.toString());
      console.log('Find Teacher', teacher);
      if (teacher) {
        let chatMessage: ChatMessagesModel = {
          messageText: row.messageText,
          teacherId: teacher.teacherId,
          orderNumber: orderNumber,
          customerId: row.customerId,
          messageType: row.messageType,
          attachemnt: '',
          isActive: true,
          serverDate: new Date(),
          additionalInfo: {
            alfaChatId: row.alfaChatId,
            tgChatId: row.tgChatId,
          },
          serverId: row.messageId ,
          source: source,
          inBound: true,
        };
        chatMessages.push(chatMessage);
        orderNumber++;
      }
    });

    //save chatMessages to chat_messages table
    console.log('ChatMessages:', chatMessages.length);
    console.log('Last ChatMessage:', chatMessages[chatMessages.length - 1]);
    await TeacherHelper.createChatMessages(chatMessages, source);
    //update chatLoader update last serverId and orderNumber
    await TeacherHelper.updateChatLoaderBySource(source, chatMessages[chatMessages.length - 1].serverId, orderNumber);

  }

  } catch (error) {
    console.error('Error fetching alfa messages:', error);
  }
}


// Запуск сервера и затем вызов fetchAllTeachers
server.listen(port, async () => {
  try {
    console.log(`Server started at PORT :${port}`);
    try {
      await launchBot();
      console.log('Bot launched successfully!');
    } catch (error) {
      console.error('Error launching bot:', error);
    }
    // await LoadChatMessagesFromSource(uaPool, 'ua');
    // await LoadChatMessagesFromSource(plPool, 'pl');
  } catch (error) { 
    console.error('Error starting server:', error);
  }
});
