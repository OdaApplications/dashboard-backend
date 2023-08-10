const fs = require("fs");
const { pool } = require("../../models/connection");
const { createMessagePdf } = require("../../services/createMessagePdf");

const postDepMessagesByJoin = async (req, res, next) => {
  const {
    senderName,
    senderEmail = null,
    senderAddress = null,
    senderPhone = null,
    recieverLevel,
    recieverDistrict = null,
    recieverHromada = null,
    recieverName = null,
    title = null,
    text = null,
    isAnswerByEmail = null,
  } = req.body;

  const newMessageQuery =
    "INSERT INTO dep_messages (senderName, senderEmail, senderAddress, senderPhone, recieverLevel, recieverDistrict, recieverHromada, recieverName, title, text, isAnswerByEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    pool.query(
      newMessageQuery,
      [
        senderName,
        senderEmail,
        senderAddress,
        senderPhone,
        recieverLevel,
        recieverDistrict,
        recieverHromada,
        recieverName,
        title,
        text,
        isAnswerByEmail,
      ],
      async (err, result) => {
        if (err) {
          return res.status(404).json({
            message: "post messages error",
            code: 404,
          });
        }

        try {
          const pathToPdfFile = await createMessagePdf(req.body);
          const data = fs.readFileSync(pathToPdfFile);

          res.contentType("application/pdf");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=e-message.pdf"
          );

          return res.status(201).send(data);
        } catch (error) {
          return res.status(500).json({
            message: "post messages error",
            code: 500,
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "post messages error",
      code: 500,
    });
  }
};

module.exports = { postDepMessagesByJoin };
