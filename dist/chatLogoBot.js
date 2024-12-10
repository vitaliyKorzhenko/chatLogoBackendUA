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
exports.launchBot = void 0;
const telegraf_1 = require("telegraf");
const teacherHelper_1 = __importDefault(require("./helpers/teacherHelper"));
const socketHandler_1 = require("./socketHandler");
const botToken = process.env.TG_BOT_TOKEN;
if (!botToken) {
    throw new Error('Bot token is not defined in environment variables.');
}
const bot = new telegraf_1.Telegraf(botToken);
bot.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                let teacherInfo = yield teacherHelper_1.default.findTeacherCustomerByChatId(codeChatId[0]);
                console.log('Teacher info:', teacherInfo);
                if (teacherInfo) {
                    let currentChatId = ctx.chat ? ctx.chat.id : null;
                    //updateRealChatIdByCustomerIdAndTeacherId
                    if (currentChatId) {
                        yield teacherHelper_1.default.updateRealChatIdByCustomerIdAndTeacherId(teacherInfo.customerId, teacherInfo.teacherId, currentChatId.toString());
                    }
                    ctx.reply(`Your teacher ${teacherInfo === null || teacherInfo === void 0 ? void 0 : teacherInfo.teacherName}`);
                }
                else {
                    yield ctx.reply(`Teacher Not Found.`);
                }
            }
            else {
                yield ctx.reply(`Teacher Not Found.`);
            }
        }
        else {
            yield ctx.reply(`Teacher Not Found.`);
        }
    }
    else {
        console.log('No text message detected.');
    }
    return next();
}));
// Обработка команды /start
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Echo any received text message
bot.on('text', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let currentChatId = ctx.chat.id;
        console.log('Current ChatId:', currentChatId);
        let teacherInfo = yield teacherHelper_1.default.findTeacherCustomerByRealChatId(currentChatId.toString());
        console.log('Teacher Info:', teacherInfo);
        if (teacherInfo) {
            console.log('Teacher Info:', teacherInfo);
            let createdMessage = yield teacherHelper_1.default.createChatMessage(teacherInfo.teacherId, teacherInfo.customerId, ctx.message.text, 'tg', teacherInfo.source, 'client');
            let newMessage = {
                id: createdMessage === null || createdMessage === void 0 ? void 0 : createdMessage.dataValues.id,
                text: ctx.message.text,
                timestamp: new Date().toISOString(),
                source: 'tg',
                sender: 'client',
                clientId: Number(teacherInfo.customerId),
            };
            console.log('New Message:', newMessage);
            (0, socketHandler_1.notifyClientOfNewMessage)(ctx.chat.id.toString(), newMessage);
        }
    }
    catch (error) {
        console.error('Error processing text message:', error);
    }
}));
// Function to launch the bot
const launchBot = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield bot.launch();
        console.log('Telegram bot launched successfully!');
    }
    catch (error) {
        console.error('Error launching Telegram bot:', error);
        throw error;
    }
});
exports.launchBot = launchBot;
// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
