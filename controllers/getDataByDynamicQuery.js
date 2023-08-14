const { pool } = require("../models/connection");
const { createHmac } = require("node:crypto");

const secret = "abcdefg";
const hash = createHmac("sha256", secret)
  .update("I love cupcakes")
  .digest("hex");
console.log(hash);
// Печать:
// c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e

const getDataByDynamicQuery = async (req, res, next) => {
  const { column = null, district = null, hromada = null } = req.body;

  console.log(column, district, hromada);

  const query1 = `SELECT type, COUNT(type)
FROM cas
GROUP BY type;`;

  //   const query = `SELECT
  //     IF('${column}' IS NULL, type, NULL) AS type,
  //     IF('${district}' IS NULL, district, NULL) AS district,
  //     IF('${hromada}' IS NULL, hromada, NULL) AS hromada,
  //     COUNT(type)
  // FROM cas
  // GROUP BY
  //     IF('${column}' IS NULL, type, NULL),
  //     IF('${district}' IS NULL, district, NULL),
  //     IF('${hromada}' IS NULL, hromada, NULL)
  // HAVING
  //     IF('${district}' IS NULL, TRUE, district = '${district}')
  //     AND
  //     IF('${hromada}' IS NULL, TRUE, hromada = '${hromada}');`;

  try {
    pool.query(query1, function (err, result, fields) {
      if (err) {
        return res.status(404).json({
          message: err.message,
          code: 404,
        });
      }

      console.log("result:", Object.values(result[0]));

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
          result: Object.values(result),
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

module.exports = { getDataByDynamicQuery };
