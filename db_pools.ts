//config for different pools and tables

import mysql, { Pool } from 'mysql2';


//tables names
export const teacherTable = 'teachers';

export const alfaCalendarsTable = 'alfa_calendars';

export const alfaCustomersTable = 'alfa_customers';

export const alfa_messages = 'alfa_messages';

export const alfa_chats = 'alfa_chats';

export const bumess_messages = 'bumess_messages';

export const bumess_chats = 'bumess_chats';

export const bumess_projects = 'bumess_projects';

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



//for testing purposes
export const testMainPool: Pool = mysql.createPool({
    host: '198.20.115.73',
    user: 'aleks3',
    password: 'klsdfjhor854here7DR93#e$5k75sdf$55',
    database: 'main',
});