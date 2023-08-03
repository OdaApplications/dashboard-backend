const { pool } = require("../models/connection");

const getPageConfig = async (req, res, next) => {
  const { pageName } = req.params;
  console.log("pageName:", pageName);

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
      'chartConfig', c.chartConfig,
      'query', c.query
    )
  ) AS charts
FROM ch_charts_groups AS g
INNER JOIN ch_charts AS c ON g.id = c.chartsGroupsId
WHERE g.pageName = '${pageName}'
GROUP BY g.id`;

  // const query = `SELECT
  // g.id,
  // g.title,
  // g.filterSelects,
  // g.pageName,
  // c.id,
  // c.chartsGroupsId,
  // c.size,
  // c.location,
  // c.chartConfig,
  // c.query
  //   FROM ch_charts_groups AS g
  //   INNER JOIN ch_charts AS c ON g.id = c.chartsGroupsId
  //   WHERE g.pageName = '${pageName}';`;

  // [
  //   ch_charts_groups: {
  //     id: 1,
  //     title: "Стан утворення мережі центрів",
  //     filterSelects: null,

  //     ch_charts: [{
  //       id: 1,
  //       title: "Стан утворення мережі центрів",
  //       filterSelects: null,
  //       pageName: "net",
  //       size: "m",
  //       location: '{"x": 0, "y": 0}',
  //       chartConfig:
  //         '{"chart": {"id": "donut-chart"}, "labels": ["ЦНАП", "ТП", "ВРМ", "Дія Центр"], "legend": {"labels": {"colors": "#000"}, "position": "top"}, "dataLabels": {"enabled": true, "formatter": "function (value, { seriesIndex, dataPointIndex, w }) { return w.config.series[seriesIndex]; }"}, "plotOptions": {"pie": {"donut": {"size": "50%"}}}}',
  //       query: null,
  //     },
  //     {
  //       id: 2,
  //       title: "Стан утворення мережі центрів",
  //       filterSelects: null,
  //       pageName: "net",
  //       size: "mtl",
  //       location: '{"x": 4, "y": 0}',
  //       chartConfig:
  //         '{"chart": {"id": "bar-chart"}, "xaxis": {"categories": ["Виконано", "План на 01.01.2024"]}, "plotOptions": {"bar": {"horizontal": true}}}',
  //       query: null,
  //     },]}];

  //  const query = `SELECT * FROM ch_charts_groups WHERE pageName = '${pageName}'`;

  try {
    pool.query(query, function (err, result, fields) {
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

      console.log("result:", result);

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
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getPageConfig };
