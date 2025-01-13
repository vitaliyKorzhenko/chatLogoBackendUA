"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../db_connection"));
class TeacherCustomer extends sequelize_1.Model {
}
TeacherCustomer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    teacherId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    customerId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customerPhones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    customerEmails: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    chatInfo: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    chatId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    realChatId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    channelId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    trackingCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    source: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    realPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: db_connection_1.default,
    tableName: 'teacher_customers',
});
exports.default = TeacherCustomer;
