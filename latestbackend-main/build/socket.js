"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocketServer = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // Replace with frontend URL in production
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`🔌 Connected: ${socket.id}`);
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
        });
        socket.on('sendMessage', (data) => {
            io.to(data.roomId).emit('receiveMessage', data);
        });
        socket.on('typing', (roomId) => {
            socket.to(roomId).emit('userTyping');
        });
        socket.on('stopTyping', (roomId) => {
            socket.to(roomId).emit('userStopTyping');
        });
        socket.on('disconnect', () => {
            console.log(`❌ Disconnected: ${socket.id}`);
        });
    });
};
exports.initSocketServer = initSocketServer;
