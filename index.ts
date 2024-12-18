import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './socketHandler';
import teacherRouter from './router/teacherRouter';
import { newUAPool, uaPool } from './db_pools';
import { findTeachersCustomer, syncTeachers } from './cronTasks';
import cors from 'cors'; 
import twilioWebhook from './twilioWebhook';
import { launchBot } from './chatLogoBot';

const app = express();
//use env port or 4030
const port = process.env.PORT || 4030;

// Подключаем middleware для обработки JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Добавляем поддержку urlencoded данных


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api', teacherRouter);

app.use('/twilio', twilioWebhook);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

socketHandler(io);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});






server.listen(port, async () => {
  try {
    console.log(`Server started at PORT :${port}`);
    try {
      //stop bot for test
     
      await syncTeachers(newUAPool, 'ua');
      // console.log("Teachers synced successfully!");
      // await findTeachersCustomer(uaPool, 'ua');
      // console.log("Teacher Customers found successfully!");

       await launchBot();
       console.log('Bot launched successfully!');
      
    } catch (error) {
      console.error('Error launching bot:', error);
    }
  } catch (error) { 
    console.error('Error starting server:', error);
  }
});
