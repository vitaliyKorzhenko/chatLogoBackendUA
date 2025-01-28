"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToCentralServer = sendMessageToCentralServer;
const socket_io_client_1 = require("socket.io-client");
const socketHandler_1 = require("./socketHandler");
const sourceHelper_1 = require("./sourceHelper");
const isProd = true;
const CENTRAL_SERVER_URL = isProd ? 'http://167.172.179.104:4000' : 'http://localhost:4000';
console.warn('CENTRAL_SERVER_URL:', CENTRAL_SERVER_URL);
// Создаем подключение к центральному серверу
const centralSocket = (0, socket_io_client_1.io)(CENTRAL_SERVER_URL, { autoConnect: false }); // autoConnect: false для ручного управления подключением
// Подключение к серверу
centralSocket.on('connect', () => {
    console.log('Connected to central WebSocket server');
    // Регистрируем украинский сервис
    centralSocket.emit('registerService', sourceHelper_1.defaultService);
});
// Обработка сообщений от центрального сервера
centralSocket.on('newMessage', (message) => {
    console.log('New message received from central server:', message);
    (0, socketHandler_1.notifyClientOfNewMessage)(message.teacherId, message.customerId, {
        text: message.text,
        sender: 'client',
        source: sourceHelper_1.defaultSource,
        timestamp: new Date().toISOString(),
        clientId: Number(message.customerId),
        id: message.messageId,
        format: message.format
    });
});
// Обработка ошибок подключения
centralSocket.on('connect_error', (error) => {
    console.error('Error connecting to central WebSocket server:', error);
});
// Обработка отключения
centralSocket.on('disconnect', () => {
    console.warn('Disconnected from central WebSocket server');
});
function sendMessageToCentralServer(data) {
    if (!centralSocket.connected) {
        console.warn('Cannot send message: not connected to central server');
        return;
    }
    console.warn('Sending message to central server:', data);
    centralSocket.emit('messageFromService', data);
    console.log(`Message sent to ${data.customer}:`, data.message);
}
// Экспорт сокета
exports.default = centralSocket;
