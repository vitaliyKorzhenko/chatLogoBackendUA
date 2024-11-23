import { json } from "sequelize";

export interface ServerTeacher {
    serverId: number;
    name: string;
    email: string;
    phone: string;
}

export interface ServerTeacherCustomers {
    teacherId: number;
    customerId: number;
    customerName: string;
    customerPhones: string[];
    customerEmails: string[];
    chatInfo: string;
}

export interface TeacherIdModel {
    id: number;
    serverId: string;
}
