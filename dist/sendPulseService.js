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
exports.sendPulseService = void 0;
const axios_1 = __importDefault(require("axios"));
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your SendPulse Client ID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // Replace with your SendPulse Client Secret
const API_BASE_URL = 'https://api.sendpulse.com';
/**
 * Class to handle SendPulse API operations
 */
class SendPulseService {
    constructor() {
        this.accessToken = null;
    }
    /**
     * Retrieves an Access Token from SendPulse API
     */
    fetchAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield axios_1.default.post(`${API_BASE_URL}/oauth/access_token`, {
                    grant_type: 'client_credentials',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                });
                this.accessToken = response.data.access_token;
                if (!this.accessToken) {
                    throw new Error('Access token not found in response');
                }
                return this.accessToken;
            }
            catch (error) {
                console.error('Failed to fetch access token:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error('Failed to authenticate with SendPulse API');
            }
        });
    }
    /**
     * Ensures an access token is available
     */
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.accessToken) {
                yield this.fetchAccessToken();
            }
            return this.accessToken;
        });
    }
    /**
     * Sends an email via SendPulse SMTP API
     * @param fromName - Sender's name
     * @param fromEmail - Sender's email
     * @param toName - Recipient's name
     * @param toEmail - Recipient's email
     * @param subject - Email subject
     * @param htmlContent - HTML content of the email
     */
    sendEmail(fromName, fromEmail, toName, toEmail, subject, htmlContent) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const accessToken = yield this.getAccessToken();
            const emailData = {
                email: {
                    from: { name: fromName, email: fromEmail },
                    to: [{ name: toName, email: toEmail }],
                    subject: subject,
                    html: htmlContent,
                },
            };
            try {
                const response = yield axios_1.default.post(`${API_BASE_URL}/smtp/emails`, emailData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Email sent successfully:', response.data);
            }
            catch (error) {
                console.error('Failed to send email:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw new Error('Error while sending email');
            }
        });
    }
}
// Exporting an instance of SendPulseService for use
exports.sendPulseService = new SendPulseService();
