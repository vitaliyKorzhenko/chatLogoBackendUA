import axios from 'axios';

export const mainBotToken = '7065191329:AAFSKQ_PMyGS8CgXa0w6Ic4FCY7MoKRqZWg';

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
