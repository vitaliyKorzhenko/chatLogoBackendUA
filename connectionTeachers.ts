import { Socket } from 'socket.io';

interface ConnectionTeacherModel {
  socketId: string;
  email: string;
  socket: Socket;
  teacherId: number;
}

export class ConnectionTeacher {
  public static connections: ConnectionTeacherModel[] = [];

  // Add new connection teacher
  public static addNewConnectionTeacher(socket: Socket, email: string, teacherId: number) {
    console.log('New connection teacher:', socket.id);
    this.connections.push({
      socketId: socket.id,
      email,
      socket,
      teacherId,
    });
  }

  // Update connection teacher
  public static updateConnectionTeacher(socket: Socket, email: string, teacherId: number) {
    const index = this.connections.findIndex((connection) => connection.socket.id === socket.id);
    if (index !== -1) {
      this.connections[index] = {
        socketId: socket.id,
        email,
        socket,
        teacherId,
      };
    }
  }

  // Find connection teacher by socket
  public static findConnectionTeacherBySocket(socket: Socket) {
    return this.connections.find((connection) => connection.socket.id === socket.id);
  }

  // Find connection teacher by email
  public static findConnectionTeacherByEmail(email: string) {
    return this.connections.find((connection) => connection.email === email);
  }

  // Find connection teacher by socketId
  public static findConnectionTeacherBySocketId(socketId: string) {
    return this.connections.find((connection) => connection.socketId === socketId);
  }

  // Find connection teacher by teacherId
  public static findConnectionTeacherByTeacherId(teacherId: number) {
    return this.connections.filter((connection) => connection.teacherId === teacherId);
  }

  // Add or update connection teacher
  public static addOrUpdateConnectionTeacher(socket: Socket, email: string, teacherId: number) {
    const existingConnection = this.findConnectionTeacherBySocket(socket);
    if (existingConnection) {
      this.updateConnectionTeacher(socket, email, teacherId);
    } else {
      this.addNewConnectionTeacher(socket, email, teacherId);
    }
  }

  // Remove connection teacher
  public static removeConnectionTeacher(socket: Socket) {
    const index = this.connections.findIndex((connection) => connection.socket.id === socket.id);
    if (index !== -1) {
      this.connections.splice(index, 1);
    }
  }
}
