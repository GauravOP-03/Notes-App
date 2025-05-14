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

const roomUsers = {};
const roomHosts = {};
const roomOwners = {};
let lockRooms = {};
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", ({ roomId, username, uid }) => {
    socket.roomId = roomId;
    socket.uid = uid;
    socket.username = username;
    socket.join(roomId);

    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    // Prevent duplicates
    if (!lockRooms[roomId]) {
      lockRooms[roomId] = false;
    }
    if (!roomUsers[roomId].some((u) => u.uid === uid)) {
      roomUsers[roomId].push({ uid, username });
    }
    // console.log(username, userId);
    if (!roomOwners[roomId]) {
      console.log(socket.roomId, uid);

      roomOwners[roomId] = uid;
    }

    if (roomOwners[roomId] && socket.roomId == uid) {
      roomOwners[roomId] = uid;
    }
    // if (
    //   roomOwners[roomId] &&
    //   roomUsers[roomId].some((u) => u.uid === roomOwners[roomId])
    // ) {
    roomHosts[roomId] = roomOwners[roomId];
    // } else {
    //   roomHosts[roomId] = roomUsers[roomId][0].uid;
    // }
    io.to(roomId).emit("hostInfo", { hostUid: roomHosts[roomId] });
    io.to(roomId).emit("userJoined", { username, uid });
    // console.log(roomId)
  });

  socket.on("updateText", (word) => {
    if (!lockRooms[socket.roomId] || socket.uid == roomHosts[socket.roomId]) {
      socket.to(socket.roomId).emit("updateText", word);
    } else {
      console.log("updateText error");
      socket.emit("error", { message: "Note is locked" });
    }
    // console.log(roomId);
  });

  socket.on("updateCursor", ({ userId, position, username }) => {
    if (!lockRooms[socket.roomId] || socket.uid == roomHosts[socket.roomId]) {
      socket
        .to(socket.roomId)
        .emit("cursorPosition", { userId, position, username });
    } else {
      // console.log("updateTcursor error");
      socket.emit("error", { message: "Note is locked" });
    }
  });

  socket.on("chatMessage", ({ message, username, uid }) => {
    io.to(socket.roomId).emit("chatMessage", { message, username, uid });
  });

  // typing status

  socket.on("typing", ({ uid, username }) => {
    // console.log(username, uid);
    if (!lockRooms[socket.roomId] || socket.uid == roomHosts[socket.roomId]) {
      io.to(socket.roomId).emit("show_typing", { uid, username });
    } else {
      // console.log("updateTyping error");
      socket.emit("error", { message: "Note is locked" });
    }
  });
  socket.on("stop_typing", ({ uid }) => {
    if (!lockRooms[socket.roomId] || socket.uid == roomHosts[socket.roomId]) {
      // console.log(uid);
      io.to(socket.roomId).emit("hide_typing", { uid });
    } else {
      // console.log("hideTyping error");
      socket.emit("error", { message: "Note is locked" });
    }
  });

  socket.on("locked", ({ uid }) => {
    console.log(uid);
    const users = roomUsers[socket.roomId];
    if (users && users.length > 0 && uid == roomHosts[socket.roomId]) {
      lockRooms[socket.roomId] = true;
      io.to(socket.roomId).emit("locked", { uid });
    } else {
      // console.log("locked error");
      socket.emit("error", { message: "Only host can lock/unlock" });
    }
  });

  socket.on("unlock", ({ uid }) => {
    console.log(uid);
    const users = roomUsers[socket.roomId];
    if (!lockRooms[socket.roomId] && uid == roomHosts[socket.roomId]) {
      // console.log("unlock error");
      socket.emit("error", { message: "Note is already unlocked" });
      return;
    }
    if (users && users.length > 0 && uid == roomHosts[socket.roomId]) {
      lockRooms[socket.roomId] = false;
      io.to(socket.roomId).emit("unlock");
    } else {
      console.log("id", uid);
      socket.emit("error", { message: "Only host can lock/unlock" });
    }
  });

  socket.on("disconnect", () => {
    const { roomId, uid } = socket;
    if (roomId && uid && roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter((u) => u.uid !== uid);
      io.to(roomId).emit("userLeft", { uid });
    }

    if (roomUsers[roomId] && roomUsers[roomId].length > 0) {
      if (
        roomOwners[roomId] &&
        roomUsers[roomId].some((u) => u.uid === roomOwners[roomId])
      ) {
        roomHosts[roomId] = roomOwners[roomId];
      } else {
        roomHosts[roomId] = roomUsers[roomId][0].uid;
      }
    } else {
      delete roomHosts[roomId];
    }
    io.to(roomId).emit("hostInfo", { hostUid: roomHosts[roomId] || null });
    if (roomUsers[roomId] && roomUsers[roomId].length === 0) {
      delete roomUsers[roomId];
      delete roomOwners[roomId];
      delete lockRooms[roomId];
      delete roomHosts[roomId];
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
