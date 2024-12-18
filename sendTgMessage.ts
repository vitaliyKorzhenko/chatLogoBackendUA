import axios from 'axios';

const isProd = false;

//use env for bot token
export const mainBotToken  =  process.env.TG_BOT_TOKEN;
export const testChatId  = '313757694'

export async function sendMessage(chatId: string, message: string) {
    const url = `https://api.telegram.org/bot${mainBotToken}/sendMessage`;

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
