const { pool } = require("../models/connection");

const depMiddleware = async (req, res, next) => {
  const {
    recieverLevel,
    recieverName = null,
    recieverDistrict = null,
    recieverHromada = null,
  } = req.body;

  const depAndOdaEmailQuery = `SELECT
  u.email
  FROM dep_users AS u
  WHERE u.structureName = '${recieverName}' 
  AND u.position = 'deputy'
  OR
  u.access = '${recieverLevel}'
  AND u.position = 'council';`;

  const depAndDistrictEmailQuery = `SELECT
  u.email
  FROM dep_users AS u
  WHERE u.structureName = '${recieverName}' 
  AND u.position = 'deputy'
  OR
  u.access = '${recieverLevel}'
  AND u.position = 'council'
  AND u.district = '${recieverDistrict}';`;

  const depAndHromadaEmailQuery = `SELECT
  u.email
  FROM dep_users AS u
  WHERE u.structureName = '${recieverName}' 
  AND u.position = 'deputy'
  OR
  u.access = '${recieverLevel}'
  AND u.position = 'council'
  AND u.hromada = '${recieverHromada}';`;

  let emailQuery = "";

  if (recieverLevel === "oda") {
    emailQuery = depAndOdaEmailQuery;
  }

  if (recieverLevel === "district" && recieverDistrict && !recieverHromada) {
    emailQuery = depAndDistrictEmailQuery;
  }

  if (recieverLevel === "hromada" && recieverHromada) {
    emailQuery = depAndHromadaEmailQuery;
  }

  try {
    pool.query(emailQuery, function (err, result, fields) {
      if (err) {
        return res.status(404).json({
          message: err,
          code: 404,
        });
      }

      if (!result.length) {
        return res.status(404).json({
          message: "not found",
          code: 404,
        });
      }

      const emailList = result.map((item) => item.email);
      // emailList.push("krupchynskyi.plbl@gmail.com");

      req.dep = {
        emailList,
      };
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "data error",
      code: 500,
    });
  }
};

module.exports = { depMiddleware };
