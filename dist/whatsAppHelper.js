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
const axios_1 = __importDefault(require("axios"));
class Wazzup24Messenger {
    constructor() {
        this.path = "https://api.wazzup24.com/v3/";
        this.channelId = "";
        this.apiKey = process.env.WUZZUP24_KEY || "";
        this.channelId = this.getSettingValue("wapi_channel_id");
    }
    getSettingValue(key) {
        // Имитация получения настроек, заменить на реальную логику
        return process.env[key] || "";
    }
    getWabaTemplates() {
        return __awaiter(this, arguments, void 0, function* (limit = 100) {
            const baseUrl = `${this.path}templates/whatsapp`;
            let offset = 0;
            const templates = [];
            while (true) {
                const url = `${baseUrl}?limit=${limit}&offset=${offset}`;
                try {
                    const response = yield axios_1.default.get(url, {
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                            "Content-Type": "application/json",
                        },
                    });
                    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                        templates.push(...response.data);
                        offset += limit;
                    }
                    else {
                        break;
                    }
                }
                catch (error) {
                    console.error("Ошибка запроса:", error);
                    break;
                }
            }
            templates.sort((a, b) => a.title.localeCompare(b.title));
            return templates;
        });
    }
    getChannelsCached() {
        return __awaiter(this, arguments, void 0, function* (time = 30) {
            if (!this.apiKey)
                return [];
            // Кэширование можно реализовать через сторонние библиотеки, например, `node-cache`
            const cacheKey = "allWazzoupChannels";
            const cached = yield this.getFromCache(cacheKey);
            if (cached) {
                return cached;
            }
            const channels = yield this.sendRequest("channels", { limit: 1000 }, "GET");
            this.saveToCache(cacheKey, channels, time);
            return channels;
        });
    }
    getAllActiveChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Wazzup24Messenger.channels.length === 0) {
                const channels = yield this.sendRequest("channels", {}, "GET");
                Wazzup24Messenger.channels = channels.filter((channel) => channel.state === "active");
            }
            return Wazzup24Messenger.channels;
        });
    }
    sendRequest(method_1) {
        return __awaiter(this, arguments, void 0, function* (method, data = {}, httpMethod = "POST") {
            const url = `${this.path}${method}`;
            const config = {
                method: httpMethod,
                url,
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(data),
            };
            try {
                const response = yield (0, axios_1.default)(config);
                return response.data;
            }
            catch (error) {
                console.error(`Ошибка в запросе ${url}:`, error);
                throw error;
            }
        });
    }
    sendFile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // const params: { chatId: any; chatType: string; channelId: any; text: any; templateId?: any; templateValues?: any[] } = {
            //     chatId: data.chatId || data.remoteAddress?.replace(/[+]|tel:/g, ""),
            //     chatType: "whatsapp",
            //     channelId: data.channelId !== this.channelId ? this.channelId : data.channelId,
            //     content: '',
            // };
            return this.sendRequest("message", '', "POST");
        });
    }
    sendText(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const params = {
                chatId: data.chatId || ((_a = data.remoteAddress) === null || _a === void 0 ? void 0 : _a.replace(/[+]|tel:/g, "")),
                chatType: "whatsapp",
                channelId: data.channelId !== this.channelId ? this.channelId : data.channelId,
                text: data.text,
            };
            if (data.templateId) {
                params["templateId"] = data.templateId;
                params["templateValues"] = data.substitutions || [];
            }
            return this.sendRequest("message", params, "POST");
        });
    }
    getFromCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // Реализуйте логику кэширования
            return null;
        });
    }
    saveToCache(key, value, ttl) {
        // Реализуйте сохранение данных в кэш
    }
}
Wazzup24Messenger.channels = [];
Wazzup24Messenger.SUFFIX = "_wazzup24";
exports.default = Wazzup24Messenger;
