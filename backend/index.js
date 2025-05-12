require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

main()
  .then((e) => {
    console.log("Database Connected");
  })
  .catch((er) => {
    console.log(er);
  });

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ roomId, username, uid }) => {
    socket.roomId = roomId;
    socket.join(roomId);
    // console.log(username, userId);
    io.to(roomId).emit("userJoined", { username, uid });
    // console.log(roomId)
  });

  socket.on("updateText", (word) => {
    socket.to(socket.roomId).emit("updateText", word);
    // console.log(roomId);
  });

  socket.on("updateCursor", ({ userId, position, username }) => {
    socket
      .to(socket.roomId)
      .emit("cursorPosition", { userId, position, username });
  });

  socket.on("chatMessage", ({ message, username, uid }) => {
    io.to(socket.roomId).emit("chatMessage", { message, username, uid });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
