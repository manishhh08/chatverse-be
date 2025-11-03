import express from "express";
import cors from "cors";
import { mongooseConnect } from "./src/config/mongoConfig.js";
import config from "./src/config/config.js";
import authRouter from "./src/routes/authRouter.js";
import chatRouter from "./src/routes/chatRouter.js";
import messageRouter from "./src/routes/messageRouter.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API endpoint for Chatverse application is running");
});

// auth router
app.use("/api/v1/auth", authRouter);

// chat router
app.use("/api/v1/chats", chatRouter);

//message router
app.use("/api/v1/messages", messageRouter);

mongooseConnect()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`✅ Server started on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB CONNECTION ERROR:", err.message);
  });
