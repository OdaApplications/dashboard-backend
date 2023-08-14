const { getDeputyName } = require("./getDeputyName");
const { getDepMessages } = require("./getDepMessages");
const { getDepMessagesByJoin } = require("./getDepMessagesByJoin");
const { postDepMessagesByJoin } = require("./postDepMessagesByJoin");

module.exports = {
  getDeputyName,
  getDepMessages,
  getDepMessagesByJoin,
  postDepMessagesByJoin,
};
