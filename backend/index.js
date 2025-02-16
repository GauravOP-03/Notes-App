require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as needed
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.roomId = roomId;
    socket.join(roomId);
    socket.to(roomId).emit("playerJoin", "New user connected");
  });
  socket.on("sendWord", (word) => {
    socket.to(socket.roomId).emit("receiveWord", word);
    // console.log(roomId);
  });

  socket.on("disconnect", () => {
    socket.to(socket.roomId).emit("playerJoin", "User disconnected");
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
