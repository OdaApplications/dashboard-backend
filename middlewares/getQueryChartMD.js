const { pool } = require("../models/connection");

const getQueryChartMD = async (req, res, next) => {
  const id = req.params.id;

  const query1 = `SELECT query
FROM ch_charts WHERE id = ${id};`;

  try {
    pool.query(query1, function (err, result, fields) {
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

      req.chartQuery = result[0];
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "data error",
      code: 500,
    });
  }
};

module.exports = { getQueryChartMD };
