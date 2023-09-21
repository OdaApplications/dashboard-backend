const fs = require("fs");
const { pool } = require("../../models/connection");
const { mailer } = require("../../mailer/mailer");

const { getRecieverNameTemplete } = require("../../helpers");

const answerDepMessage = async (req, res, next) => {
  const { id = null } = req.body;
  console.log(req.body);

  console.log("req.message:", req.message);

  // const { deputyId, councilId, emailList } = req.dep;
  const {
    deputyId,
    senderName,
    senderEmail,
    recieverLevel,
    recieverDistrict,
    recieverHromada,
    recieverName,
    isAnswerByEmail,
    createdAt,
  } = req.message;

  const newMessageQuery =
    "INSERT INTO dep_answered_mes (depMessageId, deputyId, councilId, senderName, senderEmail,  recieverLevel, recieverDistrict, recieverHromada, recieverName, title, text, isAnswerByEmail, isAnswered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    pool.query(
      newMessageQuery,
      [
        id,
        deputyId,
        councilId,
        senderName,
        senderEmail,
        recieverLevel,
        recieverDistrict,
        recieverHromada,
        recieverName,
        title,
        text,
        isAnswerByEmail,
        true,
      ],
      async (err, result) => {
        if (err) {
          return res.status(404).json({
            message: "answer message error",
            code: 404,
          });
        }

        try {
          await mailer.sendMail({
            from: process.env.SEND_MAIL_FROM,
            to: senderEmail,
            subject: title,
            text: `Відправник: ${getRecieverNameTemplete(
              recieverLevel,
              recieverDistrict,
              recieverHromada
            )} \nДепутат: ${recieverName} \nКому: ${senderName} \nВідповідь на Ваше зверненя: ${text}`,
          });

          return res.status(200).json({
            message: "answer sended",
            code: 200,
          });
        } catch (error) {
          return res.status(500).json({
            message: "add message error",
            code: 500,
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "add message error",
      code: 500,
    });
  }
};

module.exports = { answerDepMessage };
