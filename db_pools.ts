//config for different pools and tables

import mysql, { Pool } from 'mysql2';

const mainConfig = {
    host: process.env.DB_HOST_MAIN,
    user: process.env.DB_USER_MAIN,
    password: process.env.DB_PASSWORD_MAIN,
    database: process.env.DB_NAME_MAIN,
};

console.warn('mainConfig:', mainConfig);

export const mainPool: Pool = mysql.createPool(mainConfig);


//ua pool (for ua database)

const uaConfig = {
    host: process.env.DB_HOST_UA,
    user: process.env.DB_USER_UA,
    password: process.env.DB_PASSWORD_UA,
    database: process.env.DB_NAME_UA,
};
export const uaPool: Pool = mysql.createPool(uaConfig);

//pl pool (for pl database)
const plConfig = {
    host: process.env.DB_HOST_PL,
    user: process.env.DB_USER_PL,
    password: process.env.DB_PASSWORD_PL,
    database: process.env.DB_NAME_PL,
};
export const plPool: Pool = mysql.createPool(plConfig);

//tables names
export const teacherTable = 'teachers';

export const alfaCalendarsTable = 'alfa_calendars';

export const alfaCustomersTable = 'alfa_customers';