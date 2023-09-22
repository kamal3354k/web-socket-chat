const io = require("socket.io")(4000, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  socket.on("sent-msg", (message, roomId) => {
    if (roomId) {
      socket.to(roomId).emit("recieve-msg", message);
    } else {
      socket.broadcast.emit("recieve-msg", message);
    }
  });
  socket.on("join-room", (room) => {
    socket.join(room);
  });
});
