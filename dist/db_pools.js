"use strict";
//config for different pools and tables
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testMainPool = exports.plPool = exports.uaPool = exports.mainPool = exports.bumess_projects = exports.bumess_chats = exports.bumess_messages = exports.alfa_chats = exports.alfa_messages = exports.alfaCustomersTable = exports.alfaCalendarsTable = exports.teacherTable = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
//tables names
exports.teacherTable = 'teachers';
exports.alfaCalendarsTable = 'alfa_calendars';
exports.alfaCustomersTable = 'alfa_customers';
exports.alfa_messages = 'alfa_messages';
exports.alfa_chats = 'alfa_chats';
exports.bumess_messages = 'bumess_messages';
exports.bumess_chats = 'bumess_chats';
exports.bumess_projects = 'bumess_projects';
const mainConfig = {
    host: process.env.DB_HOST_MAIN,
    user: process.env.DB_USER_MAIN,
    password: process.env.DB_PASSWORD_MAIN,
    database: process.env.DB_NAME_MAIN,
};
console.warn('mainConfig:', mainConfig);
exports.mainPool = mysql2_1.default.createPool(mainConfig);
//ua pool (for ua database)
const uaConfig = {
    host: process.env.DB_HOST_UA,
    user: process.env.DB_USER_UA,
    password: process.env.DB_PASSWORD_UA,
    database: process.env.DB_NAME_UA,
};
exports.uaPool = mysql2_1.default.createPool(uaConfig);
//pl pool (for pl database)
const plConfig = {
    host: process.env.DB_HOST_PL,
    user: process.env.DB_USER_PL,
    password: process.env.DB_PASSWORD_PL,
    database: process.env.DB_NAME_PL,
};
exports.plPool = mysql2_1.default.createPool(plConfig);
//for testing purposes
exports.testMainPool = mysql2_1.default.createPool({
    host: '198.20.115.73',
    user: 'aleks3',
    password: 'klsdfjhor854here7DR93#e$5k75sdf$55',
    database: 'main',
});
