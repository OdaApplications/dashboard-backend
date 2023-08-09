const { pool } = require("../../models/connection");

const getDepMessagesByJoin = async (req, res, next) => {
  const { id } = req.user;
  const { page = 0, limit = 10 } = req.query;
  const skip = page * limit;

  const messagesQueryOda = () => {
    return `SELECT 
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
  m.createdAt,
  (SELECT COUNT(*) FROM dep_messages WHERE recieverLevel = 'oda') AS totalCount
    FROM dep_messages AS m
    INNER JOIN dep_users AS u ON m.recieverLevel = u.access
    WHERE m.recieverLevel = 'oda'
    LIMIT ${limit} OFFSET ${skip};`;
  };

  const messagesQueryDistrict = (district) => {
    return `SELECT 
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
  m.createdAt,
  (SELECT COUNT(*) FROM dep_messages WHERE recieverLevel = 'district' AND recieverDistrict = '${district}') AS totalCount
    FROM dep_messages AS m
    INNER JOIN dep_users AS u ON m.recieverLevel = u.access
    AND m.recieverDistrict = u.district
    WHERE m.recieverLevel = 'district' AND m.recieverDistrict = '${district}'
    LIMIT ${limit} OFFSET ${skip};`;
  };

  const messagesQueryHromada = (hromada) => {
    return `SELECT 
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
  m.createdAt,
   (SELECT COUNT(*) FROM dep_messages WHERE recieverLevel = 'hromada' AND recieverHromada = '${hromada}') AS totalCount
    FROM dep_messages AS m
    INNER JOIN dep_users AS u ON m.recieverLevel = u.access
    AND m.recieverHromada = u.hromada
    WHERE m.recieverLevel = 'hromada' AND m.recieverHromada = '${hromada}'
    LIMIT ${limit} OFFSET ${skip};`;
  };

  const messageQuery = `SELECT access, district, hromada
        FROM dep_users WHERE id = ?`;

  try {
    pool.query(messageQuery, [id], function (err, result, fields) {
      if (err) {
        return res.status(404).json({
          message: "not found",
          code: 404,
          data: err,
        });
      }

      if (!result.length) {
        return res.status(404).json({
          message: "not found",
          code: 404,
        });
      }

      let queryByRole = "";

      if (result[0].access === "oda") {
        queryByRole = messagesQueryOda();
      }

      if (result[0].access === "district") {
        queryByRole = messagesQueryDistrict(result[0].district);
      }

      if (result[0].access === "hromada") {
        queryByRole = messagesQueryHromada(result[0].hromada);
      }

      pool.query(queryByRole, function (err, result, fields) {
        if (err) {
          return res.status(404).json({
            message: "not found",
            code: 404,
            data: err,
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
            totalCount: result[0].totalCount,
            userMessages: result,
          },
          code: 200,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getDepMessagesByJoin };
