import { Server } from "socket.io";

function createConnection(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`user connected`, socket.id);

    socket.on('editor-update', (data) => {

      socket.broadcast.emit('broadcast-update', data)
    })
  });

  return io;
}

export default createConnection;
