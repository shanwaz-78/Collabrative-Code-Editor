import { Server } from "socket.io";

function createConnection(server) {
  const users = {};
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`user connected`, socket.id);

    socket.on("user-join", (userName) => {
      users[socket.id] = userName;
      io.emit("joined-user", { userName: userName, userId: socket.id });
    });

    socket.on("editor-update", (data) => {
      socket.broadcast.emit("broadcast-update", data);
    });

    socket.on("disconnect", () => {
      io.emit("user-disconnect", socket.id);
      console.log("User disconnected", users[socket.id]);
    });
  });

  return io;
}

export default createConnection;
