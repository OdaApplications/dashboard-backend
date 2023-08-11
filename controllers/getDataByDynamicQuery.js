const { pool } = require("../models/connection");

const getDataByDynamicQuery = async (req, res, next) => {
  const { column = null, district = null, hromada = null } = req.body;

  console.log(column, district, hromada);

  const query1 = `SELECT type, district, COUNT(type)
  FROM cas AS c
  GROUP BY c.type, c.district
  HAVING
      IF('${district}' = 'null', TRUE, c.district = '${district}');`;

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

  console.log(query1);

  try {
    pool.query(query1, function (err, result, fields) {
      if (err) {
        return res.status(404).json({
          message: err.message,
          code: 404,
        });
      }

      console.log("result:", result);

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

module.exports = { getDataByDynamicQuery };
