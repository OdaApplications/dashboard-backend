const { pool } = require("../../models/connection");

const getDepMessages = async (req, res, next) => {
  const { id } = req.user;

  const messageQuery = `SELECT id,
        senderName,
        senderEmail,
        title,
        text,
        isReaded,
        isAnswered,
        isArchived,
        answeredAt,
        createdAt
        FROM dep_messages WHERE userId = ?`;

  try {
    pool.query(messageQuery, [id], function (err, result, fields) {
      if (err) {
        return res.status(404).json({
          message: "not found",
          code: 404,
        });
      }

      if (!result.length) {
        return res.status(404).json({
          message: "not found",
          code: 404,
        });
      }

      res.json({
        message: "success",
        data: {
          length: result.length,
          userMessages: result,
        },
        code: 200,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "dep messages error",
      code: 500,
    });
  }
};

module.exports = { getDepMessages };
