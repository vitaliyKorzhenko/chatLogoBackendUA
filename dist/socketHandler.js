"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = socketHandler;
function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('message', (msg) => {
            console.log('Message from user:', msg);
            io.emit('message', msg);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}
