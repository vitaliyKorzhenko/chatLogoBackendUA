import { Telegraf, Context } from 'telegraf';
import TeacherHelper from './helpers/teacherHelper';
import { IChatMessage, TeacherInfoModel } from './types';
import { notifyClientOfNewMessage } from './socketHandler';

interface MyContext extends Context {
  state: {
    code?: string;
  };
  startPayload?: string; // Добавляем startPayload в интерфейс
}

const botToken = process.env.TG_BOT_TOKEN;

if (!botToken) {
  throw new Error('Bot token is not defined in environment variables.');
}

const bot = new Telegraf<MyContext>(botToken);

bot.use(async (ctx, next) => {
  console.log('Полное сообщение:', ctx.message);

  // Проверяем, является ли сообщение текстовым
  if (ctx.message && 'text' in ctx.message && ctx.message.text.startsWith('/start')) {
    const text = ctx.message.text;
    const fulllCode = text.split(' ')[1]; // Извлекаем параметр после команды

    console.log('Full Code:', fulllCode);

    if (fulllCode) {

      // Разбиваем код по "-"
      let codeChatId = fulllCode.split('-');
      console.log('Code parts:', codeChatId[0], codeChatId[1]);

      if (codeChatId.length > 1) {
        let teacherInfo = await TeacherHelper.findTeacherCustomerByChatId(codeChatId[0]);
        console.log('Teacher info:', teacherInfo);
        if (teacherInfo) {
          let currentChatId = ctx.chat ? ctx.chat.id : null
                //updateRealChatIdByCustomerIdAndTeacherId
        if(currentChatId) {
         await TeacherHelper.updateRealChatIdByCustomerIdAndTeacherId(teacherInfo.customerId, teacherInfo.teacherId, currentChatId.toString());
        }
          ctx.reply(`Your teacher ${teacherInfo?.teacherName}`);
        } else {
          await ctx.reply(`Teacher Not Found.`);
        }
      } else {
        await ctx.reply(`Teacher Not Found.`);
      }
    } else {
      await ctx.reply(`Teacher Not Found.`);
    }
  } else {
    console.log('No text message detected.');
  }

  return next();
});

// Обработка команды /start
bot.start(async (ctx) => {
 
});


// Echo any received text message
bot.on('text', async (ctx) => {
  try {
    let currentChatId = ctx.chat.id;
    console.log('Current ChatId:', currentChatId);

    let teacherInfo: TeacherInfoModel | null = await TeacherHelper.findTeacherCustomerByRealChatId(currentChatId.toString());
    console.log('Teacher Info:', teacherInfo);
    if (teacherInfo) {
      console.log('Teacher Info:', teacherInfo);

     let createdMessage =  await TeacherHelper.createChatMessage(
        teacherInfo.teacherId,
        teacherInfo.customerId,
        ctx.message.text,
       'tg',
       teacherInfo.source,
       'client'
      );
      let newMessage: IChatMessage = {
       id: createdMessage?.dataValues.id,
       text: ctx.message.text,
        timestamp: new Date().toISOString(),
        source: 'tg',
        sender: 'client',
        clientId: Number(teacherInfo.customerId),
      };
      console.log('New Message:', newMessage);
      notifyClientOfNewMessage(ctx.chat.id.toString(), newMessage)


    }  
  } catch (error) {
    console.error('Error processing text message:', error);
  }
});

// Function to launch the bot
export const launchBot = async () => {
  try {
    await bot.launch();
    console.log('Telegram bot launched successfully!');
  } catch (error) {
    console.error('Error launching Telegram bot:', error);
    throw error;
  }
};

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
