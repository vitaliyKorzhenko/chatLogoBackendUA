// 'use strict';

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

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db_connection';

class ChatLoader extends Model {
  public id!: number;
  public orderNumber!: number;
  public lastDate!: Date | null;
  public source!: string | null;
  public serverId!: string;
}

// wapi_wazzup24
ChatLoader.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lastDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serverId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // передаем экземпляр подключения
    tableName: 'chat_loaders', // название таблицы
  }
);

export default ChatLoader;