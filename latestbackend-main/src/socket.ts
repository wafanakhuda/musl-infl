// src/socket.ts
import { Server as HttpServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'

let io: SocketIOServer

export const initSocketServer = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Replace with frontend URL in production
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Connected: ${socket.id}`)

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId)
    })

    socket.on('sendMessage', (data) => {
      io.to(data.roomId).emit('receiveMessage', data)
    })

    socket.on('typing', (roomId: string) => {
      socket.to(roomId).emit('userTyping')
    })

    socket.on('stopTyping', (roomId: string) => {
      socket.to(roomId).emit('userStopTyping')
    })

    socket.on('disconnect', () => {
      console.log(`❌ Disconnected: ${socket.id}`)
    })
  })
}
