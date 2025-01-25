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

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.dropTable('chat_messages');
//   },
// };

import { DataTypes, Model } from 'sequelize';
import sequelize from '../db_connection';

class ChatMessages extends Model {
  public id!: number;
  public teacherId!: number;
  public orderNumber!: number;
  public customerId!: string;
  public messageType!: string;
  public attachemnt!: string | null;
  public isActive!: boolean;
  public serverDate!: Date | null;
  public additionalInfo!: object | null;
  public serverId!: string;
  public source!: string;
  public inBound!: boolean; // true - входящее, false - исходящее
  public sender!: string; //client, teacher
  public isSavedToBumes!: boolean;
  public isRead!: boolean;
  public format!: string;
}

ChatMessages.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1',
    },
    attachemnt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    serverDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    additionalInfo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inBound: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    serverId: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        messageText: {
        type: DataTypes.TEXT,
        allowNull: true,
        },
        sender: {
        type: DataTypes.STRING,
        allowNull: true,
        },
        isSavedToBumes: {
          type: DataTypes.BOOLEAN
      
        },
        isRead: {
          type: DataTypes.BOOLEAN
        },
        format: {
          type: DataTypes.STRING
        }
    },
    
    

  {
    sequelize, // передаем экземпляр подключения
    tableName: 'chat_messages', // название таблицы
  }
);

export default ChatMessages;