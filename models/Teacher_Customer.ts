import { DataTypes, Model } from 'sequelize';
import sequelize from '../db_connection';

class TeacherCustomer extends Model {
  public id!: number;
  public teacherId!: number;
  public customerId!: string;
  public customerName!: string;
  public customerPhones!: string | null;
  public customerEmails!: string| null;
  public chatInfo!: string;
  public channelId!: string;
  public chatId!: string;
  public trackingCode!: string;
  public isActive!: boolean;
  public realChatId!: string;
  public source!: string;
  public realPhone!: string | null;

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
      type:  DataTypes.STRING,
      allowNull: true,
    },
    customerEmails: {
      type:  DataTypes.STRING,
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
    realChatId: {
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
    },
    realPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    sequelize,
    tableName: 'teacher_customers',
  }
);

export default TeacherCustomer;