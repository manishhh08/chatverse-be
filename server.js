import express from "express";
import cors from "cors";
import { createServer } from "http";
import { mongooseConnect } from "./src/config/mongoConfig.js";
import config from "./src/config/config.js";
import authRouter from "./src/routes/authRouter.js";
import chatRouter from "./src/routes/chatRouter.js";
import messageRouter from "./src/routes/messageRouter.js";
import userRouter from "./src/routes/userRouter.js";
import { initSocket } from "./src/utils/socketSetup.js";

const app = express();

const server = createServer(app);

const io = initSocket(server);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API endpoint for Chatverse application is running");
});

// auth router
app.use("/api/v1/auth", authRouter);

// user router
app.use("/api/v1/user", userRouter);

// chat router
app.use("/api/v1/chats", chatRouter);

//message router
app.use("/api/v1/messages", messageRouter);

//socketio connection here
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat:${chatId}`);
  });

  socket.on("leave_chat", (chatId) => {
    socket.leave(chatId);
    console.log(`User left chat:${chatId}`);
  });

  socket.on("typing", ({ chatId }) => {
    socket.to(chatId).emit("typing", { userId: socket.userId });
  });

  socket.on("stop_typing", ({ chatId }) => {
    socket.to(chatId).emit("stop_typing", { userId: socket.userId });
  });

  socket.on("send_message", (messageData) => {
    io.to(messageData.chatId).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
});

mongooseConnect()
  .then(() => {
    server.listen(config.port, () => {
      console.log(`✅ Server started on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB CONNECTION ERROR:", err.message);
  });
