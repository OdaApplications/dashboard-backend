const { pool } = require("../../models/connection");

const getDeputyName = async (req, res, next) => {
  const { depName } = req.params;
  console.log("depName", depName);

  const depQuery = `SELECT 
  u.structureName,
  u.email
  FROM dep_users AS u
  WHERE u.structureName LIKE '%${depName}%'
  LIMIT 10;`;

  try {
    pool.query(depQuery, function (err, result, fields) {
      if (err) {
        return res.status(404).json({
          message: err.message,
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
          result,
        },
        code: 200,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "data error",
      code: 500,
    });
  }
};

module.exports = { getDeputyName };
