"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require('dotenv').config();
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME_POSTGRES || '', process.env.DB_USER_POSTGRES || '', process.env.DB_PASSWORD_POSTGRES || '', {
    host: process.env.DB_HOST_POSTGRES || '',
    port: Number(process.env.DB_PORT_POSTGRES) || 5432,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
exports.default = sequelize;
