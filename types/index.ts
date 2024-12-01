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

export interface TeacherCustomerModel {
    teacherServerId: number;
     customerId: string;
     customerName: string;
     customerPhones: string[] | null;
     customerEmails: string[] | null;
     chatInfo: Record<string, any> | null;
     chatId: string;
     source: string;
     channelId: string;
     trackingCode: string;
    isActive: boolean;
}


export interface CustomerInfo {
    customerId: number;
    customerName: string;
    customerPhones: string[];
    customerEmails: string[];
    chatInfo: string;
}
export interface TeacherInfoWithCustomer {
    teacherId: number;
    teacherName: string;
    teacherEmail: string;
    source: string;
    customers: CustomerInfo[];
}