// const { pool } = require("../../models/connection");
// const { mathMethods } = require("../../mathMethods.js/index.js");

const { generateQueryString } = require("../../helpers/generateTemplateString");
const { getRowCount } = require("../../helpers");

const getTranformedData = async (req, res, next) => {
  const { table } = req.params;
  const { columns, conditions, method } = req.query;

  try {
    const getRequestData = (columns, conditions, method) => {
      // columns: type/type
      // conditions: type - ЦНАП / type - ЦНАП, open - 1

      const allColumns = columns.split("/");

      const allConditions = conditions.split("/").map((item) => {
        return item.split(",").map((item) => item.split("-"));
      });

      const querySettingsArr = allColumns.map((item, index) => {
        const settingsObj = {};
        settingsObj.column = item;
        settingsObj.condition = allConditions[index].map((item) => ({
          key: item[0],
          value: item[1],
        }));

        console.log("****", settingsObj.condition);

        return settingsObj;
      });

      return querySettingsArr;
    };

    const querySearchArray = getRequestData(columns, conditions);
    console.log("--querySearchArray", querySearchArray);

    const getDatasArr = async () => {
      const resArr = [];

      for (const element of querySearchArray) {
        const queryString = generateQueryString(table, element);
        const data = await getRowCount(queryString);

        resArr.push(data);
      }

      return resArr;
    };

    const result = await getDatasArr();
    console.log("result", result[1].length);

    res.status(200).json({
      message: "table data",
      code: 200,
      length: result.length,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getTranformedData };

// [
//   {
//     column: "type",
//     comndition: [{ key: "type", value: "ЦНАП" }],
//   },
//   {
//     column: "type",
//     comndition: [
//       { key: "type", value: "ЦНАП" },
//       { key: "open", value: "1" },
//     ],
//   },
// ];
