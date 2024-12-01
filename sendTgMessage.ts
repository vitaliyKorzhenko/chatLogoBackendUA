import axios from 'axios';

export const mainBotToken = '1020304081:AAFQvwaohMkRpQhURXVDavdxvHOp59ur1fQ';

export const testChatId  = '313757694'

export async function sendMessage(botToken: string, chatId: string, message: string) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: message,
        });

        console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
