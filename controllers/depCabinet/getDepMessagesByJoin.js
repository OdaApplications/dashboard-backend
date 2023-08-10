const { pool } = require("../../models/connection");
const {
  messagesOdaQuery,
  messagesDistrictQuery,
  messagesHromadaQuery,
} = require("./depCabinetQuerys");

const getDepMessagesByJoin = async (req, res, next) => {
  const { id } = req.user;
  const { page = 0, limit = 10 } = req.query;
  const skip = page * limit;

  const messageQuery = `SELECT access, district, hromada
        FROM dep_users WHERE id = ?`;

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

      let queryByLevel = "";

      if (result[0].access === "oda") {
        queryByLevel = messagesOdaQuery(limit, skip);
      }

      if (result[0].access === "district") {
        queryByLevel = messagesDistrictQuery(limit, skip, result[0].district);
      }

      if (result[0].access === "hromada") {
        queryByLevel = messagesHromadaQuery(limit, skip, result[0].hromada);
      }

      pool.query(queryByLevel, function (err, result, fields) {
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
            totalCount: result[0].totalCount,
            userMessages: result,
          },
          code: 200,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "dep messages error",
      code: 500,
    });
  }
};

module.exports = { getDepMessagesByJoin };
