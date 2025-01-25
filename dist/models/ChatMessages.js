"use strict";
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('chat_messages', {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false,
//       },
//       teacherId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
//           model: 'teachers',
//           key: 'id',
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'CASCADE',
//       },
//       orderNumber: {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//       },
//       customerId: {
//         type: Sequelize.STRING,
//         allowNull: false,
//       },
//       messageType:{
//         type: Sequelize.STRING,
//         allowNull: false,
//         defaultValue: '1',
//       },
//       attachemnt: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
//       isActive: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//         defaultValue: true,
//       },
//       serverDate: {
//         type: Sequelize.DATE,
//         allowNull: true
//       },
//       additionalInfo: {
//         type: Sequelize.JSON,
//         allowNull: true,
//       },
//       createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW,
//       },
//       updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW,
//       },
//     });
//   },
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('chat_messages');
//   },
// };
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../db_connection"));
class ChatMessages extends sequelize_1.Model {
}
ChatMessages.init({
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
    orderNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    customerId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    messageType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: '1',
    },
    attachemnt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    serverDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    additionalInfo: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    source: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    inBound: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    serverId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    messageText: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    sender: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    isSavedToBumes: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    format: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: db_connection_1.default, // передаем экземпляр подключения
    tableName: 'chat_messages', // название таблицы
});
exports.default = ChatMessages;
