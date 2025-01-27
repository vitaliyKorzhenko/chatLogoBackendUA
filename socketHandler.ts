import { Server, Socket } from 'socket.io';
import { ConnectionTeacher } from './connectionTeachers';
import TeacherHelper from './helpers/teacherHelper';
import { IChatMessage, TeacherCustomerData, TeacherInfoModel } from './types';
import { sendMessageToCentralServer } from './centralSocket';
import { defaultSource } from './sourceHelper';

// Variable to store the io instance
let ioInstance: Server | null = null;

export async function notifyClientOfNewMessage(teacherId: number, customerId: string, message: IChatMessage) {
  try {
    // Step 1: Find teacher info by realChatId
    const teacherInfo: TeacherInfoModel | null = await TeacherHelper.findTeacherCustomerByCustomerIdAndTeacherId(customerId, teacherId);

    // Get all connections
    const allConnections = ConnectionTeacher.connections;
    console.log('[Notify] All connections:', allConnections);

    if (teacherInfo && teacherInfo.teacherId) {
      // Step 2: Find all sockets for the teacherId
      const connections = ConnectionTeacher.findConnectionTeacherByTeacherId(teacherInfo.teacherId);

      if (connections && connections.length > 0) {
        // Step 3: Notify all sockets
        connections.forEach((connection) => {
          console.log(`[Notify] Sending message to socketId=${connection.socketId}`);
          connection.socket.emit('newMessage', { clientId: teacherInfo.customerId, message });
        });
      } else {
        console.warn(`[Notify] No connections found for teacherId: ${teacherInfo.teacherId}`);
      }
    } else {
      console.warn(`[Notify] No teacherInfo found for realChatId: ${customerId}${teacherId}`);
    }
  } catch (error) {
    console.error('[Notify] Error in notifyClientOfNewMessage:', error);
  }
}

function updatedConnections(socket: Socket, email: any, id: any, teacherId: any) {
  console.log('[Socket] Add new connection:', email, id, teacherId);
      ConnectionTeacher.addOrUpdateConnectionTeacher(socket, email, teacherId);

      const updatedConnections = ConnectionTeacher.connections;
      console.warn('[Socket] All connections after adding:', {
        total: updatedConnections.length,
        details: updatedConnections.map(({ socketId, email, teacherId }) => ({ socketId, email, teacherId }))
      });
}

export default function socketHandler(io: Server) {
  // Save ioInstance for external use
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    console.warn('[Socket] User connected:', socket.id + 'time: ' + new Date().toISOString());

    if (socket && socket.connected) {
      console.warn('[Socket] Conected socket EMIT confirmConnection' + 'time: ' + new Date().toISOString());
      socket.emit('confirmConnection', { message: 'Connected to server' });

    }
    // Log current connections
    const allConnections = ConnectionTeacher.connections;
    console.log('[Socket] Connections after new user connected:', {
      total: allConnections.length,
      details: allConnections.map(({ socketId, email, teacherId }) => ({ socketId, email, teacherId }))
    });

    // Add new connection
    socket.on('addNewConnection', ({ email, id, teacherId }) => {
      updatedConnections(socket, email, id, teacherId);
    });

    // Reconnect socket connection
    socket.on('reconnect_attempt', (attempt) => {
      console.warn(`[Socket] Reconnect attempt #${attempt} for socket ${socket.id}`);
      //updatedConnections(socket, socket.handshake.query.email, socket.handshake.query.id, socket.handshake.query.teacherId);
    });

    socket.on('reconnect', (attempt) => {
      console.log(`[Socket] Reconnected after ${attempt} attempts:`, socket.id);
    });

    socket.on('selectClient', async (data) => {
      console.log('[Socket] Select client:', data);
      try {
        const { customerId, teacherId } = data;
        console.log('[Socket] TeacherId, customerId:', teacherId, customerId);

        const messages = await TeacherHelper.findChatMessagesByTeacherIdAndCustomerIdAndSource(teacherId, customerId.toString(), 50);
        //update isRead status
        await TeacherHelper.updateChatMessagesIsReadByTeacherIdAndCustomerIdAndSource(teacherId, customerId.toString(), defaultSource);

        console.log('[Socket] Messages count:', messages.length);
        if (messages.length > 0) {
          socket.emit('clientMessages', {
            messages,
            clientId: customerId,
          });
        }
      } catch (error) {
        console.error('[Socket] Error in selectClient:', error);
      }
    });

    socket.on('message', (msg) => {
      console.log('[Socket] Message from user:', msg);
      io.emit('message', msg);
    });

    socket.on('send_message', async (data) => {
      try {
        console.warn('[Socket] Send message:', data);
        const { customerId, teacherId, source, message } = data;
        await TeacherHelper.createChatMessage(
          teacherId,
          customerId,
          message.text,
          'tg',
          source,
          'teacher',
        );
      } catch (error) {
        console.error('[Socket] Error in send_message:', error);
      }
    });

    socket.on('message_from_teacher', async (data) => {
      try {
        console.warn('[Socket] Message from teacher:', data);
        const { customerId, teacherId, source, message, isEmail, isFile } = data;
        await TeacherHelper.createChatMessage(
          teacherId,
          customerId,
          message.text,
          'tg',
          source,
          'teacher',
          isFile
        );

        const teacherInfo: TeacherInfoModel | null = await TeacherHelper.findTeacherCustomerByCustomerIdAndTeacherId(customerId.toString(), Number(teacherId));
        console.log('[Socket] TeacherInfo found:', teacherInfo);

        if (teacherInfo?.realChatId?.length) {
          const currentCustomer: TeacherCustomerData | null = await TeacherHelper.findCustomerAndTeacherNameAndEmailByCustomerIdAndTeacherId(customerId.toString(), teacherId);
          if (currentCustomer) {
            sendMessageToCentralServer({
              message: message.text,
              customer: currentCustomer,
              isEmail,
              isFile
            });
          }
        }
      } catch (error) {
        console.error('[Socket] Error in message_from_teacher:', error);
      }
    });

    socket.on('disconnect', () => {
      console.error('[Socket] User disconnected:', socket.id);
      ConnectionTeacher.removeConnectionTeacher(socket);
      const updatedConnections = ConnectionTeacher.connections;
      console.warn('[Socket] All connections after disconnection:', {
        total: updatedConnections.length,
        details: updatedConnections.map(({ socketId, email, teacherId }) => ({ socketId, email, teacherId }))
      });
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });
  });
}
