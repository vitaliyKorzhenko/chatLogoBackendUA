"use strict";
//class for save connection teacher use socket.io
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionTeacher = void 0;
class ConnectionTeacher {
    //add new connection teacher
    static addNewConnectionTeacher(socket, email, id) {
        console.log('New connection teacher:', socket.id);
        this.connections.push({ id, email, socket });
    }
    //update connection teacher
    static updateConnectionTeacher(socket, email, id) {
        const index = this.connections.findIndex((connection) => connection.socket.id === socket.id);
        if (index !== -1) {
            this.connections[index] = { id, email, socket };
        }
    }
    //find connection teacher by socket
    static findConnectionTeacherBySocket(socket) {
        return this.connections.find((connection) => connection.socket.id === socket.id);
    }
    //find connection teacher by email
    static findConnectionTeacherByEmail(email) {
        return this.connections.find((connection) => connection.email === email);
    }
    //find connection teacher by id
    static findConnectionTeacherById(id) {
        return this.connections.find((connection) => connection.id == id);
    }
    //add or update connection teacher
    static addOrUpdateConnectionTeacher(socket, email, id) {
        if (this.findConnectionTeacherBySocket(socket)) {
            this.updateConnectionTeacher(socket, email, id);
        }
        else {
            this.addNewConnectionTeacher(socket, email, id);
        }
    }
    //remove connection teacher
    static removeConnectionTeacher(socket) {
        const index = this.connections.findIndex((connection) => connection.socket.id === socket.id);
        if (index !== -1) {
            this.connections.splice(index, 1);
        }
    }
}
exports.ConnectionTeacher = ConnectionTeacher;
ConnectionTeacher.connections = [];
