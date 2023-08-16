const express = require("express");
const usersRouter = express.Router();

const {
  ctrlWrapper,
  authMiddleware,
  messagesValidation,
  depMiddleware,
} = require("../../middlewares");

const {
  getDepMessagesByJoin,
  postDepMessagesByJoin,
  getDeputyName,
  getDepMessages,
} = require("../../controllers/depCabinet");

usersRouter.get(
  "/messages/get-messages",
  authMiddleware,
  ctrlWrapper(getDepMessages)
);

usersRouter.post(
  "/messages/add-message",
  messagesValidation,
  depMiddleware,
  ctrlWrapper(postDepMessagesByJoin)
);

usersRouter.get(
  "/deputy/search-dep/:recieverLevel",
  ctrlWrapper(getDeputyName)
);

module.exports = usersRouter;
