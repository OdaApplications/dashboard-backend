const fs = require("fs");
const { pool } = require("../../models/connection");
const { mailer } = require("../../mailer/mailer");

const { createMessagePdf } = require("../../services/createMessagePdf");
const { getRecieverNameTemplete } = require("../../helpers");

const postDepMessagesByJoin = async (req, res, next) => {
  const {
    senderName = null,
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

  const { emailList } = req.dep;

  console.log("emailList:", emailList);

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

          await mailer.sendMail({
            from: process.env.MAILER_USERNAME,
            to: emailList,
            subject: title,
            text: `${getRecieverNameTemplete(
              recieverLevel,
              recieverDistrict,
              recieverHromada
            )} \nВідправник: ${senderName} \nE-mail відправника: ${senderEmail} \nОтримувач: ${recieverName} \nТекст зверненя: ${text}`,
            attachments: [
              {
                filename: "eMessage.pdf",
                path: pathToPdfFile,
              },
            ],
          });

          await res.status(201).send(data);

          fs.unlinkSync(pathToPdfFile, (err) => {
            if (err) {
              return res.status(404).json({
                message: "file error",
                code: 404,
              });
            }
          });
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
