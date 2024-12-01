
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
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db_connection';

class TeacherCustomer extends Model {
  public id!: number;
  public teacherId!: number;
  public customerId!: string;
  public customerName!: string;
  public customerPhones!: string[] | null;
  public customerEmails!: string[] | null;
  public chatInfo!: Record<string, any> | null;
  public channelId!: string;
  public chatId!: string;
  public trackingCode!: string;
  public isActive!: boolean;
  public source!: string;
}

TeacherCustomer.init(
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
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerPhones: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    customerEmails: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    chatInfo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    chatId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    channelId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trackingCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    }

  },
  {
    sequelize,
    tableName: 'teacher_customers',
  }
);

export default TeacherCustomer;