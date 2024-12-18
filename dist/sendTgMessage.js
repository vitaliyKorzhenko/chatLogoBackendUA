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
exports.testChatId = exports.mainBotToken = void 0;
exports.sendMessage = sendMessage;
const axios_1 = __importDefault(require("axios"));
const isProd = false;
//use env for bot token
exports.mainBotToken = process.env.TG_BOT_TOKEN;
exports.testChatId = '313757694';
function sendMessage(chatId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.telegram.org/bot${exports.mainBotToken}/sendMessage`;
        try {
            const response = yield axios_1.default.post(url, {
                chat_id: chatId,
                text: message,
            });
            console.log('Message sent:', response.data);
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
    });
}
