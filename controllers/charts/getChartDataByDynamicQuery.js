const { resultFormater } = require("../../helpers");
const { pool } = require("../../models/connection");

const getChartDataByDynamicQuery = async (req, res, next) => {
  const { query, title } = req.chartQuery;
  const { filter } = req.query;

  const formatedQuery = queryFilterFormater(query, filter);

  try {
    pool.query(formatedQuery, function (err, result, fields) {
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

      const formattedResult = resultFormater(result);

      res.json({
        message: "success",
        data: {
          length: result.length,
          chartName: title,
          data: formattedResult,
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

module.exports = { getChartDataByDynamicQuery };

function queryFilterFormater(query, filter) {
  if (filter) {
    filter = JSON.parse(filter);
    const filterArr = Object.entries(filter);

    const querySplit = query.split(" ");

    const filteredQuery = querySplit.map((item, index) => {
      let transformedFilter = "";
      if (item === "filterVar") {
        let firstOperator = "WHERE ";

        for (let i = index; i >= 0; i--) {
          if (
            querySplit[i].toLowerCase() === "where" ||
            querySplit[i].toLowerCase() === "and" ||
            querySplit[i].toLowerCase() === "or"
          ) {
            firstOperator = `AND `;
            break;
          }
        }

        filterArr.forEach((item, index) => {
          if (index === 0) {
            transformedFilter += `${firstOperator}${item[0]} = '${item[1]}'`;
          } else {
            transformedFilter += ` AND ${item[0]} = '${item[1]}'`;
          }
        });
        return transformedFilter;
      } else {
        return item;
      }
    });

    query = filteredQuery.join(" ");
  } else {
    const querySplit = query.split("filterVar");
    query = querySplit.join("");
  }
  return query;
}
