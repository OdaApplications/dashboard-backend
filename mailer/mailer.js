const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  username: process.env.MAILER_USERNAME,
  from: process.env.MAILER_USERNAME,
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASS,
  },
});

module.exports = {
  mailer,
};
