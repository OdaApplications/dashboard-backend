const express = require("express");
const usersRouter = express.Router();

const {
  ctrlWrapper,
  authMiddleware,
  messagesValidation,
  depMiddleware,
  answerMessagesValidation,
  getDepMessageMiddleware,
} = require("../../middlewares");

const {
  postDepMessages,
  getDeputyName,
  getDepMessages,
  answerDepMessage,
} = require("../../controllers/depCabinet");

// get deputy names
usersRouter.get(
  "/deputy/search-dep/:recieverLevel",
  ctrlWrapper(getDeputyName)
);

// get messages in cabinet
usersRouter.get(
  "/messages/get-messages",
  authMiddleware,
  ctrlWrapper(getDepMessages)
);

// post dep messages
usersRouter.post(
  "/messages/add-message",
  messagesValidation,
  getDepMessageMiddleware,
  ctrlWrapper(postDepMessages)
);

// answer dep message
usersRouter.post(
  "/messages/answer-message",
  answerMessagesValidation,
  // depMiddleware,
  ctrlWrapper(answerDepMessage)
);

module.exports = usersRouter;
