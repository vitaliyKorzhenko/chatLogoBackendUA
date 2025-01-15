"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketHandler_1 = __importDefault(require("./socketHandler"));
const teacherRouter_1 = __importDefault(require("./router/teacherRouter"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const centralSocket_1 = __importDefault(require("./centralSocket")); // Импорт WebSocket подключения
dotenv_1.default.config();
const app = (0, express_1.default)();
//use env port or 4030
const port = process.env.PORT || 4030;
// Подключаем middleware для обработки JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // Добавляем поддержку urlencoded данных
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api', teacherRouter_1.default);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    pingInterval: 25000, // Интервал проверки соединения (25 секунд)
    pingTimeout: 60000, // Таймаут разрыва соединения (60 секунд)
});
(0, socketHandler_1.default)(io);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.warn(`Server started at PORT :${port}`);
        // Подключение к центральному серверу
        if (centralSocket_1.default.connected) {
            console.log('Already connected to central WebSocket server.');
        }
        else {
            centralSocket_1.default.connect(); // Подключаемся, если не подключены
            console.log('Connecting to central WebSocket server...');
        }
    }
    catch (error) {
        console.error('Error starting server:', error);
    }
}));
