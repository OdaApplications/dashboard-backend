const express = require("express");
const chartsRouter = express.Router();

const { ctrlWrapper } = require("../../middlewares");

const {
  getAllTables,
  getTableByName,
  getDataByParams,
  getDataByParamsMatrix,
  getTableColumns,
  getTableColumnValues,
} = require("../../controllers/charts");

const { getPageConfig } = require("../../controllers/getPageConfig");
const {
  getDataByDynamicQuery,
} = require("../../controllers/getDataByDynamicQuery");

// get all tables
chartsRouter.get("/tables", ctrlWrapper(getAllTables));

// get table by name
chartsRouter.get("/table/:table", ctrlWrapper(getTableByName));

// get table columns
chartsRouter.get("/columns/:table", ctrlWrapper(getTableColumns));

// get table column values
chartsRouter.get(
  "/columnValues/:table/:column",
  ctrlWrapper(getTableColumnValues)
);

// get table data by params
chartsRouter.get("/params/:table", ctrlWrapper(getDataByParams));

// get table data by params
chartsRouter.get("/paramsMatrix/:table", ctrlWrapper(getDataByParamsMatrix));

// page chart config routes
chartsRouter.get("/get-page-config/:pageName", ctrlWrapper(getPageConfig));
chartsRouter.get("/get-dynamic-data", ctrlWrapper(getDataByDynamicQuery));

module.exports = chartsRouter;
