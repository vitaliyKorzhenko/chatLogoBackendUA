import express, { Request, Response } from 'express';
import https from 'https'; // Подключаем HTTPS вместо HTTP
import fs from 'fs'; // Для чтения сертификатов
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

// Пути к сертификатам
const keyPath = '/etc/letsencrypt/live/chatgovorika.chat/privkey.pem';
const certPath = '/etc/letsencrypt/live/chatgovorika.chat/fullchain.pem';

// Читаем сертификаты
const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

// Подключаем middleware для обработки JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Добавляем поддержку urlencoded данных

// Настройки CORS
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Роутер
app.use('/api', teacherRouter);

// Создаём HTTPS-сервер
const server = https.createServer(httpsOptions, app);

// Инициализируем Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingInterval: 15000, // Отправляем пинг каждые 15 секунд
  pingTimeout: 30000,  // Ожидаем ответа в течение 30 секунд
});

// Подключаем обработчики сокетов
socketHandler(io);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Запускаем сервер
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
