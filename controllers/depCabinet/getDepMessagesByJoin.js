const { pool } = require("../../models/connection");

const {
  messagesOdaQuery,
  messagesDistrictQuery,
  messagesHromadaQuery,
  messagesOdaDeputyQuery,
} = require("./depCabinetQuerys");

const getDepMessagesByJoin = async (req, res, next) => {
  const { id } = req.user;
  const { page = 0, limit = 10 } = req.query;
  const skip = page * limit;

  const messageQuery = `SELECT access, district, hromada, position, structureName
        FROM dep_users WHERE id = ?`;

  try {
    pool.query(messageQuery, [id], function (err, result, fields) {
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

      let queryByLevel = "";

      if (result[0].access === "oda" && result[0].position === "council") {
        console.log("oda & concil");
        queryByLevel = messagesOdaQuery(limit, skip);
      }

      if (result[0].access === "district" && result[0].position === "council") {
        console.log("district & concil");
        queryByLevel = messagesDistrictQuery(limit, skip, result[0].district);
      }

      if (result[0].access === "hromada" && result[0].position === "council") {
        console.log("hromada & concil");
        queryByLevel = messagesHromadaQuery(limit, skip, result[0].hromada);
      }

      if (result[0].access === "oda" && result[0].position === "deputy") {
        console.log("oda & deputy");

        queryByLevel = messagesOdaDeputyQuery(
          limit,
          skip,
          result[0].structureName
        );
      }

      pool.query(queryByLevel, function (err, result, fields) {
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

        // if (isDeputy && deputyName) {
        //   console.log(isDeputy, deputyName);

        //   // by filter and without workin total count

        //   // const filtredResult = result.filter((message) => {
        //   //   console.log("++", message.recieverName);
        //   //   return message.recieverName === deputyName;
        //   // });

        //   // console.log("filtredResult", filtredResult);

        //   // return res.json({
        //   //   message: "success",
        //   //   data: {
        //   //     // totalCount: filtredResult.totalCount,
        //   //     userMessages: filtredResult,
        //   //   },
        //   //   code: 200,
        //   // });
        // }

        res.json({
          message: "success",
          data: {
            totalCount: result[0].totalCount,
            userMessages: result,
          },
          code: 200,
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: "dep messages error",
      code: 500,
    });
  }
};

module.exports = { getDepMessagesByJoin };
