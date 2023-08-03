const express = require("express");
const usersRouter = express.Router();

const {
  ctrlWrapper,
  authMiddleware,
  messagesValidation,
} = require("../../middlewares");

const {
  getDepMessagesByJoin,
  postDepMessagesByJoin,
} = require("../../controllers/depCabinet");

usersRouter.get(
  "messages/get-messages",
  authMiddleware,
  ctrlWrapper(getDepMessagesByJoin)
);

usersRouter.post(
  "messages/add-message",
  messagesValidation,
  ctrlWrapper(postDepMessagesByJoin)
);

module.exports = usersRouter;
