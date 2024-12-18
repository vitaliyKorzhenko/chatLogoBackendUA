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
const express_1 = require("express");
const twilio_1 = require("twilio");
const teacherHelper_1 = __importDefault(require("./helpers/teacherHelper"));
// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const client = new twilio_1.Twilio(accountSid, authToken);
const router = (0, express_1.Router)();
// Вебхук для обработки входящих сообщений
router.post('/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Body, From } = req.body;
        // Извлекаем номер телефона из From
        const normalizedPhone = From.replace('whatsapp:', '').replace(/\D/g, ''); // Убираем whatsapp: и нечисловые символы
        console.log(`Message from client: ${Body}`);
        console.log(`Sender: ${normalizedPhone}`);
        // Ищем учителя и клиента по нормализованному номеру телефона
        const teacherCustomerInfo = yield teacherHelper_1.default.findTeacherCustomerByPhone(normalizedPhone);
        console.log(`Customer-Teacher Info: ${teacherCustomerInfo}`);
        // Ответ Twilio (закомментированный код можно раскомментировать при необходимости)
        yield client.messages.create({
            from: 'whatsapp:+14155238886',
            to: From,
            body: 'Я сохранил ваше сообщение!'
        });
        // Ответ Twilio для завершения запроса
        res.status(200).send('OK');
    }
    catch (error) {
        console.error(`Error processing message: ${error}`);
        res.status(500).send('Error processing message');
    }
}));
exports.default = router;
