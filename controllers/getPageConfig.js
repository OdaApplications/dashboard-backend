const { pool } = require("../models/connection");

const getPageConfig = async (req, res, next) => {
  const { pageName } = req.params;

  const query = `SELECT 
  g.id,
  g.title,
  g.filterSelects,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'id', c.id,
      'chartsGroupsId', c.chartsGroupsId,
      'size', c.size,
      'location', c.location,
      'title', c.title,
      'chartConfig', c.chartConfig
    )
  ) AS charts
FROM ch_charts_groups AS g
INNER JOIN ch_charts AS c ON g.id = c.chartsGroupsId
WHERE g.pageName = '${pageName}'
GROUP BY g.id`;

  try {
    pool.query(query, function (err, result, fields) {
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
          chartsGroups: result,
        },
        code: 200,
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "page config error",
      code: 500,
    });
  }
};

module.exports = { getPageConfig };
