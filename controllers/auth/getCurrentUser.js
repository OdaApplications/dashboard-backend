const { pool } = require("../../models/connection");

const getCurrentUser = async (req, res, next) => {
  const { id } = req.user;

  const userQuery = `SELECT id,
        login,
        email,
        structureName,
        surname,
        firstName,
        lastName,
        phone,
        position,
        access,
        district,
        hromada FROM dep_users WHERE id = ?`;

  try {
    pool.query(userQuery, [id], function (err, result, fields) {
      if (err) {
        return res.status(404).json({
          message: "not found",
          code: 404,
        });
      }

      if (!result.length) {
        return res.status(401).json({
          message: "not authorized",
          code: 401,
        });
      }

      res.json({
        message: "success",
        data: {
          user: result[0],
        },
        code: 200,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "current user error" });
  }
};

module.exports = { getCurrentUser };
