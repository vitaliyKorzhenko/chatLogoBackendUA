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
    console.log(`[Add] New connection teacher: socketId=${socket.id}, email=${email}, teacherId=${teacherId}`);
    this.connections.push({
      socketId: socket.id,
      email,
      socket,
      teacherId,
    });
    this.logConnections();
  }

  // Update connection teacher
  public static updateConnectionTeacher(socket: Socket, email: string, teacherId: number) {
    const index = this.connections.findIndex((connection) => connection.socket.id === socket.id);
    if (index !== -1) {
      console.log(`[Update] Updating connection: socketId=${socket.id}, email=${email}, teacherId=${teacherId}`);
      this.connections[index] = {
        socketId: socket.id,
        email,
        socket,
        teacherId,
      };
    } else {
      console.warn(`[Update] Connection not found for socketId=${socket.id}`);
    }
    this.logConnections();
  }

  // Find connection teacher by socket
  public static findConnectionTeacherBySocket(socket: Socket) {
    const connection = this.connections.find((connection) => connection.socket.id === socket.id);
    console.log(`[Find] Connection by socketId=${socket.id}:`, connection);
    return connection;
  }

  // Find connection teacher by email
  public static findConnectionTeacherByEmail(email: string) {
    const connection = this.connections.find((connection) => connection.email === email);
    console.log(`[Find] Connection by email=${email}:`, connection);
    return connection;
  }

  // Find connection teacher by socketId
  public static findConnectionTeacherBySocketId(socketId: string) {
    const connection = this.connections.find((connection) => connection.socketId === socketId);
    console.log(`[Find] Connection by socketId=${socketId}:`, connection);
    return connection;
  }

  // Find connection teacher by teacherId
  public static findConnectionTeacherByTeacherId(teacherId: number) {
    const connections = this.connections.filter((connection) => connection.teacherId === teacherId);
    console.log(`[Find] Connections by teacherId=${teacherId}:`, connections);
    return connections;
  }

  // Add or update connection teacher
  public static addOrUpdateConnectionTeacher(socket: Socket, email: string, teacherId: number) {
    const existingConnection = this.findConnectionTeacherBySocket(socket);
    if (existingConnection) {
      console.log(`[AddOrUpdate] Updating existing connection for socketId=${socket.id}`);
      this.updateConnectionTeacher(socket, email, teacherId);
    } else {
      console.log(`[AddOrUpdate] Adding new connection for socketId=${socket.id}`);
      this.addNewConnectionTeacher(socket, email, teacherId);
    }
  }

  // Remove connection teacher
  public static removeConnectionTeacher(socket: Socket) {
    const index = this.connections.findIndex((connection) => connection.socket.id === socket.id);
    if (index !== -1) {
      console.log(`[Remove] Removing connection for socketId=${socket.id}`);
      this.connections.splice(index, 1);
    } else {
      console.warn(`[Remove] Connection not found for socketId=${socket.id}`);
    }
    this.logConnections();
  }

  // Log all connections
  private static logConnections() {
    //logs connections length, and details of each connection
    console.log(`[Log] Total connections:`, this.connections.length);
    this.connections.forEach((connection) => {
      console.log(`[Log] Connection:`, connection.socket.id, connection.email, connection.teacherId);
    });
  }
}
