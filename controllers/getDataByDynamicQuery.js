const { pool } = require("../models/connection");

const getDataByDynamicQuery = async (req, res, next) => {
  const { query } = req.chartQuery;
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

function queryFilterFormater(query, filter) {
  if (filter) {
    filter = JSON.parse(filter);
    const filterArr = Object.entries(filter);

    const querySplit = query.split(" ");
    console.log("querySplit", querySplit);

    const filteredQuery = querySplit.map((item, index) => {
      let transformedFilter = "";
      if (item === "filterVar") {
        let firstOperator = "";
        if (
          querySplit[index - 4].toLowerCase() === "where" ||
          querySplit[index - 4].toLowerCase() === "and"
        ) {
          firstOperator = `AND `;
        } else {
          firstOperator = `WHERE `;
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
