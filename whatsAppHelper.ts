import axios, { AxiosRequestConfig } from "axios";

class Wazzup24Messenger {
    private path: string = "https://api.wazzup24.com/v3/";
    private apiKey: string;
    private channelId: string = "";
    private static channels: any[] = [];
    private static readonly SUFFIX = "_wazzup24";

    constructor() {
        this.apiKey = process.env.WUZZUP24_KEY || "";
        this.channelId = this.getSettingValue("wapi_channel_id");
    }

    private getSettingValue(key: string): string {
        // Имитация получения настроек, заменить на реальную логику
        return process.env[key] || "";
    }

    public async getWabaTemplates(limit: number = 100): Promise<any[]> {
        const baseUrl = `${this.path}templates/whatsapp`;
        let offset = 0;
        const templates: any[] = [];

        while (true) {
            const url = `${baseUrl}?limit=${limit}&offset=${offset}`;
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    templates.push(...response.data);
                    offset += limit;
                } else {
                    break;
                }
            } catch (error) {
                console.error("Ошибка запроса:", error);
                break;
            }
        }

        templates.sort((a, b) => a.title.localeCompare(b.title));
        return templates;
    }

    public async getChannelsCached(time: number = 30): Promise<any[]> {
        if (!this.apiKey) return [];
        // Кэширование можно реализовать через сторонние библиотеки, например, `node-cache`
        const cacheKey = "allWazzoupChannels";
        const cached = await this.getFromCache(cacheKey);
        if (cached) {
            return cached;
        }

        const channels = await this.sendRequest("channels", { limit: 1000 }, "GET");
        this.saveToCache(cacheKey, channels, time);
        return channels;
    }

    public async getAllActiveChannels(): Promise<any[]> {
        if (Wazzup24Messenger.channels.length === 0) {
            const channels = await this.sendRequest("channels", {}, "GET");
            Wazzup24Messenger.channels = channels.filter((channel: any) => channel.state === "active");
        }
        return Wazzup24Messenger.channels;
    }

    private async sendRequest(method: string, data: any = {}, httpMethod: string = "POST"): Promise<any> {
        const url = `${this.path}${method}`;
        const config: AxiosRequestConfig = {
            method: httpMethod as any,
            url,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        };

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`Ошибка в запросе ${url}:`, error);
            throw error;
        }
    }

    public async sendFile(data: any): Promise<any> {
        // const params: { chatId: any; chatType: string; channelId: any; text: any; templateId?: any; templateValues?: any[] } = {
        //     chatId: data.chatId || data.remoteAddress?.replace(/[+]|tel:/g, ""),
        //     chatType: "whatsapp",
        //     channelId: data.channelId !== this.channelId ? this.channelId : data.channelId,
        //     content: '',
        // };

        return this.sendRequest("message", '', "POST");
    }

    public async sendText(data: any): Promise<any> {
        const params: any = {
            chatId: data.chatId || data.remoteAddress?.replace(/[+]|tel:/g, ""),
            chatType: "whatsapp",
            channelId: data.channelId !== this.channelId ? this.channelId : data.channelId,
            text: data.text,
        };

        if (data.templateId) {
            params["templateId"] = data.templateId;
            params["templateValues"] = data.substitutions || [];
        }

        return this.sendRequest("message", params, "POST");
    }

    private async getFromCache(key: string): Promise<any | null> {
        // Реализуйте логику кэширования
        return null;
    }

    private saveToCache(key: string, value: any, ttl: number): void {
        // Реализуйте сохранение данных в кэш
    }
}

export default Wazzup24Messenger;
