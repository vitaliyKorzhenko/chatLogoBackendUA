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
const db_teachers_1 = require("./db_teachers");
const teacherHelper_1 = __importDefault(require("./helpers/teacherHelper"));
const teacherRouter_1 = __importDefault(require("./router/teacherRouter"));
const db_pools_1 = require("./db_pools");
const cors_1 = __importDefault(require("cors")); // Импортируем cors
const app = (0, express_1.default)();
const port = 4030;
// Подключаем middleware для обработки JSON
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*', // Разрешаем запросы с любого источника
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Подключаем ваш роутер на /api
app.use('/api', teacherRouter_1.default);
// Создаем HTTP сервер на основе Express
const server = http_1.default.createServer(app);
// // Создаем Socket.IO сервер и подключаем его к HTTP серверу
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });
// // Используем обработчик сокетов
// socketHandler(io);
// Маршрут для проверки сервера
app.get('/', (req, res) => {
    res.send('Hello World!');
});
function testAlfaCustomer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield (0, db_teachers_1.fetchAlfaCustomer)(db_pools_1.testMainPool);
            if (res && res.length > 0) {
                console.log('Alfa Teacher Customer:', res[0]);
            }
        }
        catch (error) {
            console.error('Error fetching teacher customer:', error);
        }
    });
}
//test findTeacherCustomer
function testFindTeacherCustomer(pool, source) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const teacherCustomers = yield (0, db_teachers_1.findTeacherCustomerWithChats)(pool, source);
            if (teacherCustomers) {
                console.log('Teacher Customer:', teacherCustomers[0]);
                yield teacherHelper_1.default.createTeacherCustomerIfNotExist(teacherCustomers, source);
            }
        }
        catch (error) {
            console.error('Error fetching teacher customer:', error);
        }
    });
}
//test count distinct customer_id and teacher_id from alfa_calendars table
function testCountDistinct() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield (0, db_teachers_1.countAlfaCalendars)(db_pools_1.plPool, 'pl');
            if (res) {
                console.log('Count distinct:', res);
            }
        }
        catch (error) {
            console.error('Error fetching alfa calendar:', error);
        }
    });
}
//startCronJobs();
// Запуск сервера и затем вызов fetchAllTeachers
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Server started at http://localhost:${port}`);
    }
    catch (error) {
        console.error('Error starting server:', error);
    }
}));
