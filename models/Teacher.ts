import { DataTypes, Model } from 'sequelize';
import sequelize from '../db_connection';

class Teacher extends Model {
  public id!: number;
  public serverId!: string;
  public name!: string;
  public phone!: string | null;
  public email!: string | null;
  public source!: string | null;
  public isActive!: boolean;
}

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    serverId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize, // передаем экземпляр подключения
    tableName: 'teachers', // название таблицы
  }
);

export default Teacher;
