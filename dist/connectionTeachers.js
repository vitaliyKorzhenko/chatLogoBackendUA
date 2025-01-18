"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionTeacher = void 0;
class ConnectionTeacher {
    // Add new connection teacher
    static addNewConnectionTeacher(socket, email, teacherId) {
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
    static updateConnectionTeacher(socket, email, teacherId) {
        const index = this.connections.findIndex((connection) => connection.socket.id === socket.id);
        if (index !== -1) {
            console.log(`[Update] Updating connection: socketId=${socket.id}, email=${email}, teacherId=${teacherId}`);
            this.connections[index] = {
                socketId: socket.id,
                email,
                socket,
                teacherId,
            };
        }
        else {
            console.warn(`[Update] Connection not found for socketId=${socket.id}`);
        }
        this.logConnections();
    }
    // Find connection teacher by socket
    static findConnectionTeacherBySocket(socket) {
        const connection = this.connections.find((connection) => connection.socket.id === socket.id);
        console.log(`[Find] Connection by socketId=${socket.id}:`, connection);
        return connection;
    }
    // Find connection teacher by email
    static findConnectionTeacherByEmail(email) {
        const connection = this.connections.find((connection) => connection.email === email);
        console.log(`[Find] Connection by email=${email}:`, connection);
        return connection;
    }
    // Find connection teacher by socketId
    static findConnectionTeacherBySocketId(socketId) {
        const connection = this.connections.find((connection) => connection.socketId === socketId);
        console.log(`[Find] Connection by socketId=${socketId}:`, connection);
        return connection;
    }
    // Find connection teacher by teacherId
    static findConnectionTeacherByTeacherId(teacherId) {
        const connections = this.connections.filter((connection) => connection.teacherId === teacherId);
        console.log(`[Find] Connections by teacherId=${teacherId}:`, connections);
        return connections;
    }
    // Add or update connection teacher
    static addOrUpdateConnectionTeacher(socket, email, teacherId) {
        const existingConnection = this.findConnectionTeacherBySocket(socket);
        if (existingConnection) {
            console.log(`[AddOrUpdate] Updating existing connection for socketId=${socket.id}`);
            this.updateConnectionTeacher(socket, email, teacherId);
        }
        else {
            console.log(`[AddOrUpdate] Adding new connection for socketId=${socket.id}`);
            this.addNewConnectionTeacher(socket, email, teacherId);
        }
    }
    // Remove connection teacher
    static removeConnectionTeacher(socket) {
        const index = this.connections.findIndex((connection) => connection.socket.id === socket.id);
        if (index !== -1) {
            console.log(`[Remove] Removing connection for socketId=${socket.id}`);
            this.connections.splice(index, 1);
        }
        else {
            console.warn(`[Remove] Connection not found for socketId=${socket.id}`);
        }
        this.logConnections();
    }
    // Log all connections
    static logConnections() {
        //logs connections length, and details of each connection
        console.log(`[Log] Total connections:`, this.connections.length);
        this.connections.forEach((connection) => {
            console.log(`[Log] Connection:`, connection.socket.id, connection.email, connection.teacherId);
        });
    }
}
exports.ConnectionTeacher = ConnectionTeacher;
ConnectionTeacher.connections = [];
