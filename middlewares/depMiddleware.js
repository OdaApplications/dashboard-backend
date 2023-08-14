const { pool } = require("../models/connection");

const depMiddleware = async (req, res, next) => {
  const {
    recieverLevel,
    recieverName = null,
    recieverDistrict = null,
    recieverHromada = null,
  } = req.body;

  const depQuery = `SELECT
  u.email
  FROM dep_users AS u
  WHERE u.structureName = ? AND u.position = ?
  OR
  u.access = ?
  AND u.position = ? ;`;

  // допистати якщо рівень district, hromada

  try {
    pool.query(
      depQuery,
      [recieverName, "deputy", recieverLevel, "council"],
      function (err, result, fields) {
        if (err) {
          return res.status(404).json({
            message: err,
            code: 404,
          });
        }

        if (!result.length) {
          return res.status(404).json({
            message: "not found",
            code: 404,
          });
        }

        req.dep = {
          emailList: result.map((item) => item.email),
        };
        next();
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "data error",
      code: 500,
    });
  }
};

module.exports = { depMiddleware };
