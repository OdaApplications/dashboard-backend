const { pool } = require("../models/connection");

const getChartData = async (req, res, next) => {
  const district = "Ужгородський";
  const hromada = "Ужгородська";

  // const query = `SELECT district, (totalCount / totalCount2 * 100) AS result
  // FROM (
  //     SELECT
  //          district, SUM(pandus) + SUM(temp_place) + SUM(stairs) + SUM(snitar_room) + SUM(brail) + SUM(tech_sol) AS totalCount,
  //         COUNT(pandus) + COUNT(temp_place) + COUNT(stairs) + COUNT(snitar_room) + COUNT(brail) + COUNT(tech_sol) AS totalCount2
  //    FROM cas GROUP BY district
  // ) AS subquery;`;

  const query = `SELECT type as label, COUNT(*) AS count FROM cas GROUP BY type;`;

  // const query = `SELECT GROUP_CONCAT(
  // (COUNT(*) WHERE type = 'ЦНАП'),
  // (COUNT(*) WHERE type = 'ТП'),
  // (COUNT(*) WHERE type = 'ВРМ'),
  // (COUNT(*) WHERE type = 'Дія Центр')
  // ) AS data FROM cas`;

  // мережа
  // const queryDistrict = `SELECT
  // (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП' AND district = '${district}') AS res1,
  // (SELECT COUNT(*) FROM cas WHERE type = 'ТП' AND district = '${district}') AS res2,
  // (SELECT COUNT(*) FROM cas WHERE type = 'ВРМ' AND district = '${district}') AS res3,
  // (SELECT COUNT(*) FROM cas WHERE type = 'Дія Центр' AND district = '${district}') AS res4`;

  //  const queryHromada = `SELECT
  // (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП' AND hromada = '${hromada}') AS res1,
  // (SELECT COUNT(*) FROM cas WHERE type = 'ТП' AND hromada = '${hromada}') AS res2,
  // (SELECT COUNT(*) FROM cas WHERE type = 'ВРМ' AND hromada = '${hromada}') AS res3,
  // (SELECT COUNT(*) FROM cas WHERE type = 'Дія Центр' AND hromada = '${hromada}') AS res4`;

  // виконано, заплановано ЦНАПи

  // const query = `SELECT
  // (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП' AND open = '1') AS res1,
  // (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП') AS res2;`;

  // const queryDistrict = `SELECT
  // (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП' AND open = '1' AND district = '${district}') AS res1,
  // (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП' AND district = '${district}') AS res2;`;

  // const queryHromada = `SELECT
  // (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП' AND open = '1' AND hromada = '${hromada}') AS res1,
  // (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП' AND hromada = '${hromada}') AS res2;`;

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

      res.json({
        message: "success",
        data: {
          // length: result.length,
          // resultValues: Object.values(result[0]),
          result,
        },
        code: 200,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getChartData };

// привіт, в мене є такий mysql запит:   const query = `SELECT
//   (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП' AND open = '1') AS res1,
//   (SELECT COUNT(*) FROM cas WHERE type = 'ЦНАП') AS res2;`; я в отримую такий результат за цим запитом: res1: 46,  res2: 64. Чи можемо переробит це запит, щоб результат виглядав ось так:  46, 64
