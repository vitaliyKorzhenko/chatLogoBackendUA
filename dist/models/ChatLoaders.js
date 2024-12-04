"use strict";
// 'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.createTable('chat_loaders', {
//       id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false,
//       },
//       orderNumber: {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//       },
//       lastDate: {
//         type: Sequelize.DATE,
//         allowNull: true,
//       },
//       source: {
//         type: Sequelize.STRING,
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
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('chat_loaders');
//   },
// };
const sequelize_1 = require("sequelize");
const db_connection_1 = __importDefault(require("../db_connection"));
class ChatLoader extends sequelize_1.Model {
}
// wapi_wazzup24
ChatLoader.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    orderNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    lastDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    source: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    serverId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: db_connection_1.default, // передаем экземпляр подключения
    tableName: 'chat_loaders', // название таблицы
});
exports.default = ChatLoader;
