import { Server, Socket } from 'socket.io';

export default function socketHandler(io: Server) {
  io.on('connection', (socket: Socket) => {
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
