"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTeacher = fetchTeacher;
exports.fetchAllTeachers = fetchAllTeachers;
exports.fetchAlfaCalendar = fetchAlfaCalendar;
exports.countAlfaCalendars = countAlfaCalendars;
exports.fetchAlfaCustomer = fetchAlfaCustomer;
exports.fetchBoomiesMessages = fetchBoomiesMessages;
exports.findBoomiesChat = findBoomiesChat;
exports.fetchAllTables = fetchAllTables;
exports.fetchBoomiesChats = fetchBoomiesChats;
exports.fetchBoomiesProjects = fetchBoomiesProjects;
exports.fetchAlfaMessages = fetchAlfaMessages;
exports.fetchTableColumns = fetchTableColumns;
exports.fetchAlfaChats = fetchAlfaChats;
exports.findAlfaChat = findAlfaChat;
exports.findActiveAlfaCustomers = findActiveAlfaCustomers;
exports.findTeacherCustomerWithChats = findTeacherCustomerWithChats;
exports.findMessagesWithFullInfo = findMessagesWithFullInfo;
const teacherHelper_1 = __importDefault(require("./helpers/teacherHelper"));
const db_pools_1 = require("./db_pools");
const sourceHelper_1 = require("./sourceHelper");
// MySQL connection pool setup
require('dotenv').config();
function fetchTeacher(pool, teacherId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM teachers WHERE id = ?', [teacherId], (error, results) => {
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
    });
}
//fetch Teachers and parse them to ServerTeacher type
function fetchAllTeachers(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM teachers WHERE enabled = 1', (error, results) => {
                console.log('error:', error);
                console.log('results:', results);
                if (error) {
                    console.error('Error fetching teachers:', error);
                    return reject(error);
                }
                const teachers = results.map((row) => ({
                    serverId: row.id,
                    name: row.name,
                    phone: row.phone,
                    email: row.email,
                }));
                resolve(teachers);
            });
        });
    });
}
//select first row from alfa_calendars table
function fetchAlfaCalendar(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM alfa_calendars LIMIT 1', (error, results) => {
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
    });
}
//count distinc customer_id and teacher_id from alfa_calendars table
function countAlfaCalendars(pool, source) {
    return __awaiter(this, void 0, void 0, function* () {
        const idsModel = yield teacherHelper_1.default.getTeachersIdServerId(source);
        const teacherIds = idsModel.map((teacher) => Number(teacher.serverId));
        console.log('teacherIds:', teacherIds.length);
        return new Promise((resolve, reject) => {
            // Используем оператор IN для фильтрации по teacherIds
            pool.query('SELECT DISTINCT customer_id, teacher_id AS count FROM alfa_calendars WHERE teacher_id IN (?)', [teacherIds], (error, results) => {
                if (error) {
                    console.error('Error counting alfa calendars:', error);
                    return reject(error);
                }
                if (results.length === 0) {
                    console.log('No records found in alfa_calendars');
                    return resolve(0);
                }
                resolve(results[0].count);
            });
        });
    });
}
//select first row from alfa_customers table
function fetchAlfaCustomer(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM alfa_customers LIMIT 1', (error, results) => {
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
function fetchBoomiesMessages(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => pool.query('SELECT id, text, bumess_chat_id, status, inbound FROM bumess_messages WHERE inbound = 1 ORDER BY id DESC LIMIT 10', (error, results) => {
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
        }));
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
//find bumes chat by id
function findBoomiesChat(pool, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM bumess_chats WHERE id = ?', [chatId], (error, results) => {
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
        });
    });
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
function fetchAllTables(pool_1) {
    return __awaiter(this, arguments, void 0, function* (pool, source = 'main') {
        return new Promise((resolve, reject) => {
            const databaseName = 'main'; // Замените на имя вашей базы данных
            pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = ?`, [databaseName], (error, results) => {
                if (error) {
                    console.error('Error fetching table names:', error);
                    return reject(error);
                }
                console.log('List of tables:', results);
                resolve(results);
            });
        });
    });
}
//fetch from table 'bumess_chats';
function fetchBoomiesChats(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => pool.query('SELECT * FROM bumess_chats LIMIT 1', (error, results) => {
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
        }));
    });
}
//fetch from table bumess_projects
function fetchBoomiesProjects(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => pool.query('SELECT * FROM bumess_projects LIMIT 10', (error, results) => {
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
        }));
    });
}
//fetch from table alfa_messages
function fetchAlfaMessages(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => pool.query('SELECT * FROM alfa_messages LIMIT 10', (error, results) => {
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
        }));
    });
}
//fetchTableColumns for Pool and table name
function fetchTableColumns(pool, tableName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = ?`, [tableName], (error, results) => {
                if (error) {
                    console.error('Error fetching table columns:', error);
                    return reject(error);
                }
                console.log(`Columns for table ${tableName}:`, results);
                resolve(results);
            });
        });
    });
}
//fetch alfa_chats table
function fetchAlfaChats(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => pool.query('SELECT * FROM alfa_chats LIMIT 1', (error, results) => {
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
        }));
    });
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
function findAlfaChat(pool, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM alfa_chats WHERE id = ?', [chatId], (error, results) => {
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
    });
}
//find active alfa_customers study_status_id = 1 and is_study = 1
function findActiveAlfaCustomers(pool) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => pool.query('SELECT * FROM alfa_customers WHERE study_status_id = 1 AND is_study = 1', (error, results) => {
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
        }));
    });
}
function findTeacherCustomerWithChats(pool, source) {
    return __awaiter(this, void 0, void 0, function* () {
        // Step 1: Get teachers for the specified source
        const idsModel = yield teacherHelper_1.default.getTeachersIdServerId(source);
        const teacherIds = idsModel.map((teacher) => Number(teacher.serverId));
        if (teacherIds.length === 0) {
            console.log('No teacher IDs found.');
            return null;
        }
        let teacherCustomerModels = [];
        const limit = 800;
        let offset = 0;
        return new Promise((resolve, reject) => {
            const placeholders = teacherIds.map(() => '?').join(', ');
            const fetchBatch = () => {
                const query = `
                SELECT DISTINCT ac.teacher_id, ac.customer_id, cust.name AS customer_name, cust.phone AS customer_phone, 
                       cust.email AS customer_email, cust.fields AS customer_web, 
                       chat.channel_id, chat.chat_id, chat.tracking_code
                FROM ${db_pools_1.alfaCalendarsTable} AS ac
                JOIN ${db_pools_1.alfaCustomersTable} AS cust ON ac.customer_id = cust.id
                LEFT JOIN ${db_pools_1.alfaCustomerAlfaChat} AS acac ON ac.customer_id = acac.alfa_customer_id
                LEFT JOIN ${db_pools_1.alfa_chats} AS chat ON acac.alfa_chat_id = chat.id
                WHERE ac.teacher_id IN (${placeholders})
                AND cust.study_status_id = 1 AND cust.is_study = 1
                LIMIT ${limit} OFFSET ${offset}
            `;
                console.log('Executing query with offset:', offset);
                pool.query(query, teacherIds, (error, results) => {
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
                            source: sourceHelper_1.defaultSource,
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
function findMessagesWithFullInfo(pool, source, lastMessageId) {
    return __awaiter(this, void 0, void 0, function* () {
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
            pool.query(query, [lastMessageId], (error, results) => {
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
    });
}
