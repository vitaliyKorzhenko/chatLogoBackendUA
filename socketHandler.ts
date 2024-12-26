import { Server, Socket } from 'socket.io';
import { ConnectionTeacher } from './connectionTeachers';
import TeacherHelper from './helpers/teacherHelper';
import { IChatMessage, TeacherCustomerData, TeacherInfoModel } from './types';
import { sendMessageToCentralServer } from './centralSocket';

// Переменная для хранения экземпляра io
let ioInstance: Server | null = null;

export async function notifyClientOfNewMessage(teacherId: number, customerId: string, message: IChatMessage) {
  try {
    // Step 1: Find teacher info by realChatId
    const teacherInfo: TeacherInfoModel | null = await TeacherHelper.findTeacherCustomerByCustomerIdAndTeacherId(customerId, teacherId);


    //get all connections
    let allConnections = ConnectionTeacher.connections;
    console.log('All connections:', allConnections);
    if (teacherInfo && teacherInfo.teacherId) {
      // Step 2: Find all sockets for the teacherId
      const connections = ConnectionTeacher.findConnectionTeacherByTeacherId(teacherInfo.teacherId);

      if (connections && connections.length > 0) {
        // Step 3: Notify all sockets

        connections.forEach((connection) => {
          connection.socket.emit('newMessage', { clientId: teacherInfo.customerId, message });
        });
      } else {
        console.warn(`No connections found for teacherId: ${teacherInfo.teacherId}`);
      }
    } else {
      console.warn(`No teacherInfo found for realChatId: ${customerId}${teacherId}`);
    }
  } catch (error) {
    console.error('Error in notifyClientOfNewMessage:', error);
  }
}


export default function socketHandler(io: Server) {
  // Сохраняем ioInstance для внешнего использования
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    //on connect add new connection


    // Add new connection
    socket.on('addNewConnection', ({ email, id, teacherId }) => {
      console.log('Add new connection:', email, id, teacherId);
      ConnectionTeacher.addOrUpdateConnectionTeacher(socket, email, teacherId);

      //beforea add new conection logs all connections
      let allConnections = ConnectionTeacher.connections;
      console.log('All connections:', allConnections);
    });

    socket.on('selectClient', async (data) => {
      console.log('Select client:', data);
      try {
        const { customerId, teacherId } = data;
        console.log('TeacherId, customerId:', teacherId, customerId);

        const messages = await TeacherHelper.findChatMessagesByTeacherIdAndCustomerIdAndSource(teacherId, customerId.toString());
        console.log('Messages:', messages.length);
        console.log('First message:', messages[0]);
        if (messages.length > 0) {
          socket.emit('clientMessages', {
            messages,
            clientId: customerId,
          });
        }
      } catch (error) {
        console.error('Error in selectClient:', error);
      }
    });

    socket.on('message', (msg) => {
      console.log('Message from user:', msg);
      io.emit('message', msg);
    });

    socket.on('send_message', async (data) => {
      try {
        console.warn('Send message:', data);
        const { customerId, teacherId, source, message } = data;
        await TeacherHelper.createChatMessage(
          teacherId,
          customerId,
          message.text,
          'tg',
          source,
          'teacher',
        );
     
        // Уведомляем фронт о новом сообщении
       // notifyClientOfNewMessage(customerId, message.text);
      } catch (error) {
        console.error('Error in send_message:', error);
      }
    });

    socket.on('message_from_teacher', async (data) => {
      try {
    
        console.warn('MESSAGE FROM TEACHER!', data);
        const { customerId, teacherId, source, message, isEmail } = data;
        await TeacherHelper.createChatMessage(
          teacherId,
          customerId,
          message.text,
          'tg',
          source,
          'teacher',
        );
        const teacherInfo: TeacherInfoModel | null = await TeacherHelper.findTeacherCustomerByCustomerIdAndTeacherId(customerId.toString(), Number(teacherId));
        console.log('TeacherInfo FIND!:', teacherInfo);
        if (teacherInfo?.realChatId?.length) {
         // sendMessage(teacherInfo.realChatId, message.text);
         const testEmails = ['vitaliykorzenkoua@gmail.com'];
         if (isEmail) {
          let currentCustomer: TeacherCustomerData | null = await TeacherHelper.findCustomerAndTeacherNameAndEmailByCustomerIdAndTeacherId(customerId.toString(), teacherId);
          //parse {vitaliy@gmail.com, nextemail@gmail.com}
          if (currentCustomer?.customerEmails) {
          
          sendMessageToCentralServer(message.text, teacherInfo.realChatId, true, currentCustomer.customerEmails, currentCustomer.customerName, currentCustomer.teacherName);
          }
         } else {
          sendMessageToCentralServer(message.text, teacherInfo.realChatId, false, [], '', '');
         }
        }
        // Уведомляем фронт о новом сообщении
       // notifyClientOfNewMessage(customerId, message.text);
      } catch (error) {
        console.error('Error in message_from_teacher:', error);
      }
    });

    socket.on('disconnect', () => {
      console.error('USER DISCONNECTED:', socket.id);
      ConnectionTeacher.removeConnectionTeacher(socket);
    });
  });
}
