"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToCentralServer = sendMessageToCentralServer;
const socket_io_client_1 = require("socket.io-client");
const socketHandler_1 = require("./socketHandler");
const mode = process.env.MODESERVER || 'DEV';
const CENTRAL_SERVER_URL = 'http://167.172.179.104:4000';
console.warn('CENTRAL_SERVER_URL:', CENTRAL_SERVER_URL);
// Создаем подключение к центральному серверу
const centralSocket = (0, socket_io_client_1.io)(CENTRAL_SERVER_URL, { autoConnect: false }); // autoConnect: false для ручного управления подключением
// Подключение к серверу
centralSocket.on('connect', () => {
    console.log('Connected to central WebSocket server');
    // Регистрируем украинский сервис
    centralSocket.emit('registerService', 'ukrainianService');
});
// Обработка сообщений от центрального сервера
centralSocket.on('newMessage', (message) => {
    console.log('New message received from central server:', message);
    (0, socketHandler_1.notifyClientOfNewMessage)(message.teacherId, message.customerId, {
        text: message.text,
        sender: 'client',
        source: 'ua',
        timestamp: new Date().toISOString(),
        clientId: Number(message.customerId),
        id: message.messageId
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
function sendMessageToCentralServer(text, chatId, addEmail, emails) {
    if (!centralSocket.connected) {
        console.warn('Cannot send message: not connected to central server');
        return;
    }
    console.warn('Sending message to central server:', text, chatId, addEmail, emails);
    centralSocket.emit('messageFromService', {
        service: 'ukrainianService',
        text: text,
        chatId: chatId,
        addEmail: addEmail,
        emails: emails,
    });
    console.log(`Message sent to ${chatId}:`, text);
}
// Экспорт сокета
exports.default = centralSocket;
