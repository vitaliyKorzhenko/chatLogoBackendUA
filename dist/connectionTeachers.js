"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionTeacher = void 0;
class ConnectionTeacher {
    // Add new connection teacher
    static addNewConnectionTeacher(socket, email, teacherId) {
        console.log('New connection teacher:', socket.id);
        this.connections.push({
            socketId: socket.id,
            email,
            socket,
            teacherId,
        });
    }
    // Update connection teacher
    static updateConnectionTeacher(socket, email, teacherId) {
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
    static findConnectionTeacherBySocket(socket) {
        return this.connections.find((connection) => connection.socket.id === socket.id);
    }
    // Find connection teacher by email
    static findConnectionTeacherByEmail(email) {
        return this.connections.find((connection) => connection.email === email);
    }
    // Find connection teacher by socketId
    static findConnectionTeacherBySocketId(socketId) {
        return this.connections.find((connection) => connection.socketId === socketId);
    }
    // Find connection teacher by teacherId
    static findConnectionTeacherByTeacherId(teacherId) {
        return this.connections.filter((connection) => connection.teacherId == teacherId);
    }
    // Add or update connection teacher
    static addOrUpdateConnectionTeacher(socket, email, teacherId) {
        const existingConnection = this.findConnectionTeacherBySocket(socket);
        if (existingConnection) {
            this.updateConnectionTeacher(socket, email, teacherId);
        }
        else {
            this.addNewConnectionTeacher(socket, email, teacherId);
        }
    }
    // Remove connection teacher
    static removeConnectionTeacher(socket) {
        const index = this.connections.findIndex((connection) => connection.socket.id === socket.id);
        if (index !== -1) {
            this.connections.splice(index, 1);
        }
    }
}
exports.ConnectionTeacher = ConnectionTeacher;
ConnectionTeacher.connections = [];
