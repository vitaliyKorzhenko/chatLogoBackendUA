"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('teacher_customers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      teacherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      customerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      customerPhones: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      customerEmails: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      chatInfo: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('teacher_customers');
  },
};
*/
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
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    customerEmails: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
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
    }
}, {
    sequelize: db_connection_1.default,
    tableName: 'teacher_customers',
});
exports.default = TeacherCustomer;
