import { Router, Request, Response } from 'express';
import { Twilio } from 'twilio';
import TeacherHelper from './helpers/teacherHelper';
import { TeacherIdModel, TeacherInfoModel } from './types';

// Twilio credentials
const accountSid = 'AC69ce51ca2230d7b34fba1a169b22ceed';
const authToken = '3b06ea7739c404bbe4092707910f9190';
const client = new Twilio(accountSid, authToken);

const router = Router();

// Вебхук для обработки входящих сообщений
router.post('/webhook', async (req: Request, res: Response) => {
    try {
        const { Body, From } = req.body;

        // Извлекаем номер телефона из From
        const normalizedPhone = From.replace('whatsapp:', '').replace(/\D/g, ''); // Убираем whatsapp: и нечисловые символы

        console.log(`Message from client: ${Body}`);
        console.log(`Sender: ${normalizedPhone}`);
    
        // Ищем учителя и клиента по нормализованному номеру телефона
        const teacherCustomerInfo: TeacherInfoModel | null = await TeacherHelper.findTeacherCustomerByPhone(normalizedPhone);

        console.log(`Customer-Teacher Info: ${teacherCustomerInfo}`);
    
        // Ответ Twilio (закомментированный код можно раскомментировать при необходимости)
        await client.messages.create({
            from: 'whatsapp:+14155238886',
            to: From,
            body: 'Я сохранил ваше сообщение!'
        });

        // Ответ Twilio для завершения запроса
        res.status(200).send('OK');
        
    } catch (error) {
        console.error(`Error processing message: ${error}`);
        res.status(500).send('Error processing message');
    }
});


export default router;
