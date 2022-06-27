import express from "express";
import authMiddleware from "./middlewares/auth.js";
import registerController from "./controllers/users/registerController.js";
import loginController from "./controllers/users/loginController.js";
import createChatroomController from "./controllers/chatrooms/createChatroomController.js";
import participantController from "./controllers/participants/participantController.js";
import showChatroomController from "./controllers/chatrooms/showChatroomController.js";
import rejectController from "./controllers/invitations/rejectController.js";
import inviteController from "./controllers/invitations/inviteController.js";
import acceptController from "./controllers/invitations/acceptController.js";

const app = express();

app.use(express.json());

app.post("/users/register", registerController);
app.post("/users/login", loginController);
app.post("/invite", authMiddleware, inviteController);
app.post("/createchatroom", authMiddleware, createChatroomController);
app.post("/invitation/accept", authMiddleware, acceptController);
app.delete("/invitation/reject", authMiddleware, rejectController);
app.get("/chatrooms", authMiddleware, showChatroomController);
app.get("/chatroom/:id/participants", authMiddleware, participantController);

app.listen(8000, () => {
  console.log("Server Listening");
});
