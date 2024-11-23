import { Sequelize } from 'sequelize';
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME_POSTGRES || '',
    process.env.DB_USER_POSTGRES || '',
    process.env.DB_PASSWORD_POSTGRES || '',
    {
        host: process.env.DB_HOST_POSTGRES || '',
        port: Number(process.env.DB_PORT_POSTGRES) || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);

export default sequelize;
