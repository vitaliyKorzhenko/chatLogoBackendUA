import { Op, Sequelize } from "sequelize";
import Teacher from "../models/Teacher";
import { ServerTeacher, TeacherCustomerData, TeacherCustomerModel, TeacherIdModel, TeacherInfoModel, TeacherInfoWithCustomer } from "../types";
import TeacherCustomer from "../models/Teacher_Customer";
import ChatLoader from "../models/ChatLoaders";
import ChatMessages from "../models/ChatMessages";
import {ChatMessagesModel} from "../types/index";
import { AnyARecord } from "dns";
import { defaultSource } from "../sourceHelper";

class TeacherHelper {
  // Метод для создания нового учителя
  static async createTeacher(data: {
    serverId: string;
    name: string;
    phone?: string;
    email?: string;
    source?: string;
    isActive?: boolean;
  }) {
    try {
      const newTeacher = await Teacher.create(data);
      console.log('New teacher created:', newTeacher.toJSON());
      return newTeacher;
    } catch (error) {
      console.error('Error creating new teacher:', error);
      throw error;
    }
  }

  // Метод для получения учителя по ID
  static async getTeacherById(id: number) {
    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        console.log('Teacher not found');
        return null;
      }
      return teacher;
    } catch (error) {
      console.error('Error fetching teacher by ID:', error);
      throw error;
    }
  }

  // Метод для получения всех учителей
  static async getAllTeachers() {
    try {
      const teachers = await Teacher.findAll();
      return teachers;
    } catch (error) {
      console.error('Error fetching all teachers:', error);
      throw error;
    }
  }

  // Метод для обновления информации об учителе
  static async updateTeacher(id: number, updateData: Partial<{
    serverId: string;
    name: string;
    phone?: string;
    email?: string;
    source?: string;
    isActive?: boolean;
  }>) {
    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        console.log('Teacher not found');
        return null;
      }
      await teacher.update(updateData);
      console.log('Teacher updated:', teacher.toJSON());
      return teacher;
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  }

  // Метод для "удаления" учителя по ID (устанавливает isActive в false)
  static async deleteTeacher(id: number) {
    try {
      const teacher = await Teacher.findByPk(id);
      if (!teacher) {
        console.log('Teacher not found');
        return null;
      }
      await teacher.update({ isActive: false });
      console.log('Teacher deactivated:', id);
      return teacher;
    } catch (error) {
      console.error('Error deactivating teacher:', error);
      throw error;
    }
  }

  //create Teachers use ServeTeacher [] array 
  static async syncTeachers(teachers: ServerTeacher[], source: string = 'main'): Promise<Teacher[]> {
    try {
        // Parse ServerTeacher to Teacher
        const teacherItems = teachers.map((teacher) => ({
            serverId: teacher.serverId,
            name: teacher.name,
            phone: teacher.phone,
            email: teacher.email,
            source: source,
            isActive: true,
        }));

        // Get existing teachers by serverId and source
        const serverIds: string[] = teachers.map(teacher => teacher.serverId.toString());
        const existingTeachers: Teacher[] = await Teacher.findAll({ where: { serverId: { [Op.in]: serverIds }, source: source } });

        // Create or update teachers
        const existingTeacherIds: string[] = existingTeachers.map(teacher => teacher.serverId.toString());

        // Обновить существующих учителей одним запросом
        await Teacher.update(
            {
                isActive: true,
            },
            {
                where: {
                    serverId: { [Op.in]: existingTeacherIds },
                    source: source
                }
            }
        );

        // Найти учителей, которых нужно создать
        const newTeachersData = teacherItems.filter(teacher => !existingTeacherIds.includes(teacher.serverId.toString()));
        const newTeachers = await Teacher.bulkCreate(newTeachersData);

        console.log('New teachers created:', newTeachers.map(teacher => teacher.toJSON()));
        return [...existingTeachers, ...newTeachers];
    } catch (error) {
        console.error('Error syncing teachers:', error);
        throw error;
    }
}



    static async getTeachersIdServerId(source: string = 'main'): Promise<TeacherIdModel[]> {
        try {
        const teachers = await Teacher.findAll({
            attributes: ['id', 'serverId'],
            where:{
                source: source
            }
        });
        let teacherModels: TeacherIdModel[] = teachers.map((teacher) => ({
            id: teacher.id,
            serverId: teacher.serverId,
        }));
        return teacherModels;
        } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
        }
    }

    //find teacher by serverId
    static async findTeacherByServerId(serverId: string): Promise<Teacher | null> {
        try {
        const teacher = await Teacher.findOne({
            where: {
            serverId,
            },
        });
        return teacher;
        } catch (error) {
        console.error('Error fetching teacher:', error);
        throw error;
        }
    }

    //find teacher by email
    static async findTeacherByEmail(email: string): Promise<Teacher | null> {
        try {
        const teacher = await Teacher.findOne({
            where: {
            email,
            },
        });
        return teacher;
        } catch (error) {
        console.error('Error fetching teacher:', error);
        throw error;
        }
    }

    //find teachers by source
    static async findTeachersBySource(source: string): Promise<Teacher[]> {
        try {
        const teachers = await Teacher.findAll({
            where: {
            source,
            },
        });
        return teachers;
        } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
        }
    }


    
    static async createTeacherCustomerIfNotExist(teacherCustomer: TeacherCustomerModel[], source: string) {
        try {
            // Get teachers for source
            const teachers = await TeacherHelper.findTeachersBySource(source);
            const teacherIds = teachers.map((teacher) => teacher.id);
    
            // Fetch existing teacher customers
            const existingTeacherCustomers = await TeacherCustomer.findAll({
                where: {
                    teacherId: { [Op.in]: teacherIds },
                },
            });
    
            let newTeacherCustomerData: any[] = [];
    
            for (let i = 0; i < teacherCustomer.length; i++) {
                let teacher = teachers.find((item) => item.serverId == teacherCustomer[i].teacherServerId.toString());
                if (teacher) {
                    let currentTeacherCustomer = existingTeacherCustomers.find(
                        (item) =>
                            item.customerId == teacherCustomer[i].customerId.toString() &&
                            item.teacherId == teacher.id
                    );
    
                    if (!currentTeacherCustomer) {
                        newTeacherCustomerData.push({
                            teacherId: teacher.id,
                            customerId: teacherCustomer[i].customerId,
                            customerName: teacherCustomer[i].customerName,
                            customerPhones: teacherCustomer[i].customerPhones?.length
                                ? teacherCustomer[i].customerPhones
                                : Sequelize.literal('ARRAY[]::text[]'), // Handle empty array
                            customerEmails: teacherCustomer[i].customerEmails?.length
                                ? teacherCustomer[i].customerEmails
                                : Sequelize.literal('ARRAY[]::text[]'), // Handle empty array
                            chatInfo: teacherCustomer[i].chatInfo,
                            isActive: true,
                            source: source,
                            channelId: teacherCustomer[i].channelId,
                            chatId: teacherCustomer[i].chatId,
                            trackingCode: teacherCustomer[i].trackingCode,
                        });
                    }
                }
            }
    
            console.log('NEW CUSTOMER LENGTH', newTeacherCustomerData.length);
            console.log('First New Teacher Customer:', newTeacherCustomerData[0]);
    
            // Bulk create new teacher customers
            const newTeacherCustomers = await TeacherCustomer.bulkCreate(newTeacherCustomerData);
            console.log('new First Teacher Customer:', newTeacherCustomers[0]);
    
            return [...existingTeacherCustomers, ...newTeacherCustomers];
        } catch (error) {
            console.error('Error creating teacher customers:', error);
            throw error;
        }
    }
    

    //create teacher info with teacher customers (by email teacher)

     //find by teacherId and source array customersId + count unread messages (isRead = false or null) + total unread messages use only Table ChatMessages
     static async findCustomersIdAndUnreadMessagesByTeacherIdAndSource(teacherId: number, source: string): Promise<any[]> {
        try {
            //ChatMessages groupBy teacherId, customerId, then count unread messages, and count toal unread messages
        const customers = await ChatMessages.findAll({
            attributes: ['customerId', [Sequelize.fn('COUNT', Sequelize.col('isRead')), 'unreadMessages']],
            where: {
            teacherId: teacherId,
            source: source,
            isRead: {
                [Op.or]: [false, null]
            }
            },
            group: ['customerId'],
            raw: true
        });
        return customers
            
        } catch (error) {
            return [];
        }
    }

    static async findTeacherInfoWithCustomersByEmail(email: string): Promise<TeacherInfoWithCustomer | null> {
        try {
        const teacher = await TeacherHelper.findTeacherByEmail(email);
        if (!teacher) {
            console.log('Teacher not found');
            return null;
        }

        const teacherCustomers = await TeacherCustomer.findAll({
            where: {
            teacherId: teacher.id,
            isActive: true,
            },
            raw: true
        });
        let teacherInfoWithCustomer: TeacherInfoWithCustomer = {
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherEmail: teacher.email ?? '',
            source: teacher.source ?? '',
            customers: []
        };

        //step 2 - find customersId and unread messages
        const customersIdAndUnreadMessages = await TeacherHelper.findCustomersIdAndUnreadMessagesByTeacherIdAndSource(teacher.id, defaultSource);
        console.log('CustomersIdAndUnreadMessages:', customersIdAndUnreadMessages);
        //add customers to teacherInfoWithCustomer
        let totalUnreadMessages = 0;
        teacherCustomers.forEach((item) => {
            //find customer in customersIdAndUnreadMessages
            let customer = customersIdAndUnreadMessages.find((element) => element.customerId == item.customerId);
            teacherInfoWithCustomer.customers.push({
              customerId: Number(item.customerId),
              customerName: item.customerName,
              customerEmails: item.customerEmails ? [item.customerEmails]: [],
              customerPhones: item.customerPhones ? [item.customerPhones] : [],
              chatInfo: '',
              //chat enabled if realChatId or realPhone not null
              chatEnabled: item.realChatId || item.realPhone ? true : false,
              unreadMessages: customer && customer.unreadMessages ? Number(customer.unreadMessages) : 0
              
            });
            if (customer && customer.unreadMessages) {
                totalUnreadMessages += Number(customer.unreadMessages);
            }
        });
        teacherInfoWithCustomer.totalUnreadMessages = totalUnreadMessages;
        return teacherInfoWithCustomer;
        } catch (error) {
        console.error('Error fetching teacher info with customers:', error);
        throw error;
        }
    }

   



    //find chat Loader by source

    static async findChatLoaderBySource(source: string): Promise<ChatLoader | null> {
        try {
        const chatLoader = await ChatLoader.findOne({
            where: {
            source: source
            },
            raw: true
        });
        return chatLoader;
        } catch (error) {
        console.error('Error fetching chat loader:', error);
        throw error;
        }
    }

    //update Chat Loader by source (serverId, orderNumber)

    static async updateChatLoaderBySource(source: string, serverId: string, orderNumber: number): Promise<ChatLoader | null> {
        try {
     
          //update chat loader where source = source
        const chatLoader = await ChatLoader.findOne({
            where: {
            source: source
            }
        });
        if (!chatLoader) {
            console.log('Chat Loader not found');
            return null;
        }
        await chatLoader.update({
            serverId: serverId,
            orderNumber: orderNumber
        });

        console.log('Chat Loader updated:', chatLoader.toJSON());
        return chatLoader;
        } catch (error) {
        console.error('Error updating chat loader:', error);
        throw error;
        }
    }

    //create Chat Messages use ChatMessagesModel[] array (and update chat loader)
    static async createChatMessages(chatMessages: ChatMessagesModel[], source: string) {
        try {
        const chatLoader = await TeacherHelper.findChatLoaderBySource(source);
        if (!chatLoader) {
            console.log('Chat Loader not found');
            return null;
        }
        let newChatMessagesData: any[] = [];
        for (let i = 0; i < chatMessages.length; i++) {
            newChatMessagesData.push({
            messageText: chatMessages[i].messageText,
            teacherId: chatMessages[i].teacherId,
            orderNumber: chatMessages[i].orderNumber,
            customerId: chatMessages[i].customerId,
            messageType: chatMessages[i].messageType,
            attachemnt: chatMessages[i].attachemnt,
            isActive: true,
            serverDate: new Date(),
            additionalInfo: chatMessages[i].additionalInfo,
            source: source,
            serverId : chatMessages[i].serverId,
            });
        }
        const newChatMessages = await ChatMessages.bulkCreate(newChatMessagesData);
        console.log('New chat messages created:', newChatMessages.map((item) => item.toJSON()));
        await TeacherHelper.updateChatLoaderBySource(source, chatMessages[chatMessages.length - 1].serverId, chatMessages[chatMessages.length - 1].orderNumber);
        return newChatMessages;
        } catch (error) {
        console.error('Error creating chat messages:', error);
        throw error;
        }
    }


    //find teachers by customer id and source 
    static async findTeacherByCustomerIdAndSource(customerId: string, source: string): Promise<TeacherCustomer | null> {
        try {
        const teacherCustomer = await TeacherCustomer.findOne({
            where: {
            customerId : customerId,
            source: source,
            isActive: true
            }
        });
        if (!teacherCustomer) {
            console.log('Teacher Customer not found');
            return null;
        }
        return teacherCustomer;
       
        } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
        }
    }

    //find all teachers customer by customerIds array and source
    static async findTeacherCustomersByCustomerIdsAndSource(customerIds: string[], source: string): Promise<TeacherCustomer[]> {
        try {
        const teacherCustomers = await TeacherCustomer.findAll({
            where: {
            customerId: { [Op.in]: customerIds },
            source: source,
            isActive: true
            },
            raw: true
        });
        return teacherCustomers;
        } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
        }
    }
    //find ChatMessages by teacherId and customerId and source

    static async findChatMessagesByTeacherIdAndCustomerIdAndSource(teacherId: number, customerId: string, limit: number  = 50): Promise<ChatMessages[]> {
        try {
        const chatMessages = await ChatMessages.findAll({
            where: {
            teacherId: teacherId,
            customerId: customerId,
            },
            raw: true,
            limit: limit,
        });
        return chatMessages;
        } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
        }
    }
    
    //update ChatMessages isRead (set -> true) by teacherId and customerId and source

    static async updateChatMessagesIsReadByTeacherIdAndCustomerIdAndSource(teacherId: number, customerId: string, source: string): Promise<boolean | null> {
        try {
        await ChatMessages.update(
            {
            isRead: true
            },
            {
            where: {
                teacherId: teacherId,
                customerId: customerId,
                source: source
            }
        }
        );

            
        return true;
        } catch (error) {
        console.error('Error updating chat messages:', error);
            return false

        }
    }


    //create ChatMessages use teacherId, customerId, messageText, messageType, source
    static async createChatMessage(teacherId: number, customerId: string, messageText: string, messageType: string, source: string, sender: string, isFile: boolean = false): Promise<ChatMessages | null>  {
        try {
        const newChatMessage = await ChatMessages.create({
            messageText,
            teacherId,
            customerId,
            messageType,
            source,
            isActive: true,
            serverDate: new Date(),
            sender: sender,
            serverId: '0',
            format: isFile ? 'file' : 'text'
        });
        console.log('New chat message created:', newChatMessage.toJSON());
        return newChatMessage;
        } 
        catch (error) {
        console.error('Error creating chat message:', error);
        return null;
        }
    }


    //find customer name and customer email by customerId and teacherId

    static async findCustomerAndTeacherNameAndEmailByCustomerIdAndTeacherId(customerId: string, teacherId: number): Promise<TeacherCustomerData | null> {
        try {
        const teacherCustomer = await TeacherCustomer.findOne({
            where: {
            customerId: customerId,
            teacherId: teacherId,
            isActive: true
            },
            raw: true
        });
        if (!teacherCustomer) {
            console.log('Teacher Customer not found');
            return null;
        }
        console.log('===============FIND TEACHER CUSTOMER ==============', teacherCustomer);
        //find teacher by teacherId
        const teacher = await TeacherHelper.getTeacherById(teacherCustomer.teacherId);
        if (!teacher) {
            console.log('Teacher not found');
            return null;
        }
        //add teacher name and email to teacherCustomer
        //parse {vitaliy@gmail.com, nextemail@gmail.com}
        let emails = teacherCustomer && teacherCustomer.customerEmails ? teacherCustomer.customerEmails : [];
       let result: TeacherCustomerData = {
        customerEmails: emails,
        customerName: teacherCustomer.customerName,
        teacherName: teacher.name,
        teacherId: teacher.id,
        customerId: teacherCustomer.customerId,
        chatId: teacherCustomer.realChatId ? teacherCustomer.realChatId : '',
        source: defaultSource,
        customerPhones: teacherCustomer.customerPhones,
        phone: teacherCustomer.realPhone ? teacherCustomer.realPhone : ''
    }
        return result;
        } catch (error) {
        console.error('========== ERROR findCustomerAndTeacherNameAndEmailByCustomerIdAndTeacherId ==========:', error);
        return null;
        }
    }
    

    //find teacher customer (with teacher info - teacher name id) by chatId

    
    static async findTeacherCustomerByChatId(chatId: string): Promise<TeacherInfoModel | null> {
        try {
        const teacherCustomer = await TeacherCustomer.findOne({
            where: 
            {
            chatId: chatId,
            isActive: true
            },
            raw: true
        });
        if (!teacherCustomer) {
            console.log('Teacher Customer not found');
            return null;
        }
        //find teacher by teacherId
        const teacher = await TeacherHelper.getTeacherById(teacherCustomer.teacherId);

        if (!teacher) {
            console.log('Teacher not found');
            return null;
        }
        let resultInfo: TeacherInfoModel = {
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherEmail: teacher.email ?? '',
            customerName: teacherCustomer.customerName,
            customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails]: [],
            customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
            customerId: teacherCustomer.customerId,
            chatInfo: teacherCustomer.chatInfo,
            source: teacherCustomer.source,
            chatId: teacherCustomer.chatId,
            realChatId: teacherCustomer.realChatId
        }

        return resultInfo;
        } catch (error) {
        console.error('Error fetching teacher customer:', error);
          return null;
        }
    } 

    ///find teacher customer (with teacher info - teacher name id) by realChatId
    static async findTeacherCustomerByRealChatId(realChatId: string): Promise<TeacherInfoModel | null> {
        try {
        const teacherCustomer = await TeacherCustomer.findOne({
            where: 
            {
            realChatId: realChatId,
            isActive: true
            },
            raw: true
        });
        if (!teacherCustomer) {
            console.log('Teacher Customer not found');
            return null;
        }
        //find teacher by teacherId
        const teacher = await TeacherHelper.getTeacherById(teacherCustomer.teacherId);

        if (!teacher) {
            console.log('Teacher not found');
            return null;
        }
        let resultInfo: TeacherInfoModel = {
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherEmail: teacher.email ?? '',
            customerName: teacherCustomer.customerName,
            customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails]: [],
            customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
            customerId: teacherCustomer.customerId,
            chatInfo: teacherCustomer.chatInfo,
            source: teacherCustomer.source,
            chatId: teacherCustomer.chatId,
            realChatId: teacherCustomer.realChatId
        }

        return resultInfo;
        } catch (error) {
        console.error('Error fetching teacher customer:', error);
          return null;
        }
    }

    //find teacher customer (with teacher info) by teacherId and customerId
    static async findTeacherCustomerByTeacherIdAndCustomerId(teacherId: number, customerId: string): Promise<TeacherInfoModel | null> {
        try {
        const teacherCustomer = await TeacherCustomer.findOne({
            where: {
            customerId: customerId,
            teacherId: teacherId,
            isActive: true
            },
            raw: true
        });
        if (!teacherCustomer) {
            console.log('Teacher Customer not found');
            return null;
        }
        //find teacher by teacherId
        const teacher = await TeacherHelper.getTeacherById(teacherCustomer.teacherId);

        if (!teacher) {
            console.log('Teacher not found');
            return null;
        }
        let resultInfo: TeacherInfoModel = {
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherEmail: teacher.email ?? '',
            customerName: teacherCustomer.customerName,
            customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails]: [],
            customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
            customerId: teacherCustomer.customerId,
            chatInfo: teacherCustomer.chatInfo,
            source: teacherCustomer.source,
            chatId: teacherCustomer.chatId,
            realChatId: teacherCustomer.realChatId
        }

        return resultInfo;
        } catch (error) {
        console.error('Error fetching teacher customer:', error);
          return null;
        }
    }

    //upudate realChatId   by customerId and teacherId 
    static async updateRealChatIdByCustomerIdAndTeacherId(customerId: string, teacherId: number, realChatId: string): Promise<TeacherCustomer | null> {
        try {
        const teacherCustomer = await TeacherCustomer.findOne({
            where: {
            customerId: customerId,
            teacherId: teacherId,
            isActive: true
            }
        });
        if (!teacherCustomer) {
            console.log('Teacher Customer not found');
            return null;
        }
        await teacherCustomer.update({
            realChatId: realChatId
        });
        console.log('Teacher Customer updated:', teacherCustomer.toJSON());
        return teacherCustomer;
        } catch (error) {
        console.error('Error updating teacher customer:', error);
        throw error;
        }
    }

    //find teacher customer (teacher info TeacherInfoModel) by customerId and teacherId
    static async findTeacherCustomerByCustomerIdAndTeacherId(customerId: string, teacherId: number): Promise<TeacherInfoModel | null> {
        try {
        const teacherCustomer = await TeacherCustomer.findOne({
            where: {
            customerId: customerId,
            teacherId: teacherId,
            isActive: true
            },
            raw: true
        });
        if (!teacherCustomer) {
            console.log('Teacher Customer not found');
            return null;
        }
        //find teacher by teacherId
        const teacher = await TeacherHelper.getTeacherById(teacherCustomer.teacherId);

        if (!teacher) {
            console.log('Teacher not found');
            return null;
        }
        let resultInfo: TeacherInfoModel = {
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherEmail: teacher.email ?? '',
            customerName: teacherCustomer.customerName,
            customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails]: [],
            customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
            customerId: teacherCustomer.customerId,
            chatInfo: teacherCustomer.chatInfo,
            source: teacherCustomer.source,
            chatId: teacherCustomer.chatId,
            realChatId: teacherCustomer.realChatId
        }

        return resultInfo;
        } catch (error) {
        console.error('Error fetching teacher customer:', error);
          return null;
        }
    }



    //find teacher customer by phone (teacher info TeacherInfoModel)
    
    static async findTeacherCustomerByPhone(phone: string): Promise<TeacherInfoModel | null> {
        try {
            // Нормализуем телефон: убираем символ '+' и любые нечисловые символы
            const normalizedPhone = phone.replace(/\D/g, ''); 
        
            console.log(`Normalized phone for search: ${normalizedPhone}`);
        
            // Ищем клиента в базе данных
            const teacherCustomer = await TeacherCustomer.findOne({
                where: {
                    [Op.and]: [
                        Sequelize.literal(
                            `'${normalizedPhone}' = ANY(string_to_array("customerPhones", ','))`
                        ),
                        { isActive: true }
                    ]
                },
                raw: true
            });
        
            if (!teacherCustomer) {
                console.log('Teacher Customer not found');
                return null;
            }
        
            // Ищем учителя по teacherId
            const teacher = await TeacherHelper.getTeacherById(teacherCustomer.teacherId);
        
            if (!teacher) {
                console.log('Teacher not found');
                return null;
            }
        
            // Собираем итоговую информацию
            const resultInfo: TeacherInfoModel = {
                teacherId: teacher.id,
                teacherName: teacher.name,
                teacherEmail: teacher.email ?? '',
                customerName: teacherCustomer.customerName,
                customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails] : [],
                customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
                customerId: teacherCustomer.customerId,
                chatInfo: teacherCustomer.chatInfo,
                source: teacherCustomer.source,
                chatId: teacherCustomer.chatId,
                realChatId: teacherCustomer.realChatId
            };
        
            return resultInfo;
    
        } catch (error) {
            console.error('Error fetching teacher customer:', error);
            return null;
        }
    }
    
    
    
  }


export default TeacherHelper;
