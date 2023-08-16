const { pool } = require("../../models/connection");

const getDepMessages = async (req, res, next) => {
  const { id, structureName } = req.user;
  console.log("***", id, structureName);
  const { page = 0, limit = 10 } = req.query;
  const skip = page * limit;

  const messageQuery = `SELECT
  (SELECT COUNT(recieverName) FROM dep_messages
    WHERE m.deputyId = ${id}
    OR
    m.councilId = ${id}) AS totalCount,  
  m.id,
  m.senderName,
  m.senderEmail,
  m.recieverName,
  m.title,
  m.text,
  m.isReaded,        
  m.isAnswered,
  m.isArchived,
  m.answeredAt,
  m.createdAt
    FROM dep_messages AS m
    WHERE m.deputyId = ${id}
    OR
    m.councilId = ${id}
    ORDER BY m.createdAt DESC
    LIMIT ${limit} OFFSET ${skip};`;

  console.log("user id:", id);

  try {
    pool.query(messageQuery, function (err, result, fields) {
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

      res.status(200).json({
        message: "success",
        data: {
          totalCount: result[0].totalCount,
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
