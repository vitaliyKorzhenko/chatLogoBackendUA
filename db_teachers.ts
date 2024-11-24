import mysql, { Pool, RowDataPacket } from 'mysql2';
import { ServerTeacher, TeacherIdModel } from './types';
import TeacherHelper from './helpers/teacherHelper';
import { alfaCalendarsTable, alfaCustomersTable } from './db_pools';
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
            resolve(results[0]);
        });
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






export async function findTeacherCustomer(pool: Pool): Promise<RowDataPacket[] | null> {
    const idsModel: TeacherIdModel[] = await TeacherHelper.getTeachersIdServerId();
    const teacherIds: number[] = idsModel.map((teacher) => Number(teacher.serverId));

    if (teacherIds.length === 0) {
        console.log('No teacher IDs found.');
        return null;
    }

    return new Promise((resolve, reject) => {
        const placeholders = teacherIds.map(() => '?').join(', ');


        const query = `
            SELECT DISTINCT ac.teacher_id, ac.customer_id, cust.name AS customer_name, cust.phone AS customer_phone, cust.email AS customer_email, cust.fields AS customer_web
            FROM ${alfaCalendarsTable} AS ac
            JOIN ${alfaCustomersTable} AS cust ON ac.customer_id = cust.id
            WHERE ac.teacher_id IN (${placeholders})
            LIMIT 100
        `;
        console.log('Start query:', query);
        pool.query<RowDataPacket[]>(query, teacherIds, (error, results) => {
            console.log('error:', error);
            if (error) {
                console.error('Error fetching teacher-customer data:', error);
                return reject(error);
            }
            if (results.length === 0) {
                console.log('No records found for the given teachers.');
                return resolve(null);
            }
            console.log('first result:', results[0]);
            resolve(results);
        });
    });
}
