
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
    chatEnabled?: boolean;
    unreadMessages?: number;
}
export interface TeacherInfoWithCustomer {
    teacherId: number;
    teacherName: string;
    teacherEmail: string;
    source: string;
    customers: CustomerInfo[];
    totalUnreadMessages?: number;
}

//chat messages model

export interface ChatMessagesModel {
    teacherId: number;
    orderNumber: number;
    customerId: string;
    messageType: string;
    attachemnt: string | null;
    isActive: boolean;
    serverDate: Date | null;
    additionalInfo: object | null;
    serverId: string;
    source: string;
    inBound: boolean;
    messageText: string;
}

export interface TeacherInfoModel {
    teacherId: number;
    teacherName: string;
    teacherEmail: string;
    customerName: string;
    customerEmails: string[];
    customerPhones: string[];
    customerId: string;
    chatInfo: string;
    source: string;
    chatId: string;
    realChatId: string;
  
  }

  export interface IChatMessage {
    clientId: number;
    text: string;
    timestamp: string;
    source: string;
    sender: string
    id: number;
    format: string;
  }


  export interface TeacherCustomerData {
    teacherId: number;
    teacherName: string;
    customerId: string;
    customerName: string;
    customerPhones: any;
    customerEmails: any;
    chatId: string;
    source: string;
    phone: string;
  }

  export interface ServerDataMessage {
    customer: TeacherCustomerData;
    message: string;
    isEmail: boolean;
    isFile: boolean;
  }