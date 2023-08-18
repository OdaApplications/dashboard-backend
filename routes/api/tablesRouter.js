const express = require("express");
const tableRouter = express.Router();

const { ctrlWrapper } = require("../../middlewares");

const {
  getAllTables,
  createTable,
  getTableColumns,
  getTableColumnValues,
  getTableByName,
} = require("../../controllers/tables");

tableRouter.get("/tables/all", ctrlWrapper(getAllTables));

tableRouter.get("/tables/by-name/:table", ctrlWrapper(getTableByName));

tableRouter.get("/tables/columns/all/:table", ctrlWrapper(getTableColumns));

tableRouter.get(
  "/tables/columns/values/:table/:column",
  ctrlWrapper(getTableColumnValues)
);

tableRouter.post("/tables/create", ctrlWrapper(createTable));

module.exports = tableRouter;
