import mysql, { Pool, RowDataPacket } from 'mysql2';
import { ServerTeacher, TeacherCustomerModel, TeacherIdModel } from './types';
import TeacherHelper from './helpers/teacherHelper';
import { alfa_chats, alfaCalendarsTable, alfaCustomerAlfaChat, alfaCustomersTable } from './db_pools';
import { env } from 'process';
import { defaultSource } from './sourceHelper';
// MySQL connection pool setup
require('dotenv').config();



export async function fetchTeacher(pool: Pool, teacherId: number): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) => {
        pool.query<RowDataPacket[]>('SELECT * FROM teachers WHERE id = ?', [teacherId], (error, results) => {
            if (error) {
                console.error('Error fetching teacher:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Teacher not found');
                return resolve(null);
            }
            resolve(results[0]);
        });
    });
}

//fetch Teachers and parse them to ServerTeacher type

export async function fetchAllTeachers(pool: Pool): Promise<ServerTeacher[]> {
    return new Promise((resolve, reject) => {
        pool.query<RowDataPacket[]>('SELECT * FROM teachers WHERE enabled = 1', (error, results) => {
            console.log('error:', error);
            console.log('results:', results);
            if (error) {
                console.error('Error fetching teachers:', error);
                return reject(error);
            }
            const teachers: ServerTeacher[] = results.map((row) => ({
                serverId: row.id,
                name: row.name,
                phone: row.phone,
                email: row.email,
            }));
            resolve(teachers);
        });
    }
    );
}


//select first row from alfa_calendars table

export async function fetchAlfaCalendar(pool: Pool): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) => {
        pool.query<RowDataPacket[]>('SELECT * FROM alfa_calendars LIMIT 1', (error, results) => {
            if (error) {
                console.error('Error fetching alfa calendar:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Alfa calendar not found');
                return resolve(null);
            }
            console.log('Alfa calendar:', results[0]);
            resolve(results[0]);
        });
    });
}

//count distinc customer_id and teacher_id from alfa_calendars table

export async function countAlfaCalendars(pool: Pool, source: string): Promise<number> {
    const idsModel: TeacherIdModel[] = await TeacherHelper.getTeachersIdServerId(source);
    const teacherIds: number[] = idsModel.map((teacher) => Number(teacher.serverId));
    console.log('teacherIds:', teacherIds.length);
    
    return new Promise((resolve, reject) => {
        // Используем оператор IN для фильтрации по teacherIds
        pool.query<RowDataPacket[]>(
            'SELECT DISTINCT customer_id, teacher_id AS count FROM alfa_calendars WHERE teacher_id IN (?)',
            [teacherIds],
            (error, results) => {
                if (error) {
                    console.error('Error counting alfa calendars:', error);
                    return reject(error);
                }
                if (results.length === 0) {
                    console.log('No records found in alfa_calendars');
                    return resolve(0);
                }
                resolve(results[0].count);
            }
        );
    });
}



//select first row from alfa_customers table

export async function fetchAlfaCustomer(pool: Pool): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) => {
        pool.query<RowDataPacket[]>('SELECT * FROM alfa_customers LIMIT 1', (error, results) => {
            console.log('start alfa_customers');
            if (error) {
                console.error('Error fetching alfa customer:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Alfa customer not found');
                return resolve(null);
            }
            console.log('Alfa customer:', results[0]);
            console.log('WEb first', results[0].fields.web);
            resolve(results[0]);
        });
    });
}

//fetch boomies messages use bumess_messages table
// {
//     id: 9210445,
//     text: 'ping834',
//     bumess_chat_id: 10665,
//     status: '',
//     inbound: 1
//   },

export async function fetchBoomiesMessages(pool: Pool): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) =>
        pool.query<RowDataPacket[]>('SELECT id, text, bumess_chat_id, status, inbound FROM bumess_messages WHERE inbound = 1 ORDER BY id DESC LIMIT 10', (error, results) => {
            if (error) {
                console.error('Error fetching boomies messages:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Boomies messages not found');
                return resolve(null);
            }
            console.log('boomies messages:', results);
            resolve(results[0]);
        })
    );
}


//fetch boomies messages use bumess_messages table
// {
//     id: 9210445,
//     text: 'ping834',
//     bumess_chat_id: 10665,
//     status: '',
//     inbound: 1
//   },

//find bumes chat by id
export async function findBoomiesChat(pool: Pool, chatId: number): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject
    ) => {
        pool.query<RowDataPacket[]>('SELECT * FROM bumess_chats WHERE id = ?', [chatId], (error, results) => {
            if (error) {
                console.error('Error fetching boomies chat:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Boomies chat not found');
                return resolve(null);
            }
            console.log('boomies chat:', results);
            resolve(results[0]);
        });
    }
    );
}


// Chat: {
//     id: 10665,
//     bumess_project_id: 1,
//     chatable_id: 15597,
//     chatable_type: 'Modules\\GovorikaAlfa\\Entities\\AlfaChat',
//     created_at: 2021-09-26T11:59:30.000Z,
//     updated_at: 2022-02-04T18:53:38.000Z,
//     sub_project_id: 1
//   }



export async function fetchAllTables(pool: Pool, source: string = 'main'): Promise<RowDataPacket[]> {
    return new Promise((resolve, reject) => {
        const databaseName = 'main'; // Замените на имя вашей базы данных

        pool.query<RowDataPacket[]>(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
            [databaseName],
            (error, results) => {
                if (error) {
                    console.error('Error fetching table names:', error);
                    return reject(error);
                }
                console.log('List of tables:', results);
                resolve(results);
            }
        );
    });
}


//fetch from table 'bumess_chats';

export async function fetchBoomiesChats(pool: Pool): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) =>
        pool.query<RowDataPacket[]>('SELECT * FROM bumess_chats LIMIT 1', (error, results) => {
            if (error) {
                console.error('Error fetching boomies chats:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Boomies chats not found');
                return resolve(null);
            }
            console.log('boomies chats:', results);
            resolve(results[0]);
        })
    );
}

//fetch from table bumess_projects

export async function fetchBoomiesProjects(pool: Pool): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) =>
        pool.query<RowDataPacket[]>('SELECT * FROM bumess_projects LIMIT 10', (error, results) => {
            if (error) {
                console.error('Error fetching boomies projects:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Boomies projects not found');
                return resolve(null);
            }
            console.log('boomies projects:', results);
            resolve(results[0]);
        })
    );
}

//fetch from table alfa_messages

export async function fetchAlfaMessages(pool: Pool): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) =>
        pool.query<RowDataPacket[]>('SELECT * FROM alfa_messages LIMIT 10', (error, results) => {
            if (error) {
                console.error('Error fetching alfa messages:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Alfa messages not found');
                return resolve(null);
            }
            console.log('alfa messages:', results);
            resolve(results[0]);
        })
    );
}


//fetchTableColumns for Pool and table name

export async function fetchTableColumns(pool: Pool, tableName: string): Promise<RowDataPacket[]> {
    return new Promise((resolve, reject) => {
        pool.query<RowDataPacket[]>(
            `SELECT column_name FROM information_schema.columns WHERE table_name = ?`,
            [tableName],
            (error, results) => {
                if (error) {
                    console.error('Error fetching table columns:', error);
                    return reject(error);
                }
                console.log(`Columns for table ${tableName}:`, results);
                resolve(results);
            }
        );
    });
}

//fetch alfa_chats table

export async function fetchAlfaChats(pool: Pool): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) =>
        pool.query<RowDataPacket[]>('SELECT * FROM alfa_chats LIMIT 1', (error, results) => {
            if (error) {
                console.error('Error fetching alfa chats:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Alfa chats not found');
                return resolve(null);
            }
            console.log('alfa chats:', results);
            resolve(results[0]);
        })
    );
}

//find alfa chat by id
// Chat: {
//     id: 10665,
//     bumess_project_id: 1,
//     chatable_id: 15597,
//     chatable_type: 'Modules\\GovorikaAlfa\\Entities\\AlfaChat',
//     created_at: 2021-09-26T11:59:30.000Z,
//     updated_at: 2022-02-04T18:53:38.000Z,
//     sub_project_id: 1
//   }

export async function findAlfaChat(pool: Pool, chatId: number): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) => {
        pool.query<RowDataPacket[]>('SELECT * FROM alfa_chats WHERE id = ?', [chatId], (error, results) => {
            if (error) {
                console.error('Error fetching alfa chat:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Alfa chat not found');
                return resolve(null);
            }
            console.log('alfa chat:', results);
            resolve(results[0]);
        });
    });
}


//find active alfa_customers study_status_id = 1 and is_study = 1

export async function findActiveAlfaCustomers(pool: Pool): Promise<RowDataPacket | null> {
    return new Promise((resolve, reject) =>
        pool.query<RowDataPacket[]>('SELECT * FROM alfa_customers WHERE study_status_id = 1 AND is_study = 1', (error, results) => {
            if (error) {
                console.error('Error fetching active alfa customers:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('Active alfa customers not found');
                return resolve(null);
            }
            console.log('Count active alfa customers:', results.length);
            console.log('Active alfa customers:', results[0]);
            resolve(results[0]);
        })
    );
}


export async function findTeacherCustomerWithChats(pool: Pool, source: string): Promise<TeacherCustomerModel[] | null> {
    // Step 1: Get teachers for the specified source
    const idsModel: TeacherIdModel[] = await TeacherHelper.getTeachersIdServerId(source);
    const teacherIds: number[] = idsModel.map((teacher) => Number(teacher.serverId));

    if (teacherIds.length === 0) {
        console.log('No teacher IDs found.');
        return null;
    }

    let teacherCustomerModels: TeacherCustomerModel[] = [];
    const limit = 800;
    let offset = 0;

    return new Promise((resolve, reject) => {
        const placeholders = teacherIds.map(() => '?').join(', ');

        const fetchBatch = () => {
            const query = `
                SELECT DISTINCT ac.teacher_id, ac.customer_id, cust.name AS customer_name, cust.phone AS customer_phone, 
                       cust.email AS customer_email, cust.fields AS customer_web, 
                       chat.channel_id, chat.chat_id, chat.tracking_code
                FROM ${alfaCalendarsTable} AS ac
                JOIN ${alfaCustomersTable} AS cust ON ac.customer_id = cust.id
                LEFT JOIN ${alfaCustomerAlfaChat} AS acac ON ac.customer_id = acac.alfa_customer_id
                LEFT JOIN ${alfa_chats} AS chat ON acac.alfa_chat_id = chat.id
                WHERE ac.teacher_id IN (${placeholders})
                AND cust.study_status_id = 1 AND cust.is_study = 1
                LIMIT ${limit} OFFSET ${offset}
            `;

            console.log('Executing query with offset:', offset);
            pool.query<RowDataPacket[]>(query, teacherIds, (error, results) => {
                if (error) {
                    console.error('Error fetching teacher-customer data:', error);
                    return reject(error);
                }

                if (results.length === 0) {
                    console.log('No more records found.');
                    return resolve(teacherCustomerModels.length > 0 ? teacherCustomerModels : null);
                }

                console.log(`Fetched ${results.length} records.`, results[0]);
                results.forEach((result) => {
                    teacherCustomerModels.push({
                        source: defaultSource,
                        trackingCode: result.tracking_code,
                        chatId: result.chat_id,
                        channelId: result.channel_id,
                        teacherServerId: result.teacher_id,
                        customerId: result.customer_id,
                        customerName: result.customer_name,
                        customerPhones: result.customer_phone,
                        customerEmails: result.customer_email,
                        chatInfo: [{
                            channelId: result.channel_id,
                            chatId: result.chat_id,
                            trackingCode: result.tracking_code,
                        }],
                        isActive: true,
                    });
                });

                // Move to the next batch
                offset += limit;
                fetchBatch();
            });
        };

        // Start fetching batches
        fetchBatch();
    });
}



//find messages with full info use source and  lastMessageId
// SELECT
//  bm.id as messageId, 
// bm.text as messageText,
// ac.id as alfaChatId, 
// ac.chat_id as tgChatId,
// acac.alfa_customer_id as customerId,
// ac.channel as messageType
// FROM bumess_messages as bm INNER JOIN bumess_chats as bc 
// ON bm.bumess_chat_id = bc.id
// INNER JOIN alfa_chats as ac
// ON bc.chatable_id = ac.id
// INNER JOIN alfa_customer_alfa_chat as acac
// ON ac.id = acac.alfa_chat_id
// WHERE DATE(bm.created_at) = CURDATE() 
// AND inbound = 1 
// AND bm.id > 225590
// ORDER BY bm.id 
//not use teacher_id ony this request

export async function findMessagesWithFullInfo(pool: Pool, source: string, lastMessageId: number): Promise<RowDataPacket[] | null> {

    return new Promise((resolve, reject) => {

        const query = `
            SELECT bm.id as messageId, bm.text as messageText, ac.id as alfaChatId, ac.chat_id as tgChatId,
                   acac.alfa_customer_id as customerId, ac.channel as messageType
            FROM bumess_messages as bm
            INNER JOIN bumess_chats as bc ON bm.bumess_chat_id = bc.id
            INNER JOIN alfa_chats as ac ON bc.chatable_id = ac.id
            INNER JOIN alfa_customer_alfa_chat as acac ON ac.id = acac.alfa_chat_id
            WHERE DATE(bm.created_at) = CURDATE() AND inbound = 1 AND bm.id > ?
            ORDER BY bm.id
        `;

        pool.query<RowDataPacket[]>(query, [lastMessageId], (error, results) => {
            if (error) {
                console.error('Error fetching messages with full info:', error);
                return reject(error);
            }

            if (results.length === 0) {
                console.log('No messages found.');
                return resolve(null);
            }

            console.log(`Fetched ${results.length} messages.`, results[0]);
            resolve(results);
        });
    });
}


