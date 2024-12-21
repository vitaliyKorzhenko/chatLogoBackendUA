import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketHandler from './socketHandler';
import teacherRouter from './router/teacherRouter';
import cors from 'cors'; 
import dotenv from 'dotenv';
import centralSocket from './centralSocket'; // Импорт WebSocket подключения

dotenv.config();

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
    console.warn(`Server started at PORT :${port}`);

    // Подключение к центральному серверу
    if (centralSocket.connected) {
      console.log('Already connected to central WebSocket server.');
    } else {
      centralSocket.connect(); // Подключаемся, если не подключены
      console.log('Connecting to central WebSocket server...');
    }

  } catch (error) { 
    console.error('Error starting server:', error);
  }
});
